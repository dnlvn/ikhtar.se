import { ChevronDown, Lock, Phone, Sparkles, Unlock } from 'lucide-react';
import { useState } from 'react';
import type { Plan } from '@/hooks/usePlans';
import type { SortOption } from '@/hooks/useFilteredPlans';
import { getOperatorLogo } from '@/lib/operatorLogos';
import { getActiveMobileProviderPromotion, getMobilePlanOverride, isMobileProviderHighlighted } from '@/lib/mobileProviderConfig';
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
}

export function PremiumPlanCard({
  plan,
  dealRank,
  dealType,
  savingsVariant = 'soft-highlight',
  allPlans = [plan],
  sortMode = 'best-deals',
  cardPosition,
}: PremiumPlanCardProps) {
  const operatorLogo = getOperatorLogo(plan.title);
  const activePromotion = getActiveMobileProviderPromotion(plan.title);
  const planOverride = getMobilePlanOverride(plan.planKey);
  const ctaUrl = activePromotion?.promotionUrl || planOverride?.customAffiliateUrl || plan.sourceUrl;
  const ctaText = planOverride?.customCtaText || t('card.viewOffer');
  const [isExpanded, setIsExpanded] = useState(false);
  const costSummary = getPlanCostSummary(plan);
  const badge = getPlanBadge(plan, allPlans);
  const hasGoldBadge = badge?.variant === 'gold';
  const isBestDeal = plan.price <= 100 || isMobileProviderHighlighted(plan.title) || hasGoldBadge;

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
      is_expanded: isExpanded,
    });

    window.open(ctaUrl, '_blank', 'noopener,noreferrer');
  };

  const operatorName = plan.title.toLowerCase().split(' ')[0];
  const showCampaignCostRows = costSummary.hasCampaignPeriod && costSummary.hasReliable12mCost;
  const detailRows = [
    costSummary.postCampaignPrice !== null
      ? { label: 'السعر بعد العرض', value: `${formatSek(costSummary.postCampaignPrice)} كرونة/شهر` }
      : null,
    costSummary.campaignMonths !== null
      ? { label: 'مدة العرض', value: `${costSummary.campaignMonths} أشهر` }
      : null,
    costSummary.totalCost12m !== null
      ? { label: 'التكلفة خلال أول سنة', value: `${formatSek(costSummary.totalCost12m)} كرونة` }
      : null,
    costSummary.discountTotal !== null
      ? { label: 'الخصم الكلي', value: `${formatSek(costSummary.discountTotal)} كرونة`, valueClassName: 'text-emerald-700' }
      : null,
    { label: 'فترة الالتزام', value: plan.bindingMonths === 0 ? t('card.noBinding') : `${plan.bindingMonths} ${t('card.bindingMonths')}` },
    plan.euRoaming ? { label: 'استخدام داخل EU', value: 'مشمول' } : null,
    plan.esim ? { label: 'eSIM', value: 'متاح' } : null,
  ].filter((row): row is { label: string; value: string; valueClassName?: string } => row !== null);

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
          <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
            <div className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-1.5 text-[12px] font-black shadow-md ${getBadgeClasses(badge.variant)}`}>
              <Sparkles className="h-3 w-3" />
              {badge.text}
            </div>
          </div>
        )}

        {activePromotion && (
          <div className="absolute left-1/2 top-[54px] z-10 flex -translate-x-1/2 flex-col items-center gap-0.5 text-[9px] font-bold leading-none" dir="rtl">
            <span className="text-[9px] font-semibold text-slate-900">الآن</span>
            <span className="inline-flex items-center whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-700 shadow-sm">
              100 GB إضافية
            </span>
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

          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-0.5">
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

            <div className="flex min-w-[128px] flex-col items-end gap-1">
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

              {showCampaignCostRows && (
                <div className="max-w-[150px] text-right leading-tight">
                  {costSummary.discountTotal !== null && (
                    <div className="text-[10px] font-black text-emerald-700">
                      وفّر {formatSek(costSummary.discountTotal)} كرونة
                    </div>
                  )}
                  {costSummary.effectiveMonthlyPrice12m !== null && (
                    <div className="text-[10px] font-bold text-slate-600">
                      متوسط السنة الأولى: {formatSek(costSummary.effectiveMonthlyPrice12m)} كرونة/شهر
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {detailRows.length > 0 && (
            <div className="mt-1.5 flex justify-end">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsExpanded((current) => !current);
                }}
                className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 transition-colors hover:text-slate-700"
              >
                {isExpanded ? 'إخفاء' : 'تفاصيل'}
                <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}

          {isExpanded && detailRows.length > 0 && (
            <div
              className="mt-1.5 divide-y divide-slate-100 rounded-lg bg-slate-50/70 px-2.5 py-1.5 text-[10px] font-semibold leading-tight text-slate-600"
              onClick={(event) => event.stopPropagation()}
            >
              {detailRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 py-1">
                  <span>{row.label}</span>
                  <span className={`text-left font-black text-slate-800 ${row.valueClassName ?? ''}`}>{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
