import type { Plan } from '@/hooks/usePlans';
import type { SortOption } from '@/hooks/useFilteredPlans';
import { getMobileOperatorOverride, getMobilePlanOverride, getCommercialPriority } from '@/lib/mobileProviderConfig';
import { getPlanCostSummary } from '@/lib/mobilePlanCost';

export type MobilePlanBadgeVariant = 'gold' | 'green' | 'blue' | 'neutral';

export interface MobilePlanBadge {
  text: string;
  reason: 'yearly-cheapest' | 'current-cheapest' | 'commercial' | 'discount' | 'no-binding' | 'data';
  variant: MobilePlanBadgeVariant;
}

interface PlanBadgeContext {
  sortMode?: SortOption;
  cardPosition?: number;
  isAdditionalPlan?: boolean;
}

function isSameNumber(a: number, b: number) {
  return Math.round(a) === Math.round(b);
}

function isTopMainCard(context: PlanBadgeContext, limit = 3) {
  return !context.isAdditionalPlan && typeof context.cardPosition === 'number' && context.cardPosition <= limit;
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

export function getPlanBadge(
  plan: Plan,
  allPlans: Plan[],
  context: PlanBadgeContext = {}
): MobilePlanBadge | null {
  const sortMode = context.sortMode ?? 'best-deals';
  const summary = getPlanCostSummary(plan);
  const planOverride = getMobilePlanOverride(plan.planKey);

  if (!context.isAdditionalPlan && planOverride?.customBadgeAr) {
    return { text: planOverride.customBadgeAr, reason: 'commercial', variant: 'gold' };
  }

  if (sortMode === 'price-asc') {
    if (isTopMainCard(context, 3)) {
      return { text: 'أرخص الآن', reason: 'current-cheapest', variant: 'gold' };
    }
    return null;
  }

  if (sortMode === 'yearly-cost') {
    if (isTopMainCard(context, 3) && summary.hasReliable12mCost) {
      return { text: 'الأرخص سنة', reason: 'yearly-cheapest', variant: 'gold' };
    }
    return null;
  }

  if (sortMode === 'heavy-data') {
    if (isTopMainCard(context, 3) && (plan.isUnlimited || plan.dataSortValue >= 20)) {
      return { text: 'أكثر من 20 GB', reason: 'data', variant: 'gold' };
    }
    return null;
  }

  if (sortMode === 'no-binding') {
    if (isTopMainCard(context, 3) && plan.bindingMonths === 0) {
      return { text: 'بدون التزام', reason: 'no-binding', variant: 'gold' };
    }
    return null;
  }

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

  if (!context.isAdditionalPlan) {
    const operatorOverride = getMobileOperatorOverride(plan.title);
    if (operatorOverride?.defaultBadgeAr || getCommercialPriority(plan.title) > 0) {
      return {
        text: operatorOverride?.defaultBadgeAr ?? 'اختيار شائع',
        reason: 'commercial',
        variant: 'gold',
      };
    }
  }

  if (summary.discountTotal !== null && summary.discountTotal >= 300) {
    return { text: 'خصم قوي', reason: 'discount', variant: context.isAdditionalPlan ? 'green' : 'gold' };
  }

  if (plan.bindingMonths === 0) {
    return { text: 'بدون التزام', reason: 'no-binding', variant: context.isAdditionalPlan ? 'blue' : 'gold' };
  }

  if (plan.isUnlimited || plan.dataSortValue >= 50) {
    return { text: 'أكثر من 20 GB', reason: 'data', variant: 'neutral' };
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
