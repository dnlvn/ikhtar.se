import { useMemo } from 'react';
import type { Plan } from './usePlans';
import { getCommercialPriority } from '@/lib/mobileProviderConfig';
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

function compareClickable(a: Plan, b: Plan): number {
  const aClickable = Boolean(a.sourceUrl);
  const bClickable = Boolean(b.sourceUrl);
  if (aClickable && !bClickable) return -1;
  if (!aClickable && bClickable) return 1;
  return 0;
}

function getYearlyCost(plan: Plan): number | null {
  const summary = getPlanCostSummary(plan);
  return summary.hasReliable12mCost && summary.effectiveMonthlyPrice12m !== null
    ? summary.effectiveMonthlyPrice12m
    : null;
}

function compareYearlyCostValue(a: Plan, b: Plan): number {
  const aYearly = getYearlyCost(a);
  const bYearly = getYearlyCost(b);

  if (aYearly !== null && bYearly !== null) {
    const costCompare = aYearly - bYearly;
    if (costCompare !== 0) return costCompare;
  }

  if (aYearly !== null && bYearly === null) return -1;
  if (aYearly === null && bYearly !== null) return 1;

  return 0;
}

function compareByCurrentPrice(a: Plan, b: Plan): number {
  const priceCompare = a.price - b.price;
  if (priceCompare !== 0) return priceCompare;

  const dataCompare = b.dataSortValue - a.dataSortValue;
  if (dataCompare !== 0) return dataCompare;

  const bindingCompare = a.bindingMonths - b.bindingMonths;
  if (bindingCompare !== 0) return bindingCompare;

  const regularPriceCompare = a.regularPrice - b.regularPrice;
  if (regularPriceCompare !== 0) return regularPriceCompare;

  return compareStable(a, b);
}

function compareByYearlyCost(a: Plan, b: Plan): number {
  const yearlyCompare = compareYearlyCostValue(a, b);
  if (yearlyCompare !== 0) return yearlyCompare;

  const priceCompare = a.price - b.price;
  if (priceCompare !== 0) return priceCompare;

  const dataCompare = b.dataSortValue - a.dataSortValue;
  if (dataCompare !== 0) return dataCompare;

  const bindingCompare = a.bindingMonths - b.bindingMonths;
  if (bindingCompare !== 0) return bindingCompare;

  return compareStable(a, b);
}

function compareByHeavyData(a: Plan, b: Plan): number {
  const priceCompare = a.price - b.price;
  if (priceCompare !== 0) return priceCompare;

  const yearlyCompare = compareYearlyCostValue(a, b);
  if (yearlyCompare !== 0) return yearlyCompare;

  const dataCompare = b.dataSortValue - a.dataSortValue;
  if (dataCompare !== 0) return dataCompare;

  const bindingCompare = a.bindingMonths - b.bindingMonths;
  if (bindingCompare !== 0) return bindingCompare;

  return compareStable(a, b);
}

function compareNoBinding(a: Plan, b: Plan): number {
  const priceCompare = a.price - b.price;
  if (priceCompare !== 0) return priceCompare;

  const yearlyCompare = compareYearlyCostValue(a, b);
  if (yearlyCompare !== 0) return yearlyCompare;

  const dataCompare = b.dataSortValue - a.dataSortValue;
  if (dataCompare !== 0) return dataCompare;

  const regularPriceCompare = a.regularPrice - b.regularPrice;
  if (regularPriceCompare !== 0) return regularPriceCompare;

  return compareStable(a, b);
}

function getBestDealsPriceIndex(plan: Plan): number {
  const yearlyCost = getYearlyCost(plan);
  const priceIndex = yearlyCost !== null
    ? plan.price * 0.7 + yearlyCost * 0.3
    : plan.price;
  const summary = getPlanCostSummary(plan);

  const discountBonus = summary.discountTotal !== null
    ? Math.min(summary.discountTotal / 600, 3)
    : 0;
  const noBindingBonus = plan.bindingMonths === 0 ? 1.5 : 0;
  const dataBonus = plan.isUnlimited
    ? 1.5
    : plan.dataSortValue >= 50
      ? 1.5
      : plan.dataSortValue >= 20
        ? 1
        : plan.dataSortValue >= 5
          ? 0.5
          : 0;

  return priceIndex - discountBonus - noBindingBonus - dataBonus;
}

function createBestDealsComparator(plans: Plan[]) {
  const clickablePrices = plans
    .filter((plan) => plan.sourceUrl)
    .map((plan) => plan.price);
  const lowestClickablePrice = clickablePrices.length > 0
    ? Math.min(...clickablePrices)
    : null;

  return function compareBestDeals(a: Plan, b: Plan): number {
    const clickableCompare = compareClickable(a, b);
    if (clickableCompare !== 0) return clickableCompare;

    const getAdjustedIndex = (plan: Plan) => {
      const baseIndex = getBestDealsPriceIndex(plan);
      const commercialPriority = getCommercialPriority(plan.title);
      const isCommerciallyClose = lowestClickablePrice !== null && (
        plan.price <= lowestClickablePrice + 20 ||
        plan.price <= lowestClickablePrice * 1.15
      );
      const commercialBonus = isCommerciallyClose
        ? Math.min(commercialPriority / 10, 2)
        : 0;

      return baseIndex - commercialBonus;
    };

    const scoreCompare = getAdjustedIndex(a) - getAdjustedIndex(b);
    if (scoreCompare !== 0) return scoreCompare;

    const priceCompare = a.price - b.price;
    if (priceCompare !== 0) return priceCompare;

    const yearlyCompare = compareYearlyCostValue(a, b);
    if (yearlyCompare !== 0) return yearlyCompare;

    const dataCompare = b.dataSortValue - a.dataSortValue;
    if (dataCompare !== 0) return dataCompare;

    const bindingCompare = a.bindingMonths - b.bindingMonths;
    if (bindingCompare !== 0) return bindingCompare;

    return compareStable(a, b);
  };
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
        filtered.sort(compareNoBinding);
        break;

      case 'popular':
      case 'best-deals':
        filtered.sort(createBestDealsComparator(filtered));
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
