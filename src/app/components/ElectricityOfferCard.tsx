import { Sparkles, Zap } from 'lucide-react';
import type { ElectricityOffer } from '@/hooks/useElectricityOffers';
import { getElectricityProviderLogo } from '@/lib/electricityProviderLogos';

interface ElectricityOfferCardProps {
  offer: ElectricityOffer;
  rank: number;
  annualUsage: number;
  postcode: string;
}

type TopCardBadgeVariant =
  | 'floating-pill'
  | 'premium-medal'
  | 'soft-ribbon'
  | 'top-tab'
  | 'glow-label';

const TOP_CARD_BADGE_VARIANT: TopCardBadgeVariant = 'floating-pill';

function getArabicAgreementTypeLabel(offer: ElectricityOffer): string | null {
  if (offer.agreementCategory === 'variable') return 'سعر متغير';
  if (offer.agreementCategory === 'fixed') return 'سعر ثابت';
  if (offer.agreementCategory === 'hourly') return 'سعر بالساعة/ربع الساعة';
  return null;
}

function getTopCardBadgeClasses(rank: number, variant: TopCardBadgeVariant) {
  const isTopRank = rank === 1;
  const base = 'inline-flex items-center justify-center text-center leading-tight whitespace-nowrap';

  const variants: Record<TopCardBadgeVariant, { wrapper: string; badge: string; accent: string }> = {
    'floating-pill': {
      wrapper: '-top-4',
      badge: `${base} rounded-full ${
        isTopRank
          ? 'bg-gradient-to-r from-orange-100 via-amber-50 to-yellow-100 border-2 border-amber-400 px-5 py-2 text-[13px] font-black text-orange-700 shadow-[0_8px_24px_rgba(245,158,11,0.28)]'
          : 'bg-amber-50 border border-amber-300/70 px-4 py-1.5 text-[11px] font-bold text-amber-700 shadow-sm'
      }`,
      accent: isTopRank ? 'bg-orange-500' : 'bg-amber-400',
    },
    'premium-medal': {
      wrapper: '-top-4',
      badge: `${base} rounded-full ${
        isTopRank
          ? 'bg-white border-2 border-amber-400 px-4 py-2 text-[13px] font-black text-orange-700 shadow-[0_10px_26px_rgba(217,119,6,0.22)]'
          : 'bg-white border border-amber-200 px-3.5 py-1.5 text-[11px] font-bold text-amber-700 shadow-sm'
      }`,
      accent: isTopRank ? 'bg-gradient-to-br from-orange-400 to-yellow-300' : 'bg-amber-300',
    },
    'soft-ribbon': {
      wrapper: '-top-3',
      badge: `${base} rounded-lg ${
        isTopRank
          ? 'bg-gradient-to-r from-amber-200 via-yellow-100 to-orange-100 border border-amber-400 px-5 py-1.5 text-[13px] font-black text-orange-800 shadow-md'
          : 'bg-amber-50 border border-amber-200 px-4 py-1.5 text-[11px] font-bold text-amber-700 shadow-sm'
      }`,
      accent: isTopRank ? 'bg-orange-500' : 'bg-amber-400',
    },
    'top-tab': {
      wrapper: '-top-px',
      badge: `${base} rounded-b-xl ${
        isTopRank
          ? 'bg-gradient-to-r from-orange-100 to-yellow-100 border-x-2 border-b-2 border-amber-400 px-5 py-1.5 text-[13px] font-black text-orange-700 shadow-sm'
          : 'bg-amber-50 border-x border-b border-amber-300/70 px-4 py-1.5 text-[11px] font-bold text-amber-700 shadow-sm'
      }`,
      accent: isTopRank ? 'bg-orange-500' : 'bg-amber-400',
    },
    'glow-label': {
      wrapper: '-top-4',
      badge: `${base} rounded-full ${
        isTopRank
          ? 'bg-yellow-50 border-2 border-orange-300 px-5 py-2 text-[13px] font-black text-orange-700 shadow-[0_0_24px_rgba(251,191,36,0.45)]'
          : 'bg-amber-50 border border-yellow-300 px-4 py-1.5 text-[11px] font-bold text-amber-700 shadow-[0_0_14px_rgba(251,191,36,0.18)]'
      }`,
      accent: isTopRank ? 'bg-orange-500' : 'bg-amber-400',
    },
  };

  return variants[variant];
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
    1: 'أفضل عرض لك',
    2: 'يستحق المقارنة',
    3: 'خيار ذكي',
  };
  const badgeLabel = badgeLabelByRank[rank];
  const badgeClasses = badgeLabel ? getTopCardBadgeClasses(rank, TOP_CARD_BADGE_VARIANT) : null;
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
    window.dataLayer.push({
      event: 'electricity_provider_click',
      vertical: 'electricity',
      provider: offer.provider,
      plan_name: offer.agreementName,
      rank,
      affiliate_url_type: offer.affiliateUrlType,
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
          <div className={`absolute left-1/2 z-20 -translate-x-1/2 ${badgeClasses?.wrapper}`}>
            <div className={badgeClasses?.badge}>
              <span className={`ml-1.5 h-2 w-2 rounded-full ${badgeClasses?.accent}`} />
              {badgeLabel}
            </div>
          </div>
        )}

        <div className="p-[14px]">
          <div className="flex items-center justify-between mb-[6px]">
            <div
              dir="ltr"
              className="flex min-w-0 w-[220px] max-w-[58%] flex-col items-end gap-1.5 text-right"
            >
              {providerLogo ? (
                <div className={`flex w-full items-center justify-end overflow-visible ${isBestDeal ? 'min-h-[50px]' : 'min-h-[42px]'}`}>
                  <img
                    src={providerLogo}
                    alt={offer.provider}
                    className={`ml-auto block w-auto max-w-full object-contain ${isBestDeal ? 'h-[42px]' : 'h-[35px]'}`}
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
                <span
                  dir="rtl"
                  className="inline-flex w-fit self-end rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold leading-tight text-blue-700"
                >
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
            <div dir="ltr" className="flex min-w-0 flex-col items-end justify-center gap-1 text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span dir="rtl" className="text-[12px] leading-tight text-slate-900">
                  {offer.comparisonPriceOre.toFixed(2).replace('.', ',')} أوره/kWh
                </span>
                <Zap className="w-3.5 h-3.5 text-blue-700" strokeWidth={2.5} />
              </div>
              {detailItems.length > 0 && (
                <div className="flex flex-wrap justify-end gap-x-2 gap-y-0.5 text-[10px] font-medium leading-tight text-slate-500">
                  {detailItems.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              )}
              <p className="mt-1 max-w-[220px] text-right text-[9px] leading-snug text-slate-500">
                بناءً على الاستهلاك المختار. رسوم شبكة الكهرباء تُضاف
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
              {rank === 1 ? 'اشترك الآن' : 'احصل على العرض'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
