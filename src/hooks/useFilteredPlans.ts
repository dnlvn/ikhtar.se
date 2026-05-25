import { useMemo } from 'react';
import type { Plan } from './usePlans';
import { getCommercialPriority, isPopularMobileProvider } from '@/lib/mobileProviderConfig';
import { getPlanCostSummary } from '@/lib/mobilePlanCost';

export type QuickFilter = 'cheapest' | 'most-data' | 'no-binding' | 'esim' | 'eu-roaming';
export type SortOption =
  | 'price-asc'
  | 'price-desc'
  | 'data-desc'
  | 'best-value'
  | 'best-deals'
  | 'yearly-cost'
  | 'heavy-data'
  | 'no-binding'
  | 'popular';

interface UseFilteredPlansParams {
  plans: Plan[];
  activeFilters: Set<QuickFilter>;
  sortBy: SortOption;
}

function compareStable(a: Plan, b: Plan): number {
  const operatorCompare = a.title.localeCompare(b.title, 'sv');
  if (operatorCompare !== 0) return operatorCompare;
  return a.id.localeCompare(b.id);
}

function compareByCurrentPrice(a: Plan, b: Plan): number {
  const priceCompare = a.price - b.price;
  if (priceCompare !== 0) return priceCompare;

  const dataCompare = b.dataSortValue - a.dataSortValue;
  if (dataCompare !== 0) return dataCompare;

  const bindingCompare = a.bindingMonths - b.bindingMonths;
  if (bindingCompare !== 0) return bindingCompare;

  return compareStable(a, b);
}

function compareByYearlyCost(a: Plan, b: Plan): number {
  const aSummary = getPlanCostSummary(a);
  const bSummary = getPlanCostSummary(b);

  if (aSummary.hasReliable12mCost && !bSummary.hasReliable12mCost) return -1;
  if (!aSummary.hasReliable12mCost && bSummary.hasReliable12mCost) return 1;

  if (aSummary.effectiveMonthlyPrice12m !== null && bSummary.effectiveMonthlyPrice12m !== null) {
    const costCompare = aSummary.effectiveMonthlyPrice12m - bSummary.effectiveMonthlyPrice12m;
    if (costCompare !== 0) return costCompare;
  }

  const priceCompare = a.price - b.price;
  if (priceCompare !== 0) return priceCompare;

  const regularPriceCompare = a.regularPrice - b.regularPrice;
  if (regularPriceCompare !== 0) return regularPriceCompare;

  const dataCompare = b.dataSortValue - a.dataSortValue;
  if (dataCompare !== 0) return dataCompare;

  return compareStable(a, b);
}

function compareByHeavyData(a: Plan, b: Plan): number {
  const priceCompare = a.price - b.price;
  if (priceCompare !== 0) return priceCompare;

  const dataCompare = b.dataSortValue - a.dataSortValue;
  if (dataCompare !== 0) return dataCompare;

  return compareStable(a, b);
}

function getBestDealScore(plan: Plan): number {
  const summary = getPlanCostSummary(plan);
  const commercialPriority = getCommercialPriority(plan.title);
  const clickableScore = plan.sourceUrl ? 100000 : 0;
  const campaignScore = plan.campaign ? 8000 : 0;
  const commercialScore = commercialPriority * 350;
  const noBindingScore = plan.bindingMonths === 0 ? 900 : 0;
  const dataScore = Math.min(plan.dataSortValue, 120) * 18;
  const yearlyCostScore = summary.hasReliable12mCost && summary.effectiveMonthlyPrice12m !== null
    ? Math.max(0, 5000 - summary.effectiveMonthlyPrice12m * 12)
    : 0;
  const discountScore = summary.discountTotal ? Math.min(summary.discountTotal, 2500) : 0;
  const pricePenalty = plan.price * 45;

  return (
    clickableScore +
    campaignScore +
    commercialScore +
    noBindingScore +
    dataScore +
    yearlyCostScore +
    discountScore -
    pricePenalty
  );
}

