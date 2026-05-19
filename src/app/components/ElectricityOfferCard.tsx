import { Bolt, Sparkles } from 'lucide-react';
import type { ElectricityOffer } from '@/hooks/useElectricityOffers';
import { getElectricityProviderLogo } from '@/lib/electricityProviderLogos';

interface ElectricityOfferCardProps {
  offer: ElectricityOffer;
  rank: number;
  annualUsage: number;
  postcode: string;
}

function getArabicAgreementTypeLabel(offer: ElectricityOffer): string | null {
  if (offer.agreementCategory === 'variable') return 'سعر متغير';
  if (offer.agreementCategory === 'fixed') return 'سعر ثابت';
  if (offer.agreementCategory === 'hourly') return 'سعر بالساعة/ربع الساعة';
  return null;
}

export function ElectricityOfferCard({
  offer,
  rank,
  annualUsage,
  postcode,
}: ElectricityOfferCardProps) {
  const isBestDeal = rank <= 3;
  const providerLogo = getElectricityProviderLogo(offer.provider);
  const badgeLabelByRank: Record<number, string> = {
    1: 'الأرخص الآن',
    2: 'سعر ممتاز',
    3: 'عرض اقتصادي',
  };
  const badgeLabel = badgeLabelByRank[rank];
  const agreementTypeLabel = getArabicAgreementTypeLabel(offer);
  const hasSpecificAgreementName = offer.agreementName.trim().toLowerCase() !== 'elavtal';
  const detailItems = [
    offer.cancellationPeriod ? `إلغاء: ${offer.cancellationPeriod}` : null,
    offer.newCustomersOnly ? 'للعملاء الجدد' : null,
  ].filter(Boolean);

  const handleClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'electricity_cta_click',
      vertical: 'electricity',
      provider: offer.provider,
      plan_name: offer.agreementName,
      agreement_type: offer.agreementTypeLabel,
      estimated_monthly_cost: offer.estimatedMonthlyCost,
      comparison_price_ore: offer.comparisonPriceOre,
      annual_usage_kwh: annualUsage,
      postcode: postcode.replace(/\D/g, ''),
      rank,
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
          relative overflow-visible rounded-xl shadow-sm transition-all duration-200 hover:shadow-lg cursor-pointer
          ${isBestDeal
            ? 'bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/60 border-2 border-amber-400 shadow-amber-200/40 shadow-lg hover:shadow-xl hover:shadow-amber-300/50'
            : 'bg-white border border-slate-200/60'
          }
        `}
        style={{ borderRadius: '0.75rem' }}
      >
        {badgeLabel && (
          <div className="absolute -top-3 right-4 z-20">
            <div
              className={`rounded-full flex items-center gap-1 ${
                rank === 1
                  ? 'bg-gradient-to-r from-orange-100 via-amber-50 to-yellow-100 border-2 border-amber-400 px-4 py-1.5 text-[12px] font-black text-orange-700 shadow-[0_0_18px_rgba(245,158,11,0.28)]'
                  : 'bg-amber-50 border border-amber-300/50 px-3 py-1 text-[10px] font-semibold text-amber-700 shadow-sm'
              }`}
            >
              <Sparkles className={rank === 1 ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5'} />
              {badgeLabel}
            </div>
          </div>
        )}

        <div className="p-[14px]">
          <div className="flex items-center justify-between mb-[6px]">
            <div className="flex min-w-0 flex-col items-end gap-1.5 text-right">
              {providerLogo ? (
                <div className="flex min-h-[42px] w-[160px] items-center justify-end overflow-visible">
                  <img
                    src={providerLogo}
                    alt={offer.provider}
                    className="h-[35px] w-auto max-w-[160px] object-contain"
                  />
                </div>
              ) : (
                <div className="w-7 h-7 flex shrink-0 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
                  <span className="text-xs font-bold text-slate-700">
                    {offer.provider.charAt(0)}
                  </span>
                </div>
              )}
              {agreementTypeLabel && (
                <span className="inline-flex w-fit self-end rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold leading-tight text-blue-700">
                  {agreementTypeLabel}
                </span>
              )}
              {hasSpecificAgreementName && (
                <p className="max-w-[160px] truncate text-[11px] text-slate-500">
                  {offer.agreementName}
                </p>
              )}
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
                <Bolt className="w-3.5 h-3.5 text-blue-700" strokeWidth={2.5} />
                <span className="text-[12px] leading-tight text-slate-900">
                  {offer.comparisonPriceOre.toFixed(2).replace('.', ',')} أوره/kWh
                </span>
              </div>
              {detailItems.length > 0 && (
                <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] font-medium leading-tight text-slate-500">
                  {detailItems.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              )}
              <p className="mt-1 max-w-[220px] text-[9px] leading-snug text-slate-500">
                بناءً على الاستهلاك المختار. رسوم شبكة الكهرباء تُضاف.
              </p>
            </div>

            <button
              onClick={(event) => {
                event.stopPropagation();
                handleClick();
              }}
              className={`
                whitespace-nowrap px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase sm:px-5 sm:text-[13px]
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
