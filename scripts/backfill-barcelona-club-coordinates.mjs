import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import {
  getReviewedCoordinateFromRow,
  isKnownBarcelonaFallbackCoordinate,
} from './club-coordinate-utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const reviewPath = path.join(root, 'output', 'barcelona-club-geocodes-review.json');

function loadEnvFile(fileName) {
  const envPath = path.join(root, fileName);
  if (!fs.existsSync(envPath)) {
    return;
  }

  for (const rawLine of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const equalsIndex = line.indexOf('=');
    if (equalsIndex === -1) {
      continue;
    }

    const key = line.slice(0, equalsIndex).trim();
    const value = line.slice(equalsIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

function parseArgs(argv) {
  const args = new Set(argv);
  return {
    apply: args.has('--apply'),
  };
}

function loadAcceptedReviewRows() {
  if (!fs.existsSync(reviewPath)) {
    throw new Error('Missing output/barcelona-club-geocodes-review.json. Run npm run clubs:geocode-barcelona first.');
  }

  const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
  const rows = Array.isArray(review.results) ? review.results : [];

  return rows
    .map((row) => ({
      ...row,
      coordinateReviewedAt: review.generatedAt,
      coordinate: getReviewedCoordinateFromRow(row),
    }))
    .filter((row) => row.coordinate !== null);
}

loadEnvFile('.env');
loadEnvFile('.env.local');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required to backfill Barcelona club coordinates.');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const acceptedRows = loadAcceptedReviewRows();
  const result = {
    mode: options.apply ? 'apply' : 'dry-run',
    acceptedReviewRows: acceptedRows.length,
    plannedUpdates: 0,
    plannedFallbackClears: 0,
    plannedDeactivations: 0,
    updated: 0,
    clearedFallbacks: 0,
    deactivated: 0,
    skippedMissingClub: 0,
    skippedProtectedStatus: 0,
    skippedAlreadySame: 0,
    skippedUnsafeFallback: 0,
  };
  const acceptedSlugs = new Set(acceptedRows.map((row) => row.slug));

  for (const row of acceptedRows) {
    const club = await prisma.club.findUnique({
      where: { slug: row.slug },
      select: {
        id: true,
        slug: true,
        name: true,
        verificationStatus: true,
        isVerified: true,
        coordinates: true,
        city: { select: { slug: true } },
      },
    });

    if (!club || club.city.slug !== 'barcelona') {
      result.skippedMissingClub += 1;
      continue;
    }

    if (club.verificationStatus === 'SCM_VERIFIED' || club.verificationStatus === 'FEATURED') {
      result.skippedProtectedStatus += 1;
      continue;
    }

    if (isKnownBarcelonaFallbackCoordinate(row.coordinate) && row.coordinateSource !== 'manual_review') {
      result.skippedUnsafeFallback += 1;
      continue;
    }

    const current = club.coordinates;
    if (
      current &&
      typeof current === 'object' &&
      Number(current.lat) === row.coordinate.lat &&
      Number(current.lng) === row.coordinate.lng
    ) {
      result.skippedAlreadySame += 1;
      continue;
    }

    result.plannedUpdates += 1;
    console.log(`${options.apply ? 'UPDATE' : 'PLAN'} ${club.slug}: ${JSON.stringify(current)} -> ${JSON.stringify(row.coordinate)}`);

    if (options.apply) {
      await prisma.club.update({
        where: { id: club.id },
        data: {
          coordinates: {
            ...row.coordinate,
            source: row.coordinateSource,
            reviewedAt: row.coordinateReviewedAt ?? new Date().toISOString(),
          },
          publicDataReviewedAt: new Date(),
        },
      });
      result.updated += 1;
    }
  }

  const publicBarcelonaClubs = await prisma.club.findMany({
    where: {
      city: { slug: 'barcelona' },
      isActive: true,
      verificationStatus: { notIn: ['SCM_VERIFIED', 'FEATURED'] },
    },
    select: {
      id: true,
      slug: true,
      coordinates: true,
    },
  });

  for (const club of publicBarcelonaClubs) {
    if (acceptedSlugs.has(club.slug)) {
      continue;
    }

    result.plannedDeactivations += 1;
    console.log(`${options.apply ? 'DEACTIVATE' : 'PLAN_DEACTIVATE'} ${club.slug}: no accepted reviewed address-level coordinate`);

    if (options.apply) {
      await prisma.club.update({
        where: { id: club.id },
        data: {
          isActive: false,
          verificationStatus: 'INACTIVE',
          takedownReason: 'QUALITY_HOLD',
          takedownNotes: 'Held from public Barcelona directory: no accepted reviewed address-level map coordinate.',
          coordinates: {},
        },
      });
      result.deactivated += 1;
    }
  }

  for (const club of publicBarcelonaClubs) {
    if (!acceptedSlugs.has(club.slug) || !isKnownBarcelonaFallbackCoordinate(club.coordinates)) {
      continue;
    }

    result.plannedFallbackClears += 1;
    console.log(`${options.apply ? 'CLEAR' : 'PLAN_CLEAR'} ${club.slug}: ${JSON.stringify(club.coordinates)} -> {}`);

    if (options.apply) {
      await prisma.club.update({
        where: { id: club.id },
        data: {
          coordinates: {},
        },
      });
      result.clearedFallbacks += 1;
    }
  }

  console.log(JSON.stringify(result, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
