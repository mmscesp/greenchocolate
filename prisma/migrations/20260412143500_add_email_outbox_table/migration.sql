-- CreateEnum
CREATE TYPE "EmailProviderRoute" AS ENUM ('TRANSACTIONAL', 'MARKETING');

-- CreateEnum
CREATE TYPE "EmailOutboxStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'SKIPPED', 'FAILED');

-- CreateTable
CREATE TABLE "EmailOutbox" (
    "id" TEXT NOT NULL,
    "communicationEventId" TEXT,
    "audience" "CommunicationAudience" NOT NULL,
    "route" "EmailProviderRoute" NOT NULL,
    "status" "EmailOutboxStatus" NOT NULL,
    "relatedUserId" TEXT,
    "relatedRequestId" TEXT,
    "provider" TEXT,
    "idempotencyKey" TEXT,
    "payload" JSONB NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailOutbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailOutbox_communicationEventId_key" ON "EmailOutbox"("communicationEventId");

-- CreateIndex
CREATE INDEX "EmailOutbox_status_availableAt_createdAt_idx" ON "EmailOutbox"("status", "availableAt", "createdAt");

-- CreateIndex
CREATE INDEX "EmailOutbox_relatedUserId_createdAt_idx" ON "EmailOutbox"("relatedUserId", "createdAt");

-- CreateIndex
CREATE INDEX "EmailOutbox_relatedRequestId_createdAt_idx" ON "EmailOutbox"("relatedRequestId", "createdAt");

-- CreateIndex
CREATE INDEX "EmailOutbox_audience_route_createdAt_idx" ON "EmailOutbox"("audience", "route", "createdAt");

-- AddForeignKey
ALTER TABLE "EmailOutbox" ADD CONSTRAINT "EmailOutbox_communicationEventId_fkey" FOREIGN KEY ("communicationEventId") REFERENCES "CommunicationEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailOutbox" ADD CONSTRAINT "EmailOutbox_relatedUserId_fkey" FOREIGN KEY ("relatedUserId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
