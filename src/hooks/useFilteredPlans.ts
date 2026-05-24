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

  // Stable fallbacks if score is identical.
  const priceCompare = a.price - b.price;
  if (priceCompare !== 0) return priceCompare;

  const dataCompare = b.dataSortValue - a.dataSortValue;
  if (dataCompare !== 0) return dataCompare;

  const bindingCompare = a.bindingMonths - b.bindingMonths;
  if (bindingCompare !== 0) return bindingCompare;

  return compareStable(a, b);
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

  const priceCompare = a.price - b.price;
  if (priceCompare !== 0) return priceCompare;

  const dataCompare = b.dataSortValue - a.dataSortValue;
  if (dataCompare !== 0) return dataCompare;

  const bindingCompare = a.bindingMonths - b.bindingMonths;
  if (bindingCompare !== 0) return bindingCompare;

  return compareStable(a, b);
}

function groupBestPlanPerOperator(filtered: Plan[]) {
  const operatorGroups = new Map<string, Plan[]>();
  filtered.forEach((plan) => {
    const operator = plan.title;
    if (!operatorGroups.has(operator)) {
      operatorGroups.set(operator, []);
    }
    operatorGroups.get(operator)!.push(plan);
  });

  const diverseList: Plan[] = [];
  const additionalPlansByOperator = new Map<string, Plan[]>();

  operatorGroups.forEach((operatorPlans, operator) => {
    operatorPlans.sort(comparePlansForBestDeal);
    diverseList.push(operatorPlans[0]);

    if (operatorPlans.length > 1) {
      additionalPlansByOperator.set(operator, operatorPlans.slice(1));
    }
  });

  diverseList.sort(comparePlansForBestDeal);
  return { diverseList, additionalPlansByOperator };
}

export interface GroupedPlans {
  diverseList: Plan[]; // Best plan per operator or current sorted list
  additionalPlansByOperator: Map<string, Plan[]>; // operator -> additional plans
}

export function useFilteredPlans({ plans, activeFilters, sortBy }: UseFilteredPlansParams) {
  const result = useMemo(() => {
    console.log('🔍 DEBUG useFilteredPlans: Input plans:', plans.length);
    console.log('🔍 DEBUG useFilteredPlans: Active filters:', Array.from(activeFilters));
    console.log('🔍 DEBUG useFilteredPlans: Sort by:', sortBy);
    
    let filtered = [...plans];

    if (activeFilters.has('no-binding')) {
      filtered = filtered.filter((p) => p.bindingMonths === 0);
      console.log('🔍 DEBUG: After no-binding filter:', filtered.length);
    }
    
    if (activeFilters.has('esim')) {
      filtered = filtered.filter((p) => p.esim);
      console.log('🔍 DEBUG: After esim filter:', filtered.length);
    }
    
    if (activeFilters.has('eu-roaming')) {
      filtered = filtered.filter((p) => p.euRoaming);
      console.log('🔍 DEBUG: After eu-roaming filter:', filtered.length);
    }

    let effectiveSort = sortBy;
    
    if (activeFilters.has('cheapest')) {
      effectiveSort = 'price-asc';
    } else if (activeFilters.has('most-data')) {
      effectiveSort = 'data-desc';
    }

    switch (effectiveSort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price || compareStable(a, b));
        break;

      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price || compareStable(a, b));
        break;

      case 'data-desc':
        filtered.sort((a, b) => {
          const dataCompare = b.dataSortValue - a.dataSortValue;
          if (dataCompare !== 0) return dataCompare;
          return a.price - b.price || compareStable(a, b);
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
        filtered.sort(comparePlansForBestDeal);
        break;

      case 'no-binding':
        filtered = filtered.filter((p) => p.bindingMonths === 0);
        filtered.sort(comparePlansForBestDeal);
        break;

      case 'popular':
        filtered.sort(comparePopular);
        break;

      case 'best-deals': {
        filtered.sort(comparePlansForBestDeal);
        const grouped = groupBestPlanPerOperator(filtered);

        console.log('🔍 DEBUG best-deals mode: diverseList length:', grouped.diverseList.length);
        console.log('🔍 DEBUG best-deals mode: additionalPlansByOperator size:', grouped.additionalPlansByOperator.size);

        return { 
          filteredPlans: filtered, 
          diverseList: grouped.diverseList, 
          additionalPlansByOperator: grouped.additionalPlansByOperator,
        };
      }
    }

    console.log('🔍 DEBUG: Returning filtered plans:', filtered.length);
    
    return { 
      filteredPlans: filtered, 
      diverseList: filtered, 
      additionalPlansByOperator: new Map<string, Plan[]>(),
    };
  }, [plans, activeFilters, sortBy]);

  console.log('🔍 DEBUG useFilteredPlans RESULT:', {
    filteredPlans: result.filteredPlans.length,
    diverseList: result.diverseList.length,
    additionalOperators: result.additionalPlansByOperator.size,
  });

  return result;
}
