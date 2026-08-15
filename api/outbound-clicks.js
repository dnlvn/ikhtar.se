const MAX_BODY_BYTES = 8192;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const CURRENT_SITE = 'ikhtar';
const CURRENT_VERTICAL = 'electricity';

const ALLOWED_PROVIDERS = new Set([
  'Skellefteå Kraft',
  'Skellefteå kraft',
  'Vattenfall',
  'Fortum',
  'Tibber',
  'Eon',
  'E.ON',
  'Telinet Energi',
  'Bixia',
  'Greenely',
  'Greenly',
  'HemSol',
  'Dalakraft',
  'Dala Kraft',
  'Enkla Elbolaget',
  'Göteborg Energi',
  'Cheap Energy',
  'Kärnfull Energi',
  'Karnfull Energi',
  'Motala Energi',
  'Stockholms Elbolag',
  'Svea Lands Elbolag',
  'Svealands Elbolag',
  'Svekraft',
]);

const ALLOWED_NETWORKS = new Set(['adtraction', 'addrevenue', 'direct', 'unknown']);
const ALLOWED_AGREEMENT_TYPES = new Set(['variable', 'fixed', 'hourly', 'quarterly', 'other']);
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

function optionalString(value, maxLength) {
  if (value === undefined || value === null) return null;
  return asString(value, maxLength);
}

function asInteger(value) {
  if (typeof value !== 'number' || !Number.isInteger(value)) return null;
  return value;
}

function validatePayload(body) {
  const clickId = asString(body.click_id, 64);
  const provider = asString(body.provider, 80);
  const affiliateNetwork = asString(body.affiliate_network, 32);
  const position = asInteger(body.position);
  const agreementType = asString(body.agreement_type, 32);
  const annualUsageKwh = asInteger(body.annual_usage_kwh);
  const estimatedMonthlyCost = asInteger(body.estimated_monthly_cost);
  const comparisonPriceOre =
    body.comparison_price_ore === undefined || body.comparison_price_ore === null
      ? null
      : asInteger(body.comparison_price_ore);
  const source = optionalString(body.source, 32);
  const campaign = optionalString(body.campaign, 120);

  if (!clickId || !UUID_PATTERN.test(clickId)) return null;
  if (!provider || !ALLOWED_PROVIDERS.has(provider)) return null;
  if (!affiliateNetwork || !ALLOWED_NETWORKS.has(affiliateNetwork)) return null;
  if (position === null || position <= 0 || position >= 100) return null;
  if (!agreementType || !ALLOWED_AGREEMENT_TYPES.has(agreementType)) return null;
  if (annualUsageKwh === null || annualUsageKwh <= 0 || annualUsageKwh >= 100000) return null;
  if (estimatedMonthlyCost === null || estimatedMonthlyCost < 0 || estimatedMonthlyCost >= 100000) return null;
  if (comparisonPriceOre !== null && (comparisonPriceOre < 0 || comparisonPriceOre >= 100000)) return null;
  if (source !== null && !ALLOWED_SOURCES.has(source)) return null;

  return {
    click_id: clickId,
    site: CURRENT_SITE,
    vertical: CURRENT_VERTICAL,
    provider,
    affiliate_network: affiliateNetwork,
    position,
    agreement_type: agreementType,
    annual_usage_kwh: annualUsageKwh,
    estimated_monthly_cost: estimatedMonthlyCost,
    comparison_price_ore: comparisonPriceOre,
    source,
    campaign,
    gclid: optionalString(body.gclid, 180),
    gbraid: optionalString(body.gbraid, 180),
    wbraid: optionalString(body.wbraid, 180),
    fbclid: optionalString(body.fbclid, 260),
    page_path: optionalString(body.page_path, 180),
    landing_page: optionalString(body.landing_page, 500),
    referrer: optionalString(body.referrer, 500),
  };
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
    console.error('[Ikhtar outbound-clicks] Missing Supabase environment variables');
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

    const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/outbound_clicks`, {
      method: 'POST',
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });

    if (!supabaseResponse.ok && supabaseResponse.status !== 409) {
      const text = await supabaseResponse.text();
      console.error('[Ikhtar outbound-clicks] Supabase insert failed', {
        status: supabaseResponse.status,
        body: text.slice(0, 500),
      });
      sendJson(response, 202, { ok: false });
      return;
    }

    sendJson(response, 202, { ok: true });
  } catch (error) {
    console.error('[Ikhtar outbound-clicks] Request failed', error);
    sendJson(response, 202, { ok: false });
  }
}
