import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  AlertCircle,
  Building2,
  Check,
  Clock,
  Gauge,
  House,
  MapPin,
  RefreshCw,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { PremiumPlanCardSkeleton } from '@/app/components/PremiumPlanCardSkeleton';
import { ElectricityOfferCard } from '@/app/components/ElectricityOfferCard';
import {
  type AgreementFilter,
  type HousingType,
  type UsageLevel,
  ELECTRICITY_USAGE_KWH,
  useElectricityOffers,
} from '@/hooks/useElectricityOffers';

const housingOptions: Array<{ value: HousingType; label: string; hint: string; icon: LucideIcon }> = [
  { value: 'apartment', label: 'شقة', hint: 'استهلاك أقل', icon: Building2 },
  { value: 'house', label: 'فيلا', hint: 'استهلاك أعلى', icon: House },
];

const usageOptions: Array<{
  value: UsageLevel;
  label: string;
  hints: Record<HousingType, string>;
  icon: LucideIcon;
}> = [
  {
    value: 'low',
    label: 'منخفض',
    hints: { apartment: 'شقة صغيرة', house: 'فيلا بدون تدفئة كهربائية' },
    icon: Gauge,
  },
  {
    value: 'normal',
    label: 'عادي',
    hints: { apartment: 'عائلة عادية', house: 'فيلا عادية' },
    icon: Gauge,
  },
  {
    value: 'high',
    label: 'مرتفع',
    hints: { apartment: 'سكن كبير', house: 'فيلا كبيرة / تدفئة كهربائية' },
    icon: Gauge,
  },
];

const usageIconClasses: Record<UsageLevel, string> = {
  low: 'bg-emerald-50 text-emerald-600',
  normal: 'bg-amber-50 text-amber-600',
  high: 'bg-red-50 text-red-600',
};

