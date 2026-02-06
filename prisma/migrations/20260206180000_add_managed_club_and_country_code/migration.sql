-- Add managedClubId field to Profile for CLUB_ADMIN authorization scope
ALTER TABLE "public"."Profile" ADD COLUMN "managedClubId" TEXT;

-- Add foreign key constraint
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_managedClubId_fkey" 
FOREIGN KEY ("managedClubId") REFERENCES "public"."Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add countryCode field to City
ALTER TABLE "public"."City" ADD COLUMN "countryCode" TEXT NOT NULL DEFAULT 'ES';

-- Add index for managedClubId for performance
CREATE INDEX "Profile_managedClubId_idx" ON "public"."Profile"("managedClubId");
