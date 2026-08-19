const MAX_BODY_BYTES = 8192;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ALLOWED_PROVIDERS = new Set([
  'Vattenfall',
  'Fortum',
  'Tibber',
  'Eon',
  'E.ON',
  'Telinet Energi',
  'Bixia',
  'Göteborg Energi',
  'Goteborg Energi',
  'Cheap Energy',
  'Kärnfull Energi',
  'Karnfull Energi',
  'Motala Energi',
  'Stockholms Elbolag',
  'Svea Lands Elbolag',
  'Svealands Elbolag',
  'Svekraft',
  'Dalakraft',
  'Dala Kraft',
]);

const CURRENT_SITE = 'ikhtar';
const CURRENT_VERTICAL = 'electricity';
const ALLOWED_SITES = new Set([CURRENT_SITE]);
const ALLOWED_VERTICALS = new Set(['electricity', 'mobile']);
const ALLOWED_NETWORKS = new Set(['adtraction', 'addrevenue', 'direct', 'unknown']);
const ALLOWED_AGREEMENT_TYPES = new Set(['variable', 'fixed', 'hourly', 'quarterly', 'other']);
const ALLOWED_SORT_MODES = new Set(['12_month_price', 'no_binding', 'best_data_value']);
const ALLOWED_SOURCES = new Set([
  'google_ads',
  'meta',
  'alkompis',
  'google_organic',
  'direct',
  'referral',
]);

function sendJson(response, status, payload) {
  response.status(status).json(payload);
}

async function readJsonBody(request) {
  if (request.body && typeof request.body === 'object') {
    return request.body;
  }

  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      throw new Error('payload_too_large');
    }
    chunks.push(chunk);
  }

  if (chunks.length === 0) return {};

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function asString(value, maxLength) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

function asInteger(value) {
  if (typeof value !== 'number' || !Number.isInteger(value)) return null;
  return value;
}

function optionalInteger(value) {
  if (value === undefined || value === null) return null;
  return asInteger(value);
}

function asBoolean(value) {
  return typeof value === 'boolean' ? value : false;
}

function optionalString(value, maxLength) {
  if (value === undefined || value === null) return null;
  return asString(value, maxLength);
}

function sanitizeMarketingAttribution(row) {
  if (row.marketing_consent === true) return row;

  if (row.vertical === 'mobile') {
    return {
      ...row,
      source: null,
      campaign: null,
      gclid: null,
      gbraid: null,
      wbraid: null,
      fbclid: null,
      fbp: null,
      fbc: null,
      landing_page: null,
      referrer: null,
    };
  }

  const hasGoogleAdsAttribution = row.source === 'google_ads' || row.gclid || row.gbraid || row.wbraid;
  const hasMetaAttribution = row.source === 'meta' || row.fbclid || row.fbp || row.fbc;

  return {
    ...row,
    source: row.source === 'google_ads' || row.source === 'meta' ? null : row.source,
    campaign: hasGoogleAdsAttribution || hasMetaAttribution ? null : row.campaign,
    gclid: null,
    gbraid: null,
    wbraid: null,
    fbclid: null,
    fbp: null,
    fbc: null,
    landing_page: hasGoogleAdsAttribution || hasMetaAttribution ? null : row.landing_page,
    referrer: hasGoogleAdsAttribution || hasMetaAttribution ? null : row.referrer,
  };
}

