import { normalizeAffiliateProviderName } from '@/lib/electricityPromotions';

interface BottomOnlyProvider {
  provider: string;
  aliases?: string[];
}

// Non-affiliate providers that may be shown only after the full commercial block
// when the current search price is more expensive than every visible affiliate offer.
const BOTTOM_ONLY_PROVIDERS: BottomOnlyProvider[] = [
  { provider: 'Skyllbergskraft AB' },
  { provider: 'Höganäs Energi Handel AB' },
  { provider: 'Sölvesborgs Energi AB' },
  { provider: 'Falu Energi & Vatten AB' },
  { provider: 'Trelleborgs Energi AB' },
  { provider: 'Ystad Energihandel AB' },
  { provider: 'Lerum Elhandel AB' },
  { provider: 'Västerbergslagens Elförsäljning AB' },
  { provider: 'EVLTA AB' },
  { provider: 'Bengtsfors Energi Handel AB' },
  { provider: 'Norrtälje Energi Försäljnings AB' },
  { provider: 'Karlshamn Energi Elförsäljning AB' },
  { provider: 'Sala-Heby Energi AB' },
  { provider: 'Mellanskånes Kraft AB' },
  { provider: 'Gislaved Energi AB' },
  { provider: 'Storuman Energi AB' },
  { provider: 'Rödeby Energi AB' },
  { provider: 'Bodens Energi AB' },
  { provider: 'Elnor Elhandel AB' },
  { provider: 'Mölndal Energi AB' },
  { provider: 'Österlens Kraft AB' },
  { provider: 'Varberg Energimarknad AB' },
  { provider: 'Kraftringen Energi AB' },
  { provider: 'Jönköping Energi AB' },
  { provider: 'Umeå Energi Elhandel AB' },
  { provider: 'Mälarenergi AB' },
  { provider: 'Öresundskraft' },
  { provider: 'Gotlands Elförsäljning AB' },
];

export function getBottomOnlyProviderName(provider: string): string | null {
  const providerSlug = normalizeAffiliateProviderName(provider);

  return (
    BOTTOM_ONLY_PROVIDERS.find((candidate) => {
      const candidateSlugs = [candidate.provider, ...(candidate.aliases ?? [])].map(
        normalizeAffiliateProviderName
      );

      return candidateSlugs.some(
        (candidateSlug) => providerSlug === candidateSlug || providerSlug.includes(candidateSlug)
      );
    })?.provider ?? null
  );
}