const electricityFaqItems = [
  {
    question: 'كيف يمكن العثور على أرخص عقد كهرباء؟',
    answer: 'من خلال مقارنة أسعار الكهرباء، والرسوم الثابتة، والشروط بين شركات الكهرباء المختلفة.',
  },
  {
    question: 'هل تغيير عقد الكهرباء مجاني؟',
    answer: 'نعم، في معظم الحالات يكون تغيير عقد الكهرباء مجانياً بالكامل.',
  },
  {
    question: 'هل يمكن تغيير شركة الكهرباء في أي وقت؟',
    answer: 'يعتمد ذلك على ما إذا كان لديك مدة التزام في عقد الكهرباء الحالي.',
  },
  {
    question: 'هل يحدث انقطاع للكهرباء عند تغيير العقد؟',
    answer: 'كلا. تستمر الكهرباء بالعمل بشكل طبيعي حتى عند تغيير شركة الكهرباء أو عقد الكهرباء.',
  },
  {
    question: 'كم يمكن توفيره عند تغيير عقد الكهرباء؟',
    answer: 'يختلف ذلك بحسب الاستهلاك والعقد الحالي، لكن كثيراً من الأسر يمكنها توفير مئات أو آلاف الكرونات سنوياً.',
  },
  {
    question: 'هل السعر المتغير أم الثابت أرخص؟',
    answer: 'تاريخياً، كان السعر المتغير غالباً الأرخص على المدى الطويل، لكن أسعار الكهرباء قد تختلف بين الأشهر.',
  },
  {
    question: 'ما هو العقد المفتوح (tillsvidareavtal)؟',
    answer: 'العقد المفتوح هو غالباً أغلى عقد قياسي لدى شركات الكهرباء، ويتم تطبيقه إذا لم تقم باختيار عقد كهرباء بشكل فعّال.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: electricityFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export function ElectricityComparison() {
  const [postcode, setPostcode] = useState('');
  const [housingType, setHousingType] = useState<HousingType>('apartment');
  const [usageLevel, setUsageLevel] = useState<UsageLevel>('normal');
  const [agreementFilter] = useState<AgreementFilter>('all');
  const [showCustomUsage, setShowCustomUsage] = useState(false);
  const [customUsage, setCustomUsage] = useState('');
  const [showPostcodeCta, setShowPostcodeCta] = useState(false);
  const [showStickyUsageTabs, setShowStickyUsageTabs] = useState(false);
  const [postcodeError, setPostcodeError] = useState('');
  const [hasRequestedResults, setHasRequestedResults] = useState(false);
  const [showSearchTransition, setShowSearchTransition] = useState(false);
  const postcodeInputRef = useRef<HTMLInputElement>(null);
  const searchSectionRef = useRef<HTMLElement>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);
  const trackedResultsViews = useRef<Set<string>>(new Set());
  const customAnnualUsage = Number(customUsage.replace(/\D/g, ''));
  const cleanPostcode = postcode.replace(/\D/g, '');

  const scrollToPostcodeInput = () => {
    postcodeInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => postcodeInputRef.current?.focus(), 450);
  };

  const scrollToResults = () => {
    resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePostcodeChange = (value: string) => {
    setPostcode(value);
    setPostcodeError('');
    setHasRequestedResults(false);
  };

  const handleShowResults = () => {
    if (!canSearch) {
      setPostcodeError('أدخل رمزًا بريديًا صحيحًا من 5 أرقام');
      scrollToPostcodeInput();
      return;
    }

    setPostcodeError('');
    setHasRequestedResults(true);
    setShowSearchTransition(true);

    window.setTimeout(() => {
      setShowSearchTransition(false);
      window.setTimeout(scrollToResults, 80);
    }, 750);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'electricity_active_10s_view',
        vertical: 'electricity',
        page_path: window.location.pathname,
      });
    }, 10000);

    return () => window.clearTimeout(timer);
  }, []);

  const {
    offers,
    loading,
    error,
    annualUsage,
    canSearch,
    supportedProvidersCount,
  } = useElectricityOffers({
    postcode,
    housingType,
    usageLevel,
    customAnnualUsage: customAnnualUsage > 0 ? customAnnualUsage : undefined,
    agreementFilter,
  });
  const shouldShowResults = canSearch && hasRequestedResults && !showSearchTransition;

  useEffect(() => {
    if (!hasRequestedResults || showSearchTransition || !canSearch || loading || error || offers.length === 0) return;

    const resultSignature = [
      postcode.replace(/\D/g, ''),
      annualUsage,
      agreementFilter,
      offers.map((offer) => offer.id).join('|'),
    ].join(':');

    if (trackedResultsViews.current.has(resultSignature)) return;
    trackedResultsViews.current.add(resultSignature);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'electricity_results_view',
      vertical: 'electricity',
      results_count: offers.length,
    });
  }, [agreementFilter, annualUsage, canSearch, error, hasRequestedResults, loading, offers, postcode, showSearchTransition]);

  useEffect(() => {
    const updatePostcodeCtaVisibility = () => {
      const inputRect = postcodeInputRef.current?.getBoundingClientRect();
      const sectionRect = searchSectionRef.current?.getBoundingClientRect();
      const inputIsVisible = inputRect
        ? inputRect.top < window.innerHeight - 80 && inputRect.bottom > 80
        : false;
      const hasScrolledPastForm = sectionRect ? sectionRect.bottom < 24 : false;

      setShowPostcodeCta(!canSearch && hasScrolledPastForm && !inputIsVisible);
    };

    updatePostcodeCtaVisibility();
    window.addEventListener('scroll', updatePostcodeCtaVisibility, { passive: true });
    window.addEventListener('resize', updatePostcodeCtaVisibility);

    return () => {
      window.removeEventListener('scroll', updatePostcodeCtaVisibility);
      window.removeEventListener('resize', updatePostcodeCtaVisibility);
    };
  }, [canSearch]);

  useEffect(() => {
    const updateStickyUsageTabsVisibility = () => {
      const sectionRect = searchSectionRef.current?.getBoundingClientRect();
      const hasScrolledPastForm = sectionRect ? sectionRect.bottom < -24 : false;

      setShowStickyUsageTabs(shouldShowResults && offers.length > 0 && hasScrolledPastForm);
    };

    updateStickyUsageTabsVisibility();
    window.addEventListener('scroll', updateStickyUsageTabsVisibility, { passive: true });
    window.addEventListener('resize', updateStickyUsageTabsVisibility);

    return () => {
      window.removeEventListener('scroll', updateStickyUsageTabsVisibility);
      window.removeEventListener('resize', updateStickyUsageTabsVisibility);
    };
  }, [offers.length, shouldShowResults]);

  return (
    <>
      <Helmet>
        <title>قارن عقود الكهرباء في السويد | Ikhtar</title>
        <meta
          name="description"
          content="قارن عقود الكهرباء في السويد حسب الرمز البريدي والاستهلاك واعثر بسرعة على عرض مناسب من شركات الكهرباء السويدية."
        />
        <link rel="canonical" href="https://ikhtar.se/elavtal" />
        <link rel="icon" type="image/svg+xml" href="/assets/electricity-favicon.svg" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
        <div className="relative max-w-7xl mx-auto px-[16px] py-[24px] sm:py-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-[14px]">
              <div className="flex items-center gap-2.5" dir="ltr">
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-blue-50 text-blue-700 ring-1 ring-blue-100 shadow-sm">
                  <Zap className="h-8 w-8 fill-blue-600/10" strokeWidth={2.5} />
                </div>
                <div className="flex items-baseline leading-none text-[24px]">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight text-[36px]">
                    ikhtar
                  </span>
                  <span className="text-xs font-medium text-[rgb(0,0,0)] tracking-wide text-[20px]">
                    .se
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-2 leading-tight">
              قارن{' '}
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 bg-clip-text text-transparent">
                عقود الكهرباء
              </span>
              <br />
              في السويد
            </h1>

            <p className="sm:text-xl text-slate-600 mb-3 leading-relaxed text-[15px]">
              اكتشف أرخص العروض وغيّر عقد الكهرباء خلال دقائق.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-slate-600">
              <div className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-[12px]">يُحدّث يوميًا</span>
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-[12px]">أسعار مباشرة من الجهات السويدية الرسمية</span>
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="inline-flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-[12px]">
                  نقارن {supportedProvidersCount} شركة كهرباء
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section ref={searchSectionRef} id="electricity-search" className="border-b border-blue-100/70 bg-gradient-to-b from-white to-blue-50/60 px-3 py-3">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[26px] border border-white/80 bg-white/95 p-3.5 shadow-[0_14px_42px_rgba(15,23,42,0.09)] ring-1 ring-blue-100/60 sm:p-4">
            <div className="grid grid-cols-1 gap-3">
              <label className="block">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="text-[16px] font-extrabold text-slate-900">
                    الرمز البريدي
                  </span>
                </div>
                <p className="mb-2 text-[12px] font-semibold text-slate-500">
                  الأسعار تختلف حسب منطقتك
                </p>
                <div className={`group flex min-h-[62px] items-center gap-3 rounded-[22px] border bg-white px-4 shadow-inner shadow-blue-900/5 transition-all duration-200 focus-within:ring-4 ${
                  postcodeError
                    ? 'border-red-500 focus-within:ring-red-100'
                    : 'border-blue-600 focus-within:ring-blue-100'
                }`}>
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm transition-transform duration-200 group-focus-within:scale-105">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <input
                    ref={postcodeInputRef}
                    inputMode="numeric"
                    value={postcode}
                    onChange={(event) => handlePostcodeChange(event.target.value)}
                    maxLength={6}
                    placeholder="12345"
                    className="w-full bg-transparent text-[22px] font-black tracking-wide text-slate-950 outline-none placeholder:text-slate-400"
                  />
                </div>
                {postcodeError && (
                  <p className="mt-2 text-[12px] font-bold text-red-600">{postcodeError}</p>
                )}
              </label>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="text-[16px] font-extrabold text-slate-900">نوع السكن</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {housingOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = housingType === option.value;

                    return (
                      <button
                        key={option.value}
                        onClick={() => setHousingType(option.value)}
                        className={`group min-h-[56px] rounded-[20px] border px-3 py-2.5 text-right transition-all duration-200 active:scale-[0.98] ${
                          isSelected
                            ? 'border-blue-700 bg-blue-50 text-blue-800 shadow-[0_8px_20px_rgba(37,99,235,0.14)] ring-2 ring-blue-600/15'
                            : 'border-blue-200 bg-white text-slate-800 shadow-sm hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-2xl transition-all duration-200 ${
                              isSelected
                                ? 'bg-white text-blue-700'
                                : 'bg-blue-50 text-blue-700 group-hover:bg-white'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[14px] font-black leading-tight">
                              {option.label}
                            </span>
                            <span
                              className={`mt-0.5 block text-[10px] font-semibold leading-tight ${
                                isSelected ? 'text-blue-700' : 'text-slate-500'
                              }`}
                            >
                              {option.hint}
                            </span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="text-[16px] font-extrabold text-slate-900">
                    الاستهلاك
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {usageOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = usageLevel === option.value;

                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setUsageLevel(option.value);
                          setCustomUsage('');
                        }}
                        className={`min-h-[56px] rounded-[20px] border px-2 py-2.5 text-center transition-all duration-200 active:scale-[0.98] ${
                          isSelected
                            ? 'border-blue-700 bg-blue-50 text-blue-800 shadow-[0_8px_20px_rgba(37,99,235,0.14)] ring-2 ring-blue-600/15'
                            : 'border-blue-200 bg-white text-slate-700 shadow-sm hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-md'
                        }`}
                      >
                        <span className={`mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-2xl ${usageIconClasses[option.value]}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="block text-[13px] font-black leading-tight">
                          {option.label}
                        </span>
                        <span className="mt-0.5 block text-[11px] font-medium leading-tight text-blue-800">
                          {option.hints[housingType]}
                        </span>
                        <span className="mt-0.5 block text-[9px] font-semibold leading-tight text-slate-500">
                          {ELECTRICITY_USAGE_KWH[housingType][option.value].toLocaleString('sv-SE')} kWh / سنة
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setShowCustomUsage((current) => !current)}
                  className="mt-2 w-full bg-transparent px-2 py-1 text-center text-[12px] font-normal text-slate-400 transition-colors duration-200 hover:text-slate-600"
                >
                  أو اضغط هنا لإدخال استهلاكك السنوي بنفسك
                </button>
                {showCustomUsage && (
                  <div className="mt-2 flex min-h-[54px] items-center gap-3 rounded-[18px] border border-blue-600 bg-white px-4 shadow-inner shadow-blue-900/5 transition-all duration-200 focus-within:ring-4 focus-within:ring-blue-100">
                    <Gauge className="h-5 w-5 flex-shrink-0 text-blue-700" />
                    <input
                      inputMode="numeric"
                      value={customUsage}
                      onChange={(event) => setCustomUsage(event.target.value)}
                      placeholder="مثال: 4500 kWh / سنة"
                      className="w-full bg-transparent text-[18px] font-black text-slate-950 outline-none placeholder:text-slate-400"
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleShowResults}
                dir="ltr"
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-[22px] bg-blue-700 px-5 py-4 text-[15px] font-black text-white shadow-lg shadow-blue-700/20 ring-1 ring-blue-600 transition duration-200 hover:bg-blue-800 active:scale-[0.98]"
              >
                <Zap className="h-5 w-5" />
                <span dir="rtl">اعثر على أفضل عقد كهرباء لمنطقتك</span>
              </button>

            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-[12px] md:px-4 py-2">
        {!canSearch && (
          <div className="text-center py-12 px-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              أدخل الرمز البريدي لعرض أرخص العقود
            </h2>
            <p className="text-slate-600 mb-5">
              نقارن عقود الكهرباء حسب منطقتك واستهلاكك التقريبي.
            </p>
            <button
              type="button"
              onClick={scrollToPostcodeInput}
              className="rounded-2xl bg-blue-700 px-5 py-3 text-[14px] font-black text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 active:scale-[0.98]"
            >
              أدخل الرمز البريدي الآن
            </button>
          </div>
        )}

        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl shadow-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-red-900 mb-1">
                  تعذّر تحميل عقود الكهرباء
                </h2>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {hasRequestedResults && canSearch && showSearchTransition && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 px-4 backdrop-blur-[2px]">
            <div className="w-full max-w-sm rounded-[28px] bg-white p-6 text-center shadow-2xl shadow-blue-950/20 ring-1 ring-blue-100">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50 text-blue-700">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
              <p className="text-[17px] font-black leading-7 text-slate-950">
                نبحث عن أرخص عقود الكهرباء في منطقتك...
              </p>
              <div className="mx-auto mt-5 h-2.5 max-w-xs overflow-hidden rounded-full bg-blue-50">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-blue-300" />
              </div>
            </div>
          </div>
        )}

        {hasRequestedResults && canSearch && !showSearchTransition && loading && (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <PremiumPlanCardSkeleton key={item} />
            ))}
          </div>
        )}

        {shouldShowResults && !loading && !error && offers.length === 0 && (
          <div className="text-center py-12 px-4">
            <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              لم نجد عروضًا من الشركات المختارة
            </h2>
            <p className="text-slate-600">
              جرّب فلترًا آخر أو رمزًا بريديًا أو مستوى استهلاك مختلفًا.
            </p>
          </div>
        )}

        {shouldShowResults && offers.length > 0 && (
          <>
            <div ref={resultsSectionRef} className="mb-3 rounded-[22px] bg-blue-50/70 px-4 py-4 text-center ring-1 ring-blue-100">
              <h2 className="text-[22px] font-black text-slate-950">
                {offers.length} شركة كهرباء متاحة في منطقتك
              </h2>
              <p className="mt-1.5 text-[15px] font-extrabold text-blue-800">
                أفضل الأسعار المتاحة اليوم في {cleanPostcode}
              </p>
            </div>

            <div className="text-center mb-7">
              <p className="text-xs text-slate-500 text-[10px]">
                إعلان – عند النقر على عرض قد نحصل على عمولة دون تكلفة إضافية عليك.
              </p>
            </div>

            <div id="results-section" className="grid grid-cols-1 gap-3">
              {offers.map((offer, index) => (
                <ElectricityOfferCard
                  key={offer.id}
                  offer={offer}
                  rank={index + 1}
                  annualUsage={annualUsage}
                  postcode={postcode}
                />
              ))}
            </div>
          </>
        )}

        <ElectricitySeoSection />
      </main>

      {showPostcodeCta && (
        <div className="fixed inset-x-3 bottom-3 z-50 sm:hidden">
          <button
            type="button"
            onClick={scrollToPostcodeInput}
            className="flex w-full items-center justify-center gap-2 rounded-[22px] bg-blue-700 px-5 py-4 text-[15px] font-black text-white ring-1 ring-white/30 transition duration-300 animate-in fade-in slide-in-from-bottom-3 active:scale-[0.98]"
          >
            <MapPin className="h-5 w-5" />
            أدخل الرمز البريدي لعرض العروض
          </button>
        </div>
      )}
    

      {showStickyUsageTabs && (
        <div className="fixed inset-x-0 top-0 z-40 border-b border-blue-100 bg-white/95 px-3 py-2 shadow-sm backdrop-blur sm:hidden">
          <div className="grid grid-cols-3 gap-2" dir="rtl">
            {usageOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = usageLevel === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setUsageLevel(option.value);
                    setCustomUsage('');
                  }}
                  className={`flex min-h-[46px] items-center justify-center gap-1.5 rounded-[16px] border px-2 text-[12px] font-black transition active:scale-[0.98] ${
                    isSelected
                      ? 'border-blue-700 bg-blue-50 text-blue-800 shadow-[0_4px_14px_rgba(37,99,235,0.12)] ring-1 ring-blue-600/15'
                      : 'border-blue-100 bg-white text-slate-700'
                  }`}
                >
                  <span className={`flex h-7 w-7 items-center justify-center rounded-2xl ${usageIconClasses[option.value]}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}</>
  );
}

function ElectricitySeoSection() {
  const agreementTypeCards = [
    {
      title: 'عقود الكهرباء ذات السعر المتغير',
      text: 'يتبع سعر الكهرباء المتغير سوق الكهرباء ويمكن أن يتغير من شهر إلى آخر. تاريخياً، كان السعر المتغير غالباً الخيار الأرخص على المدى الطويل.',
    },
    {
      title: 'عقود الكهرباء ذات السعر الثابت',
      text: 'مع عقد الكهرباء ذي السعر الثابت، تدفع السعر نفسه طوال مدة العقد. وقد يكون هذا خياراً جيداً لمن يريد تكاليف كهرباء أكثر استقراراً وتوقعاً.',
    },
    {
      title: 'عقود الكهرباء بالتسعير بالساعة',
      text: 'مع التسعير بالساعة، يتغير سعر الكهرباء من ساعة إلى أخرى بناءً على أسعار سوق الكهرباء. يناسب هذا الخيار من يستطيع تنظيم استهلاكه خلال الساعات الأرخص من اليوم.',
    },
  ];

  const cheapElectricityCards = [
    ['عقود الكهرباء الرخيصة', 'نساعدك على العثور على عقود كهرباء أرخص من شركات مختلفة في السويد.'],
    ['الكهرباء الرخيصة في السويد', 'قارن الأسعار الحالية واعثر على كهرباء رخيصة تناسب منزلك واستهلاكك.'],
    ['سعر الكهرباء المتغير', 'قارن عقود الكهرباء ذات السعر المتغير واعرف أي الشركات تقدم أفضل العروض.'],
    ['سعر الكهرباء الثابت', 'اختر عقد كهرباء بسعر ثابت إذا كنت تريد تكلفة أكثر استقراراً وتوقعاً.'],
    ['عقود الكهرباء للشقق', 'قارن عقود الكهرباء المناسبة للشقق حيث تكون الرسوم الثابتة مهمة جداً.'],
    ['عقود الكهرباء للمنازل المستقلة', 'قارن عقود الكهرباء المناسبة للفيلات والمنازل ذات الاستهلاك الأعلى.'],
  ];

  const scrollToSearch = () => {
    document.getElementById('electricity-search')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="mt-10 border-t border-blue-100 bg-gradient-to-b from-white via-blue-50/30 to-white px-1 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-wrap gap-2">
          {['أسعار محدثة', 'مقارنة مجانية', 'روابط واضحة'].map((badge) => (
            <span key={badge} className="rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-800 ring-1 ring-blue-100">
              {badge}
            </span>
          ))}
        </div>

        <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-blue-100">
          <h2 className="mb-3 text-2xl font-black leading-tight text-slate-950">
            قارن عقود الكهرباء وخفّض تكلفة الكهرباء
          </h2>
          <div className="space-y-3 text-[14px] leading-7 text-slate-700">
            <p>هنا يمكنك مقارنة عقود الكهرباء من شركات كهرباء مختلفة في السويد في مكان واحد. نعرض أسعار الكهرباء الحالية، والرسوم الثابتة، والتكلفة التقديرية لعقد الكهرباء بناءً على الرمز البريدي واستهلاكك للكهرباء.</p>
            <p>يدفع كثير من الأشخاص مبالغ أعلى من اللازم مقابل الكهرباء كل شهر من دون أن يدركوا ذلك. ومن خلال مقارنة عقود الكهرباء بانتظام، يمكنك غالباً العثور على كهرباء أرخص وتقليل تكاليف الكهرباء بشكل ملحوظ.</p>
            <p>يتم تحديث الأسعار والشروط باستمرار لعرض أحدث عروض الكهرباء من شركات الكهرباء السويدية.</p>
          </div>
        </div>

        <div className="rounded-[24px] bg-blue-950 p-5 text-white shadow-lg shadow-blue-950/10">
          <h2 className="mb-4 text-xl font-black">كيف تعمل مقارنة عقود الكهرباء؟</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ['1', 'أدخل الرمز البريدي والاستهلاك', 'أدخل الرمز البريدي وحدد كمية الكهرباء التي تستخدمها تقريباً سنوياً.'],
              ['2', 'قارن عقود الكهرباء الحالية', 'شاهد أسعار الكهرباء الحالية، والرسوم الثابتة، والعقود المختلفة من شركات الكهرباء في السويد.'],
              ['3', 'انتقل إلى عقد كهرباء أرخص', 'عندما تجد عقد كهرباء مناسباً، يمكنك الانتقال مباشرة إلى شركة الكهرباء وإكمال عملية التبديل لدى المزود نفسه.'],
            ].map(([number, title, text]) => (
              <div key={number} className="rounded-[18px] bg-white/10 p-4 ring-1 ring-white/10">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-400 text-sm font-black text-blue-950">
                  {number}
                </div>
                <h3 className="mb-1 text-sm font-black">{title}</h3>
                <p className="text-[12px] leading-6 text-blue-50">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <SeoTextBlock title="لماذا يدفع كثيرون مبالغ مرتفعة للكهرباء؟">
          <p>يمتلك كثير من الأشخاص عقود كهرباء قديمة أو ما يُعرف بالعقود المفتوحة (tillsvidareavtal)، والتي تكون غالباً أغلى بكثير من عروض الكهرباء الجديدة والأسعار الترويجية.</p>
          <p>وفي بعض الحالات قد يصل الفرق إلى عدة آلاف من الكرونات سنوياً. لذلك من الذكاء مقارنة عقود الكهرباء بشكل منتظم بدلاً من البقاء على العقد نفسه عاماً بعد عام.</p>
          <p>عند مقارنة أسعار الكهرباء، من المهم النظر إلى السعر لكل كيلوواط ساعة، الرسوم الشهرية الثابتة، مدة الالتزام، الخصومات المحتملة، والسعر بعد انتهاء العرض الترويجي.</p>
          <p>أرخص عقد كهرباء ليس دائماً العقد الذي يملك أقل سعر لكل كيلوواط ساعة. بالنسبة لبعض الأسر، قد تكون الرسوم الثابتة أكثر أهمية من سعر الكهرباء نفسه.</p>
        </SeoTextBlock>

        <SeoTextBlock title="ما الذي يؤثر على تكلفة الكهرباء؟">
          <p>تتأثر تكلفة الكهرباء بعدة عوامل، منها كمية الكهرباء التي تستخدمها، ما إذا كنت تعيش في شقة أو منزل مستقل، منطقة الكهرباء التي تقيم فيها، نوع السعر، والرسوم الثابتة والإضافية.</p>
          <p>إذا كنت تعيش في شقة، فإن الرسوم الشهرية الثابتة تكون غالباً العامل الأهم لأن استهلاك الكهرباء يكون أقل عادةً.</p>
          <p>أما بالنسبة للمنازل المستقلة والأسر ذات الاستهلاك المرتفع للكهرباء، فإن سعر الكهرباء لكل كيلوواط ساعة يكون غالباً الأكثر أهمية.</p>
        </SeoTextBlock>

        <div>
          <h2 className="mb-3 text-2xl font-black text-slate-950">أنواع عقود الكهرباء</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {agreementTypeCards.map((card) => (
              <div key={card.title} className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-blue-100">
                <h3 className="mb-2 text-[15px] font-black text-slate-950">{card.title}</h3>
                <p className="text-[13px] leading-6 text-slate-600">{card.text}</p>
              </div>
            ))}
          </div>
        </div>

        <SeoTextBlock title="تبديل شركة الكهرباء سهل">
          <p>يعتقد كثير من الأشخاص أن تغيير شركة الكهرباء أمر معقد، لكنه في معظم الحالات لا يستغرق سوى بضع دقائق.</p>
          <p>ستستمر بالحصول على الكهرباء عبر شبكة الكهرباء نفسها، ولن يحدث أي انقطاع للكهرباء عند تغيير العقد.</p>
          <p>وغالباً ما تساعدك شركة الكهرباء الجديدة في تنفيذ عملية التبديل بالكامل.</p>
        </SeoTextBlock>

        <div>
          <h2 className="mb-3 text-2xl font-black text-slate-950">قارن عقود الكهرباء الرخيصة في السويد</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {cheapElectricityCards.map(([title, text]) => (
              <div key={title} className="rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-blue-100">
                <h3 className="mb-1 text-[14px] font-black text-blue-900">{title}</h3>
                <p className="text-[12px] leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-2xl font-black text-slate-950">أسئلة شائعة حول عقود الكهرباء</h2>
          <div className="space-y-2">
            {electricityFaqItems.map((item) => (
              <details key={item.question} className="group rounded-[18px] bg-white p-4 shadow-sm ring-1 ring-blue-100">
                <summary className="cursor-pointer list-none text-[14px] font-black text-slate-950">
                  {item.question}
                </summary>
                <p className="mt-3 text-[13px] leading-6 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] bg-blue-50 p-5 ring-1 ring-blue-100">
          <h2 className="mb-2 text-lg font-black text-blue-950">حول روابطنا</h2>
          <p className="text-[13px] leading-6 text-blue-900">
            قد نحصل على تعويض من بعض شركات الكهرباء إذا انتقلت عبر روابطنا وقمت بتبديل عقد الكهرباء. هذا لا يؤثر على السعر الذي تدفعه لدى شركة الكهرباء.
          </p>
        </div>

        <div className="rounded-[26px] bg-gradient-to-br from-blue-700 to-blue-950 p-6 text-center text-white shadow-xl shadow-blue-900/20">
          <h2 className="mb-2 text-2xl font-black">اعثر على عقد كهرباء أرخص اليوم</h2>
          <p className="mx-auto mb-5 max-w-2xl text-[14px] leading-7 text-blue-50">
            قارن عروض الكهرباء الحالية من شركات الكهرباء السويدية وشاهد كم يمكنك أن توفر عند تغيير عقد الكهرباء.
          </p>
          <button
            type="button"
            onClick={scrollToSearch}
            className="rounded-2xl bg-white px-5 py-3 text-[14px] font-black text-blue-800 shadow-lg transition hover:bg-blue-50"
          >
            شاهد أرخص عقود الكهرباء
          </button>
        </div>
      </div>
    </section>
  );
}

function SeoTextBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-blue-100">
      <h2 className="mb-3 text-2xl font-black leading-tight text-slate-950">{title}</h2>
      <div className="space-y-3 text-[14px] leading-7 text-slate-700">{children}</div>
    </div>
  );
}
