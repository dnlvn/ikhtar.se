export const DISABLED_MOBILE_PROVIDERS = ['hallon'] as const;
export const HIGHLIGHTED_MOBILE_PROVIDERS = [] as const;
export const POPULAR_MOBILE_PROVIDERS = ['comviq', 'vimla'] as const;

export const COMMERCIAL_PRIORITY: Record<string, number> = {
  vimla: 20,
  comviq: 18,
};

export interface MobileOperatorOverride {
  priorityBoost?: number;
  defaultBadgeAr?: string;
}

export interface MobilePlanOverride {
  customBadgeAr?: string;
  customPriority?: number;
  hidePlan?: boolean;
  customAffiliateUrl?: string;
  customCtaText?: string;
  notes?: string;
}

export const MOBILE_OPERATOR_OVERRIDES: Record<string, MobileOperatorOverride> = {
  comviq: { priorityBoost: 18, defaultBadgeAr: 'اختيار شائع' },
  vimla: { priorityBoost: 20, defaultBadgeAr: 'اختيار شائع' },
};

// Future-friendly frontend override layer. This can later move to Supabase.
export const MOBILE_PLAN_OVERRIDES: Record<string, MobilePlanOverride> = {};

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

export function normalizeMobileProvider(providerName?: string | null): string {
  return providerName?.trim().toLowerCase() ?? '';
}

export function getMobileProviderSlug(providerName?: string | null): string {
  const normalizedProvider = normalizeMobileProvider(providerName);

  if (normalizedProvider === '3' || normalizedProvider.includes('tre')) return 'tre';
  if (normalizedProvider.includes('comviq')) return 'comviq';
  if (normalizedProvider.includes('vimla')) return 'vimla';
  if (normalizedProvider.includes('fello')) return 'fello';
  if (normalizedProvider.includes('tele2')) return 'tele2';
  if (normalizedProvider.includes('telenor')) return 'telenor';
  if (normalizedProvider.includes('telia')) return 'telia';
  if (normalizedProvider.includes('hallon')) return 'hallon';

  return normalizedProvider;
}

export function isMobileProviderDisabled(providerName?: string | null): boolean {
  const normalizedProvider = getMobileProviderSlug(providerName);
  return DISABLED_MOBILE_PROVIDERS.some(
    (provider) => getMobileProviderSlug(provider) === normalizedProvider
  );
}

export function isMobileProviderHighlighted(providerName?: string | null): boolean {
  const normalizedProvider = getMobileProviderSlug(providerName);
  return HIGHLIGHTED_MOBILE_PROVIDERS.some(
    (provider) => getMobileProviderSlug(provider) === normalizedProvider
  );
}

export function isPopularMobileProvider(providerName?: string | null): boolean {
  const normalizedProvider = getMobileProviderSlug(providerName);
  return POPULAR_MOBILE_PROVIDERS.some(
    (provider) => getMobileProviderSlug(provider) === normalizedProvider
  );
}

export function getCommercialPriority(providerName?: string | null): number {
  const slug = getMobileProviderSlug(providerName);
  const overridePriority = MOBILE_OPERATOR_OVERRIDES[slug]?.priorityBoost;
  return overridePriority ?? COMMERCIAL_PRIORITY[slug] ?? 0;
}

export function getMobileOperatorOverride(providerName?: string | null): MobileOperatorOverride | null {
  const slug = getMobileProviderSlug(providerName);
  return MOBILE_OPERATOR_OVERRIDES[slug] ?? null;
}

export function getMobilePlanOverride(planKey?: string | null): MobilePlanOverride | null {
  if (!planKey) return null;
  return MOBILE_PLAN_OVERRIDES[planKey] ?? null;
}

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getActiveMobileProviderPromotion(
  providerName?: string | null,
  today = getTodayDateString()
): MobileProviderPromotion | null {
  const normalizedProvider = getMobileProviderSlug(providerName);
  const promotion = MOBILE_PROVIDER_PROMOTIONS[normalizedProvider];

  if (!promotion?.promotionActive) return null;
  if (today < promotion.promotionValidFrom) return null;
  if (today > promotion.promotionValidUntil) return null;

  return promotion;
}
