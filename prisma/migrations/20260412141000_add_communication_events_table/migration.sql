-- CreateEnum
CREATE TYPE "CommunicationChannel" AS ENUM ('EMAIL', 'IN_APP');

-- CreateEnum
CREATE TYPE "CommunicationAudience" AS ENUM ('TRANSACTIONAL', 'MARKETING');

-- CreateEnum
CREATE TYPE "CommunicationStatus" AS ENUM ('PENDING', 'SENT', 'SKIPPED', 'FAILED');

-- CreateTable
CREATE TABLE "CommunicationEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "channel" "CommunicationChannel" NOT NULL,
    "audience" "CommunicationAudience" NOT NULL,
    "provider" TEXT,
    "status" "CommunicationStatus" NOT NULL,
    "relatedUserId" TEXT,
    "relatedRequestId" TEXT,
    "idempotencyKey" TEXT,
    "locale" TEXT,
    "subject" TEXT,
    "recipientEmail" TEXT,
    "payload" JSONB,
    "errorMessage" TEXT,
    "sentAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunicationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunicationEvent_type_createdAt_idx" ON "CommunicationEvent"("type", "createdAt");

-- CreateIndex
CREATE INDEX "CommunicationEvent_status_createdAt_idx" ON "CommunicationEvent"("status", "createdAt");

-- CreateIndex
CREATE INDEX "CommunicationEvent_relatedUserId_createdAt_idx" ON "CommunicationEvent"("relatedUserId", "createdAt");

-- CreateIndex
CREATE INDEX "CommunicationEvent_relatedRequestId_createdAt_idx" ON "CommunicationEvent"("relatedRequestId", "createdAt");

-- CreateIndex
CREATE INDEX "CommunicationEvent_audience_channel_createdAt_idx" ON "CommunicationEvent"("audience", "channel", "createdAt");

-- CreateIndex
CREATE INDEX "CommunicationEvent_recipientEmail_createdAt_idx" ON "CommunicationEvent"("recipientEmail", "createdAt");

-- AddForeignKey
ALTER TABLE "CommunicationEvent" ADD CONSTRAINT "CommunicationEvent_relatedUserId_fkey" FOREIGN KEY ("relatedUserId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
