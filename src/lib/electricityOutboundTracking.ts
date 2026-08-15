import type { ElectricityOffer } from '@/hooks/useElectricityOffers';
import { getMobileAttribution } from '@/lib/mobileAttribution';

const EPI_KEYS = new Set(['epi', 'epi2', 'epi3', 'epi4', 'epi5']);
const ADDREVENUE_CLICK_REF_KEY = 'r';
const OUTBOUND_CLICK_ENDPOINT = '/api/outbound-clicks';

const ADTRACTION_HOSTS = new Set([
  'at.telinet.se',
  'dot.dalakraft.se',
  'go.adt242.com',
  'go.adt256.com',
  'go.adt291.com',
  'ion.fortum.com',
  'to.bixia.se',
]);

const ADDREVENUE_HOST = 'addrevenue.io';

type ElectricityAffiliateNetwork = 'adtraction' | 'addrevenue' | 'direct' | 'unknown';

type ElectricityTrafficSource =
  | 'google_ads'
  | 'meta'
  | 'alkompis'
  | 'google_organic'
  | 'direct'
  | 'referral';

interface OutboundClickPayload {
  click_id: string;
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
  page_path?: string;
  landing_page?: string;
  referrer?: string;
}

function getDecodedParamKey(param: string) {
  const rawKey = param.split('=')[0] || '';

  try {
    return decodeURIComponent(rawKey.replace(/\+/g, ' '));
  } catch {
    return rawKey;
  }
}

function normalizeAgreementText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function getRawStringValue(raw: Record<string, any>, keys: string[]) {
  const value = keys.find((key) => raw[key] !== undefined && raw[key] !== null);

  return value ? String(raw[value]) : '';
}

export function isAdtractionElectricityUrl(ctaUrl: string) {
  try {
    const url = new URL(ctaUrl);

    return ADTRACTION_HOSTS.has(url.hostname.toLowerCase()) && url.pathname.startsWith('/t/t');
  } catch {
    return false;
  }
}

export function isAddrevenueElectricityUrl(ctaUrl: string) {
  try {
    const url = new URL(ctaUrl);

    return url.hostname.toLowerCase() === ADDREVENUE_HOST;
  } catch {
    return false;
  }
}

function getElectricityAffiliateNetwork(ctaUrl: string): ElectricityAffiliateNetwork {
  try {
    const url = new URL(ctaUrl);

    if (isAdtractionElectricityUrl(ctaUrl)) return 'adtraction';
    if (isAddrevenueElectricityUrl(ctaUrl)) return 'addrevenue';
    if (url.protocol === 'http:' || url.protocol === 'https:') return 'direct';

    return 'unknown';
  } catch {
    return 'unknown';
  }
}

export function getElectricityAgreementTypeEpiValue(offer: ElectricityOffer) {
  const agreementText = normalizeAgreementText(
    [
      offer.agreementName,
      offer.agreementType,
      offer.agreementTypeLabel,
      getRawStringValue(offer.raw, [
        'AvtalBenamning',
        'AvtalBenämning',
        'Benamning',
        'Benämning',
        'AvtalTyp',
        'Avtalstyp',
        'Avtalsform',
        'AvtalTypId',
        'TypId',
      ]),
    ]
      .filter(Boolean)
      .join(' ')
  );

  if (agreementText.includes('kvart') || agreementText.includes('kvartspris')) {
    return 'quarterly';
  }

  if (agreementText.includes('timpris') || agreementText.includes('timavtal')) {
    return 'hourly';
  }

  if (agreementText.includes('fastpris') || agreementText.includes('fast')) {
    return 'fixed';
  }

  if (agreementText.includes('rorlig')) {
    return 'variable';
  }

  if (
    offer.agreementCategory === 'variable' ||
    offer.agreementCategory === 'fixed' ||
    offer.agreementCategory === 'hourly'
  ) {
    return offer.agreementCategory;
  }

  return 'other';
}

function getElectricityTrackingDimensions(
  offer: ElectricityOffer,
  rank: number,
  annualUsage: number
) {
  const attribution = getMobileAttribution();

  return {
    position: `position_${rank}`,
    agreementType: getElectricityAgreementTypeEpiValue(offer),
    source: attribution.source,
    campaign: attribution.campaign || 'none',
    annualUsage: `${Math.round(annualUsage)}kwh`,
  };
}

function hasMarketingConsent() {
  return (
    typeof window !== 'undefined' &&
    Boolean((window as any).Cookiebot?.consent?.marketing === true)
  );
}

function getOptionalSearchParam(params: URLSearchParams, key: string) {
  const value = params.get(key)?.trim();
  return value || undefined;
}

