export default async function handler(request, response) {
  const { postNummer, forbrukning } = request.query;
  const cleanPostcode = String(postNummer || '').replace(/\D/g, '');
  const cleanUsage = String(forbrukning || '').replace(/\D/g, '');

  if (cleanPostcode.length !== 5 || !cleanUsage) {
    response.status(400).json({ error: 'Invalid postNummer or forbrukning' });
    return;
  }

  const params = new URLSearchParams({
    postNummer: cleanPostcode,
    forbrukning: cleanUsage,
  });

  try {
    const upstream = await fetch(
      `https://www1.ei.se/elinservices/api/json/SokAvtal?${params.toString()}`
    );
    const text = await upstream.text();

    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    response.setHeader(
      'Content-Type',
      upstream.headers.get('content-type') || 'application/json; charset=utf-8'
    );
    response.status(upstream.status).send(text);
  } catch (error) {
    response.status(502).json({ error: 'Could not fetch electricity offers' });
  }
}
