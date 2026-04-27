import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const previewPath = path.join(root, 'output', 'barcelona-clubs-import-preview.json');

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

loadEnvFile('.env');
loadEnvFile('.env.local');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required to import Barcelona clubs.');
}

if (!fs.existsSync(previewPath)) {
  throw new Error('Missing output/barcelona-clubs-import-preview.json. Run npm run clubs:preview-import first.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL })),
});

const fallbackCoordinates = {
  lat: 41.3874,
  lng: 2.1686,
};

const publicListingOpeningHours = {
  note: 'Opening hours have not been verified by SCM.',
};

function buildSocialMedia(row) {
  if (!row.instagram) {
    return null;
  }

  return {
    instagram: row.instagram,
  };
}

function buildClubPayload(row, cityId) {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    shortDescription: row.shortDescription,
    cityId,
    neighborhood: row.neighborhood,
    district: row.district,
    addressDisplay: row.addressDisplay,
    coordinates: fallbackCoordinates,
    contactEmail: 'listings@socialclubsmaps.com',
    phoneNumber: null,
    website: row.website,
    socialMedia: buildSocialMedia(row),
    verificationStatus: 'UNVERIFIED',
    listingTier: row.listingTier ?? 'STANDARD',
    takedownReason: null,
    takedownNotes: null,
    publicDataSource: row.publicDataSource,
    publicDataReviewedAt: row.publicDataReviewedAt ? new Date(row.publicDataReviewedAt) : new Date(),
    dataQualityScore: row.dataQualityScore,
    googlePlaceId: row.googlePlaceId || null,
    googleMapsUrl: row.googleMapsUrl || null,
    googleRatingSnapshot: row.googleRatingSnapshot,
    googleReviewCountSnapshot: row.googleReviewCountSnapshot,
    isVerified: false,
    isActive: true,
    allowsPreRegistration: false,
    openingHours: publicListingOpeningHours,
    amenities: [],
    vibeTags: ['public listing', 'unverified'],
    priceRange: 'Not verified',
    capacity: 1,
    foundedYear: 2026,
    images: [],
    logoUrl: null,
    coverImageUrl: null,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
  };
}

async function main() {
  const preview = JSON.parse(fs.readFileSync(previewPath, 'utf8'));
  const selectedRows = Array.isArray(preview.selected) ? preview.selected : [];
  if (selectedRows.length === 0) {
    throw new Error('Preview file does not contain selected rows to import.');
  }

  const city = await prisma.city.findUnique({
    where: { slug: 'barcelona' },
    select: { id: true, name: true },
  });

  if (!city) {
    throw new Error('Barcelona city row is missing. Seed or create the Barcelona city before importing clubs.');
  }

  const result = {
    created: 0,
    updated: 0,
    skippedVerified: 0,
  };

  for (const row of selectedRows) {
    if (!row.readyForImport || row.status !== 'UNVERIFIED') {
      continue;
    }

    const existing = await prisma.club.findUnique({
      where: { slug: row.slug },
      select: { id: true, verificationStatus: true },
    });

    if (existing?.verificationStatus === 'SCM_VERIFIED' || existing?.verificationStatus === 'FEATURED') {
      result.skippedVerified += 1;
      continue;
    }

    const payload = buildClubPayload(row, city.id);
    await prisma.club.upsert({
      where: { slug: row.slug },
      create: payload,
      update: payload,
    });

    if (existing) {
      result.updated += 1;
    } else {
      result.created += 1;
    }
  }

  const totalBarcelonaClubs = await prisma.club.count({
    where: {
      cityId: city.id,
      isActive: true,
      verificationStatus: { not: 'INACTIVE' },
    },
  });

  const verifiedBarcelonaClubs = await prisma.club.count({
    where: {
      cityId: city.id,
      isActive: true,
      verificationStatus: { in: ['SCM_VERIFIED', 'FEATURED'] },
    },
  });

  console.log(JSON.stringify({
    ...result,
    selectedRows: selectedRows.length,
    totalBarcelonaClubs,
    verifiedBarcelonaClubs,
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
