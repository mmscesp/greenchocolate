-- Enterprise-grade hardening for membership applications
-- 1. Add encrypted payload and metadata to membership requests
-- 2. Add guest lead capture table
-- 3. Add durable attempt tracking for anti-abuse decisions

ALTER TABLE "MembershipRequest"
ADD COLUMN "encryptedPayload" TEXT,
ADD COLUMN "snapshotMeta" JSONB;

CREATE TABLE "MembershipApplicationLead" (
  "id" TEXT NOT NULL,
  "clubId" TEXT NOT NULL,
  "encryptedPayload" TEXT NOT NULL,
  "payloadMeta" JSONB,
  "payloadHash" TEXT NOT NULL,
  "emailHash" TEXT NOT NULL,
  "fingerprintHash" TEXT NOT NULL,
  "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
  "challengeStatus" TEXT NOT NULL DEFAULT 'NOT_REQUIRED',
  "challengeRequired" BOOLEAN NOT NULL DEFAULT false,
  "countryCode" TEXT,
  "experience" TEXT,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "consumedAt" TIMESTAMP(3),
  "verifiedAt" TIMESTAMP(3),
  "consumedByProfileId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "MembershipApplicationLead_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MembershipApplicationLead_clubId_createdAt_idx" ON "MembershipApplicationLead"("clubId", "createdAt");
CREATE INDEX "MembershipApplicationLead_emailHash_createdAt_idx" ON "MembershipApplicationLead"("emailHash", "createdAt");
CREATE INDEX "MembershipApplicationLead_fingerprintHash_createdAt_idx" ON "MembershipApplicationLead"("fingerprintHash", "createdAt");
CREATE INDEX "MembershipApplicationLead_payloadHash_idx" ON "MembershipApplicationLead"("payloadHash");
CREATE INDEX "MembershipApplicationLead_expiresAt_idx" ON "MembershipApplicationLead"("expiresAt");
CREATE INDEX "MembershipApplicationLead_consumedByProfileId_idx" ON "MembershipApplicationLead"("consumedByProfileId");

ALTER TABLE "MembershipApplicationLead"
ADD CONSTRAINT "MembershipApplicationLead_clubId_fkey"
FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MembershipApplicationLead"
ADD CONSTRAINT "MembershipApplicationLead_consumedByProfileId_fkey"
FOREIGN KEY ("consumedByProfileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "MembershipApplicationAttempt" (
  "id" TEXT NOT NULL,
  "clubId" TEXT NOT NULL,
  "profileId" TEXT,
  "leadId" TEXT,
  "subjectType" TEXT NOT NULL,
  "emailHash" TEXT,
  "fingerprintHash" TEXT,
  "payloadHash" TEXT,
  "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
  "decision" TEXT NOT NULL,
  "challengeStatus" TEXT NOT NULL DEFAULT 'NOT_REQUIRED',
  "countryCode" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "MembershipApplicationAttempt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MembershipApplicationAttempt_clubId_createdAt_idx" ON "MembershipApplicationAttempt"("clubId", "createdAt");
CREATE INDEX "MembershipApplicationAttempt_profileId_createdAt_idx" ON "MembershipApplicationAttempt"("profileId", "createdAt");
CREATE INDEX "MembershipApplicationAttempt_leadId_createdAt_idx" ON "MembershipApplicationAttempt"("leadId", "createdAt");
CREATE INDEX "MembershipApplicationAttempt_emailHash_createdAt_idx" ON "MembershipApplicationAttempt"("emailHash", "createdAt");
CREATE INDEX "MembershipApplicationAttempt_fingerprintHash_createdAt_idx" ON "MembershipApplicationAttempt"("fingerprintHash", "createdAt");
CREATE INDEX "MembershipApplicationAttempt_payloadHash_createdAt_idx" ON "MembershipApplicationAttempt"("payloadHash", "createdAt");

ALTER TABLE "MembershipApplicationAttempt"
ADD CONSTRAINT "MembershipApplicationAttempt_clubId_fkey"
FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MembershipApplicationAttempt"
ADD CONSTRAINT "MembershipApplicationAttempt_profileId_fkey"
FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "MembershipApplicationAttempt"
ADD CONSTRAINT "MembershipApplicationAttempt_leadId_fkey"
FOREIGN KEY ("leadId") REFERENCES "MembershipApplicationLead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
