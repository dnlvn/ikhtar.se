import { useEffect, useMemo, useState } from 'react';

export type HousingType = 'apartment' | 'house';
export type UsageLevel = 'low' | 'normal' | 'high';

export interface ElectricityOffer {
  id: string;
  provider: string;
  agreementName: string;
  comparisonPriceOre: number;
  estimatedMonthlyCost: number;
  energySources: string;
  affiliateUrl: string;
  raw: Record<string, any>;
}

interface UseElectricityOffersParams {
  postcode: string;
  housingType: HousingType;
  usageLevel: UsageLevel;
}

const SUPPORTED_PROVIDERS = [
  'Skellefteå kraft',
  'Vattenfall',
  'Telinet Energi',
  'Fortum',
  'Greenely',
  'Eon',
  'Bixia',
  'HemSol',
  'Tibber',
  'Dalakraft',
  'Enkla Elbolaget',
  'Cheap Energy',
  'Kärnfull Energi',
  'Motala Energi',
  'Stockholms Elbolag',
  'Svea Lands Elbolag',
  'Svekraft',
];

export const SUPPORTED_ELECTRICITY_PROVIDERS_COUNT = SUPPORTED_PROVIDERS.length;

export const ELECTRICITY_USAGE_KWH: Record<HousingType, Record<UsageLevel, number>> = {
  apartment: {
    low: 1000,
    normal: 2000,
    high: 3500,
  },
  house: {
    low: 5000,
    normal: 12000,
    high: 20000,
  },
};

const providerMatchers = SUPPORTED_PROVIDERS.map((provider) => ({
  provider,
  normalized: normalizeName(provider),
}));

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]/g, '');
}

function getValue(row: Record<string, any>, keys: string[]): any {
  const normalizedKeys = Object.keys(row).reduce<Record<string, string>>((acc, key) => {
    acc[normalizeName(key)] = key;
    return acc;
  }, {});

  for (const key of keys) {
    const exact = row[key];
    if (exact !== undefined && exact !== null) return exact;

    const normalizedKey = normalizedKeys[normalizeName(key)];
    if (normalizedKey && row[normalizedKey] !== undefined && row[normalizedKey] !== null) {
      return row[normalizedKey];
    }
  }

  return undefined;
}

function toNumber(value: any): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;

  const parsed = Number(value.replace(',', '.').replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function findProvider(row: Record<string, any>): string | null {
  const candidate = String(
    getValue(row, [
      'Foretagsnamn',
      'Företagsnamn',
      'Elhandlare',
      'Leverantor',
      'Leverantör',
      'Bolag',
      'Namn',
    ]) ?? ''
  );
  const normalizedCandidate = normalizeName(candidate);

  return (
    providerMatchers.find(({ normalized }) => normalizedCandidate.includes(normalized))?.provider ??
    null
  );
}

function flattenRows(payload: any): Record<string, any>[] {
  if (Array.isArray(payload)) return payload;

  if (payload && typeof payload === 'object') {
    for (const key of ['Avtal', 'avtal', 'ElAvtal', 'Resultat', 'resultat', 'Data', 'data']) {
      if (Array.isArray(payload[key])) return payload[key];
    }

    const firstArray = Object.values(payload).find(Array.isArray);
    if (Array.isArray(firstArray)) return firstArray as Record<string, any>[];
  }

  return [];
}

function getAffiliateUrl(provider: string): string {
  const slug = normalizeName(provider);
  return `https://www.elpriskollen.se/sidor/sok-avtal.html?ikhtar_provider=${encodeURIComponent(slug)}`;
}

function transformOffer(row: Record<string, any>, annualUsage: number, index: number): ElectricityOffer | null {
  const provider = findProvider(row);
  if (!provider) return null;

  const comparisonPriceOre = toNumber(
    getValue(row, ['AvtalJamforPris', 'AvtalJämförPris', 'JamforPris', 'Jämförpris'])
  );
  if (comparisonPriceOre === null) return null;

  const agreementName = String(
    getValue(row, ['Avtalsnamn', 'AvtalNamn', 'Produktnamn', 'Produkt', 'Avtalsform']) ??
      'Elavtal'
  );

  const energySources = String(
    getValue(row, ['Energikallor', 'Energikällor', 'ElensUrsprung', 'Ursprung']) ??
      'Elmix'
  );

  return {
    id: `${provider}-${agreementName}-${comparisonPriceOre}-${index}`,
    provider,
    agreementName,
    comparisonPriceOre,
    estimatedMonthlyCost: Math.round((comparisonPriceOre / 100) * annualUsage / 12),
    energySources,
    affiliateUrl: getAffiliateUrl(provider),
    raw: row,
  };
}

export function useElectricityOffers({
  postcode,
  housingType,
  usageLevel,
}: UseElectricityOffersParams) {
  const [offers, setOffers] = useState<ElectricityOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const annualUsage = ELECTRICITY_USAGE_KWH[housingType][usageLevel];
  const cleanPostcode = postcode.replace(/\D/g, '');
  const canSearch = cleanPostcode.length === 5;

  useEffect(() => {
    if (!canSearch) {
      setOffers([]);
      setError(null);
      return;
    }

    const controller = new AbortController();

    async function fetchOffers() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          postNummer: cleanPostcode,
          forbrukning: String(annualUsage),
        });

        const response = await fetch(`/api/elpriskollen?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('تعذّر تحميل عروض الكهرباء الآن.');
        }

        const payload = await response.json();
        const rows = flattenRows(payload);
        const unique = new Map<string, ElectricityOffer>();

        rows.forEach((row, index) => {
          const offer = transformOffer(row, annualUsage, index);
          if (!offer) return;

          const key = `${offer.provider}-${offer.agreementName}-${offer.comparisonPriceOre}`;
          if (!unique.has(key)) unique.set(key, offer);
        });

        setOffers(
          Array.from(unique.values()).sort(
            (a, b) => a.estimatedMonthlyCost - b.estimatedMonthlyCost
          )
        );
      } catch (err) {
        if (controller.signal.aborted) return;
        setOffers([]);
        setError(err instanceof Error ? err.message : 'تعذّر تحميل عروض الكهرباء الآن.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchOffers();

    return () => controller.abort();
  }, [annualUsage, canSearch, cleanPostcode]);

  return useMemo(
    () => ({
      offers,
      loading,
      error,
      annualUsage,
      canSearch,
      supportedProvidersCount: SUPPORTED_ELECTRICITY_PROVIDERS_COUNT,
    }),
    [annualUsage, canSearch, error, loading, offers]
  );
}
