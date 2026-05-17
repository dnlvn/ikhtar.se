export type ElectricityProviderSlug =
  | 'vattenfall'
  | 'fortum'
  | 'eon'
  | 'cheap-energy'
  | 'karnfull-energi'
  | 'motala-energi'
  | 'stockholms-elbolag'
  | 'svea-lands-elbolag'
  | 'svekraft';

export const ELECTRICITY_PROVIDER_LOGOS: Record<ElectricityProviderSlug, string> = {
  vattenfall: '/assets/electricity-providers/vattenfall.svg',
  fortum: '/assets/electricity-providers/fortum.svg',
  eon: '/assets/electricity-providers/eon.svg',
  'cheap-energy': '/assets/electricity-providers/cheap-energy.svg',
  'karnfull-energi': '/assets/electricity-providers/karnfull-energi.svg',
  'motala-energi': '/assets/electricity-providers/motala-energi.svg',
  'stockholms-elbolag': '/assets/electricity-providers/stockholms-elbolag.svg',
  'svea-lands-elbolag': '/assets/electricity-providers/svea-lands-elbolag.svg',
  svekraft: '/assets/electricity-providers/svekraft.svg',
};

function slugifyElectricityProvider(input?: string | null): ElectricityProviderSlug | null {
  if (!input) return null;

  const value = input.toLowerCase().trim();

  if (value.includes('vattenfall')) return 'vattenfall';
  if (value.includes('fortum')) return 'fortum';
  if (value.includes('e.on') || value.includes('eon')) return 'eon';
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
  return ELECTRICITY_PROVIDER_LOGOS[slug] ?? null;
}
