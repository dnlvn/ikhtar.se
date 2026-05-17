import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  AlertCircle,
  Check,
  Clock,
  Gauge,
  Home,
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
  ELECTRICITY_USAGE_KWH,
  type HousingType,
  type UsageLevel,
  useElectricityOffers,
} from '@/hooks/useElectricityOffers';

const housingOptions: Array<{ value: HousingType; label: string; icon: LucideIcon }> = [
  { value: 'apartment', label: 'شقة', icon: Home },
  { value: 'house', label: 'فيلا', icon: Zap },
];

const usageOptions: Array<{ value: UsageLevel; label: string; icon: LucideIcon }> = [
  { value: 'low', label: 'منخفض', icon: Zap },
  { value: 'normal', label: 'عادي', icon: Gauge },
  { value: 'high', label: 'مرتفع', icon: SlidersHorizontal },
];

export function ElectricityComparison() {
  const [postcode, setPostcode] = useState('');
  const [housingType, setHousingType] = useState<HousingType>('apartment');
  const [usageLevel, setUsageLevel] = useState<UsageLevel>('normal');

  const {
    offers,
    loading,
    error,
    annualUsage,
    canSearch,
    supportedProvidersCount,
  } = useElectricityOffers({ postcode, housingType, usageLevel });

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
                <span className="font-medium text-[12px]">أسعار من Elpriskollen</span>
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

      <section className="border-b border-slate-100 bg-gradient-to-b from-white to-slate-50 px-3 py-3">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-[0_14px_38px_rgba(15,23,42,0.08)] sm:p-4">
            <div className="grid grid-cols-1 gap-3">
              <label className="block">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="text-[13px] font-extrabold text-slate-900">
                    الرمز البريدي
                  </span>
                  <span className="text-[11px] font-bold text-blue-700">تحديث فوري</span>
                </div>
                <div className="group flex min-h-[66px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 shadow-inner shadow-slate-900/5 transition-all duration-200 focus-within:border-blue-600 focus-within:bg-white focus-within:shadow-[0_10px_30px_rgba(37,99,235,0.12)] focus-within:ring-4 focus-within:ring-blue-100">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm transition-transform duration-200 group-focus-within:scale-105">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <input
                    inputMode="numeric"
                    value={postcode}
                    onChange={(event) => setPostcode(event.target.value)}
                    maxLength={6}
                    placeholder="11239"
                    className="w-full bg-transparent text-[24px] font-black tracking-wide text-slate-950 outline-none placeholder:text-slate-400"
                  />
                </div>
              </label>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="text-[13px] font-extrabold text-slate-800">نوع السكن</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {housingOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = housingType === option.value;

                    return (
                      <button
                        key={option.value}
                        onClick={() => setHousingType(option.value)}
                        className={`group min-h-[52px] rounded-xl border px-3 py-2.5 text-right transition-all duration-200 active:scale-[0.98] ${
                          isSelected
                            ? 'border-blue-700 bg-blue-700 text-white shadow-[0_8px_18px_rgba(29,78,216,0.20)]'
                            : 'border-slate-200 bg-white text-slate-800 shadow-sm hover:border-blue-200 hover:bg-slate-50 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 ${
                              isSelected
                                ? 'bg-white/15 text-white'
                                : 'bg-slate-50 text-slate-600 group-hover:text-blue-700'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[14px] font-black leading-tight">
                              {option.label}
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
                  <span className="text-[13px] font-extrabold text-slate-800">
                    الاستهلاك
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                    <Gauge className="h-3.5 w-3.5 text-blue-700" />
                    {annualUsage.toLocaleString('sv-SE')} kWh / سنة
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {usageOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = usageLevel === option.value;

                    return (
                      <button
                        key={option.value}
                        onClick={() => setUsageLevel(option.value)}
                        className={`min-h-[52px] rounded-xl border px-2 py-2.5 text-center transition-all duration-200 active:scale-[0.98] ${
                          isSelected
                            ? 'border-blue-700 bg-blue-700 text-white shadow-[0_8px_18px_rgba(29,78,216,0.20)]'
                            : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:border-blue-200 hover:bg-slate-50 hover:shadow-md'
                        }`}
                      >
                        <span
                          className={`mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-xl ${
                            isSelected ? 'bg-white/15 text-white' : 'bg-slate-50 text-slate-600'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="block text-[13px] font-black leading-tight">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-blue-700" />
                  الأرخص أولًا
                </span>
                <span>تتحدث النتائج مباشرة</span>
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
              جرّب رمزًا بريديًا آخر أو مستوى استهلاك مختلف.
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
