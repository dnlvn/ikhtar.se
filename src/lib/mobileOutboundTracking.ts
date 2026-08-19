import type { SortOption } from '@/hooks/useFilteredPlans';
import type { Plan } from '@/hooks/usePlans';
import { getMobileAttribution } from '@/lib/mobileAttribution';

const EPI_KEYS = new Set(['epi', 'epi2', 'epi3', 'epi4', 'epi5']);

export type MobileAffiliateNetwork = 'adtraction' | 'addrevenue' | 'direct' | 'unknown';

interface OutboundClickPayload {
  click_id: string;
  site: 'ikhtar';
  vertical: 'mobile';
  provider: string;
  affiliate_network: MobileAffiliateNetwork;
  position: number;
  plan_key: string;
  data_gb: number | null;
  is_unlimited: boolean;
  price: number;
  binding_months: number;
  sort_mode: string;
  source?: ReturnType<typeof getMobileAttribution>['source'];
  campaign?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  fbp?: string;
  fbc?: string;
  marketing_consent?: boolean;
  page_path?: string;
  landing_page?: string;
  referrer?: string;
}

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

function isAddrevenueUrl(url: URL) {
  return url.hostname.toLowerCase().includes('addrevenue.io');
}

function isAdtractionUrl(url: URL) {
  const hostname = url.hostname.toLowerCase();
  return hostname.includes('adt') || hostname.includes('adtraction') || hostname.endsWith('.vimla.se');
}

function getAffiliateNetwork(ctaUrl: string): MobileAffiliateNetwork {
  try {
    const parsedUrl = new URL(ctaUrl);

    if (isAddrevenueUrl(parsedUrl)) return 'addrevenue';
    if (isAdtractionUrl(parsedUrl)) return 'adtraction';
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:' ? 'direct' : 'unknown';
  } catch {
    return 'unknown';
  }
}

function hasMarketingConsent() {
  return typeof window !== 'undefined' && (window as any).Cookiebot?.consent?.marketing === true;
}

function getOptionalSearchParam(params: URLSearchParams, key: string) {
  const value = params.get(key)?.trim();
  return value || undefined;
}

function isTestClickIdentifier(value: string) {
  return /^test/i.test(value);
}

function getGoogleClickIdentifier(params: URLSearchParams, key: 'gclid' | 'gbraid' | 'wbraid') {
  const value = getOptionalSearchParam(params, key);

  if (!value || isTestClickIdentifier(value)) return undefined;

  return value.slice(0, 180);
}

function getCookieValue(name: string) {
  if (typeof document === 'undefined' || typeof document.cookie !== 'string') return undefined;

  return document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function decodeCookieValue(value: string | undefined) {
  if (!value) return undefined;

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function buildFbcFromFbclid(fbclid: string | undefined) {
  if (!fbclid) return undefined;

  return `fb.1.${Date.now()}.${fbclid}`;
}

function getGoogleClickIdentifiers(params: URLSearchParams, attribution: ReturnType<typeof getMobileAttribution>) {
  const hasCurrentGoogleClickIdentifier =
    params.has('gclid') || params.has('gbraid') || params.has('wbraid');

  if (hasCurrentGoogleClickIdentifier) {
    return {
      gclid: getGoogleClickIdentifier(params, 'gclid'),
      gbraid: getGoogleClickIdentifier(params, 'gbraid'),
      wbraid: getGoogleClickIdentifier(params, 'wbraid'),
    };
  }

  return {
    gclid: attribution.gclid,
    gbraid: attribution.gbraid,
    wbraid: attribution.wbraid,
  };
}

export function buildMobileOutboundUrl(
  ctaUrl: string,
  clickId: string
) {
  try {
    const parsedUrl = new URL(ctaUrl);
    const affiliateNetwork = getAffiliateNetwork(ctaUrl);

    if (affiliateNetwork === 'addrevenue') {
      parsedUrl.searchParams.set('r', clickId);
      return parsedUrl.toString();
    }

    if (affiliateNetwork === 'adtraction') {
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
      epiParams.set('epi', clickId);

      const nextQuery = [...existingParams, epiParams.toString()]
        .filter(Boolean)
        .join('&');

      return `${baseUrl}${nextQuery ? `?${nextQuery}` : ''}${hash}`;
    }

    return ctaUrl;
  } catch {
    return ctaUrl;
  }
}

export function createOutboundClickId(): string | null {
  if (typeof crypto === 'undefined' || typeof crypto.randomUUID !== 'function') {
    return null;
  }

  return crypto.randomUUID();
}

export function buildMobileOutboundClickPayload({
  clickId,
  affiliateUrl,
  plan,
  operatorPosition,
  sortMode,
}: {
  clickId: string;
  affiliateUrl: string;
  plan: Plan;
  operatorPosition: number;
  sortMode: SortOption;
}): OutboundClickPayload {
  const payload: OutboundClickPayload = {
    click_id: clickId,
    site: 'ikhtar',
    vertical: 'mobile',
    provider: plan.title,
    affiliate_network: getAffiliateNetwork(affiliateUrl),
    position: operatorPosition,
    plan_key: plan.planKey,
    data_gb: plan.isUnlimited ? null : Math.round(plan.dataSortValue),
    is_unlimited: plan.isUnlimited,
    price: plan.price,
    binding_months: plan.bindingMonths,
    sort_mode: getSortModeEpiValue(sortMode),
    page_path: typeof window === 'undefined' ? undefined : window.location.pathname,
    marketing_consent: hasMarketingConsent(),
  };

  if (hasMarketingConsent()) {
    const attribution = getMobileAttribution();
    const params = new URLSearchParams(window.location.search);
    const googleClickIdentifiers = getGoogleClickIdentifiers(params, attribution);
    const fbclid = getOptionalSearchParam(params, 'fbclid')?.slice(0, 260) ?? attribution.fbclid;
    const fbp = decodeCookieValue(getCookieValue('_fbp'))?.slice(0, 260);
    const fbc = decodeCookieValue(getCookieValue('_fbc'))?.slice(0, 320) ?? buildFbcFromFbclid(fbclid);

    payload.source = attribution.source;
    payload.campaign = attribution.campaign || 'none';
    payload.gclid = googleClickIdentifiers.gclid;
    payload.gbraid = googleClickIdentifiers.gbraid;
    payload.wbraid = googleClickIdentifiers.wbraid;
    payload.fbclid = fbclid;
    payload.fbp = fbp;
    payload.fbc = fbc;
    payload.landing_page = window.location.href;
    payload.referrer = document.referrer || undefined;
  }

  return payload;
}

export function logMobileOutboundClick(payload: OutboundClickPayload) {
  const body = JSON.stringify(payload);

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const sent = navigator.sendBeacon(
        '/api/outbound-click',
        new Blob([body], { type: 'application/json' })
      );
      if (sent) return;
    }

    void fetch('/api/outbound-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
      keepalive: true,
    }).catch(() => {
      // Outbound logging must never affect affiliate navigation.
    });
  } catch {
    // Outbound logging must never affect affiliate navigation.
  }
}
