import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertCircle, Check, Clock, RefreshCw, SlidersHorizontal, Zap } from 'lucide-react';
import { Logo } from '@/app/components/Logo';
import { PremiumPlanCardSkeleton } from '@/app/components/PremiumPlanCardSkeleton';
import { ElectricityOfferCard } from '@/app/components/ElectricityOfferCard';
import {
  ELECTRICITY_USAGE_KWH,
  type HousingType,
  type UsageLevel,
  useElectricityOffers,
} from '@/hooks/useElectricityOffers';

const housingOptions: Array<{ value: HousingType; label: string }> = [
  { value: 'apartment', label: 'شقة' },
  { value: 'house', label: 'فيلا' },
];

const usageOptions: Array<{ value: UsageLevel; label: string }> = [
  { value: 'low', label: 'منخفض' },
  { value: 'normal', label: 'عادي' },
  { value: 'high', label: 'مرتفع' },
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

      <section className="bg-white border-b border-slate-200/80 shadow-sm sticky top-0 z-30 backdrop-blur-lg bg-white/95">
        <div className="max-w-4xl mx-auto px-4 md:px-0 py-4">
          <div className="grid grid-cols-1 gap-3">
            <label className="block">
              <span className="sr-only">الرمز البريدي</span>
              <input
                inputMode="numeric"
                value={postcode}
                onChange={(event) => setPostcode(event.target.value)}
                maxLength={6}
                placeholder="أدخل الرمز البريدي"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <div className="grid grid-cols-2 gap-2">
              {housingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setHousingType(option.value)}
                  className={`rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition-all ${
                    housingType === option.value
                      ? 'border-blue-700 bg-blue-700 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {usageOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setUsageLevel(option.value)}
                  className={`rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition-all ${
                    usageLevel === option.value
                      ? 'border-blue-700 bg-blue-50 text-blue-800'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between text-[12px] text-slate-500">
              <span>{annualUsage.toLocaleString('sv-SE')} kWh / سنة</span>
              <span className="inline-flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                الأرخص أولًا
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-[12px] md:px-4 py-[14px]">
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
