export const DISABLED_MOBILE_PROVIDERS = ['hallon'] as const;
export const HIGHLIGHTED_MOBILE_PROVIDERS = ['comviq'] as const;

export interface MobileProviderPromotion {
  promotionBadge: string;
  promotionText: string;
  promotionUrl: string;
  promotionValidFrom: string;
  promotionValidUntil: string;
  promotionActive: boolean;
}

export const MOBILE_PROVIDER_PROMOTIONS: Record<string, MobileProviderPromotion> = {
  vimla: {
    promotionBadge: '١٠٠ GB إنترنت إضافي!',
    promotionText: 'ساري حتى 31 مايو',
    promotionUrl:
      'https://on.vimla.se/t/t?a=1081333617&as=2043693860&t=2&tk=1&url=vimla.se/bestall/special-offer/',
    promotionValidFrom: '2026-02-01',
    promotionValidUntil: '2026-05-31',
    promotionActive: true,
  },
};

function normalizeMobileProvider(providerName?: string | null): string {
  return providerName?.trim().toLowerCase() ?? '';
}

export function isMobileProviderDisabled(providerName?: string | null): boolean {
  const normalizedProvider = normalizeMobileProvider(providerName);
  return DISABLED_MOBILE_PROVIDERS.some(
    (provider) => normalizeMobileProvider(provider) === normalizedProvider
  );
}

export function isMobileProviderHighlighted(providerName?: string | null): boolean {
  const normalizedProvider = normalizeMobileProvider(providerName);
  return HIGHLIGHTED_MOBILE_PROVIDERS.some(
    (provider) => normalizeMobileProvider(provider) === normalizedProvider
  );
}

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getActiveMobileProviderPromotion(
  providerName?: string | null,
  today = getTodayDateString()
): MobileProviderPromotion | null {
  const normalizedProvider = normalizeMobileProvider(providerName);
  const promotion = MOBILE_PROVIDER_PROMOTIONS[normalizedProvider];

  if (!promotion?.promotionActive) return null;
  if (today < promotion.promotionValidFrom) return null;
  if (today > promotion.promotionValidUntil) return null;

  return promotion;
}
