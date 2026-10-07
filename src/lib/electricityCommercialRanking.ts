import { normalizeAffiliateProviderName } from '@/lib/electricityPromotions';

type ProviderRankingStatus = 'priority' | 'normal' | 'special';

interface ElectricityRankingOffer {
  provider: string;
  estimatedMonthlyCost: number;
  comparisonPriceOre: number;
}

interface SpecialProviderRule {
  maximumPosition?: number;
}

const priorityProviders = ['Vattenfall', 'Fortum', 'Eon'];

const specialProviders: Record<string, SpecialProviderRule> = {
  [normalizeProviderSlug('Göteborg Energi')]: {
    maximumPosition: 3,
  },
};

// Later this list can be replaced by a dynamic commercial score or affiliate-performance API.
const priorityProviderSlugs = new Set(priorityProviders.map(normalizeProviderSlug));

function normalizeProviderSlug(provider: string): string {
  return normalizeAffiliateProviderName(provider);
}

function getProviderSlug(offer: ElectricityRankingOffer): string {
  return normalizeProviderSlug(offer.provider);
}

function getProviderRankingStatus(offer: ElectricityRankingOffer): ProviderRankingStatus {
  const providerSlug = getProviderSlug(offer);

  if (priorityProviderSlugs.has(providerSlug)) return 'priority';
  if (specialProviders[providerSlug]) return 'special';

  return 'normal';
}

function getRankingStatusWeight(offer: ElectricityRankingOffer): number {
  const rankingStatus = getProviderRankingStatus(offer);

  if (rankingStatus === 'priority') return 0;
  if (rankingStatus === 'special') return 1;

  return 2;
}

function compareOffersByCost(a: ElectricityRankingOffer, b: ElectricityRankingOffer): number {
  return (
    a.estimatedMonthlyCost - b.estimatedMonthlyCost ||
    a.comparisonPriceOre - b.comparisonPriceOre
  );
}

function compareOffersForDisplay(a: ElectricityRankingOffer, b: ElectricityRankingOffer): number {
  return compareOffersByCost(a, b) || getRankingStatusWeight(a) - getRankingStatusWeight(b);
}

function sortByEstimatedMonthlyCost<T extends ElectricityRankingOffer>(offers: T[]): T[] {
  return [...offers].sort(compareOffersForDisplay);
}

function findProviderIndex<T extends ElectricityRankingOffer>(offers: T[], providerSlug: string): number {
  return offers.findIndex((offer) => getProviderSlug(offer) === providerSlug);
}

function limitOffersAheadOfSpecialProviders<T extends ElectricityRankingOffer>(
  visibleOffers: T[]
): T[] {
  let nextOffers = [...visibleOffers];

  for (const [providerSlug, rule] of Object.entries(specialProviders)) {
    const providerIndex = findProviderIndex(nextOffers, providerSlug);
    if (providerIndex < 0) continue;

    if (rule.maximumPosition && providerIndex >= rule.maximumPosition) {
      const maximumOffersAhead = rule.maximumPosition - 1;
      nextOffers = [
        ...nextOffers.slice(0, maximumOffersAhead),
        ...nextOffers.slice(providerIndex),
      ];
    }
  }

  return nextOffers;
}

export function rankElectricityOffersCommercially<T extends ElectricityRankingOffer>(offers: T[]): T[] {
  const baseSortedOffers = sortByEstimatedMonthlyCost(offers);
  const priorityAnchor =
    baseSortedOffers.find((offer) => getProviderRankingStatus(offer) === 'priority') ?? null;

  const commerciallyFilteredOffers = priorityAnchor
    ? baseSortedOffers.filter((offer) => {
        const rankingStatus = getProviderRankingStatus(offer);

        return (
          rankingStatus !== 'normal' ||
          compareOffersByCost(offer, priorityAnchor) >= 0
        );
      })
    : baseSortedOffers;

  return limitOffersAheadOfSpecialProviders(
    sortByEstimatedMonthlyCost(commerciallyFilteredOffers)
  );
}
