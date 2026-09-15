import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validatePayload } from '../api/outbound-click.js';
import {
  buildElectricityAffiliateUrl,
  buildOutboundClickPayload as buildElectricityOutboundClickPayload,
  logOutboundClick as logElectricityOutboundClick,
  openTrackedOutboundUrl as openElectricityTrackedOutboundUrl,
} from '../src/lib/electricityAffiliateTracking.ts';
import {
  buildMobileOutboundClickPayload,
  buildMobileOutboundUrl,
  logMobileOutboundClick,
  openTrackedMobileOutboundUrl,
} from '../src/lib/mobileOutboundTracking.ts';

const clickId = '5038a136-e46a-4607-ac9d-7d9d93b1e345';

function buildTrackedUrl(rawUrl, id) {
  const parsedUrl = new URL(rawUrl);
  const hostname = parsedUrl.hostname.toLowerCase();

  if (hostname.includes('addrevenue.io')) {
    parsedUrl.searchParams.set('r', id);
    return parsedUrl.toString();
  }

  parsedUrl.searchParams.delete('epi');
  parsedUrl.searchParams.delete('epi2');
  parsedUrl.searchParams.delete('epi3');
  parsedUrl.searchParams.delete('epi4');
  parsedUrl.searchParams.delete('epi5');
  parsedUrl.searchParams.set('epi', id);

  return parsedUrl.toString();
}

const adtractionUrl = buildTrackedUrl(
  'https://on.vimla.se/t/t?a=1081333617&as=2043693860&t=2&tk=1&epi=position_1&url=vimla.se/bestall/',
  clickId
);
assert.equal(new URL(adtractionUrl).searchParams.get('epi'), clickId);
assert.equal(new URL(adtractionUrl).searchParams.get('epi2'), null);

const addrevenueUrl = buildTrackedUrl(
  'https://addrevenue.io/t?a=123&c=456&u=https%3A%2F%2Fexample.com%2F',
  clickId
);
assert.equal(new URL(addrevenueUrl).searchParams.get('r'), clickId);

const mobileAdtractionUrl = buildMobileOutboundUrl(
  'https://on.vimla.se/t/t?a=1081333617&as=2043693860&t=2&tk=1&epi=position_1&url=vimla.se/bestall/',
  clickId
);
assert.equal(new URL(mobileAdtractionUrl).searchParams.get('epi'), clickId);
assert.equal(new URL(mobileAdtractionUrl).searchParams.get('epi2'), null);

const mobileAddrevenueUrl = buildMobileOutboundUrl(
  'https://addrevenue.io/t?a=123&c=456&u=https%3A%2F%2Fexample.com%2F',
  clickId
);
assert.equal(new URL(mobileAddrevenueUrl).searchParams.get('r'), clickId);

const electricityOffer = {
  id: 'eon-test',
  provider: 'E.ON SE',
  agreementName: 'Rörligt pris',
  agreementType: 'Rörligt pris',
  agreementTypeLabel: 'Rörligt pris',
  agreementCategory: 'variable',
  comparisonPriceOre: 50,
  estimatedMonthlyCost: 100,
  newCustomersOnly: false,
  affiliateUrl: 'https://go.adt256.com/t/t?a=2028688348&as=2043693860&t=2&tk=1',
  affiliateUrlType: 'standard',
  raw: {},
};
const electricityAffiliateUrl = buildElectricityAffiliateUrl({
  affiliateUrl: electricityOffer.affiliateUrl,
  clickId,
});
assert.equal(new URL(electricityAffiliateUrl).searchParams.get('epi'), clickId);

const electricityAddrevenueUrl = buildElectricityAffiliateUrl({
  affiliateUrl: 'https://addrevenue.io/t?a=985028&c=3467756&u=https%3A%2F%2Fexample.com%2F',
  clickId,
});
assert.equal(new URL(electricityAddrevenueUrl).searchParams.get('r'), clickId);

const electricityTrackingPayload = buildElectricityOutboundClickPayload({
  clickId,
  affiliateUrl: electricityAffiliateUrl,
  offer: electricityOffer,
  rank: 1,
  annualUsage: 2000,
});
assert.equal(electricityTrackingPayload.click_id, clickId);
assert.equal(electricityTrackingPayload.provider, 'Eon');