// CRO-friendly ranking for default mode.
function comparePlansForBestDeal(a: Plan, b: Plan): number {
  const scoreCompare = getBestDealScore(b) - getBestDealScore(a);
  if (scoreCompare !== 0) return scoreCompare;

  return compareByCurrentPrice(a, b);
}

function comparePopular(a: Plan, b: Plan): number {
  const aPopular = isPopularMobileProvider(a.title);
  const bPopular = isPopularMobileProvider(b.title);
  if (aPopular && !bPopular) return -1;
  if (!aPopular && bPopular) return 1;

  const aCampaign = a.campaign !== null;
  const bCampaign = b.campaign !== null;
  if (aCampaign && !bCampaign) return -1;
  if (!aCampaign && bCampaign) return 1;

  return compareByCurrentPrice(a, b);
}

function groupSortedPlansByOperator(sortedPlans: Plan[]) {
  const diverseList: Plan[] = [];
  const additionalPlansByOperator = new Map<string, Plan[]>();
  const seenOperators = new Set<string>();

  sortedPlans.forEach((plan) => {
    const operator = plan.title;

    if (!seenOperators.has(operator)) {
      seenOperators.add(operator);
      diverseList.push(plan);
      return;
    }

    const additionalPlans = additionalPlansByOperator.get(operator) ?? [];
    additionalPlans.push(plan);
    additionalPlansByOperator.set(operator, additionalPlans);
  });

  return { diverseList, additionalPlansByOperator };
}

export interface GroupedPlans {
  diverseList: Plan[]; // Best visible plan per operator in the current sort/filter mode
  additionalPlansByOperator: Map<string, Plan[]>; // operator -> additional plans in the current mode
}

export function useFilteredPlans({ plans, activeFilters, sortBy }: UseFilteredPlansParams) {
  return useMemo(() => {
    let filtered = [...plans];

    if (activeFilters.has('no-binding')) {
      filtered = filtered.filter((p) => p.bindingMonths === 0);
    }

    if (activeFilters.has('esim')) {
      filtered = filtered.filter((p) => p.esim);
    }

    if (activeFilters.has('eu-roaming')) {
      filtered = filtered.filter((p) => p.euRoaming);
    }

    let effectiveSort = sortBy;

    if (activeFilters.has('cheapest')) {
      effectiveSort = 'price-asc';
    } else if (activeFilters.has('most-data')) {
      effectiveSort = 'data-desc';
    }

    switch (effectiveSort) {
      case 'price-asc':
        filtered.sort(compareByCurrentPrice);
        break;

      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price || compareStable(a, b));
        break;

      case 'data-desc':
        filtered.sort((a, b) => {
          const dataCompare = b.dataSortValue - a.dataSortValue;
          if (dataCompare !== 0) return dataCompare;
          return compareByCurrentPrice(a, b);
        });
        break;

      case 'best-value':
        filtered.sort((a, b) => {
          const aValue = a.price / (a.dataSortValue || 1);
          const bValue = b.price / (b.dataSortValue || 1);
          return aValue - bValue || compareStable(a, b);
        });
        break;

      case 'yearly-cost':
        filtered.sort(compareByYearlyCost);
        break;

      case 'heavy-data':
        filtered = filtered.filter((p) => p.isUnlimited || p.dataSortValue >= 20);
        filtered.sort(compareByHeavyData);
        break;

      case 'no-binding':
        filtered = filtered.filter((p) => p.bindingMonths === 0);
        filtered.sort(compareByCurrentPrice);
        break;

      case 'popular':
        filtered.sort(comparePopular);
        break;

      case 'best-deals':
        filtered.sort(comparePlansForBestDeal);
        break;
    }

    const grouped = groupSortedPlansByOperator(filtered);

    return {
      filteredPlans: filtered,
      diverseList: grouped.diverseList,
      additionalPlansByOperator: grouped.additionalPlansByOperator,
    };
  }, [plans, activeFilters, sortBy]);
}
