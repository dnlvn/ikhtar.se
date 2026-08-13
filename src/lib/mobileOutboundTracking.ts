import { getMobileProviderSlug } from '@/lib/mobileProviderConfig';

const EPI_KEYS = new Set(['epi', 'epi2', 'epi3']);

function getDecodedParamKey(param: string) {
  const rawKey = param.split('=')[0] || '';

  try {
    return decodeURIComponent(rawKey.replace(/\+/g, ' '));
  } catch {
    return rawKey;
  }
}

export function buildMobileOutboundUrl(
  ctaUrl: string,
  provider: string,
  position?: number | null
) {
  try {
    new URL(ctaUrl);

    const providerSlug = getMobileProviderSlug(provider);
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
    epiParams.set('epi', 'mobile');
    epiParams.set('epi2', providerSlug);

    if (position !== undefined && position !== null) {
      epiParams.set('epi3', `position_${position}`);
    }

    const nextQuery = [...existingParams, epiParams.toString()]
      .filter(Boolean)
      .join('&');

    return `${baseUrl}${nextQuery ? `?${nextQuery}` : ''}${hash}`;
  } catch {
    return ctaUrl;
  }
}
