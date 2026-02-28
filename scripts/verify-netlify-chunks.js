#!/usr/bin/env node

const args = process.argv.slice(2);

function readArg(name, fallback) {
  const prefix = `--${name}=`;
  const hit = args.find((arg) => arg.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
}

const siteUrl = readArg('url', process.env.SITE_URL || 'https://socialclubsmaps.netlify.app').replace(/\/$/, '');
const route = readArg('route', process.env.SITE_ROUTE || '/en');

async function requestWithFallback(path) {
  const url = `${siteUrl}${path}`;
  let response = await fetch(url, {
    method: 'HEAD',
    headers: {
      'cache-control': 'no-cache',
      pragma: 'no-cache',
    },
  });

  if (response.status === 405 || response.status === 501) {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        'cache-control': 'no-cache',
        pragma: 'no-cache',
      },
    });
  }

  return response;
}

function extractChunkPaths(html) {
  const regex = /\/_next\/static\/chunks\/[A-Za-z0-9-]+\.js/g;
  return [...new Set(html.match(regex) || [])].sort();
}

(async () => {
  console.log(`Checking chunk integrity for ${siteUrl}${route}`);

  const pageRes = await fetch(`${siteUrl}${route}`, {
    headers: {
      'cache-control': 'no-cache',
      pragma: 'no-cache',
    },
  });

  if (!pageRes.ok) {
    console.error(`Page request failed: ${pageRes.status} ${pageRes.statusText}`);
    process.exit(1);
  }

  const html = await pageRes.text();
  const chunks = extractChunkPaths(html);

  if (chunks.length === 0) {
    console.error('No chunk references found in HTML.');
    process.exit(1);
  }

  const failures = [];

  for (const chunkPath of chunks) {
    const res = await requestWithFallback(chunkPath);
    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    const validMime = contentType.includes('javascript') || contentType.includes('ecmascript');

    if (!res.ok || !validMime) {
      failures.push({
        chunkPath,
        status: res.status,
        contentType: contentType || 'missing',
      });
    }
  }

  if (failures.length > 0) {
    console.error(`Chunk integrity failed: ${failures.length}/${chunks.length} chunks invalid.`);
    for (const failure of failures) {
      console.error(`- ${failure.chunkPath} -> ${failure.status} (${failure.contentType})`);
    }
    process.exit(1);
  }

  console.log(`Chunk integrity passed: ${chunks.length}/${chunks.length} chunks valid.`);
})();
