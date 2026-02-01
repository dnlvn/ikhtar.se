import { useMemo } from 'react';
import type { Plan } from './usePlans';

export type QuickFilter = 'cheapest' | 'most-data' | 'no-binding' | 'esim' | 'eu-roaming';
export type SortOption = 'price-asc' | 'price-desc' | 'data-desc' | 'best-value' | 'best-deals' | 'no-binding' | 'popular';

interface UseFilteredPlansParams {
  plans: Plan[];
  activeFilters: Set<QuickFilter>;
  sortBy: SortOption;
}

// Helper function to calculate 12-month average price
function calculate12MonthAverage(plan: Plan): number {
  if (!plan.campaign || !plan.campaign.months) {
    return plan.regularPrice;
  }
  
  const campaignMonths = Math.min(plan.campaign.months, 12);
  const regularMonths = 12 - campaignMonths;
  
  return (plan.campaign.price * campaignMonths + plan.regularPrice * regularMonths) / 12;
}

// Helper function to calculate total campaign savings
function calculateTotalSavings(plan: Plan): number {
  if (!plan.campaign || !plan.campaign.months) {
    return 0;
  }
  
  return (plan.regularPrice - plan.campaign.price) * plan.campaign.months;
}

// Helper function to compare plans for "best deal" ranking
function comparePlansForBestDeal(a: Plan, b: Plan): number {
  // 1. Clickable first (source_url is available)
  const aClickable = !!(a.sourceUrl);
  const bClickable = !!(b.sourceUrl);
  if (aClickable && !bClickable) return -1;
  if (!aClickable && bClickable) return 1;

  // 2. Campaign deals first
  const aCampaign = a.campaign !== null;
  const bCampaign = b.campaign !== null;
  if (aCampaign && !bCampaign) return -1;
  if (!aCampaign && bCampaign) return 1;

  // 3. Cheapest current price
  const priceCompare = a.price - b.price;
  if (priceCompare !== 0) return priceCompare;

  // 4. Cheapest regular price
  const regularPriceCompare = a.regularPrice - b.regularPrice;
  if (regularPriceCompare !== 0) return regularPriceCompare;

  // 5. More data (using dataSortValue)
  const dataCompare = b.dataSortValue - a.dataSortValue;
  if (dataCompare !== 0) return dataCompare;

  // 6. Stable tie-breakers: operator A-Ö, then plan_key
  const operatorCompare = a.title.localeCompare(b.title, 'sv');
  if (operatorCompare !== 0) return operatorCompare;
  return a.id.localeCompare(b.id);
}

export interface GroupedPlans {
  diverseList: Plan[]; // Best plan per operator
  additionalPlansByOperator: Map<string, Plan[]>; // operator -> additional plans
}

export function useFilteredPlans({ plans, activeFilters, sortBy }: UseFilteredPlansParams) {
  const result = useMemo(() => {
    console.log('🔍 DEBUG useFilteredPlans: Input plans:', plans.length);
    console.log('🔍 DEBUG useFilteredPlans: Active filters:', Array.from(activeFilters));
    console.log('🔍 DEBUG useFilteredPlans: Sort by:', sortBy);
    
    let filtered = [...plans];

    // Apply combinable filters
    if (activeFilters.has('no-binding')) {
      filtered = filtered.filter(p => p.bindingMonths === 0);
      console.log('🔍 DEBUG: After no-binding filter:', filtered.length);
    }
    
    if (activeFilters.has('esim')) {
      filtered = filtered.filter(p => p.esim);
      console.log('🔍 DEBUG: After esim filter:', filtered.length);
    }
    
    if (activeFilters.has('eu-roaming')) {
      filtered = filtered.filter(p => p.euRoaming);
      console.log('🔍 DEBUG: After eu-roaming filter:', filtered.length);
    }

    // Determine effective sort - quick filter chips can override
    let effectiveSort = sortBy;
    
    if (activeFilters.has('cheapest')) {
      effectiveSort = 'price-asc';
    } else if (activeFilters.has('most-data')) {
      effectiveSort = 'data-desc';
    }

    // Apply sort
    switch (effectiveSort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;

      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;

      case 'data-desc':
        // Sort by data_sort_ui desc (handles both unlimited and limited plans)
        filtered.sort((a, b) => {
          const dataCompare = b.dataSortValue - a.dataSortValue;
          if (dataCompare !== 0) return dataCompare;
          return a.price - b.price;
        });
        break;

      case 'best-value':
        // Price per GB (current_price / dataSortValue) asc
        filtered.sort((a, b) => {
          // Use dataSortValue for calculation (it's normalized for unlimited too)
          const aValue = a.price / (a.dataSortValue || 1);
          const bValue = b.price / (b.dataSortValue || 1);
          return aValue - bValue;
        });
        break;

      case 'no-binding':
        // Filter to no binding and sort by price
        filtered = filtered.filter(p => p.bindingMonths === 0);
        filtered.sort((a, b) => a.price - b.price);
        break;

      case 'popular':
        // Sort by campaigns first (popular with deals), then by data amount, then price
        filtered.sort((a, b) => {
          // Campaign plans first
          const aCampaign = a.campaign !== null;
          const bCampaign = b.campaign !== null;
          if (aCampaign && !bCampaign) return -1;
          if (!aCampaign && bCampaign) return 1;

          // Then by data amount (unlimited first, then high GB)
          if (a.isUnlimited && !b.isUnlimited) return -1;
          if (!a.isUnlimited && b.isUnlimited) return 1;
          const dataCompare = (b.dataGb || 0) - (a.dataGb || 0);
          if (dataCompare !== 0) return dataCompare;

          // Then by price
          return a.price - b.price;
        });
        break;

      case 'best-deals':
        // Multi-criteria sort with operator diversity
        filtered.sort(comparePlansForBestDeal);
        
        // Group by operator: show best plan per operator first, then additional plans
        const operatorGroups = new Map<string, Plan[]>();
        filtered.forEach(plan => {
          const operator = plan.title;
          if (!operatorGroups.has(operator)) {
            operatorGroups.set(operator, []);
          }
          operatorGroups.get(operator)!.push(plan);
        });

        // Build diverse list and additional plans map
        const diverseList: Plan[] = [];
        const additionalPlansByOperator = new Map<string, Plan[]>();

        operatorGroups.forEach((plans, operator) => {
          // Sort plans within this operator group
          plans.sort(comparePlansForBestDeal);
          
          // Best plan goes to diverse list
          diverseList.push(plans[0]);
          
          // Additional plans
          if (plans.length > 1) {
            additionalPlansByOperator.set(operator, plans.slice(1));
          }
        });

        // Sort diverse list again to ensure best deals across operators come first
        diverseList.sort(comparePlansForBestDeal);

        console.log('🔍 DEBUG best-deals mode: diverseList length:', diverseList.length);
        console.log('🔍 DEBUG best-deals mode: additionalPlansByOperator size:', additionalPlansByOperator.size);

        return { 
          filteredPlans: filtered, 
          diverseList, 
          additionalPlansByOperator 
        };
    }

    // For non-best-deals sorts, return simple list
    console.log('🔍 DEBUG: Returning filtered plans:', filtered.length);
    
    return { 
      filteredPlans: filtered, 
      diverseList: filtered, 
      additionalPlansByOperator: new Map() 
    };
  }, [plans, activeFilters, sortBy]);

  console.log('🔍 DEBUG useFilteredPlans RESULT:', {
    filteredPlans: result.filteredPlans.length,
    diverseList: result.diverseList.length,
    additionalOperators: result.additionalPlansByOperator.size
  });

  return result;
}