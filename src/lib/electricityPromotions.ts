export type AffiliateVertical = 'electricity' | (string & {});

export interface AffiliatePromotion {
  vertical: AffiliateVertical;
  provider: string;
  startDate: string;
  endDate: string;
  badgeTextAr: string;
  titleAr: string;
  descriptionAr: string;
  campaignUrl: string;
  annualDiscountSek?: number;
  enabled: boolean;
}

export const ELECTRICITY_PROMOTIONS: AffiliatePromotion[] = [];

export function normalizeAffiliateProviderName(provider: string): string {
  return provider
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]/g, '');
}

export function getActivePromotion({
  vertical,
  provider,
  date = new Date(),
}: {
  vertical: AffiliateVertical;
  provider: string;
  date?: Date;
}): AffiliatePromotion | null {
  const providerSlug = normalizeAffiliateProviderName(provider);

  return (
    ELECTRICITY_PROMOTIONS.find((promotion) => {
      if (!promotion.enabled || promotion.vertical !== vertical) return false;
      if (normalizeAffiliateProviderName(promotion.provider) !== providerSlug) return false;

      const startsAt = new Date(`${promotion.startDate}T00:00:00`);
      const endsAt = new Date(`${promotion.endDate}T23:59:59`);
      return date >= startsAt && date <= endsAt;
    }) ?? null
  );
}
