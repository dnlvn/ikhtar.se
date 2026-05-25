import type { Plan } from '@/hooks/usePlans';

export interface PlanCostSummary {
  hasCampaignPeriod: boolean;
  campaignMonths: number | null;
  postCampaignPrice: number | null;
  totalCost12m: number | null;
  effectiveMonthlyPrice12m: number | null;
  discountTotal: number | null;
  hasReliable12mCost: boolean;
}

function isUsableNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function getPlanCostSummary(plan: Plan): PlanCostSummary {
  const campaignPrice = plan.campaign?.price ?? null;
  const rawCampaignMonths = plan.campaign?.months ?? null;
  const regularPrice = plan.regularPrice;
  const currentPrice = plan.price;
  const hasCampaignPrice = isUsableNumber(campaignPrice);
  const hasCampaignMonths = isUsableNumber(rawCampaignMonths) && rawCampaignMonths > 0;
  const hasRegularPrice = isUsableNumber(regularPrice);
  const hasCurrentPrice = isUsableNumber(currentPrice);

  if (hasCampaignPrice) {
    const campaignMonths = hasCampaignMonths ? Math.min(rawCampaignMonths, 12) : null;
    const hasReliableCampaignCost = campaignMonths !== null && hasRegularPrice;

    if (!hasReliableCampaignCost) {
      return {
        hasCampaignPeriod: false,
        campaignMonths: null,
        postCampaignPrice: hasRegularPrice ? regularPrice : null,
        totalCost12m: null,
        effectiveMonthlyPrice12m: null,
        discountTotal: null,
        hasReliable12mCost: false,
      };
    }

    const regularMonths = 12 - campaignMonths;
    const totalCost12m = campaignPrice * campaignMonths + regularPrice * regularMonths;
    const discountTotal = regularPrice > campaignPrice
      ? (regularPrice - campaignPrice) * campaignMonths
      : null;

    return {
      hasCampaignPeriod: true,
      campaignMonths,
      postCampaignPrice: regularPrice,
      totalCost12m,
      effectiveMonthlyPrice12m: totalCost12m / 12,
      discountTotal: discountTotal && discountTotal > 0 ? discountTotal : null,
      hasReliable12mCost: true,
    };
  }

  if (!hasCurrentPrice) {
    return {
      hasCampaignPeriod: false,
      campaignMonths: null,
      postCampaignPrice: null,
      totalCost12m: null,
      effectiveMonthlyPrice12m: null,
      discountTotal: null,
      hasReliable12mCost: false,
    };
  }

  return {
    hasCampaignPeriod: false,
    campaignMonths: null,
    postCampaignPrice: null,
    totalCost12m: currentPrice * 12,
    effectiveMonthlyPrice12m: currentPrice,
    discountTotal: null,
    hasReliable12mCost: true,
  };
}

export function formatSek(value: number): string {
  return Math.round(value).toLocaleString('sv-SE');
}
