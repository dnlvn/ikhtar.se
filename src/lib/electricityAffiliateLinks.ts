import {
  type AffiliateVertical,
  getActivePromotion,
  normalizeAffiliateProviderName,
} from '@/lib/electricityPromotions';

export type AffiliateUrlType = 'standard' | 'campaign';

interface AffiliateLink {
  vertical: AffiliateVertical;
  provider: string;
  affiliateUrl: string;
  aliases?: string[];
}

const ELECTRICITY_AFFILIATE_LINKS: AffiliateLink[] = [
  {
    vertical: 'electricity',
    provider: 'Vattenfall',
    affiliateUrl: 'https://go.adt291.com/t/t?a=1515676052&as=2043693860&t=2&tk=1&url=www.vattenfall.se/elavtal/teckna-elavtal/',
  },
  {
    vertical: 'electricity',
    provider: 'Fortum',
    affiliateUrl: 'https://ion.fortum.com/t/t?a=1312475339&as=2043693860&t=2&tk=1',
  },
  {
    vertical: 'electricity',
    provider: 'Tibber',
    affiliateUrl: 'https://go.adt242.com/t/t?a=1590956516&as=2043693860&t=2&tk=1',
  },
  {
    vertical: 'electricity',
    provider: 'Cheap Energy',
    affiliateUrl: 'https://addrevenue.io/t?a=985028&c=3467756&u=https%3A%2F%2Fwww.cheapenergy.se%2Fteckna-elavtal%2F',
    aliases: ['Cheap Energy AB'],
  },
  {
    vertical: 'electricity',
    provider: 'Kärnfull Energi',
    affiliateUrl: 'https://addrevenue.io/t?a=984789&c=3467756&u=https%3A%2F%2Fwww.karnfull.se%2Fsignup%2F',
    aliases: ['Karnfull Energi'],
  },
  {
    vertical: 'electricity',
    provider: 'Motala Energi',
    affiliateUrl: 'https://addrevenue.io/t?a=986637&c=3467756&u=https%3A%2F%2Fmotalaenergi.se%2Fprivatperson%2F',
  },
  {
    vertical: 'electricity',
    provider: 'Stockholms Elbolag',
    affiliateUrl: 'https://addrevenue.io/t?a=985027&c=3467756&u=https%3A%2F%2Fwww.stockholmselbolag.se%2Felavtal%2F',
  },
  {
    vertical: 'electricity',
    provider: 'Svea Lands Elbolag',
    affiliateUrl: 'https://addrevenue.io/t?a=985029&c=3467756&u=https%3A%2F%2Fwww.svealandselbolag.se%2Fteckna-avtal%2F',
    aliases: ['Svealands Elbolag'],
  },
  {
    vertical: 'electricity',
    provider: 'Svekraft',
    affiliateUrl: 'https://addrevenue.io/t?a=985245&c=3467756',
  },
  {
    vertical: 'electricity',
    provider: 'Dalakraft',
    affiliateUrl: 'https://dot.dalakraft.se/t/t?a=1970530769&as=2043693860&t=2&tk=1&url=www.dalakraft.se/elavtal/affiliate-jamforelse/?nav_id=24900&ttl=30#blikund',
    aliases: ['Dala Kraft'],
  },
];

function matchesProvider(link: AffiliateLink, provider: string): boolean {
  const providerSlug = normalizeAffiliateProviderName(provider);
  const candidates = [link.provider, ...(link.aliases ?? [])].map(normalizeAffiliateProviderName);

  return candidates.some(
    (candidate) => providerSlug === candidate || providerSlug.includes(candidate)
  );
}

export function getAffiliateUrl({
  vertical,
  provider,
}: {
  vertical: AffiliateVertical;
  provider: string;
}): string | null {
  return (
    ELECTRICITY_AFFILIATE_LINKS.find(
      (link) => link.vertical === vertical && matchesProvider(link, provider)
    )?.affiliateUrl ?? null
  );
}

export function getEffectiveAffiliateUrl({
  vertical,
  provider,
  date = new Date(),
}: {
  vertical: AffiliateVertical;
  provider: string;
  date?: Date;
}): string | null {
  const activePromotion = getActivePromotion({ vertical, provider, date });
  if (activePromotion?.campaignUrl) return activePromotion.campaignUrl;

  return getAffiliateUrl({ vertical, provider });
}

export function getEffectiveAffiliateUrlType({
  vertical,
  provider,
  date = new Date(),
}: {
  vertical: AffiliateVertical;
  provider: string;
  date?: Date;
}): AffiliateUrlType | null {
  const activePromotion = getActivePromotion({ vertical, provider, date });
  if (activePromotion?.campaignUrl) return 'campaign';

  return getAffiliateUrl({ vertical, provider }) ? 'standard' : null;
}
