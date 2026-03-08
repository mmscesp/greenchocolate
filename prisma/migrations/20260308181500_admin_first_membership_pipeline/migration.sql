-- Admin-first membership pipeline
-- 1. Add canonical current stage to membership requests
-- 2. Add admin note storage
-- 3. Separate club registration from membership requests

ALTER TABLE "MembershipRequest"
ADD COLUMN "currentStage" TEXT NOT NULL DEFAULT 'INTAKE';

UPDATE "MembershipRequest"
SET "currentStage" = CASE
  WHEN "status" = 'APPROVED' THEN 'FINAL_APPROVAL'
  WHEN "status" = 'REJECTED' THEN 'DOCUMENT_VERIFICATION'
  WHEN "status" = 'SCHEDULED' THEN 'BACKGROUND_CHECK'
  ELSE 'INTAKE'
END;

CREATE INDEX "MembershipRequest_clubId_currentStage_idx" ON "MembershipRequest"("clubId", "currentStage");

CREATE TABLE "MembershipRequestNote" (
  "id" TEXT NOT NULL,
  "requestId" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "MembershipRequestNote_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MembershipRequestNote_requestId_createdAt_idx" ON "MembershipRequestNote"("requestId", "createdAt");
CREATE INDEX "MembershipRequestNote_authorId_createdAt_idx" ON "MembershipRequestNote"("authorId", "createdAt");

ALTER TABLE "MembershipRequestNote"
ADD CONSTRAINT "MembershipRequestNote_requestId_fkey"
FOREIGN KEY ("requestId") REFERENCES "MembershipRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MembershipRequestNote"
ADD CONSTRAINT "MembershipRequestNote_authorId_fkey"
FOREIGN KEY ("authorId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ClubRegistrationRequest" (
  "id" TEXT NOT NULL,
  "profileId" TEXT NOT NULL,
  "clubId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "encryptedPayload" TEXT NOT NULL,
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  "reviewedBy" TEXT,
  "notes" TEXT,

  CONSTRAINT "ClubRegistrationRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ClubRegistrationRequest_profileId_clubId_key" ON "ClubRegistrationRequest"("profileId", "clubId");
CREATE INDEX "ClubRegistrationRequest_status_submittedAt_idx" ON "ClubRegistrationRequest"("status", "submittedAt");
CREATE INDEX "ClubRegistrationRequest_clubId_status_idx" ON "ClubRegistrationRequest"("clubId", "status");

ALTER TABLE "ClubRegistrationRequest"
ADD CONSTRAINT "ClubRegistrationRequest_profileId_fkey"
FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ClubRegistrationRequest"
ADD CONSTRAINT "ClubRegistrationRequest_clubId_fkey"
FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
