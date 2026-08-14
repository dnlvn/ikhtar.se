import { normalizeAffiliateProviderName } from '@/lib/electricityPromotions';

type ProviderRankingStatus = 'priority' | 'normal' | 'special';

interface ElectricityRankingOffer {
  provider: string;
  estimatedMonthlyCost: number;
}

interface SpecialProviderRule {
  cannotRankFirst: boolean;
  fallbackProviderIfFirst?: string;
}

const priorityProviders = ['Vattenfall', 'Fortum', 'Eon'];

const specialProviders: Record<string, SpecialProviderRule> = {
  [normalizeProviderSlug('Göteborg Energi')]: {
    cannotRankFirst: true,
    fallbackProviderIfFirst: 'Svekraft',
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

function sortByEstimatedMonthlyCost<T extends ElectricityRankingOffer>(offers: T[]): T[] {
  return [...offers].sort((a, b) => a.estimatedMonthlyCost - b.estimatedMonthlyCost);
}

function findProviderIndex<T extends ElectricityRankingOffer>(offers: T[], providerSlug: string): number {
  return offers.findIndex((offer) => getProviderSlug(offer) === providerSlug);
}

function ensureOfferIncluded<T extends ElectricityRankingOffer>(offers: T[], offer: T): T[] {
  const offerSlug = getProviderSlug(offer);

  if (offers.some((candidate) => getProviderSlug(candidate) === offerSlug)) {
    return offers;
  }

  return [...offers, offer];
}

function moveProviderToFirst<T extends ElectricityRankingOffer>(offers: T[], providerSlug: string): T[] {
  const providerIndex = findProviderIndex(offers, providerSlug);
  if (providerIndex <= 0) return offers;

  const nextOffers = [...offers];
  const [providerOffer] = nextOffers.splice(providerIndex, 1);
  return [providerOffer, ...nextOffers];
}

function preventSpecialProviderFirst<T extends ElectricityRankingOffer>({
  visibleOffers,
  baseSortedOffers,
  priorityAnchor,
}: {
  visibleOffers: T[];
  baseSortedOffers: T[];
  priorityAnchor: T | null;
}): T[] {
  const firstOffer = visibleOffers[0];
  if (!firstOffer) return visibleOffers;

  const firstProviderSlug = getProviderSlug(firstOffer);
  const rule = specialProviders[firstProviderSlug];

  if (!rule?.cannotRankFirst) return visibleOffers;

  const fallbackSlug = rule.fallbackProviderIfFirst
    ? normalizeProviderSlug(rule.fallbackProviderIfFirst)
    : null;

  if (fallbackSlug) {
    const fallbackOffer = baseSortedOffers.find((offer) => getProviderSlug(offer) === fallbackSlug);
    const fallbackIndex = fallbackSlug ? findProviderIndex(baseSortedOffers, fallbackSlug) : -1;
    const specialIndex = findProviderIndex(baseSortedOffers, firstProviderSlug);

    if (fallbackOffer && fallbackIndex >= 0 && specialIndex >= 0 && fallbackIndex < specialIndex) {
      const withFallback = sortByEstimatedMonthlyCost(
        ensureOfferIncluded(visibleOffers, fallbackOffer)
      );
      return moveProviderToFirst(withFallback, fallbackSlug);
    }
  }

  if (!priorityAnchor) {
    const nextProvider = baseSortedOffers.find((offer) => getProviderSlug(offer) !== firstProviderSlug);

    if (nextProvider) {
      const nextProviderSlug = getProviderSlug(nextProvider);
      const withNextProvider = sortByEstimatedMonthlyCost(
        ensureOfferIncluded(visibleOffers, nextProvider)
      );
      return moveProviderToFirst(withNextProvider, nextProviderSlug);
    }
  }

  return visibleOffers;
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
          offer.estimatedMonthlyCost >= priorityAnchor.estimatedMonthlyCost
        );
      })
    : baseSortedOffers;

  return preventSpecialProviderFirst({
    visibleOffers: sortByEstimatedMonthlyCost(commerciallyFilteredOffers),
    baseSortedOffers,
    priorityAnchor,
  });
}
