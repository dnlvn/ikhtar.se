import { Lock, Phone, Sparkles, Unlock } from 'lucide-react';
import type { Plan } from '@/hooks/usePlans';
import type { SortOption } from '@/hooks/useFilteredPlans';
import { getOperatorLogo } from '@/lib/operatorLogos';
import {
  getActiveMobileProviderPromotion,
  getMobilePlanOverride,
  getMobileProviderSlug,
  isMobileProviderHighlighted,
} from '@/lib/mobileProviderConfig';
import { getPlanCostSummary } from '@/lib/mobilePlanCost';
import { t } from '@/i18n';

interface PremiumPlanCardProps {
  plan: Plan;
  dealRank?: 1 | 2 | 3;
  dealType?: 'best-price' | 'most-data' | 'popular';
  savingsVariant?: 'gradient-text' | 'outlined' | 'soft-highlight';
  allPlans?: Plan[];
  sortMode?: SortOption;
  cardPosition?: number;
  isAdditionalPlan?: boolean;
}

const GOLD_OPERATOR_SLUGS = new Set(['vimla', 'comviq', 'fello']);

export function PremiumPlanCard({
  plan,
  sortMode = 'best-deals',
  cardPosition,
}: PremiumPlanCardProps) {
  const operatorLogo = getOperatorLogo(plan.title);
  const activePromotion = getActiveMobileProviderPromotion(plan.title);
  const planOverride = getMobilePlanOverride(plan.planKey);
  const ctaUrl = activePromotion?.promotionUrl || planOverride?.customAffiliateUrl || plan.sourceUrl;
  const ctaText = planOverride?.customCtaText || t('card.viewOffer');
  const costSummary = getPlanCostSummary(plan);
  const operatorName = plan.title.toLowerCase().split(' ')[0];
  const providerSlug = getMobileProviderSlug(plan.title);
  const showRegularPrice = Number.isFinite(plan.regularPrice) && plan.regularPrice > plan.price;
  const isTopOperator = GOLD_OPERATOR_SLUGS.has(providerSlug);
  const isBestDeal = isTopOperator || plan.price <= 100 || isMobileProviderHighlighted(plan.title);
  const badgeText = isBestDeal ? t('card.bestDealBadge') : null;

  const handleClick = () => {
    if (!ctaUrl) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'cta_click',
      operator: plan.title,
      plan_name: plan.subtitle,
      price: plan.price,
      selected_sort_mode: sortMode,
      plan_key: plan.planKey,
      current_price: plan.price,
      effective_monthly_price_12m: costSummary.effectiveMonthlyPrice12m,
      badge_text: badgeText,
      card_position: cardPosition ?? null,
      is_expanded: false,
    });

    window.open(ctaUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div id={`plan-${plan.id}`} className="relative">
      {isBestDeal && (
        <>
          <Sparkles className="absolute -top-1 -right-1 z-20 h-4 w-4 animate-pulse text-yellow-400 delay-75" />
          <Sparkles className="absolute -bottom-1 -left-1 z-20 h-5 w-5 animate-pulse text-orange-400 delay-150" />
        </>
      )}

      <div
        onClick={handleClick}
        className={`
          relative rounded-xl shadow-sm transition-all duration-200 hover:shadow-lg
          ${ctaUrl ? 'cursor-pointer' : 'cursor-not-allowed'}
          ${isBestDeal
            ? 'border-2 border-amber-400 bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/60 shadow-lg shadow-amber-200/40 hover:shadow-xl hover:shadow-amber-300/50'
            : 'border border-slate-200/60 bg-white'
          }
        `}
        style={{ borderRadius: '0.75rem' }}
      >
        {showRegularPrice && (
          <span className={`absolute left-4 top-0 z-10 -translate-y-1/2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold line-through shadow-sm ${isBestDeal ? 'text-red-700' : 'text-slate-600'}`}>
            {plan.regularPrice} {t('card.pricePerMonth')}
          </span>
        )}

        {isBestDeal && (
          <div className="absolute -top-3 right-4 z-20">
            <div className="flex items-center gap-1 rounded-full border border-amber-300/50 bg-amber-50 px-3 py-1 text-[10px] font-semibold text-amber-700 shadow-sm">
              <Sparkles className="h-2.5 w-2.5" />
              {t('card.bestDealBadge')}
            </div>
          </div>
        )}

        <div className="p-[14px]">
          <div className="mb-[6px] grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2" dir="ltr">
            <div className="flex min-w-0 flex-col items-start">
              <div className="flex items-baseline gap-1">
                <span className="text-[40px] font-black leading-none text-slate-900">
                  {plan.price}
                </span>
                <span className="text-[12px] font-medium leading-tight text-slate-700">
                  {t('card.pricePerMonth')}
                </span>
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center justify-center text-center">
              <span className={`${plan.isUnlimited ? 'text-[18px]' : 'text-[22px]'} m-0 p-0 font-extrabold leading-none text-slate-900`}>
                {plan.dataLabel || t('card.unlimitedData')}
              </span>
            </div>

            <div className="flex min-w-0 items-center justify-end gap-2.5">
              {operatorLogo ? (
                <img
                  src={operatorLogo}
                  alt={operatorName}
                  className="h-[35px] w-auto object-contain"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200">
                  <span className="text-xs font-bold text-slate-700">{plan.title.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                {plan.bindingMonths === 0 ? (
                  <Unlock className="h-3.5 w-3.5 text-slate-900" strokeWidth={2.5} />
                ) : (
                  <Lock className="h-3.5 w-3.5 text-slate-900" strokeWidth={2.5} />
                )}
                <span className="text-[12px] font-regular leading-tight text-slate-900">
                  {plan.bindingMonths === 0 ? t('card.noBinding') : `${plan.bindingMonths} ${t('card.bindingMonths')}`}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-900" strokeWidth={2.5} />
                <span className="text-[12px] font-regular leading-tight text-slate-900">
                  {t('card.freeCalls')}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              disabled={!ctaUrl}
              className={`
                relative cursor-pointer overflow-hidden rounded-xl px-5 py-2.5 text-[13px] font-bold uppercase
                shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed
                ${isBestDeal
                  ? 'text-white shadow-lg hover:brightness-110'
                  : 'border-2 border-green-700 bg-green-700 text-white hover:bg-green-800'
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
              <span className="relative flex items-center gap-1.5">{ctaText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
