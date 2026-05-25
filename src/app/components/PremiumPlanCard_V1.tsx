import { Lock, Sparkles, Unlock } from 'lucide-react';
import type { Plan } from '@/hooks/usePlans';
import type { SortOption } from '@/hooks/useFilteredPlans';
import { getOperatorLogo } from '@/lib/operatorLogos';
import { getActiveMobileProviderPromotion, getMobilePlanOverride } from '@/lib/mobileProviderConfig';
import { formatSek, getPlanCostSummary } from '@/lib/mobilePlanCost';
import { getBadgeClasses, getPlanBadge } from '@/lib/mobilePlanBadges';
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

export function PremiumPlanCard({
  plan,
  dealRank,
  dealType,
  savingsVariant = 'soft-highlight',
  allPlans = [plan],
  sortMode = 'best-deals',
  cardPosition,
  isAdditionalPlan = false,
}: PremiumPlanCardProps) {
  const operatorLogo = getOperatorLogo(plan.title);
  const activePromotion = getActiveMobileProviderPromotion(plan.title);
  const planOverride = getMobilePlanOverride(plan.planKey);
  const ctaUrl = activePromotion?.promotionUrl || planOverride?.customAffiliateUrl || plan.sourceUrl;
  const ctaText = planOverride?.customCtaText || t('card.viewOffer');
  const costSummary = getPlanCostSummary(plan);
  const badge = getPlanBadge(plan, allPlans, { sortMode, cardPosition, isAdditionalPlan });
  const hasGoldBadge = badge?.variant === 'gold';
  const isBestDeal = !isAdditionalPlan && hasGoldBadge;

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
      badge_text: badge?.text ?? null,
      card_position: cardPosition ?? null,
      is_expanded: false,
    });

    window.open(ctaUrl, '_blank', 'noopener,noreferrer');
  };

  const operatorName = plan.title.toLowerCase().split(' ')[0];
  const hasCampaignPrice = typeof plan.campaign?.price === 'number' && Number.isFinite(plan.campaign.price);
  const hasCampaignMonths = typeof plan.campaign?.months === 'number' && Number.isFinite(plan.campaign.months);
  const showRegularPrice = Number.isFinite(plan.regularPrice) && plan.regularPrice > plan.price;
  const showReliableYearCost = costSummary.hasCampaignPeriod && costSummary.hasReliable12mCost;
  const showSavingsText =
    hasCampaignPrice &&
    showRegularPrice &&
    hasCampaignMonths &&
    plan.campaign!.price < plan.regularPrice &&
    costSummary.discountTotal !== null;

  return (
    <div id={`plan-${plan.id}`} className="relative pt-3">
      {isBestDeal && (
        <>
          <Sparkles className="absolute top-2 -right-1 z-20 h-4 w-4 animate-pulse text-yellow-400 delay-75" />
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
        {badge && (
          <div className="absolute right-4 top-0 z-20 -translate-y-1/2">
            <div className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-1.5 text-[12px] font-black shadow-md ${getBadgeClasses(badge.variant)}`}>
              <Sparkles className="h-3 w-3" />
              {badge.text}
            </div>
          </div>
        )}

        <div className="p-[14px]">
          <div className="mb-[6px] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
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

            <div className="flex-shrink-0">
              <span className={`${plan.isUnlimited ? 'text-[18px]' : 'text-[22px]'} m-0 p-0 font-extrabold leading-none text-slate-900`}>
                {plan.dataLabel || t('card.unlimitedData')}
              </span>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-baseline gap-1">
                <span className="text-[40px] font-black leading-none text-slate-900">
                  {plan.price}
                </span>
                <span className="text-[12px] font-medium leading-tight text-slate-700">
                  {t('card.pricePerMonth')}
                </span>
              </div>
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
                <span className="text-[11px] font-regular leading-tight text-slate-900 sm:text-[12px]">
                  <strong>مدة الالتزام:</strong> {plan.bindingMonths === 0 ? t('card.noBinding') : `${plan.bindingMonths} ${t('card.bindingMonths')}`}
                </span>
              </div>
            </div>

            <div className="flex min-w-[108px] flex-col items-end gap-1 sm:min-w-[128px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                disabled={!ctaUrl}
                className={`
                  relative cursor-pointer overflow-hidden rounded-xl px-3.5 py-2.5 text-[12px] font-bold uppercase
                  shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed sm:px-5 sm:text-[13px]
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

              {(showRegularPrice || (showReliableYearCost && costSummary.effectiveMonthlyPrice12m !== null)) && (
                <div className="mt-1 max-w-[190px] text-right text-[10px] font-medium leading-snug text-slate-600 sm:text-[11px]" dir="rtl">
                  {showRegularPrice && (
                    <div>
                      السعر العادي: {formatSek(plan.regularPrice)} كرونة/شهر
                      {showSavingsText && ` · وفّر ${formatSek(costSummary.discountTotal!)} كرونة`}
                    </div>
                  )}
                  {showReliableYearCost && costSummary.effectiveMonthlyPrice12m !== null && (
                    <div className="font-normal">
                      متوسط أول 12 شهر: {formatSek(costSummary.effectiveMonthlyPrice12m)} كرونة/شهر
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
