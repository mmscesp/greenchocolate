CREATE TYPE "ClubVerificationStatus" AS ENUM (
  'UNVERIFIED',
  'PENDING_REVIEW',
  'SCM_VERIFIED',
  'FEATURED',
  'INACTIVE'
);

CREATE TYPE "ClubListingTier" AS ENUM (
  'STANDARD',
  'FEATURED'
);

CREATE TYPE "ClubTakedownReason" AS ENUM (
  'OPERATOR_REQUEST',
  'DATA_ISSUE',
  'DUPLICATE',
  'LEGAL_RISK',
  'QUALITY_HOLD'
);

CREATE TYPE "ClubPhotoSource" AS ENUM (
  'SCM_BRANDED',
  'CLUB_SUBMITTED',
  'LICENSED_STOCK',
  'EDITORIAL_GENERATED'
);

ALTER TABLE "Club"
  ADD COLUMN "district" TEXT,
  ADD COLUMN "verificationStatus" "ClubVerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
  ADD COLUMN "listingTier" "ClubListingTier" NOT NULL DEFAULT 'STANDARD',
  ADD COLUMN "takedownReason" "ClubTakedownReason",
  ADD COLUMN "takedownNotes" TEXT,
  ADD COLUMN "publicDataSource" TEXT,
  ADD COLUMN "publicDataReviewedAt" TIMESTAMP(3),
  ADD COLUMN "dataQualityScore" INTEGER,
  ADD COLUMN "googlePlaceId" TEXT,
  ADD COLUMN "googleMapsUrl" TEXT,
  ADD COLUMN "googleRatingSnapshot" DOUBLE PRECISION,
  ADD COLUMN "googleReviewCountSnapshot" INTEGER;

UPDATE "Club"
SET "verificationStatus" = CASE
  WHEN "isActive" = false THEN 'INACTIVE'::"ClubVerificationStatus"
  WHEN "slug" = 'club-311-barcelona' THEN 'SCM_VERIFIED'::"ClubVerificationStatus"
  ELSE 'UNVERIFIED'::"ClubVerificationStatus"
END;

UPDATE "Club"
SET "isVerified" = CASE
  WHEN "slug" = 'club-311-barcelona' THEN true
  ELSE false
END;

CREATE TABLE "ClubPhoto" (
  "id" TEXT NOT NULL,
  "clubId" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "r2Key" TEXT,
  "source" "ClubPhotoSource" NOT NULL,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "width" INTEGER,
  "height" INTEGER,
  "altText" TEXT NOT NULL,
  "isHero" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ClubPhoto_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ClubPhoto"
  ADD CONSTRAINT "ClubPhoto_clubId_fkey"
  FOREIGN KEY ("clubId") REFERENCES "Club"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "Club_googlePlaceId_key" ON "Club"("googlePlaceId");
CREATE INDEX "Club_district_idx" ON "Club"("district");
CREATE INDEX "Club_verificationStatus_isActive_idx" ON "Club"("verificationStatus", "isActive");
CREATE INDEX "Club_listingTier_isActive_idx" ON "Club"("listingTier", "isActive");
CREATE INDEX "ClubPhoto_clubId_displayOrder_idx" ON "ClubPhoto"("clubId", "displayOrder");
CREATE INDEX "ClubPhoto_clubId_isHero_idx" ON "ClubPhoto"("clubId", "isHero");
CREATE INDEX "ClubPhoto_source_idx" ON "ClubPhoto"("source");
