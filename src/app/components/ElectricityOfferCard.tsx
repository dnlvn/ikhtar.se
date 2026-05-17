import { Bolt, Sparkles, Zap } from 'lucide-react';
import type { ElectricityOffer } from '@/hooks/useElectricityOffers';

interface ElectricityOfferCardProps {
  offer: ElectricityOffer;
  rank: number;
  annualUsage: number;
  postcode: string;
}

export function ElectricityOfferCard({
  offer,
  rank,
  annualUsage,
  postcode,
}: ElectricityOfferCardProps) {
  const isBestDeal = rank <= 3;
  const hasSpecificAgreementName = offer.agreementName.trim().toLowerCase() !== 'elavtal';
  const hasSpecificAgreementType = offer.agreementTypeLabel.trim().toLowerCase() !== 'elavtal';
  const detailItems = [
    offer.cancellationPeriod ? `إلغاء: ${offer.cancellationPeriod}` : null,
    offer.newCustomersOnly ? 'للعملاء الجدد' : null,
  ].filter(Boolean);

  const handleClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'cta_click',
      vertical: 'electricity',
      provider: offer.provider,
      plan_name: offer.agreementName,
      estimated_monthly_cost: offer.estimatedMonthlyCost,
      comparison_price_ore: offer.comparisonPriceOre,
      annual_usage_kwh: annualUsage,
      postcode: postcode.replace(/\D/g, ''),
    });

    window.open(offer.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div id={`electricity-offer-${offer.id}`} className="relative">
      {isBestDeal && (
        <>
          <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse delay-75 z-20" />
          <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-orange-400 animate-pulse delay-150 z-20" />
        </>
      )}

      <div
        onClick={handleClick}
        className={`
          relative rounded-xl shadow-sm transition-all duration-200 hover:shadow-lg cursor-pointer
          ${isBestDeal
            ? 'bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/60 border-2 border-amber-400 shadow-amber-200/40 shadow-lg hover:shadow-xl hover:shadow-amber-300/50'
            : 'bg-white border border-slate-200/60'
          }
        `}
        style={{ borderRadius: '0.75rem' }}
      >
        {isBestDeal && (
          <div className="absolute -top-3 right-4 z-20">
            <div className="bg-amber-50 border border-amber-300/50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-semibold shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              من أرخص العروض
            </div>
          </div>
        )}

        <div className="p-[14px]">
          <div className="flex items-center justify-between mb-[6px]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 flex items-center justify-center bg-blue-100 rounded-lg">
                <Zap className="w-5 h-5 text-blue-700" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[18px] font-extrabold text-slate-900 leading-tight truncate">
                  {offer.provider}
                </h3>
                {hasSpecificAgreementName && (
                  <p className="text-[11px] text-slate-500 truncate">
                    {offer.agreementName}
                  </p>
                )}
                {hasSpecificAgreementType && (
                  <span className="mt-1 inline-flex w-fit rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold leading-tight text-blue-700">
                    {offer.agreementTypeLabel}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end text-right">
              <span className="mb-0.5 block w-full text-right text-[10px] font-bold text-slate-500">
                تقدير من
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-[40px] font-black text-slate-900 leading-none">
                  {offer.estimatedMonthlyCost}
                </span>
                <span className="text-[12px] font-medium text-slate-700 leading-tight">
                  كرونة/شهر
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col justify-center gap-1">
              <div className="flex items-center gap-1.5">
                <Bolt className="w-3.5 h-3.5 text-slate-900" strokeWidth={2.5} />
                <span className="text-[12px] leading-tight text-slate-900">
                  {offer.comparisonPriceOre.toFixed(2).replace('.', ',')} öre/kWh
                </span>
              </div>
              {detailItems.length > 0 && (
                <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] font-medium leading-tight text-slate-500">
                  {detailItems.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              )}
              <p className="mt-1 max-w-[220px] text-[10px] leading-snug text-slate-500">
                بناءً على الاستهلاك المختار. رسوم شبكة الكهرباء تُضاف.
              </p>
            </div>

            <button
              onClick={(event) => {
                event.stopPropagation();
                handleClick();
              }}
              className={`
                px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase
                transition-all duration-500 shadow-sm hover:shadow-md hover:-translate-y-0.5
                cursor-pointer relative overflow-hidden
                ${isBestDeal
                  ? 'text-white shadow-lg hover:brightness-110'
                  : 'bg-blue-700 text-white border-2 border-blue-700 hover:bg-blue-800'
                }
              `}
              style={isBestDeal ? {
                backgroundImage: 'linear-gradient(to right, #F7971E 0%, #FFD200 51%, #F7971E 100%)',
                backgroundSize: '200% auto',
                animation: 'shimmer-slide 3s ease-in-out infinite',
                borderRadius: '0.75rem',
              } : {
                borderRadius: '0.75rem',
              }}
            >
              احصل على العرض
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
