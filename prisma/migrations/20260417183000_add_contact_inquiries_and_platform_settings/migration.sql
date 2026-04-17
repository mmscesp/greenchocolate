CREATE TYPE "ContactInquiryCategory" AS ENUM (
  'GENERAL_SUPPORT',
  'LISTING_CORRECTION',
  'CLUB_OPERATOR',
  'EDITORIAL',
  'PARTNERSHIP',
  'SAFETY_KIT'
);

CREATE TYPE "ContactInquiryStatus" AS ENUM (
  'NEW',
  'IN_PROGRESS',
  'RESOLVED',
  'SPAM'
);

CREATE TABLE "ContactInquiry" (
  "id" TEXT NOT NULL,
  "locale" TEXT,
  "source" TEXT,
  "category" "ContactInquiryCategory" NOT NULL,
  "status" "ContactInquiryStatus" NOT NULL DEFAULT 'NEW',
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "adminNotes" TEXT,
  "metadata" JSONB,
  "assignedAdminProfileId" TEXT,
  "resolvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContactInquiry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PlatformSetting" (
  "key" TEXT NOT NULL,
  "value" JSONB NOT NULL,
  "updatedBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PlatformSetting_pkey" PRIMARY KEY ("key")
);

CREATE INDEX "ContactInquiry_status_createdAt_idx" ON "ContactInquiry"("status", "createdAt");
CREATE INDEX "ContactInquiry_category_createdAt_idx" ON "ContactInquiry"("category", "createdAt");
CREATE INDEX "ContactInquiry_email_createdAt_idx" ON "ContactInquiry"("email", "createdAt");
CREATE INDEX "ContactInquiry_assignedAdminProfileId_status_idx" ON "ContactInquiry"("assignedAdminProfileId", "status");
CREATE INDEX "PlatformSetting_updatedAt_idx" ON "PlatformSetting"("updatedAt");

ALTER TABLE "ContactInquiry"
ADD CONSTRAINT "ContactInquiry_assignedAdminProfileId_fkey"
FOREIGN KEY ("assignedAdminProfileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "public"."ContactInquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."PlatformSetting" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin manage contact inquiries" ON "public"."ContactInquiry";
CREATE POLICY "Admin manage contact inquiries"
ON "public"."ContactInquiry"
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin manage platform settings" ON "public"."PlatformSetting";
CREATE POLICY "Admin manage platform settings"
ON "public"."PlatformSetting"
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
