-- Add SafetyPass table as source of truth for pass lifecycle

-- Create enums
CREATE TYPE "public"."SafetyPassTier" AS ENUM ('STANDARD', 'PREMIUM', 'ELITE');
CREATE TYPE "public"."SafetyPassStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'SUSPENDED');

-- Create table
CREATE TABLE "public"."SafetyPass" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "passNumber" TEXT NOT NULL,
    "tier" "public"."SafetyPassTier" NOT NULL,
    "status" "public"."SafetyPassStatus" NOT NULL DEFAULT 'ACTIVE',
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "renewedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SafetyPass_pkey" PRIMARY KEY ("id")
);

-- Constraints
CREATE UNIQUE INDEX "SafetyPass_userId_key" ON "public"."SafetyPass"("userId");
CREATE UNIQUE INDEX "SafetyPass_passNumber_key" ON "public"."SafetyPass"("passNumber");

-- Performance indexes
CREATE INDEX "SafetyPass_status_expiresAt_idx" ON "public"."SafetyPass"("status", "expiresAt");
CREATE INDEX "SafetyPass_userId_status_idx" ON "public"."SafetyPass"("userId", "status");

-- Relation
ALTER TABLE "public"."SafetyPass"
ADD CONSTRAINT "SafetyPass_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