const consentPayload = validatePayload({
  click_id: clickId,
  site: 'ikhtar',
  vertical: 'mobile',
  provider: 'Vimla',
  operator: 'Vimla',
  affiliate_network: 'adtraction',
  position: 1,
  plan_key: 'vimla-20gb-test',
  data_gb: 20,
  is_unlimited: false,
  price: 99,
  binding_months: 0,
  sort_mode: '12_month_price',
  source: 'google_ads',
  campaign: 'mobile_search',
  gclid: 'REAL-GCLID-123',
  fbclid: 'REAL-FBCLID-123',
  fbp: 'fb.1.123.abc',
  fbc: 'fb.1.123.REAL-FBCLID-123',
  campaign_id: '6956582083628',
  adset_id: '1234567890123',
  ad_id: '2345678901234',
  marketing_consent: true,
  page_path: '/mobilabonnemang',
  landing_page: 'https://ikhtar.se/mobilabonnemang?gclid=REAL-GCLID-123',
  referrer: 'https://www.google.com/',
});

assert.equal(consentPayload.site, 'ikhtar');
assert.equal(consentPayload.vertical, 'mobile');
assert.equal(consentPayload.provider, 'Vimla');
assert.equal(consentPayload.operator, 'Vimla');
assert.equal(consentPayload.plan_key, 'vimla-20gb-test');
assert.equal(consentPayload.data_gb, 20);
assert.equal(consentPayload.is_unlimited, false);
assert.equal(consentPayload.price, 99);
assert.equal(consentPayload.binding_months, 0);
assert.equal(consentPayload.sort_mode, '12_month_price');
assert.equal(consentPayload.gclid, 'REAL-GCLID-123');
assert.equal(consentPayload.fbc, 'fb.1.123.REAL-FBCLID-123');
assert.equal(consentPayload.campaign_id, '6956582083628');
assert.equal(consentPayload.adset_id, '1234567890123');
assert.equal(consentPayload.ad_id, '2345678901234');

const electricityConsentPayload = validatePayload({
  click_id: clickId,
  site: 'ikhtar',
  vertical: 'electricity',
  provider: 'Fortum',
  affiliate_network: 'adtraction',
  position: 1,
  agreement_type: 'variable',
  annual_usage_kwh: 2000,
  estimated_monthly_cost: 450,
  comparison_price_ore: 270,
  source: 'meta',
  campaign: 'Ikhtar.se | El | OutboundClicks',
  fbclid: 'REAL-FBCLID-EL-123',
  fbp: 'fb.1.123.elabc',
  fbc: 'fb.1.123.REAL-FBCLID-EL-123',
  campaign_id: '52510248866432',
  adset_id: '3456789012345',
  ad_id: '4567890123456',
  marketing_consent: true,
  page_path: '/elavtal',
  landing_page: 'https://ikhtar.se/elavtal?utm_source=meta&campaign_id=52510248866432',
  referrer: 'https://facebook.com/',
});

assert.equal(electricityConsentPayload.site, 'ikhtar');
assert.equal(electricityConsentPayload.vertical, 'electricity');
assert.equal(electricityConsentPayload.source, 'meta');
assert.equal(electricityConsentPayload.campaign, 'Ikhtar.se | El | OutboundClicks');
assert.equal(electricityConsentPayload.fbclid, 'REAL-FBCLID-EL-123');
assert.equal(electricityConsentPayload.campaign_id, '52510248866432');
assert.equal(electricityConsentPayload.adset_id, '3456789012345');
assert.equal(electricityConsentPayload.ad_id, '4567890123456');

const electricityEonSePayload = validatePayload({
  ...electricityConsentPayload,
  provider: 'E.ON SE',
  marketing_consent: false,
});
assert.equal(electricityEonSePayload.provider, 'Eon');

const electricityVattenfallPayload = validatePayload({
  ...electricityConsentPayload,
  provider: 'Vattenfall',
  marketing_consent: false,
});
assert.equal(electricityVattenfallPayload.provider, 'Vattenfall');

const electricityNoConsentPayload = validatePayload({
  ...electricityConsentPayload,
  campaign_id: '52510248866432',
  adset_id: '3456789012345',
  ad_id: '4567890123456',
  marketing_consent: false,
});

assert.equal(electricityNoConsentPayload.source, null);
assert.equal(electricityNoConsentPayload.campaign, null);
assert.equal(electricityNoConsentPayload.fbclid, null);
assert.equal(electricityNoConsentPayload.campaign_id, null);
assert.equal(electricityNoConsentPayload.adset_id, null);
assert.equal(electricityNoConsentPayload.ad_id, null);

