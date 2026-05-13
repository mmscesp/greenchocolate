CREATE TABLE "CookieConsentAudit" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "policyVersion" TEXT NOT NULL,
    "necessary" BOOLEAN NOT NULL DEFAULT true,
    "functional" BOOLEAN NOT NULL DEFAULT false,
    "measurement" BOOLEAN NOT NULL DEFAULT false,
    "marketing" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "countryCode" TEXT,
    "userAgentHash" TEXT,
    "ipHash" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CookieConsentAudit_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CookieConsentAudit_subjectId_createdAt_idx" ON "CookieConsentAudit"("subjectId", "createdAt");
CREATE INDEX "CookieConsentAudit_policyVersion_createdAt_idx" ON "CookieConsentAudit"("policyVersion", "createdAt");
CREATE INDEX "CookieConsentAudit_createdAt_idx" ON "CookieConsentAudit"("createdAt");
