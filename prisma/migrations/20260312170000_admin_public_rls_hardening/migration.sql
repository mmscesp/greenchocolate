-- Harden public-schema tables that were created without RLS and fix mutable search_path on
-- the role-immutability trigger function. The application uses Prisma on the server for writes,
-- so public API policies stay intentionally narrow.

CREATE OR REPLACE FUNCTION "public"."prevent_profile_role_change"()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW."role" IS DISTINCT FROM OLD."role"
     AND COALESCE(current_setting('app.allow_role_change', true), 'off') <> 'on' THEN
    RAISE EXCEPTION 'Profile role is immutable';
  END IF;

  RETURN NEW;
END;
$$;

ALTER TABLE "public"."Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."SafetyPass" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."MembershipRequestNote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ClubRegistrationRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."MembershipApplicationLead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."MembershipApplicationAttempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."_prisma_migrations" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin manage bookings" ON "public"."Booking";
DROP POLICY IF EXISTS "Users view own bookings" ON "public"."Booking";
CREATE POLICY "Admin manage bookings"
ON "public"."Booking"
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
CREATE POLICY "Users view own bookings"
ON "public"."Booking"
FOR SELECT
TO authenticated
USING ("userId" = public.current_profile_id());

DROP POLICY IF EXISTS "Admin manage safety passes" ON "public"."SafetyPass";
DROP POLICY IF EXISTS "Users view own safety pass" ON "public"."SafetyPass";
CREATE POLICY "Admin manage safety passes"
ON "public"."SafetyPass"
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
CREATE POLICY "Users view own safety pass"
ON "public"."SafetyPass"
FOR SELECT
TO authenticated
USING ("userId" = public.current_profile_id());

DROP POLICY IF EXISTS "Admin manage membership request notes" ON "public"."MembershipRequestNote";
DROP POLICY IF EXISTS "Membership request notes read access" ON "public"."MembershipRequestNote";
CREATE POLICY "Admin manage membership request notes"
ON "public"."MembershipRequestNote"
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
CREATE POLICY "Membership request notes read access"
ON "public"."MembershipRequestNote"
FOR SELECT
TO authenticated
USING (
  public.is_admin()
  OR EXISTS (
    SELECT 1
    FROM "public"."MembershipRequest" mr
    WHERE mr."id" = "MembershipRequestNote"."requestId"
      AND mr."userId" = public.current_profile_id()
  )
  OR EXISTS (
    SELECT 1
    FROM "public"."MembershipRequest" mr
    JOIN "public"."Profile" cp
      ON cp."managedClubId" = mr."clubId"
    WHERE mr."id" = "MembershipRequestNote"."requestId"
      AND cp."authId" = public.current_auth_id()
      AND cp."role" = 'CLUB_ADMIN'::"public"."UserRole"
  )
);

DROP POLICY IF EXISTS "Admin manage club registration requests" ON "public"."ClubRegistrationRequest";
DROP POLICY IF EXISTS "Users view own club registration requests" ON "public"."ClubRegistrationRequest";
CREATE POLICY "Admin manage club registration requests"
ON "public"."ClubRegistrationRequest"
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
CREATE POLICY "Users view own club registration requests"
ON "public"."ClubRegistrationRequest"
FOR SELECT
TO authenticated
USING ("profileId" = public.current_profile_id());

DROP POLICY IF EXISTS "Admin manage membership application leads" ON "public"."MembershipApplicationLead";
CREATE POLICY "Admin manage membership application leads"
ON "public"."MembershipApplicationLead"
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin manage membership application attempts" ON "public"."MembershipApplicationAttempt";
CREATE POLICY "Admin manage membership application attempts"
ON "public"."MembershipApplicationAttempt"
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
