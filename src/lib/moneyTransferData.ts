export type MoneyTransferDeliveryMethod = 'cash_pickup' | 'bank_account' | 'mobile_wallet';

export interface MoneyTransferCountry {
  code: string;
  nameAr: string;
  flag: string;
  currency: string;
  timeZones?: string[];
}

export interface MoneyTransferProvider {
  id: string;
  name: string;
  logoText: string;
  affiliateUrl: string;
  supportedDeliveryMethods: MoneyTransferDeliveryMethod[];
  baseFeeSek: number;
  rateAdjustment: number;
  transferTimeAr: string;
  recommended?: boolean;
}

export interface MoneyTransferQuote {
  id: string;
  provider: MoneyTransferProvider;
  recipientGets: number;
  recipientCurrency: string;
  fee: number;
  feeCurrency: string;
  exchangeRate: number;
  transferTimeAr: string;
  deliveryMethod: MoneyTransferDeliveryMethod;
  badgeTextAr: string;
}

export const SEND_COUNTRIES: MoneyTransferCountry[] = [
  { code: 'at', nameAr: 'النمسا', flag: '🇦🇹', currency: 'EUR', timeZones: ['Europe/Vienna'] },
  { code: 'be', nameAr: 'بلجيكا', flag: '🇧🇪', currency: 'EUR', timeZones: ['Europe/Brussels'] },
  { code: 'dk', nameAr: 'الدنمارك', flag: '🇩🇰', currency: 'DKK', timeZones: ['Europe/Copenhagen'] },
  { code: 'fr', nameAr: 'فرنسا', flag: '🇫🇷', currency: 'EUR', timeZones: ['Europe/Paris'] },
  { code: 'de', nameAr: 'ألمانيا', flag: '🇩🇪', currency: 'EUR', timeZones: ['Europe/Berlin'] },
  { code: 'ie', nameAr: 'إيرلندا', flag: '🇮🇪', currency: 'EUR', timeZones: ['Europe/Dublin'] },
  { code: 'it', nameAr: 'إيطاليا', flag: '🇮🇹', currency: 'EUR', timeZones: ['Europe/Rome'] },
  { code: 'nl', nameAr: 'هولندا', flag: '🇳🇱', currency: 'EUR', timeZones: ['Europe/Amsterdam'] },
  { code: 'no', nameAr: 'النرويج', flag: '🇳🇴', currency: 'NOK', timeZones: ['Europe/Oslo'] },
  { code: 'pl', nameAr: 'بولندا', flag: '🇵🇱', currency: 'PLN', timeZones: ['Europe/Warsaw'] },
  { code: 'pt', nameAr: 'البرتغال', flag: '🇵🇹', currency: 'EUR', timeZones: ['Europe/Lisbon'] },
  { code: 'es', nameAr: 'إسبانيا', flag: '🇪🇸', currency: 'EUR', timeZones: ['Europe/Madrid'] },
  { code: 'se', nameAr: 'السويد', flag: '🇸🇪', currency: 'SEK', timeZones: ['Europe/Stockholm'] },
  { code: 'ch', nameAr: 'سويسرا', flag: '🇨🇭', currency: 'CHF', timeZones: ['Europe/Zurich'] },
  { code: 'gb', nameAr: 'المملكة المتحدة', flag: '🇬🇧', currency: 'GBP', timeZones: ['Europe/London'] },
];

export const RECEIVE_COUNTRIES: MoneyTransferCountry[] = [
  { code: 'sy', nameAr: 'سوريا', flag: '🇸🇾', currency: 'SYP' },
  { code: 'lb', nameAr: 'لبنان', flag: '🇱🇧', currency: 'USD' },
  { code: 'iq', nameAr: 'العراق', flag: '🇮🇶', currency: 'IQD' },
  { code: 'jo', nameAr: 'الأردن', flag: '🇯🇴', currency: 'JOD' },
  { code: 'eg', nameAr: 'مصر', flag: '🇪🇬', currency: 'EGP' },
  { code: 'tr', nameAr: 'تركيا', flag: '🇹🇷', currency: 'TRY' },
  { code: 'ma', nameAr: 'المغرب', flag: '🇲🇦', currency: 'MAD' },
];

export const MONEY_TRANSFER_CURRENCIES = ['SEK', 'EUR', 'DKK', 'NOK', 'PLN', 'CHF', 'GBP'];

