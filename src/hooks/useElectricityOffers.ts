import { useEffect, useMemo, useState } from 'react';

export type HousingType = 'apartment' | 'house';
export type UsageLevel = 'low' | 'normal' | 'high';
export type AgreementFilter = 'all' | 'variable' | 'fixed' | 'hourly';
export type AgreementCategory = Exclude<AgreementFilter, 'all'> | 'unknown';

export interface ElectricityOffer {
  id: string;
  provider: string;
  agreementName: string;
  agreementType?: string;
  agreementTypeLabel: string;
  agreementCategory: AgreementCategory;
  comparisonPriceOre: number;
  estimatedMonthlyCost: number;
  energySources: string;
  cancellationPeriod?: string;
  newCustomersOnly: boolean;
  hasBraMiljoval: boolean;
  affiliateUrl: string;
  raw: Record<string, any>;
}

interface UseElectricityOffersParams {
  postcode: string;
  housingType: HousingType;
  usageLevel: UsageLevel;
  customAnnualUsage?: number;
  agreementFilter?: AgreementFilter;
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

const PROVIDER_ALIASES: Record<string, string[]> = {
  'Skellefteå kraft': ['Skellefteå Kraft AB'],
  Eon: ['E.ON', 'E.ON Energi', 'E.ON Energilösningar', 'E.ON Försäljning'],
};

const PROVIDER_NAME_KEYS = [
  'ElLeverantorNamn',
  'ElleverantorNamn',
  'ElLeverantörNamn',
  'ElleverantörNamn',
  'ElLeverantor',
  'Elleverantor',
  'ElLeverantör',
  'Elleverantör',
  'Foretagsnamn',
  'Företagsnamn',
  'Foretag',
  'Företag',
  'Elhandlare',
  'Elhandelsforetag',
  'Elhandelsföretag',
  'Leverantor',
  'Leverantör',
  'Bolag',
  'Namn',
];

const AGREEMENT_NAME_KEYS = [
  'Avtalsnamn',
  'AvtalNamn',
  'AvtalNamn',
  'Produktnamn',
  'Produkt',
];

const AGREEMENT_TYPE_KEYS = [
  'Avtalsform',
  'AvtalTyp',
  'Avtalstyp',
  'AvtalTypId',
  'TypId',
  'AvtalBenamning',
  'AvtalBenämning',
  'Benamning',
  'Benämning',
  'Prisavtal',
  'Pristyp',
];

const COMPARISON_PRICE_KEYS = [
  'AvtalJamforPris',
  'AvtalJämförPris',
  'AvtalJamforpris',
  'AvtalJämförpris',
  'AvtalJmfPris',
  'JamforPris',
  'JämförPris',
  'Jamforpris',
  'Jämförpris',
  'JamforprisOreKwh',
  'JämförprisÖreKwh',
];

const ENERGY_SOURCE_KEYS = [
  'Energikallor',
  'Energikällor',
  'ElensUrsprung',
  'Ursprung',
  'Miljo',
  'Miljö',
];

const CANCELLATION_PERIOD_KEYS = [
  'Uppsagningstid',
  'Uppsägningstid',
  'UppsagningstidManader',
  'UppsägningstidMånader',
  'UppsagningstidManad',
  'UppsägningstidMånad',
];

const NEW_CUSTOMERS_ONLY_KEYS = [
  'EndastNyaKunder',
  'EndastNyKund',
  'BaraNyaKunder',
  'Nykund',
  'NyKund',
  'GallerEndastNyaKunder',
  'GällerEndastNyaKunder',
];

const BRA_MILJOVAL_KEYS = [
  'BraMiljoval',
  'BraMiljöval',
  'HarBraMiljoval',
  'HarBraMiljöval',
];

export const ELECTRICITY_USAGE_KWH: Record<HousingType, Record<UsageLevel, number>> = {
  apartment: {
    low: 1000,
    normal: 2000,
    high: 3500,
  },
  house: {
    low: 8000,
    normal: 15000,
    high: 25000,
  },
};

const providerMatchers = SUPPORTED_PROVIDERS.flatMap((provider) =>
  [provider, ...(PROVIDER_ALIASES[provider] ?? [])].map((alias) => ({
    provider,
    normalized: normalizeName(alias),
  }))
);

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

