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
}

const ATTRIBUTION_STORAGE_KEY = 'ikhtar_mobile_attribution_v1';

function getParam(params: URLSearchParams, key: string) {
  return params.get(key)?.trim().toLowerCase() ?? '';
}

function isPaidGoogleTraffic(source: string, medium: string, params: URLSearchParams) {
  return (
    params.has('gclid') ||
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

function getStoredAttribution(): MobileAttribution | null {
  try {
    const storedValue = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    return storedValue ? (JSON.parse(storedValue) as MobileAttribution) : null;
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

function getCurrentAttributionFromPage(): MobileAttribution | null {
  const params = new URLSearchParams(window.location.search);
  const source = getParam(params, 'utm_source');
  const medium = getParam(params, 'utm_medium');
  const campaign = params.get('utm_campaign')?.trim() || 'none';

  if (isPaidGoogleTraffic(source, medium, params)) {
    return { source: 'google_ads', campaign, timestamp: new Date().toISOString() };
  }

  if (isMetaTraffic(source, params)) {
    return { source: 'meta', campaign, timestamp: new Date().toISOString() };
  }

  if (source === 'alkompis') {
    return { source: 'alkompis', campaign, timestamp: new Date().toISOString() };
  }

  if (source) {
    return { source: 'referral', campaign, timestamp: new Date().toISOString() };
  }

  if (isGoogleOrganicReferrer(document.referrer)) {
    return {
      source: 'google_organic',
      campaign: 'none',
      timestamp: new Date().toISOString(),
    };
  }

  if (document.referrer && !isInternalReferrer(document.referrer, window.location.origin)) {
    return { source: 'referral', campaign: 'none', timestamp: new Date().toISOString() };
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