const noConsentPayload = validatePayload({
  click_id: clickId,
  site: 'ikhtar',
  vertical: 'mobile',
  provider: 'Vimla',
  operator: 'Vimla',
  affiliate_network: 'adtraction',
  position: 1,
  plan_key: 'vimla-20gb-test',
  data_gb: 20,
  is_unlimited: false,
  price: 99,
  binding_months: 0,
  sort_mode: '12_month_price',
  source: 'google_ads',
  campaign: 'mobile_search',
  gclid: 'REAL-GCLID-123',
  gbraid: 'REAL-GBRAID-123',
  wbraid: 'REAL-WBRAID-123',
  fbclid: 'REAL-FBCLID-123',
  fbp: 'fb.1.123.abc',
  fbc: 'fb.1.123.REAL-FBCLID-123',
  campaign_id: '6889268342428',
  adset_id: '5678901234567',
  ad_id: '6789012345678',
  marketing_consent: false,
  page_path: '/mobilabonnemang',
  landing_page: 'https://ikhtar.se/mobilabonnemang?gclid=REAL-GCLID-123',
  referrer: 'https://www.google.com/',
});

assert.equal(noConsentPayload.source, null);
assert.equal(noConsentPayload.campaign, null);
assert.equal(noConsentPayload.gclid, null);
assert.equal(noConsentPayload.gbraid, null);
assert.equal(noConsentPayload.wbraid, null);
assert.equal(noConsentPayload.fbclid, null);
assert.equal(noConsentPayload.fbp, null);
assert.equal(noConsentPayload.fbc, null);
assert.equal(noConsentPayload.campaign_id, null);
assert.equal(noConsentPayload.adset_id, null);
assert.equal(noConsentPayload.ad_id, null);
assert.equal(noConsentPayload.landing_page, null);
assert.equal(noConsentPayload.referrer, null);

assert.equal(validatePayload({ ...consentPayload, click_id: 'position_1' }), null);

const plan = {
  id: 'vimla-20gb-test',
  planKey: 'vimla-20gb-test',
  title: 'Vimla',
  subtitle: '20 GB',
  dataLabel: '20 GB',
  dataSortValue: 20,
  isUnlimited: false,
  price: 99,
  regularPrice: 199,
  bindingMonths: 0,
  campaign: null,
  sourceUrl: 'https://on.vimla.se/t/t?a=1081333617&as=2043693860&t=2&tk=1&url=vimla.se/bestall/',
  affiliateUrl: 'https://on.vimla.se/t/t?a=1081333617&as=2043693860&t=2&tk=1&url=vimla.se/bestall/',
};

const mobileTrackingPayload = buildMobileOutboundClickPayload({
  clickId,
  affiliateUrl: mobileAdtractionUrl,
  plan,
  operatorPosition: 1,
  sortMode: 'yearly-cost',
});
assert.equal(mobileTrackingPayload.click_id, clickId);
assert.equal(mobileTrackingPayload.site, 'ikhtar');
assert.equal(mobileTrackingPayload.vertical, 'mobile');
assert.equal(mobileTrackingPayload.provider, 'Vimla');
assert.equal(mobileTrackingPayload.sort_mode, '12_month_price');
assert.equal(validatePayload(mobileTrackingPayload).click_id, clickId);

const mobilePriceAscPayload = buildMobileOutboundClickPayload({
  clickId,
  affiliateUrl: mobileAdtractionUrl,
  plan,
  operatorPosition: 2,
  sortMode: 'price-asc',
});
assert.equal(mobilePriceAscPayload.sort_mode, 'price_asc');
assert.equal(validatePayload(mobilePriceAscPayload).sort_mode, 'price_asc');