function getConsentGatedMarketingFields() {
  if (typeof window === 'undefined' || !hasMarketingConsent()) {
    return {};
  }

  const attribution = getMobileAttribution();
  const params = new URLSearchParams(window.location.search);

  return {
    source: attribution.source,
    campaign: attribution.campaign || 'none',
    gclid: getOptionalSearchParam(params, 'gclid'),
    gbraid: getOptionalSearchParam(params, 'gbraid'),
    wbraid: getOptionalSearchParam(params, 'wbraid'),
    fbclid: getOptionalSearchParam(params, 'fbclid'),
    landing_page: window.location.href,
    referrer: document.referrer || undefined,
  };
}

function splitUrlParts(ctaUrl: string) {
  const hashIndex = ctaUrl.indexOf('#');
  const urlWithoutHash = hashIndex >= 0 ? ctaUrl.slice(0, hashIndex) : ctaUrl;
  const hash = hashIndex >= 0 ? ctaUrl.slice(hashIndex) : '';
  const queryIndex = urlWithoutHash.indexOf('?');
  const baseUrl =
    queryIndex >= 0 ? urlWithoutHash.slice(0, queryIndex) : urlWithoutHash;
  const rawQuery =
    queryIndex >= 0 ? urlWithoutHash.slice(queryIndex + 1) : '';

  return { baseUrl, rawQuery, hash };
}

export function buildElectricityOutboundUrl(
  ctaUrl: string,
  offer: ElectricityOffer,
  rank: number,
  annualUsage: number,
  clickId?: string | null
) {
  if (!isAdtractionElectricityUrl(ctaUrl) && !isAddrevenueElectricityUrl(ctaUrl)) {
    return ctaUrl;
  }

  try {
    new URL(ctaUrl);

    const dimensions = getElectricityTrackingDimensions(offer, rank, annualUsage);
    const { baseUrl, rawQuery, hash } = splitUrlParts(ctaUrl);
    const isAddrevenueUrl = isAddrevenueElectricityUrl(ctaUrl);
    const existingParams = rawQuery
      .split('&')
      .filter(Boolean)
      .filter((param) => {
        const decodedKey = getDecodedParamKey(param);

        if (isAddrevenueUrl) return decodedKey !== ADDREVENUE_CLICK_REF_KEY;
        return !EPI_KEYS.has(decodedKey);
      });

    if (isAddrevenueUrl) {
      const clickRef =
        clickId ||
        [
          dimensions.position,
          dimensions.agreementType,
          dimensions.source,
          dimensions.campaign,
          dimensions.annualUsage,
        ].join('|');
      const clickRefParam = `${ADDREVENUE_CLICK_REF_KEY}=${encodeURIComponent(clickRef)}`;
      const nextQuery = [...existingParams, clickRefParam].filter(Boolean).join('&');

      return `${baseUrl}${nextQuery ? `?${nextQuery}` : ''}${hash}`;
    }

    const epiParams = new URLSearchParams();
    epiParams.set('epi', clickId || dimensions.position);
    epiParams.set('epi2', dimensions.agreementType);
    epiParams.set('epi3', dimensions.source);
    epiParams.set('epi4', dimensions.campaign);
    epiParams.set('epi5', dimensions.annualUsage);

    const nextQuery = [...existingParams, epiParams.toString()]
      .filter(Boolean)
      .join('&');

    return `${baseUrl}${nextQuery ? `?${nextQuery}` : ''}${hash}`;
  } catch {
    return ctaUrl;
  }
}

export function createElectricityOutboundClickId() {
  try {
    if (
      typeof globalThis.crypto !== 'undefined' &&
      typeof globalThis.crypto.randomUUID === 'function'
    ) {
      return globalThis.crypto.randomUUID();
    }
  } catch {
    // UUID creation must never block affiliate navigation.
  }

  return null;
}

export function buildElectricityOutboundClickPayload({
  clickId,
  ctaUrl,
  offer,
  rank,
  annualUsage,
}: {
  clickId: string;
  ctaUrl: string;
  offer: ElectricityOffer;
  rank: number;
  annualUsage: number;
}): OutboundClickPayload {
  return {
    click_id: clickId,
    provider: offer.provider,
    affiliate_network: getElectricityAffiliateNetwork(ctaUrl),
    position: rank,
    agreement_type: getElectricityAgreementTypeEpiValue(offer),
    annual_usage_kwh: Math.round(annualUsage),
    estimated_monthly_cost: offer.estimatedMonthlyCost,
    comparison_price_ore: Math.round(offer.comparisonPriceOre),
    page_path: typeof window === 'undefined' ? undefined : window.location.pathname,
    ...getConsentGatedMarketingFields(),
  };
}

export function logElectricityOutboundClick(payload: OutboundClickPayload) {
  const body = JSON.stringify(payload);

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const sent = navigator.sendBeacon(
        OUTBOUND_CLICK_ENDPOINT,
        new Blob([body], { type: 'application/json' })
      );

      if (sent) return;
    }

    void fetch(OUTBOUND_CLICK_ENDPOINT, {
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
