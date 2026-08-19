export type MobileTrafficSource =
  | 'google_ads'
  | 'meta'
  | 'alkompis'
  | 'google_organic'
  | 'direct'
  | 'referral';

export interface MobileAttribution {
  source: MobileTrafficSource;
  campaign: string;
  timestamp: string;
  captured_at?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  campaign_id?: string;
  adset_id?: string;
  ad_id?: string;
}

const ATTRIBUTION_STORAGE_KEY = 'ikhtar_mobile_attribution_v1';
const GOOGLE_CLICK_ID_TTL_DAYS = 90;
const GOOGLE_CLICK_ID_TTL_MS = GOOGLE_CLICK_ID_TTL_DAYS * 24 * 60 * 60 * 1000;
const GOOGLE_CLICK_ID_KEYS = ['gclid', 'gbraid', 'wbraid'] as const;

function getParam(params: URLSearchParams, key: string) {
  return params.get(key)?.trim().toLowerCase() ?? '';
}

function isPaidGoogleTraffic(source: string, medium: string, params: URLSearchParams) {
  return (
    params.has('gclid') ||
    params.has('wbraid') ||
    params.has('gbraid') ||
    (source === 'google' &&
      ['paid', 'cpc', 'ppc', 'paid_search', 'paid_social'].includes(medium))
  );
}

function isMetaTraffic(source: string, params: URLSearchParams) {
  return params.has('fbclid') || ['meta', 'facebook', 'instagram'].includes(source);
}

function isGoogleOrganicReferrer(referrer: string) {
  try {
    const hostname = new URL(referrer).hostname.toLowerCase();
    return hostname === 'google.com' || hostname.endsWith('.google.com');
  } catch {
    return false;
  }
}

function isInternalReferrer(referrer: string, currentOrigin: string) {
  if (!referrer) return false;

  try {
    return new URL(referrer).origin === currentOrigin;
  } catch {
    return false;
  }
}

function isExpiredAttribution(attribution: MobileAttribution) {
  const capturedAt = attribution.captured_at || attribution.timestamp;
  const capturedAtMs = Date.parse(capturedAt);

  if (!Number.isFinite(capturedAtMs)) return true;

  return Date.now() - capturedAtMs > GOOGLE_CLICK_ID_TTL_MS;
}

function getStoredAttribution(): MobileAttribution | null {
  try {
    const storedValue = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!storedValue) return null;

    const attribution = JSON.parse(storedValue) as MobileAttribution;

    if (isExpiredAttribution(attribution)) {
      window.localStorage.removeItem(ATTRIBUTION_STORAGE_KEY);
      return null;
    }

    return attribution;
  } catch {
    return null;
  }
}

function storeAttribution(attribution: MobileAttribution) {
  try {
    window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Attribution should never block outbound clicks or rendering.
  }
}

function hasMarketingConsent() {
  return typeof window !== 'undefined' && (window as any).Cookiebot?.consent?.marketing === true;
}

function isTestClickIdentifier(value: string) {
  return /^test/i.test(value);
}

function getOptionalSearchParam(params: URLSearchParams, key: string) {
  const value = params.get(key)?.trim();
  return value || undefined;
}

function getCampaignId(params: URLSearchParams) {
  return getOptionalSearchParam(params, 'campaign_id')?.slice(0, 120);
}

function getMetaIdentifier(params: URLSearchParams, key: 'campaign_id' | 'adset_id' | 'ad_id') {
  return getOptionalSearchParam(params, key)?.slice(0, 120);
}

function getGoogleClickIdentifier(params: URLSearchParams, key: (typeof GOOGLE_CLICK_ID_KEYS)[number]) {
  const value = getOptionalSearchParam(params, key);

  if (!value || isTestClickIdentifier(value)) return undefined;

  return value.slice(0, 180);
}

function getGoogleClickIdentifiers(params: URLSearchParams) {
  return {
    gclid: getGoogleClickIdentifier(params, 'gclid'),
    gbraid: getGoogleClickIdentifier(params, 'gbraid'),
    wbraid: getGoogleClickIdentifier(params, 'wbraid'),
  };
}

function hasAnyGoogleClickIdentifier(identifiers: ReturnType<typeof getGoogleClickIdentifiers>) {
  return Boolean(identifiers.gclid || identifiers.gbraid || identifiers.wbraid);
}

function getCurrentAttributionFromPage(): MobileAttribution | null {
  const params = new URLSearchParams(window.location.search);
  const source = getParam(params, 'utm_source');
  const medium = getParam(params, 'utm_medium');
  const campaign = params.get('utm_campaign')?.trim() || 'none';
  const now = new Date().toISOString();

  if (isPaidGoogleTraffic(source, medium, params)) {
    const googleClickIdentifiers = hasMarketingConsent() ? getGoogleClickIdentifiers(params) : {};

    return {
      source: 'google_ads',
      campaign,
      timestamp: now,
      ...(hasAnyGoogleClickIdentifier(googleClickIdentifiers)
        ? { ...googleClickIdentifiers, captured_at: now }
        : {}),
    };
  }

  if (isMetaTraffic(source, params)) {
    const fbclid = hasMarketingConsent() ? getOptionalSearchParam(params, 'fbclid')?.slice(0, 260) : undefined;
    const campaignId = hasMarketingConsent() ? getCampaignId(params) : undefined;
    const adsetId = hasMarketingConsent() ? getMetaIdentifier(params, 'adset_id') : undefined;
    const adId = hasMarketingConsent() ? getMetaIdentifier(params, 'ad_id') : undefined;

    return {
      source: 'meta',
      campaign,
      timestamp: now,
      ...(fbclid ? { fbclid, captured_at: now } : {}),
      ...(campaignId ? { campaign_id: campaignId } : {}),
      ...(adsetId ? { adset_id: adsetId } : {}),
      ...(adId ? { ad_id: adId } : {}),
    };
  }

  if (source === 'alkompis') {
    return { source: 'alkompis', campaign, timestamp: now };
  }

  if (source) {
    return { source: 'referral', campaign, timestamp: now };
  }

  if (isGoogleOrganicReferrer(document.referrer)) {
    return {
      source: 'google_organic',
      campaign: 'none',
      timestamp: now,
    };
  }

  if (document.referrer && !isInternalReferrer(document.referrer, window.location.origin)) {
    return { source: 'referral', campaign: 'none', timestamp: now };
  }

  return null;
}

export function captureMobileAttribution() {
  if (typeof window === 'undefined') return;

  const currentAttribution = getCurrentAttributionFromPage();

  if (currentAttribution) {
    storeAttribution(currentAttribution);
    return;
  }

  if (!getStoredAttribution()) {
    storeAttribution({
      source: 'direct',
      campaign: 'none',
      timestamp: new Date().toISOString(),
    });
  }
}

export function getMobileAttribution(): MobileAttribution {
  if (typeof window === 'undefined') {
    return { source: 'direct', campaign: 'none', timestamp: '' };
  }

  return (
    getStoredAttribution() ?? {
      source: 'direct',
      campaign: 'none',
      timestamp: new Date().toISOString(),
    }
  );
}
