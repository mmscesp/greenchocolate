-- CreateEnum
CREATE TYPE "EmailSubscriptionStatus" AS ENUM ('SUBSCRIBED', 'UNSUBSCRIBED');

-- CreateTable
CREATE TABLE "EmailSubscription" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profileId" TEXT,
    "status" "EmailSubscriptionStatus" NOT NULL,
    "locale" TEXT,
    "source" TEXT,
    "marketingConsentAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),
    "lastMarketingEmailAt" TIMESTAMP(3),
    "lastTransactionalEmailAt" TIMESTAMP(3),
    "provider" TEXT,
    "providerContactId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderWebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "externalId" TEXT,
    "recipientEmail" TEXT,
    "signatureValid" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProviderWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailSubscription_email_key" ON "EmailSubscription"("email");

-- CreateIndex
CREATE INDEX "EmailSubscription_profileId_idx" ON "EmailSubscription"("profileId");

-- CreateIndex
CREATE INDEX "EmailSubscription_status_updatedAt_idx" ON "EmailSubscription"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "ProviderWebhookEvent_provider_eventType_createdAt_idx" ON "ProviderWebhookEvent"("provider", "eventType", "createdAt");

-- CreateIndex
CREATE INDEX "ProviderWebhookEvent_externalId_idx" ON "ProviderWebhookEvent"("externalId");

-- CreateIndex
CREATE INDEX "ProviderWebhookEvent_recipientEmail_createdAt_idx" ON "ProviderWebhookEvent"("recipientEmail", "createdAt");

-- AddForeignKey
ALTER TABLE "EmailSubscription" ADD CONSTRAINT "EmailSubscription_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