async function withMockedFetch(implementation, callback) {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (...args) => {
    calls.push(args);
    return implementation(...args);
  };

  try {
    await callback(calls);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

async function withMockedWindowOpen(callback) {
  const originalWindow = globalThis.window;
  const openedWindows = [];
  globalThis.window = {
    open: (url, target, features) => {
      const openedWindow = {
        closed: false,
        location: { href: url },
        opener: {},
      };
      openedWindows.push({ url, target, features, openedWindow });
      return openedWindow;
    },
  };

  try {
    await callback(openedWindows);
  } finally {
    globalThis.window = originalWindow;
  }
}

async function runElectricityNavigationScenario(fetchImplementation) {
  await withMockedWindowOpen(async (openedWindows) => {
    await withMockedFetch(fetchImplementation, async (calls) => {
      await openElectricityTrackedOutboundUrl({
        outboundUrl: electricityAffiliateUrl,
        payload: electricityTrackingPayload,
        timeoutMs: 10,
      });

      assert.equal(openedWindows.length, 1);
      assert.equal(openedWindows[0].url, 'about:blank');
      assert.equal(openedWindows[0].openedWindow.location.href, electricityAffiliateUrl);
      assert.equal(calls.length, 1);
      assert.equal(calls[0][0], '/api/outbound-click');
      assert.equal(JSON.parse(calls[0][1].body).click_id, clickId);
      assert.equal(new URL(electricityAffiliateUrl).searchParams.get('epi'), clickId);
    });
  });
}

async function runMobileNavigationScenario(fetchImplementation) {
  await withMockedWindowOpen(async (openedWindows) => {
    await withMockedFetch(fetchImplementation, async (calls) => {
      await openTrackedMobileOutboundUrl({
        outboundUrl: mobileAdtractionUrl,
        payload: mobileTrackingPayload,
        timeoutMs: 10,
      });

      assert.equal(openedWindows.length, 1);
      assert.equal(openedWindows[0].url, 'about:blank');
      assert.equal(openedWindows[0].openedWindow.location.href, mobileAdtractionUrl);
      assert.equal(calls.length, 1);
      assert.equal(calls[0][0], '/api/outbound-click');
      assert.equal(JSON.parse(calls[0][1].body).click_id, clickId);
      assert.equal(new URL(mobileAdtractionUrl).searchParams.get('epi'), clickId);
    });
  });
}

await withMockedFetch(async () => ({ ok: true }), async (calls) => {
  assert.equal(await logMobileOutboundClick(mobileTrackingPayload, { timeoutMs: 20 }), true);
  assert.equal(calls.length, 1);
});

await withMockedFetch(async () => ({ ok: false }), async (calls) => {
  assert.equal(await logMobileOutboundClick(mobileTrackingPayload, { timeoutMs: 20 }), false);
  assert.equal(calls.length, 1);
});

await withMockedFetch(async () => {
  throw new Error('network_failed');
}, async (calls) => {
  assert.equal(await logMobileOutboundClick(mobileTrackingPayload, { timeoutMs: 20 }), false);
  assert.equal(calls.length, 1);
});

await withMockedFetch(() => new Promise(() => {}), async (calls) => {
  assert.equal(await logMobileOutboundClick(mobileTrackingPayload, { timeoutMs: 5 }), false);
  assert.equal(calls.length, 1);
});

await runMobileNavigationScenario(async () => ({ ok: true }));
await runMobileNavigationScenario(async () => ({ ok: false }));
await runMobileNavigationScenario(async () => {
  throw new Error('network_failed');
});
await runMobileNavigationScenario(() => new Promise(() => {}));

await withMockedFetch(async () => ({ ok: true }), async (calls) => {
  assert.equal(await logElectricityOutboundClick(electricityTrackingPayload, { timeoutMs: 20 }), true);
  assert.equal(calls.length, 1);
});

await withMockedFetch(async () => ({ ok: false }), async (calls) => {
  assert.equal(await logElectricityOutboundClick(electricityTrackingPayload, { timeoutMs: 20 }), false);
  assert.equal(calls.length, 1);
});

await withMockedFetch(async () => {
  throw new Error('network_failed');
}, async (calls) => {
  assert.equal(await logElectricityOutboundClick(electricityTrackingPayload, { timeoutMs: 20 }), false);
  assert.equal(calls.length, 1);
});

await withMockedFetch(() => new Promise(() => {}), async (calls) => {
  assert.equal(await logElectricityOutboundClick(electricityTrackingPayload, { timeoutMs: 5 }), false);
  assert.equal(calls.length, 1);
});

await runElectricityNavigationScenario(async () => ({ ok: true }));
await runElectricityNavigationScenario(async () => ({ ok: false }));
await runElectricityNavigationScenario(async () => {
  throw new Error('network_failed');
});
await runElectricityNavigationScenario(() => new Promise(() => {}));

const activeSurfaceFiles = [
  'src/app/components/PremiumPlanCard_V1.tsx',
  'src/app/components/MobileQuickComparison.tsx',
  'src/app/components/MobilePlansTeaserWidget.tsx',
  'src/app/components/SeoContentSection.tsx',
];

for (const filePath of activeSurfaceFiles) {
  const source = readFileSync(filePath, 'utf8');
  assert.match(source, /buildMobileOutboundUrl/);
  assert.match(source, /buildMobileOutboundClickPayload/);
  assert.match(source, /createOutboundClickId/);
  assert.match(source, /openTrackedMobileOutboundUrl/);
}

const seoSource = readFileSync('src/app/components/SeoContentSection.tsx', 'utf8');
assert.match(seoSource, /<InternalTextLink/);
assert.match(seoSource, /to=\{operatorInternalLinks\[slug\]\}/);

console.log('mobile affiliate tracking checks passed');
