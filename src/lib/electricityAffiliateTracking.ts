import type { AgreementCategory, ElectricityOffer } from '@/hooks/useElectricityOffers';

type ElectricityTrafficSource =
  | 'google_ads'
  | 'meta'
  | 'alkompis'
  | 'google_organic'
  | 'direct'
  | 'referral';

interface ElectricityAttribution {
  source: ElectricityTrafficSource;
  campaign: string;
  timestamp: string;
  captured_at?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
}

export type ElectricityAffiliateNetwork = 'adtraction' | 'addrevenue' | 'direct' | 'unknown';

interface OutboundClickPayload {
  click_id: string;
  site: 'ikhtar';
  vertical: 'electricity';
  provider: string;
  affiliate_network: ElectricityAffiliateNetwork;
  position: number;
  agreement_type: string;
  annual_usage_kwh: number;
  estimated_monthly_cost: number;
  comparison_price_ore: number;
  source?: ElectricityTrafficSource;
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

const ATTRIBUTION_STORAGE_KEY = 'ikhtar_electricity_attribution_v1';
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
    (source === 'google' && ['paid', 'cpc', 'ppc', 'paid_search', 'paid_social'].includes(medium))
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

function isExpiredAttribution(attribution: ElectricityAttribution) {
  const capturedAt = attribution.captured_at || attribution.timestamp;
  const capturedAtMs = Date.parse(capturedAt);

  if (!Number.isFinite(capturedAtMs)) return true;

  return Date.now() - capturedAtMs > GOOGLE_CLICK_ID_TTL_MS;
}

function getStoredAttribution(): ElectricityAttribution | null {
  try {
    const storedValue = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!storedValue) return null;

    const attribution = JSON.parse(storedValue) as ElectricityAttribution;

    if (isExpiredAttribution(attribution)) {
      window.localStorage.removeItem(ATTRIBUTION_STORAGE_KEY);
      return null;
    }

    return attribution;
  } catch {
    return null;
  }
}

function storeAttribution(attribution: ElectricityAttribution) {
  try {
    window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Attribution must never block comparison rendering or outbound clicks.
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

function hasGoogleClickIdentifierParam(params: URLSearchParams) {
  return GOOGLE_CLICK_ID_KEYS.some((key) => params.has(key));
}

function hasAnyGoogleClickIdentifier(identifiers: ReturnType<typeof getGoogleClickIdentifiers>) {
  return Boolean(identifiers.gclid || identifiers.gbraid || identifiers.wbraid);
}

function getCurrentAttributionFromPage(): ElectricityAttribution | null {
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

    return {
      source: 'meta',
      campaign,
      timestamp: now,
      ...(fbclid ? { fbclid, captured_at: now } : {}),
    };
  }

  if (source === 'alkompis') {
    return { source: 'alkompis', campaign, timestamp: now };
  }

  if (source) {
    return { source: 'referral', campaign, timestamp: now };
  }

  if (isGoogleOrganicReferrer(document.referrer)) {
    return { source: 'google_organic', campaign: 'none', timestamp: now };
  }

  if (document.referrer && !isInternalReferrer(document.referrer, window.location.origin)) {
    return { source: 'referral', campaign: 'none', timestamp: now };
  }

  return null;
}

export function captureElectricityAttribution() {
  if (typeof window === 'undefined') return;

  const currentAttribution = getCurrentAttributionFromPage();

  if (currentAttribution) {
    storeAttribution(currentAttribution);
    return;
  }

  if (!getStoredAttribution()) {
    storeAttribution({ source: 'direct', campaign: 'none', timestamp: new Date().toISOString() });
  }
}

function getElectricityAttribution(): ElectricityAttribution {
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

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]/g, '');
}

