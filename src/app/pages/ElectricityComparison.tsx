import { useState } from 'react';
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
  SlidersHorizontal,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Logo } from '@/app/components/Logo';
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

const agreementFilterOptions: Array<{ value: AgreementFilter; label: string }> = [
  { value: 'all', label: 'كل العقود' },
  { value: 'variable', label: 'سعر متغير' },
  { value: 'fixed', label: 'سعر ثابت' },
  { value: 'hourly', label: 'بالساعة/الربع' },
];

export function ElectricityComparison() {
  const [postcode, setPostcode] = useState('12747');
  const [housingType, setHousingType] = useState<HousingType>('apartment');
  const [usageLevel, setUsageLevel] = useState<UsageLevel>('normal');
  const [agreementFilter, setAgreementFilter] = useState<AgreementFilter>('all');
  const [showCustomUsage, setShowCustomUsage] = useState(false);
  const [customUsage, setCustomUsage] = useState('');
  const customAnnualUsage = Number(customUsage.replace(/\D/g, ''));

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

  return (
    <>
      <Helmet>
        <title>قارن عقود الكهرباء في السويد | Ikhtar</title>
        <meta
          name="description"
          content="قارن عقود الكهرباء في السويد حسب الرمز البريدي والاستهلاك واعثر بسرعة على عرض مناسب من شركات الكهرباء السويدية."
        />
        <link rel="canonical" href="https://ikhtar.se/elavtal" />
      </Helmet>

      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
        <div className="relative max-w-7xl mx-auto px-[16px] py-[24px] sm:py-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-[14px]">
              <Logo />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-2 leading-tight">
              قارن{' '}
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 bg-clip-text text-transparent">
                عقود الكهرباء
              </span>
              {' '}في السويد
            </h1>

            <p className="sm:text-xl text-slate-600 mb-3 leading-relaxed text-[15px]">
              أدخل الرمز البريدي واختر نوع السكن والاستهلاك لعرض أرخص عقود الكهرباء بسرعة.
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

      <section className="border-b border-blue-100/70 bg-gradient-to-b from-white to-blue-50/60 px-3 py-3">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[26px] border border-white/80 bg-white/95 p-3.5 shadow-[0_14px_42px_rgba(15,23,42,0.09)] ring-1 ring-blue-100/60 sm:p-4">
            <div className="grid grid-cols-1 gap-3">
              <label className="block">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="text-[16px] font-extrabold text-slate-900">
                    الرمز البريدي
                  </span>
                  <span className="text-[13px] font-extrabold text-blue-700">نتائج بسرعة البرق</span>
                </div>
                <div className="group flex min-h-[62px] items-center gap-3 rounded-[22px] border border-blue-600 bg-blue-50/50 px-4 shadow-inner shadow-blue-900/5 transition-all duration-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm transition-transform duration-200 group-focus-within:scale-105">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <input
                    inputMode="numeric"
                    value={postcode}
                    onChange={(event) => setPostcode(event.target.value)}
                    maxLength={6}
                    placeholder="12747"
                    className="w-full bg-transparent text-[22px] font-black tracking-wide text-slate-950 outline-none placeholder:text-slate-400"
                  />
                </div>
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
                            ? 'border-blue-700 bg-blue-700 text-white shadow-[0_10px_24px_rgba(29,78,216,0.22)]'
                            : 'border-blue-200 bg-white text-slate-800 shadow-sm hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-2xl transition-all duration-200 ${
                              isSelected
                                ? 'bg-white/15 text-white'
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
                                isSelected ? 'text-blue-100' : 'text-slate-500'
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
                  className="mt-2 w-full bg-transparent px-2 py-1 text-center text-[13px] font-bold text-slate-400 transition-colors duration-200 hover:text-slate-600"
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

            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-[12px] md:px-4 py-2">
        {!canSearch && (
          <div className="text-center py-12 px-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              ابدأ بإدخال الرمز البريدي
            </h2>
            <p className="text-slate-600">
              سنعرض عقود الكهرباء المتاحة حسب منطقتك واستهلاكك التقريبي.
            </p>
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

        {canSearch && !error && (
          <div className="mb-3 overflow-x-auto py-0.5">
            <div className="flex min-w-max items-center gap-2">
              {agreementFilterOptions.map((option) => {
                const isSelected = agreementFilter === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAgreementFilter(option.value)}
                    className={`rounded-[14px] px-3.5 py-2 text-[12px] font-bold transition-all duration-200 active:scale-[0.98] ${
                      isSelected
                        ? 'bg-blue-50 text-blue-800 shadow-sm ring-1 ring-blue-200'
                        : 'bg-white/80 text-slate-600 ring-1 ring-blue-100/70 hover:bg-blue-50 hover:text-blue-800'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {canSearch && !error && (
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-[18px] bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-500">
            <SlidersHorizontal className="h-3.5 w-3.5 text-blue-700" />
            الأرخص أولًا
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <PremiumPlanCardSkeleton key={item} />
            ))}
          </div>
        )}

        {canSearch && !loading && !error && offers.length === 0 && (
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

        {offers.length > 0 && (
          <>
            <div className="text-center mb-4">
              <p className="text-xs text-slate-500 text-[10px]">
                إعلان – عند النقر على عرض قد نحصل على عمولة دون تكلفة إضافية عليك.
              </p>
            </div>

            <div id="results-section" className="grid grid-cols-1 gap-2">
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
      </main>
    </>
  );
}
