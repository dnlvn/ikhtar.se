import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';

const distDir = join(process.cwd(), 'dist');
const vercelConfig = JSON.parse(await readFile('vercel.json', 'utf8'));
const rewrites = vercelConfig.rewrites.map(({ source, destination }) => ({
  pattern: new RegExp(`^${source}$`),
  destination,
}));

assert.deepEqual(vercelConfig.rewrites[0], {
  source: '/elavtal',
  destination: '/elavtal.html',
});
assert.deepEqual(vercelConfig.rewrites.at(-1), {
  source: '/(.*)',
  destination: '/',
});

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

async function readStaticFile(filePath) {
  try {
    const info = await stat(filePath);
    return info.isFile() ? await readFile(filePath) : null;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return null;
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://127.0.0.1');

  // Model Vercel's static file lookup and ordered same-app rewrites.
  const rewrite = rewrites.find(({ pattern }) => pattern.test(url.pathname));
  for (const path of [url.pathname, rewrite?.destination].filter(Boolean)) {
    const filePath = join(distDir, path === '/' ? 'index.html' : path);
    const content = await readStaticFile(filePath);
    if (!content) continue;
    response.writeHead(200, {
      'content-type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
    }).end(content);
    return;
  }
  response.writeHead(404).end('Not found');
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
assert(address && typeof address === 'object');
const baseUrl = `http://127.0.0.1:${address.port}`;

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map((match) => [match[1], match[2]])
  );
}

function metaTags(html, key, value) {
  return [...html.matchAll(/<meta\b[^>]*>/g)]
    .map((match) => ({ tag: match[0], attributes: attributes(match[0]) }))
    .filter((entry) => entry.attributes[key] === value);
}

function canonicalTags(html) {
  return [...html.matchAll(/<link\b[^>]*>/g)]
    .map((match) => ({ tag: match[0], attributes: attributes(match[0]) }))
    .filter((entry) => entry.attributes.rel === 'canonical');
}

function moduleScriptPath(html) {
  const scripts = [...html.matchAll(/<script\b[^>]*>/g)]
    .map((match) => attributes(match[0]))
    .filter((entry) => entry.type === 'module' && entry.src);
  assert.equal(scripts.length, 1, 'expected exactly one module entry script');
  return scripts[0].src;
}

const expectedElectricity = {
  title: 'قارن عقود الكهرباء في السويد | Ikhtar',
  description: 'أدخل رمزك البريدي واستهلاكك لتقارن الأسعار والشروط لدى مجموعة مختارة من شركات الكهرباء.',
  canonical: 'https://ikhtar.se/elavtal',
  openGraph: {
    'og:type': 'website',
    'og:locale': 'ar_AR',
    'og:site_name': 'Ikhtar',
    'og:title': 'قارن عقود الكهرباء في السويد | Ikhtar',
    'og:description': 'أدخل رمزك البريدي واستهلاكك لتقارن الأسعار والشروط لدى مجموعة مختارة من شركات الكهرباء.',
    'og:url': 'https://ikhtar.se/elavtal',
    'og:image': 'https://ikhtar.se/og/electricity-contracts-ar.png',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': 'مقارنة عقود الكهرباء في السويد',
  },
};

function assertElectricityMetadata(html) {
  const titles = [...html.matchAll(/<title\b[^>]*>(.*?)<\/title>/gs)];
  assert.equal(titles.length, 1, 'expected exactly one title');
  assert.equal(titles[0][1], expectedElectricity.title);

  const descriptions = metaTags(html, 'name', 'description');
  assert.equal(descriptions.length, 1, 'expected exactly one meta description');
  assert.equal(descriptions[0].attributes.content, expectedElectricity.description);

  const canonicals = canonicalTags(html);
  assert.equal(canonicals.length, 1, 'expected exactly one canonical link');
  assert.equal(canonicals[0].attributes.href, expectedElectricity.canonical);

  for (const [property, content] of Object.entries(expectedElectricity.openGraph)) {
    const tags = metaTags(html, 'property', property);
    assert.equal(tags.length, 1, `expected exactly one ${property} tag`);
    assert.equal(tags[0].attributes.content, content);
  }
  const openGraphTags = [...html.matchAll(/<meta\b[^>]*>/g)]
    .map(([tag]) => attributes(tag))
    .filter(({ property }) => property?.startsWith('og:'));
  assert.equal(openGraphTags.length, Object.keys(expectedElectricity.openGraph).length);
}

try {
  for (const path of ['/elavtal', '/elavtal?utm_source=meta']) {
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assertElectricityMetadata(html);

    const entryResponse = await fetch(`${baseUrl}${moduleScriptPath(html)}`);
    assert.equal(entryResponse.status, 200, `entry script must load for ${path}`);
  }

  const reloadResponse = await fetch(`${baseUrl}/elavtal`, { cache: 'reload' });
  assert.equal(reloadResponse.status, 200, 'direct reload must return the electricity entry HTML');
  assertElectricityMetadata(await reloadResponse.text());

  const mobileResponse = await fetch(`${baseUrl}/mobilabonnemang`);
  assert.equal(mobileResponse.status, 200);
  const mobileHtml = await mobileResponse.text();
  assert.match(
    mobileHtml,
    /<title>قارن باقات الجوال في السويد – اعثر على أرخص اشتراك \| Ikhtar<\/title>/
  );
  assert.equal(metaTags(mobileHtml, 'property', 'og:url')[0]?.attributes.content, 'https://ikhtar.se/mobilabonnemang');
  assert.equal(metaTags(mobileHtml, 'property', 'og:image')[0]?.attributes.content, 'https://ikhtar.se/og/og-mobile-plans-ar.png');

  const imageUrl = new URL(expectedElectricity.openGraph['og:image']);
  const imageResponse = await fetch(new URL(imageUrl.pathname, baseUrl));
  assert.equal(imageResponse.status, 200);
  assert.match(imageResponse.headers.get('content-type') ?? '', /^image\/png/);
  const image = Buffer.from(await imageResponse.arrayBuffer());
  assert.deepEqual([...image.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);

  console.log('static social metadata checks passed');
} finally {
  server.close();
}