  for (const value of Object.values(row)) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue;

    const nested = getValue(value as Record<string, any>, keys);
    if (nested !== undefined && nested !== null) return nested;
  }

  return undefined;
}

function toNumber(value: any): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;

  const parsed = Number(value.replace(',', '.').replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function toBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value !== 'string') return false;

  const normalized = normalizeName(value);
  return ['true', 'ja', 'yes', '1'].includes(normalized);
}

function getProviderName(row: Record<string, any>): string {
  return String(getValue(row, PROVIDER_NAME_KEYS) ?? '');
}

function findProvider(row: Record<string, any>): string | null {
  const candidate = getProviderName(row);
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

function getProviderSlug(provider: string): string {
  return normalizeName(provider);
}

function getEnergySources(row: Record<string, any>): string {
  const directValue = getValue(row, ENERGY_SOURCE_KEYS);
  if (directValue) return String(directValue);

  const sourceLabels = [
    ['Sol', 'Sol'],
    ['Vind', 'Vind'],
    ['Vatten', 'Vatten'],
    ['Karnkraft', 'Kärnkraft'],
    ['Kärnkraft', 'Kärnkraft'],
    ['Bio', 'Biobränsle'],
    ['Biobransle', 'Biobränsle'],
    ['Biobränsle', 'Biobränsle'],
    ['Fossil', 'Fossilt'],
  ];

  const activeSources = sourceLabels
    .filter(([key]) => {
      const value = getValue(row, [key]);
      return value === true || value === 'true' || value === 'Ja' || value === 'ja' || value === 1;
    })
    .map(([, label]) => label);

  return activeSources.length > 0 ? activeSources.join(', ') : 'Elmix';
}

function classifyAgreement(row: Record<string, any>, agreementName: string, agreementType?: string): AgreementCategory {
  const candidates = [
    agreementName,
    agreementType,
    getValue(row, ['AvtalBenamning', 'AvtalBenämning', 'Benamning', 'Benämning']),
    getValue(row, ['AvtalTypId', 'TypId']),
  ]
    .filter(Boolean)
    .map(String)
    .join(' ');
  const normalized = normalizeName(candidates);

  if (
    normalized.includes('timpris') ||
    normalized.includes('kvartspris') ||
    normalized.includes('spotpris') ||
    normalized.includes('timavtal') ||
    normalized.includes('kvart')
  ) {
    return 'hourly';
  }

  if (
    normalized.includes('fastpris') ||
    normalized.includes('fastavtal') ||
    normalized.includes('fastprisavtal') ||
    normalized.includes('fast')
  ) {
    return 'fixed';
  }

  if (
    normalized.includes('rorligt') ||
    normalized.includes('rorlig') ||
    normalized.includes('manadspris') ||
    normalized.includes('manadsbaserat')
  ) {
    return 'variable';
  }

  return 'unknown';
}

function getAgreementTypeLabel(category: AgreementCategory, agreementName: string, agreementType?: string): string {
  const source = agreementType || agreementName;

  if (category === 'fixed') return source && normalizeName(source).includes('fast') ? source : 'Fast pris';
  if (category === 'hourly') return source && /(tim|kvart|spot)/i.test(source) ? source : 'Timpris/kvartspris';
  if (category === 'variable') return source && /rör|ror|mån|man/i.test(source) ? source : 'Rörligt pris';

  return source || 'Elavtal';
}

function transformOffer(row: Record<string, any>, annualUsage: number, index: number): ElectricityOffer | null {
  const provider = findProvider(row);
  if (!provider) return null;

  const comparisonPriceOre = toNumber(getValue(row, COMPARISON_PRICE_KEYS));
  if (comparisonPriceOre === null) return null;

  const agreementName = String(getValue(row, AGREEMENT_NAME_KEYS) ?? 'Elavtal');
  const agreementTypeValue = getValue(row, AGREEMENT_TYPE_KEYS);
  const agreementType = agreementTypeValue ? String(agreementTypeValue) : undefined;
  const agreementCategory = classifyAgreement(row, agreementName, agreementType);
  const cancellationPeriod = getValue(row, CANCELLATION_PERIOD_KEYS);
  const energySources = getEnergySources(row);

  return {
    id: `${provider}-${agreementName}-${comparisonPriceOre}-${index}`,
    provider,
    agreementName,
    agreementType,
    agreementTypeLabel: getAgreementTypeLabel(agreementCategory, agreementName, agreementType),
    agreementCategory,
    comparisonPriceOre,
    estimatedMonthlyCost: Math.round((comparisonPriceOre / 100) * annualUsage / 12),
    energySources,
    cancellationPeriod: cancellationPeriod ? String(cancellationPeriod) : undefined,
    newCustomersOnly: toBoolean(getValue(row, NEW_CUSTOMERS_ONLY_KEYS)),
    hasBraMiljoval: toBoolean(getValue(row, BRA_MILJOVAL_KEYS)),
    affiliateUrl: getAffiliateUrl(provider),
    raw: row,
  };
}

export function useElectricityOffers({
  postcode,
  housingType,
  usageLevel,
  customAnnualUsage,
  agreementFilter = 'all',
}: UseElectricityOffersParams) {
  const [offers, setOffers] = useState<ElectricityOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const annualUsage = customAnnualUsage && customAnnualUsage > 0
    ? customAnnualUsage
    : ELECTRICITY_USAGE_KWH[housingType][usageLevel];
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

        console.info('[Ikhtar elavtal] Hämtar Elpriskollen-data', {
          postNummer: cleanPostcode,
          forbrukning: annualUsage,
          url: `/api/elpriskollen?${params.toString()}`,
        });

        if (!response.ok) {
          throw new Error('تعذّر تحميل عروض الكهرباء الآن.');
        }

        const payload = await response.json();
        const rows = flattenRows(payload);
        const bestOfferByProvider = new Map<string, ElectricityOffer>();
        const providerNames = rows
          .map((row) => getProviderName(row))
          .filter(Boolean);
        const unmatchedProviders = new Set<string>();
        let matchedOffers = 0;

        rows.forEach((row, index) => {
          const offer = transformOffer(row, annualUsage, index);
          if (!offer) {
            const providerName = getProviderName(row);
            if (providerName) unmatchedProviders.add(providerName);
            return;
          }

          if (agreementFilter !== 'all' && offer.agreementCategory !== agreementFilter) {
            return;
          }

          matchedOffers += 1;

          const providerSlug = getProviderSlug(offer.provider);
          const currentBest = bestOfferByProvider.get(providerSlug);
          if (
            !currentBest ||
            offer.estimatedMonthlyCost < currentBest.estimatedMonthlyCost ||
            (
              offer.estimatedMonthlyCost === currentBest.estimatedMonthlyCost &&
              offer.comparisonPriceOre < currentBest.comparisonPriceOre
            )
          ) {
            bestOfferByProvider.set(providerSlug, offer);
          }
        });

        console.info('[Ikhtar elavtal] Elpriskollen-resultat', {
          totalRows: rows.length,
          providerNames: Array.from(new Set(providerNames)).slice(0, 40),
          matchedOffers,
          agreementFilter,
          displayedProviders: bestOfferByProvider.size,
          unmatchedProviders: Array.from(unmatchedProviders).slice(0, 40),
        });

        setOffers(
          Array.from(bestOfferByProvider.values()).sort(
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
  }, [agreementFilter, annualUsage, canSearch, cleanPostcode]);

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
