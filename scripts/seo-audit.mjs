const baseUrl = process.env.SEO_AUDIT_BASE_URL || 'http://localhost:3000';

const routes = [
  '/en',
  '/en/safety-kit',
  '/en/verification',
  '/en/editorial',
  '/en/editorial/legal',
  '/en/editorial/spain-cannabis-laws-tourists',
  '/en/spain',
  '/en/spain/barcelona',
  '/en/spain/barcelona/clubs',
  '/en/events',
  '/en/spain/madrid',
  '/en/spain/madrid/clubs',
];

function fail(message) {
  console.error(`SEO AUDIT FAIL: ${message}`);
  process.exitCode = 1;
}

function extractAll(pattern, html) {
  return Array.from(html.matchAll(pattern)).map((match) => match[1]);
}

for (const route of routes) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: 'manual' });
  const html = await response.text();

  if (response.status >= 500) {
    fail(`${route} returned ${response.status}`);
    continue;
  }

  if (!route.includes('/events') && !route.includes('/madrid') && response.status === 200) {
    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1];
    if (!canonical) {
      fail(`${route} is missing canonical`);
    }
  }

  const htmlLang = html.match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1];
  const expectedLang = route.split('/')[1];
  if (response.status === 200 && htmlLang !== expectedLang) {
    fail(`${route} has html lang ${htmlLang}, expected ${expectedLang}`);
  }

  const robots = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i)?.[1] || '';
  if ((route.includes('/events') || route.includes('/madrid')) && !robots.includes('noindex')) {
    fail(`${route} should be noindex`);
  }

  const jsonLdBlocks = extractAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi, html);
  for (const block of jsonLdBlocks) {
    try {
      JSON.parse(block);
    } catch {
      fail(`${route} contains invalid JSON-LD`);
    }
  }
}

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
const sitemap = await sitemapResponse.text();
const sitemapPaths = Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g), ([, loc]) => {
  try {
    return new URL(loc).pathname;
  } catch {
    return loc;
  }
});

for (const forbidden of ['/en/events', '/en/spain/madrid', '/en/clubs']) {
  if (sitemapPaths.includes(forbidden)) {
    fail(`sitemap contains forbidden URL ${forbidden}`);
  }
}

for (const required of ['/en/safety-kit', '/en/verification', '/en/spain/barcelona', '/en/spain/barcelona/clubs']) {
  if (!sitemapPaths.includes(required)) {
    fail(`sitemap is missing required URL ${required}`);
  }
}

if (!process.exitCode) {
  console.log('SEO AUDIT PASS');
}
