import type { ElectricityOffer } from '@/hooks/useElectricityOffers';
import { getMobileAttribution } from '@/lib/mobileAttribution';

const EPI_KEYS = new Set(['epi', 'epi2', 'epi3', 'epi4', 'epi5']);

const ADTRACTION_HOSTS = new Set([
  'at.telinet.se',
  'dot.dalakraft.se',
  'go.adt242.com',
  'go.adt256.com',
  'go.adt291.com',
  'ion.fortum.com',
  'to.bixia.se',
]);

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

export function buildElectricityOutboundUrl(
  ctaUrl: string,
  offer: ElectricityOffer,
  rank: number,
  annualUsage: number
) {
  if (!isAdtractionElectricityUrl(ctaUrl)) return ctaUrl;

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
    epiParams.set('epi', `position_${rank}`);
    epiParams.set('epi2', getElectricityAgreementTypeEpiValue(offer));
    epiParams.set('epi3', attribution.source);
    epiParams.set('epi4', attribution.campaign || 'none');
    epiParams.set('epi5', `${Math.round(annualUsage)}kwh`);

    const nextQuery = [...existingParams, epiParams.toString()]
      .filter(Boolean)
      .join('&');

    return `${baseUrl}${nextQuery ? `?${nextQuery}` : ''}${hash}`;
  } catch {
    return ctaUrl;
  }
}
