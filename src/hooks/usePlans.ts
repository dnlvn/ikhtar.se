import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getMobilePlanOverride, isMobileProviderDisabled } from '@/lib/mobileProviderConfig';

// Database types - matches mobile_plans_public view columns used by the UI
export interface MobilePlanDB {
  plan_key: string;
  operator: string;
  plan_name: string;
  data_gb: number | null;
  unlimited_data: boolean;
  current_price: number;
  regular_price: number;
  campaign_price: number | null;
  campaign_months?: number | null;
  binding_months: number;
  is_active: boolean;
  affiliate_url: string | null;
  updated_at: string;
}

// UI-ready plan type
export interface Plan {
  id: string; // plan_key - keep id for React compatibility
  planKey: string; // plan_key
  title: string; // operator
  subtitle: string; // plan_name
  dataLabel: string; // computed: "X GB" or "Fri surf"
  dataSortValue: number; // computed: data_gb or 9999 for unlimited
  isUnlimited: boolean; // unlimited_data
  price: number; // current_price
  regularPrice: number; // regular_price
  bindingMonths: number;
  campaign: {
    price: number;
    months?: number | null;
  } | null;
  // Legacy fields for backward compatibility (all undefined for now)
  network?: string | null;
  esim?: boolean;
  euRoaming?: boolean;
  affiliateUrl?: string | null;
  sourceUrl?: string | null;
}

function transformPlan(dbPlan: MobilePlanDB): Plan {
  // Compute dataLabel: never show "undefined GB"
  let dataLabel: string;
  if (dbPlan.unlimited_data || dbPlan.data_gb === null) {
    dataLabel = 'Fri surf';
  } else {
    dataLabel = `${dbPlan.data_gb} GB`;
  }

  // Compute dataSortValue: unlimited = 9999, else use data_gb
  const dataSortValue = dbPlan.unlimited_data || dbPlan.data_gb === null
    ? 9999
    : dbPlan.data_gb;
  const planOverride = getMobilePlanOverride(dbPlan.plan_key);
  const affiliateUrl = planOverride?.customAffiliateUrl || dbPlan.affiliate_url;

  return {
    id: dbPlan.plan_key, // Use plan_key as React key
    planKey: dbPlan.plan_key,
    title: dbPlan.operator,
    subtitle: dbPlan.plan_name,
    dataLabel: dataLabel,
    dataSortValue: dataSortValue,
    isUnlimited: dbPlan.unlimited_data,
    price: dbPlan.current_price,
    regularPrice: dbPlan.regular_price,
    bindingMonths: dbPlan.binding_months,
    campaign: dbPlan.campaign_price !== null
      ? {
          price: dbPlan.campaign_price,
          months: dbPlan.campaign_months ?? null,
        }
      : null,
    // Legacy fields - all undefined for now (columns don't exist in view)
    network: undefined,
    esim: undefined,
    euRoaming: undefined,
    affiliateUrl,
    sourceUrl: affiliateUrl, // Map affiliate_url to both fields for compatibility
  };
}

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      // Query all public view columns so campaign_months can be used when available.
      const { data, error: fetchError } = await supabase
        .from('mobile_plans_public')
        .select('*')
        .eq('is_active', true) // Only active plans
        .not('current_price', 'is', null) // current_price must not be null
        .order('current_price', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        // Deduplicate by plan_key ONLY (keep first occurrence)
        const seen = new Set<string>();
        const uniquePlans = (data as MobilePlanDB[]).filter((plan) => {
          if (seen.has(plan.plan_key)) {
            return false;
          }
          seen.add(plan.plan_key);
          return true;
        });

        const transformedPlans = uniquePlans
          .map((plan) => transformPlan(plan))
          .filter((plan) => !isMobileProviderDisabled(plan.title))
          .filter((plan) => !getMobilePlanOverride(plan.planKey)?.hidePlan);

        setPlans(transformedPlans);

        // Get max updated_at
        const maxUpdated = uniquePlans.reduce((max, plan) => {
          return plan.updated_at > max ? plan.updated_at : max;
        }, uniquePlans[0].updated_at);
        setLastUpdated(maxUpdated);
      } else {
        setPlans([]);
        setLastUpdated(null);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch plans');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return { plans, loading, error, lastUpdated, retry: fetchPlans };
}
