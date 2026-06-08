import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildAddressQuery,
  isBarcelonaCityDisplayName,
  isWithinBarcelonaBounds,
  normalizeCoordinate,
} from './club-coordinate-utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const previewPath = path.join(root, 'output', 'barcelona-clubs-import-preview.json');
const outputPath = path.join(root, 'output', 'barcelona-club-geocodes-review.json');
const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search';
const REQUEST_DELAY_MS = 1200;

const userAgent = process.env.NOMINATIM_USER_AGENT || 'SocialClubsMaps local coordinate repair (listings@socialclubsmaps.com)';

function parseArgs(argv) {
  const args = new Set(argv);
  const limitIndex = argv.indexOf('--limit');
  const limit = limitIndex >= 0 ? Number(argv[limitIndex + 1]) : null;

  return {
    force: args.has('--force'),
    limit: Number.isInteger(limit) && limit > 0 ? limit : null,
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadPreviewRows() {
  if (!fs.existsSync(previewPath)) {
    throw new Error('Missing output/barcelona-clubs-import-preview.json. Run npm run clubs:preview-import first.');
  }

  const preview = JSON.parse(fs.readFileSync(previewPath, 'utf8'));
  return Array.isArray(preview.selected) ? preview.selected : [];
}

function loadExistingResults() {
  if (!fs.existsSync(outputPath)) {
    return new Map();
  }

  const payload = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  const rows = Array.isArray(payload.results) ? payload.results : [];
  return new Map(rows.map((row) => [row.slug, row]));
}

function getCoordinateStatus(row, result) {
  if (!result) {
    return {
      coordinateStatus: 'failed',
      failureReason: 'no_result',
    };
  }

  const coordinate = normalizeCoordinate({
    lat: result.lat,
    lng: result.lon,
  });

  if (!coordinate) {
    return {
      coordinateStatus: 'failed',
      failureReason: 'invalid_coordinate',
    };
  }

  if (!isWithinBarcelonaBounds(coordinate)) {
    return {
      coordinateStatus: 'needs_review',
      failureReason: 'outside_barcelona_bounds',
      coordinate,
    };
  }

  const displayName = String(result.display_name || '');
  if (!isBarcelonaCityDisplayName(displayName)) {
    return {
      coordinateStatus: 'needs_review',
      failureReason: 'outside_barcelona_city',
      coordinate,
    };
  }

  const placeRank = Number(result.place_rank ?? 0);
  const isSpecificEnough = placeRank >= 30;

  return {
    coordinateStatus: isSpecificEnough ? 'accepted' : 'needs_review',
    failureReason: isSpecificEnough ? null : 'address_level_required',
    coordinate,
  };
}

async function geocodeRow(row) {
  const query = buildAddressQuery(row);
  if (!query) {
    return {
      slug: row.slug,
      name: row.name,
      addressDisplay: row.addressDisplay,
      query,
      coordinateStatus: 'failed',
      failureReason: 'missing_address',
      coordinateSource: 'nominatim_address',
      latitude: null,
      longitude: null,
    };
  }

  const url = new URL(NOMINATIM_ENDPOINT);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('q', query);
  url.searchParams.set('limit', '3');
  url.searchParams.set('countrycodes', 'es');
  url.searchParams.set('addressdetails', '1');

  const response = await fetch(url, {
    headers: {
      'Accept-Language': 'en',
      'User-Agent': userAgent,
    },
  });

  if (!response.ok) {
    return {
      slug: row.slug,
      name: row.name,
      addressDisplay: row.addressDisplay,
      query,
      coordinateStatus: 'failed',
      failureReason: `http_${response.status}`,
      coordinateSource: 'nominatim_address',
      latitude: null,
      longitude: null,
    };
  }

  const results = await response.json();
  const firstResult = Array.isArray(results) ? results[0] : null;
  const status = getCoordinateStatus(row, firstResult);

  return {
    slug: row.slug,
    name: row.name,
    addressDisplay: row.addressDisplay,
    query,
    coordinateStatus: status.coordinateStatus,
    failureReason: status.failureReason,
    coordinateSource: 'nominatim_address',
    latitude: status.coordinate?.lat ?? null,
    longitude: status.coordinate?.lng ?? null,
    displayName: firstResult?.display_name ?? null,
    placeRank: firstResult?.place_rank ?? null,
    category: firstResult?.category ?? null,
    type: firstResult?.type ?? null,
    osmType: firstResult?.osm_type ?? null,
    osmId: firstResult?.osm_id ?? null,
    alternatives: Array.isArray(results)
      ? results.slice(1).map((result) => ({
          latitude: Number(result.lat),
          longitude: Number(result.lon),
          displayName: result.display_name,
          placeRank: result.place_rank,
          category: result.category,
          type: result.type,
        }))
      : [],
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const previewRows = loadPreviewRows().filter((row) => row.readyForImport && row.status === 'UNVERIFIED');
  const existingBySlug = loadExistingResults();
  const results = [];
  let processed = 0;

  for (const row of previewRows) {
    if (options.limit && processed >= options.limit) {
      results.push(...previewRows.slice(processed).map((pendingRow) => existingBySlug.get(pendingRow.slug)).filter(Boolean));
      break;
    }

    const existing = existingBySlug.get(row.slug);
    if (existing && !options.force) {
      results.push(existing);
      processed += 1;
      continue;
    }

    const result = await geocodeRow(row);
    results.push(result);
    processed += 1;
    console.log(`${processed}/${previewRows.length} ${result.coordinateStatus}: ${row.name}`);
    await sleep(REQUEST_DELAY_MS);
  }

  const payload = {
    source: path.relative(root, previewPath),
    generatedAt: new Date().toISOString(),
    provider: 'nominatim.openstreetmap.org',
    policy: {
      mode: 'one-time cached address geocoding',
      requestDelayMs: REQUEST_DELAY_MS,
      frontendGeocoding: false,
    },
    totals: {
      rows: results.length,
      accepted: results.filter((row) => row.coordinateStatus === 'accepted').length,
      needsReview: results.filter((row) => row.coordinateStatus === 'needs_review').length,
      failed: results.filter((row) => row.coordinateStatus === 'failed').length,
    },
    results: results.sort((left, right) => left.name.localeCompare(right.name)),
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(payload.totals, null, 2));
  console.log(`Wrote ${path.relative(root, outputPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
