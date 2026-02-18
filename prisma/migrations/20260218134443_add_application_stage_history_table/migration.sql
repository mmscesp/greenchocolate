-- AddApplicationStageHistoryTable
-- Migration-safe: additive only, no breaking changes

-- Create ApplicationStageHistory table for canonical stage audit trail
CREATE TABLE "ApplicationStageHistory" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "fromStage" TEXT,
    "toStage" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationStageHistory_pkey" PRIMARY KEY ("id")
);

-- Create indexes for query performance
CREATE INDEX "ApplicationStageHistory_applicationId_createdAt_idx" ON "ApplicationStageHistory"("applicationId", "createdAt");
CREATE INDEX "ApplicationStageHistory_changedBy_idx" ON "ApplicationStageHistory"("changedBy");

-- Add foreign key constraint
ALTER TABLE "ApplicationStageHistory" ADD CONSTRAINT "ApplicationStageHistory_applicationId_fkey" 
    FOREIGN KEY ("applicationId") REFERENCES "MembershipRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
