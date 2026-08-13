import type { SortOption } from '@/hooks/useFilteredPlans';
import type { Plan } from '@/hooks/usePlans';
import { getMobileAttribution } from '@/lib/mobileAttribution';

const EPI_KEYS = new Set(['epi', 'epi2', 'epi3', 'epi4', 'epi5']);

const SORT_MODE_EPI_VALUES: Partial<Record<SortOption, string>> = {
  'yearly-cost': '12_month_price',
  'no-binding': 'no_binding',
  'surf-value': 'best_data_value',
};

function getDecodedParamKey(param: string) {
  const rawKey = param.split('=')[0] || '';

  try {
    return decodeURIComponent(rawKey.replace(/\+/g, ' '));
  } catch {
    return rawKey;
  }
}

function getMobileDataEpiValue(plan: Plan) {
  if (plan.isUnlimited) return 'unlimited';
  return `${Math.round(plan.dataSortValue)}gb`.toLowerCase();
}

function getSortModeEpiValue(sortMode: SortOption) {
  return SORT_MODE_EPI_VALUES[sortMode] ?? sortMode.replace(/-/g, '_');
}

export function buildMobileOutboundUrl(
  ctaUrl: string,
  plan: Plan,
  operatorPosition?: number | null,
  sortMode: SortOption = 'yearly-cost'
) {
  try {
    new URL(ctaUrl);

    const attribution = getMobileAttribution();
    const hashIndex = ctaUrl.indexOf('#');
    const urlWithoutHash = hashIndex >= 0 ? ctaUrl.slice(0, hashIndex) : ctaUrl;
    const hash = hashIndex >= 0 ? ctaUrl.slice(hashIndex) : '';
    const queryIndex = urlWithoutHash.indexOf('?');
    const baseUrl =
      queryIndex >= 0 ? urlWithoutHash.slice(0, queryIndex) : urlWithoutHash;
    const rawQuery =
      queryIndex >= 0 ? urlWithoutHash.slice(queryIndex + 1) : '';
    const existingParams = rawQuery
      .split('&')
      .filter(Boolean)
      .filter((param) => !EPI_KEYS.has(getDecodedParamKey(param)));

    const epiParams = new URLSearchParams();
    if (operatorPosition !== undefined && operatorPosition !== null) {
      epiParams.set('epi', `position_${operatorPosition}`);
    }

    epiParams.set('epi2', getMobileDataEpiValue(plan));
    epiParams.set('epi3', attribution.source);
    epiParams.set('epi4', attribution.campaign || 'none');
    epiParams.set('epi5', getSortModeEpiValue(sortMode));

    const nextQuery = [...existingParams, epiParams.toString()]
      .filter(Boolean)
      .join('&');

    return `${baseUrl}${nextQuery ? `?${nextQuery}` : ''}${hash}`;
  } catch {
    return ctaUrl;
  }
}
