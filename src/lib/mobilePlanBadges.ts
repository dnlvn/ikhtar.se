import type { Plan } from '@/hooks/usePlans';
import { getMobileOperatorOverride, getMobilePlanOverride, getCommercialPriority } from '@/lib/mobileProviderConfig';
import { getPlanCostSummary } from '@/lib/mobilePlanCost';

export type MobilePlanBadgeVariant = 'gold' | 'green' | 'blue' | 'neutral';

export interface MobilePlanBadge {
  text: string;
  reason: 'yearly-cheapest' | 'current-cheapest' | 'commercial' | 'discount' | 'no-binding' | 'data';
  variant: MobilePlanBadgeVariant;
}

function isSameNumber(a: number, b: number) {
  return Math.round(a) === Math.round(b);
}

function getLowestReliableYearlyCost(plans: Plan[]): number | null {
  const reliableCosts = plans
    .map((plan) => getPlanCostSummary(plan).effectiveMonthlyPrice12m)
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));

  if (reliableCosts.length === 0) return null;
  return Math.min(...reliableCosts);
}

function getLowestCurrentPrice(plans: Plan[]): number | null {
  const prices = plans
    .map((plan) => plan.price)
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));

  if (prices.length === 0) return null;
  return Math.min(...prices);
}

export function getPlanBadge(plan: Plan, allPlans: Plan[]): MobilePlanBadge | null {
  const planOverride = getMobilePlanOverride(plan.planKey);
  if (planOverride?.customBadgeAr) {
    return { text: planOverride.customBadgeAr, reason: 'commercial', variant: 'gold' };
  }

  const summary = getPlanCostSummary(plan);
  const lowestReliableYearlyCost = getLowestReliableYearlyCost(allPlans);

  if (
    lowestReliableYearlyCost !== null &&
    summary.hasReliable12mCost &&
    summary.effectiveMonthlyPrice12m !== null &&
    isSameNumber(summary.effectiveMonthlyPrice12m, lowestReliableYearlyCost)
  ) {
    return { text: 'الأرخص خلال سنة', reason: 'yearly-cheapest', variant: 'gold' };
  }

  const lowestCurrentPrice = getLowestCurrentPrice(allPlans);
  if (lowestCurrentPrice !== null && isSameNumber(plan.price, lowestCurrentPrice)) {
    return { text: 'أرخص الآن', reason: 'current-cheapest', variant: 'gold' };
  }

  const operatorOverride = getMobileOperatorOverride(plan.title);
  if (operatorOverride?.defaultBadgeAr || getCommercialPriority(plan.title) > 0) {
    return {
      text: operatorOverride?.defaultBadgeAr ?? 'اختيار شائع',
      reason: 'commercial',
      variant: 'gold',
    };
  }

  if (summary.discountTotal !== null && summary.discountTotal >= 300) {
    return { text: 'خصم قوي', reason: 'discount', variant: 'green' };
  }

  if (plan.bindingMonths === 0) {
    return { text: 'بدون التزام', reason: 'no-binding', variant: 'blue' };
  }

  if (plan.isUnlimited || plan.dataSortValue >= 50) {
    return { text: 'أكثر من 50 GB', reason: 'data', variant: 'neutral' };
  }

  return null;
}

export function getBadgeClasses(variant: MobilePlanBadgeVariant): string {
  if (variant === 'green') {
    return 'border-emerald-300 bg-emerald-50 text-emerald-800 shadow-emerald-100';
  }

  if (variant === 'blue') {
    return 'border-blue-200 bg-blue-50 text-blue-800 shadow-blue-100';
  }

  if (variant === 'neutral') {
    return 'border-slate-200 bg-white text-slate-700 shadow-slate-100';
  }

  return 'border-amber-300 bg-amber-50 text-amber-700 shadow-amber-100';
}