function normalizeAgreementType(offer: ElectricityOffer): string {
  const text = normalizeText([offer.agreementName, offer.agreementType].filter(Boolean).join(' '));

  if (text.includes('kvart') || text.includes('kvartspris')) return 'quarterly';
  if (text.includes('timpris') || text.includes('timavtal') || text.includes('spotpris')) return 'hourly';
  if (text.includes('fastpris') || text.includes('fastavtal') || text.includes('fast')) return 'fixed';
  if (text.includes('rorligt') || text.includes('rorlig')) return 'variable';

  const categoryMap: Partial<Record<AgreementCategory, string>> = {
    fixed: 'fixed',
    variable: 'variable',
    hourly: 'hourly',
  };

  return categoryMap[offer.agreementCategory] ?? 'other';
}

function isAddrevenueUrl(url: URL) {
  return url.hostname.toLowerCase().includes('addrevenue.io');
}

function isAdtractionUrl(url: URL) {
  const hostname = url.hostname.toLowerCase();
  return hostname.includes('adt') || hostname.includes('adtraction') || hostname.endsWith('.fortum.com');
}

function getAffiliateNetwork(affiliateUrl: string): ElectricityAffiliateNetwork {
  try {
    const parsedUrl = new URL(affiliateUrl);

    if (isAddrevenueUrl(parsedUrl)) return 'addrevenue';
    if (isAdtractionUrl(parsedUrl)) return 'adtraction';
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:' ? 'direct' : 'unknown';
  } catch {
    return 'unknown';
  }
}

export function buildElectricityAffiliateUrl({
  affiliateUrl,
  clickId,
}: {
  affiliateUrl: string;
  clickId: string;
}) {
  try {
    const parsedUrl = new URL(affiliateUrl);
    const affiliateNetwork = getAffiliateNetwork(affiliateUrl);

    if (affiliateNetwork === 'addrevenue') {
      parsedUrl.searchParams.set('r', clickId);
      return parsedUrl.toString();
    }

    if (affiliateNetwork === 'adtraction') {
      parsedUrl.searchParams.set('epi', clickId);
      return parsedUrl.toString();
    }

    return affiliateUrl;
  } catch {
    return affiliateUrl;
  }
}

export function createOutboundClickId(): string | null {
  if (typeof crypto === 'undefined' || typeof crypto.randomUUID !== 'function') {
    return null;
  }

  return crypto.randomUUID();
}

export function buildOutboundClickPayload({
  clickId,
  affiliateUrl,
  offer,
  rank,
  annualUsage,
}: {
  clickId: string;
  affiliateUrl: string;
  offer: ElectricityOffer;
  rank: number;
  annualUsage: number;
}): OutboundClickPayload {
  const payload: OutboundClickPayload = {
    click_id: clickId,
    site: 'ikhtar',
    vertical: 'electricity',
    provider: offer.provider,
    affiliate_network: getAffiliateNetwork(affiliateUrl),
    position: rank,
    agreement_type: normalizeAgreementType(offer),
    annual_usage_kwh: Math.round(annualUsage),
    estimated_monthly_cost: offer.estimatedMonthlyCost,
    comparison_price_ore: Math.round(offer.comparisonPriceOre),
    page_path: typeof window === 'undefined' ? undefined : window.location.pathname,
    marketing_consent: hasMarketingConsent(),
  };

  if (hasMarketingConsent()) {
    const attribution = getElectricityAttribution();
    const params = new URLSearchParams(window.location.search);
    const hasCurrentGoogleClickIdentifier = hasGoogleClickIdentifierParam(params);
    const currentGoogleClickIdentifiers = getGoogleClickIdentifiers(params);
    const storedGoogleClickIdentifiers = {
      gclid: attribution.gclid,
      gbraid: attribution.gbraid,
      wbraid: attribution.wbraid,
    };
    const googleClickIdentifiers = hasCurrentGoogleClickIdentifier
      ? currentGoogleClickIdentifiers
      : storedGoogleClickIdentifiers;
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

export function logOutboundClick(payload: OutboundClickPayload) {
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
