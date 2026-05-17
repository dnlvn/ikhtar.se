export type ElectricityProviderSlug =
  | 'skelleftea-kraft'
  | 'vattenfall'
  | 'telinet-energi'
  | 'fortum'
  | 'greenely'
  | 'eon'
  | 'bixia'
  | 'tibber'
  | 'dalakraft'
  | 'enkla-elbolaget'
  | 'cheap-energy'
  | 'karnfull-energi'
  | 'motala-energi'
  | 'stockholms-elbolag'
  | 'svea-lands-elbolag'
  | 'svekraft';

export const ELECTRICITY_PROVIDER_LOGOS: Record<ElectricityProviderSlug, string> = {
  'skelleftea-kraft': '/assets/electricity-providers/skelleftea-kraft.png?v=2',
  vattenfall: '/assets/electricity-providers/vattenfall.svg',
  'telinet-energi': '/assets/electricity-providers/telinet-energi.png',
  fortum: '/assets/electricity-providers/fortum.svg',
  greenely: '/assets/electricity-providers/greenely.png',
  eon: '/assets/electricity-providers/eon.svg',
  bixia: '/assets/electricity-providers/bixia.png',
  tibber: '/assets/electricity-providers/tibber.png',
  dalakraft: '/assets/electricity-providers/dalakraft.webp',
  'enkla-elbolaget': '/assets/electricity-providers/enkla-elbolaget.png?v=2',
  'cheap-energy': '/assets/electricity-providers/cheap-energy.png?v=2',
  'karnfull-energi': '/assets/electricity-providers/karnfull-energi.svg',
  'motala-energi': '/assets/electricity-providers/motala-energi.svg',
  'stockholms-elbolag': '/assets/electricity-providers/stockholms-elbolag.svg',
  'svea-lands-elbolag': '/assets/electricity-providers/svea-lands-elbolag.svg',
  svekraft: '/assets/electricity-providers/svekraft.svg',
};

const PLACEHOLDER_LOGO_PROVIDERS: ElectricityProviderSlug[] = [
  'skelleftea-kraft',
  'enkla-elbolaget',
  'cheap-energy',
];

function slugifyElectricityProvider(input?: string | null): ElectricityProviderSlug | null {
  if (!input) return null;

  const value = input.toLowerCase().trim();

  if (value.includes('skellefte')) return 'skelleftea-kraft';
  if (value.includes('vattenfall')) return 'vattenfall';
  if (value.includes('telinet')) return 'telinet-energi';
  if (value.includes('fortum')) return 'fortum';
  if (value.includes('greenely') || value.includes('greenly')) return 'greenely';
  if (value.includes('e.on') || value.includes('eon')) return 'eon';
  if (value.includes('bixia')) return 'bixia';
  if (value.includes('tibber')) return 'tibber';
  if (value.includes('dalakraft') || value.includes('dala kraft')) return 'dalakraft';
  if (value.includes('enkla elbolaget')) return 'enkla-elbolaget';
  if (value.includes('cheap energy')) return 'cheap-energy';
  if (value.includes('kärnfull') || value.includes('karnfull')) return 'karnfull-energi';
  if (value.includes('motala')) return 'motala-energi';
  if (value.includes('stockholms elbolag')) return 'stockholms-elbolag';
  if (value.includes('svea lands') || value.includes('svealands')) return 'svea-lands-elbolag';
  if (value.includes('svekraft')) return 'svekraft';

  return null;
}

export function getElectricityProviderLogo(providerName?: string | null): string | null {
  const slug = slugifyElectricityProvider(providerName);
  if (!slug) return null;
  if (PLACEHOLDER_LOGO_PROVIDERS.includes(slug)) return null;
  return ELECTRICITY_PROVIDER_LOGOS[slug] ?? null;
}
