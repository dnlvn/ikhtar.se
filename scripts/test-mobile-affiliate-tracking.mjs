import assert from 'node:assert/strict';
import { validatePayload } from '../api/outbound-click.js';

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

console.log('mobile affiliate tracking checks passed');