export function validatePayload(body) {
  const clickId = asString(body.click_id, 64);
  const site = asString(body.site, 40) ?? CURRENT_SITE;
  const vertical = asString(body.vertical, 40) ?? CURRENT_VERTICAL;
  const provider = asString(body.provider, 80);
  const affiliateNetwork = asString(body.affiliate_network, 32);
  const position = asInteger(body.position);
  const agreementType = asString(body.agreement_type, 32);
  const annualUsageKwh = asInteger(body.annual_usage_kwh);
  const estimatedMonthlyCost = asInteger(body.estimated_monthly_cost);
  const comparisonPriceOre = body.comparison_price_ore === undefined || body.comparison_price_ore === null
    ? null
    : asInteger(body.comparison_price_ore);
  const source = optionalString(body.source, 32);
  const campaign = optionalString(body.campaign, 120);

  if (!clickId || !UUID_PATTERN.test(clickId)) return null;
  if (!ALLOWED_SITES.has(site)) return null;
  if (!ALLOWED_VERTICALS.has(vertical)) return null;
  if (!affiliateNetwork || !ALLOWED_NETWORKS.has(affiliateNetwork)) return null;
  if (position === null || position <= 0 || position >= 100) return null;
  if (source !== null && !ALLOWED_SOURCES.has(source)) return null;

  const baseRow = {
    click_id: clickId,
    site,
    vertical,
    provider,
    affiliate_network: affiliateNetwork,
    position,
    source,
    campaign,
    gclid: optionalString(body.gclid, 180),
    gbraid: optionalString(body.gbraid, 180),
    wbraid: optionalString(body.wbraid, 180),
    fbclid: optionalString(body.fbclid, 260),
    fbp: optionalString(body.fbp, 260),
    fbc: optionalString(body.fbc, 320),
    marketing_consent: asBoolean(body.marketing_consent),
    page_path: optionalString(body.page_path, 180),
    landing_page: optionalString(body.landing_page, 500),
    referrer: optionalString(body.referrer, 500),
  };

  if (vertical === 'electricity') {
    if (!provider || !ALLOWED_PROVIDERS.has(provider)) return null;
    if (!agreementType || !ALLOWED_AGREEMENT_TYPES.has(agreementType)) return null;
    if (annualUsageKwh === null || annualUsageKwh <= 0 || annualUsageKwh >= 100000) return null;
    if (estimatedMonthlyCost === null || estimatedMonthlyCost < 0 || estimatedMonthlyCost >= 100000) return null;
    if (comparisonPriceOre !== null && (comparisonPriceOre < 0 || comparisonPriceOre >= 100000)) return null;

    return sanitizeMarketingAttribution({
      ...baseRow,
      agreement_type: agreementType,
      annual_usage_kwh: annualUsageKwh,
      estimated_monthly_cost: estimatedMonthlyCost,
      comparison_price_ore: comparisonPriceOre,
    });
  }

  const operator = asString(body.operator, 80) ?? provider;
  const planKey = asString(body.plan_key, 120);
  const dataGb = optionalInteger(body.data_gb);
  const isUnlimited = asBoolean(body.is_unlimited);
  const price = asInteger(body.price);
  const bindingMonths = asInteger(body.binding_months);
  const sortMode = asString(body.sort_mode, 40);

  if (!provider || !operator) return null;
  if (!planKey) return null;
  if (dataGb !== null && (dataGb < 0 || dataGb >= 10000)) return null;
  if (price === null || price < 0 || price >= 100000) return null;
  if (bindingMonths === null || bindingMonths < 0 || bindingMonths >= 1000) return null;
  if (!sortMode || !ALLOWED_SORT_MODES.has(sortMode)) return null;

  return sanitizeMarketingAttribution({
    ...baseRow,
    operator,
    plan_key: planKey,
    data_gb: dataGb,
    is_unlimited: isUnlimited,
    price,
    binding_months: bindingMonths,
    sort_mode: sortMode,
  });
}

async function insertOutboundClick({ supabaseUrl, supabaseServiceRoleKey, row }) {
  const response = await fetch(`${supabaseUrl}/rest/v1/outbound_clicks`, {
    method: 'POST',
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });

  if (response.ok || response.status === 409) {
    return { response, errorText: '', schemaFallback: false };
  }

  const text = await response.text();

  if (
    response.status === 400 &&
    (text.includes('marketing_consent') || text.includes('fbp') || text.includes('fbc'))
  ) {
    const {
      marketing_consent: _marketingConsent,
      fbp: _fbp,
      fbc: _fbc,
      ...legacySchemaRow
    } = row;
    const fallbackResponse = await fetch(`${supabaseUrl}/rest/v1/outbound_clicks`, {
      method: 'POST',
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(legacySchemaRow),
    });

    return { response: fallbackResponse, errorText: text, schemaFallback: true };
  }

  return { response, errorText: text, schemaFallback: false };
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    sendJson(response, 405, { error: 'Method not allowed' });
    return;
  }

  const contentType = request.headers['content-type'] || '';
  if (!String(contentType).includes('application/json')) {
    sendJson(response, 415, { error: 'Unsupported content type' });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('[Ikhtar outbound-click] Missing Supabase environment variables');
    sendJson(response, 202, { ok: false });
    return;
  }

  try {
    const body = await readJsonBody(request);
    const row = validatePayload(body);

    if (!row) {
      sendJson(response, 400, { error: 'Invalid payload' });
      return;
    }

    const supabaseInsert = await insertOutboundClick({
      supabaseUrl,
      supabaseServiceRoleKey,
      row,
    });
    const supabaseResponse = supabaseInsert.response;

    if (!supabaseResponse.ok && supabaseResponse.status !== 409) {
      console.error('[Ikhtar outbound-click] Supabase insert failed', {
        status: supabaseResponse.status,
        body: supabaseInsert.errorText.slice(0, 500),
      });
      sendJson(response, 202, { ok: false });
      return;
    }

    if (supabaseInsert.schemaFallback) {
      console.warn('[Ikhtar outbound-click] Inserted without marketing_consent because database schema is not migrated yet');
    }

    sendJson(response, 202, { ok: true });
  } catch (error) {
    console.error('[Ikhtar outbound-click] Request failed', error);
    sendJson(response, 202, { ok: false });
  }
}