export const MONEY_TRANSFER_PROVIDERS: MoneyTransferProvider[] = [
  {
    id: 'western-union',
    name: 'Western Union',
    logoText: 'WU',
    affiliateUrl: 'https://www.westernunion.com/',
    supportedDeliveryMethods: ['cash_pickup', 'bank_account', 'mobile_wallet'],
    baseFeeSek: 35,
    rateAdjustment: 1.006,
    transferTimeAr: 'خلال دقائق',
    recommended: true,
  },
  {
    id: 'moneygram',
    name: 'MoneyGram',
    logoText: 'MG',
    affiliateUrl: 'https://www.moneygram.com/',
    supportedDeliveryMethods: ['cash_pickup', 'bank_account'],
    baseFeeSek: 39,
    rateAdjustment: 0.998,
    transferTimeAr: 'خلال دقائق',
  },
  {
    id: 'wise',
    name: 'Wise',
    logoText: 'W',
    affiliateUrl: 'https://wise.com/',
    supportedDeliveryMethods: ['bank_account'],
    baseFeeSek: 24,
    rateAdjustment: 1.01,
    transferTimeAr: 'نفس اليوم',
  },
  {
    id: 'remitly',
    name: 'Remitly',
    logoText: 'R',
    affiliateUrl: 'https://www.remitly.com/',
    supportedDeliveryMethods: ['cash_pickup', 'bank_account', 'mobile_wallet'],
    baseFeeSek: 29,
    rateAdjustment: 1.003,
    transferTimeAr: 'خلال ساعات',
  },
  {
    id: 'ria',
    name: 'Ria',
    logoText: 'RIA',
    affiliateUrl: 'https://www.riamoneytransfer.com/',
    supportedDeliveryMethods: ['cash_pickup', 'bank_account'],
    baseFeeSek: 33,
    rateAdjustment: 1,
    transferTimeAr: 'خلال دقائق',
  },
  {
    id: 'transfer-galaxy',
    name: 'Transfer Galaxy',
    logoText: 'TG',
    affiliateUrl: 'https://www.transfergalaxy.com/',
    supportedDeliveryMethods: ['bank_account', 'mobile_wallet'],
    baseFeeSek: 19,
    rateAdjustment: 0.995,
    transferTimeAr: 'نفس اليوم',
  },
];

const DESTINATION_RATE_FROM_SEK: Record<string, number> = {
  sy: 1340,
  lb: 0.095,
  iq: 124,
  jo: 0.067,
  eg: 4.55,
  tr: 3.08,
  ma: 0.92,
};

const CURRENCY_TO_SEK: Record<string, number> = {
  SEK: 1,
  EUR: 11.2,
  DKK: 1.5,
  NOK: 0.96,
  PLN: 2.65,
  CHF: 11.8,
  GBP: 13.1,
};

export const DELIVERY_METHOD_LABELS_AR: Record<MoneyTransferDeliveryMethod, string> = {
  cash_pickup: 'استلام نقدي',
  bank_account: 'حساب بنكي',
  mobile_wallet: 'محفظة جوال',
};

export function getDefaultSendCountryCode(timeZone?: string, locale?: string): string {
  const byTimeZone = SEND_COUNTRIES.find((country) => country.timeZones?.includes(timeZone ?? ''));
  if (byTimeZone) return byTimeZone.code;

  const region = locale?.split('-')[1]?.toLowerCase();
  if (region && SEND_COUNTRIES.some((country) => country.code === region)) return region;

  return 'se';
}

export function getSendCountry(code: string): MoneyTransferCountry {
  return SEND_COUNTRIES.find((country) => country.code === code) ?? SEND_COUNTRIES.find((country) => country.code === 'se')!;
}

export function getReceiveCountry(code: string): MoneyTransferCountry {
  return RECEIVE_COUNTRIES.find((country) => country.code === code) ?? RECEIVE_COUNTRIES[0];
}

export function getCurrencyForSendCountry(code: string): string {
  return getSendCountry(code).currency;
}

export function getMoneyTransferQuotes({
  amount,
  currency,
  toCountryCode,
}: {
  amount: number;
  currency: string;
  toCountryCode: string;
}): MoneyTransferQuote[] {
  const targetCountry = getReceiveCountry(toCountryCode);
  const amountInSek = amount * (CURRENCY_TO_SEK[currency] ?? 1);
  const destinationBaseRate = DESTINATION_RATE_FROM_SEK[targetCountry.code] ?? 1;

  return MONEY_TRANSFER_PROVIDERS.map((provider) => {
    const feeInInputCurrency = provider.baseFeeSek / (CURRENCY_TO_SEK[currency] ?? 1);
    const exchangeRate = destinationBaseRate * (CURRENCY_TO_SEK[currency] ?? 1) * provider.rateAdjustment;
    const recipientGets = Math.max(0, (amountInSek - provider.baseFeeSek) * destinationBaseRate * provider.rateAdjustment);
    const deliveryMethod = provider.supportedDeliveryMethods[0];

    return {
      id: provider.id,
      provider,
      recipientGets: Math.round(recipientGets),
      recipientCurrency: targetCountry.currency,
      fee: Math.round(feeInInputCurrency * 100) / 100,
      feeCurrency: currency,
      exchangeRate,
      transferTimeAr: provider.transferTimeAr,
      deliveryMethod,
      badgeTextAr: 'موصى به',
    };
  })
    .sort((a, b) => b.recipientGets - a.recipientGets)
    .map((quote, index) => ({
      ...quote,
      badgeTextAr: index === 0 ? 'أفضل سعر' : quote.transferTimeAr.includes('دقائق') ? 'سريع' : 'موصى به',
    }));
}

export function formatMoneyTransferNumber(value: number): string {
  return new Intl.NumberFormat('ar-SE', { maximumFractionDigits: 0 }).format(value);
}
