-- Keep Prisma's bookkeeping table inaccessible through the Data API while satisfying the
-- RLS policy requirement for exposed public-schema objects.

DROP POLICY IF EXISTS "No api access to prisma migrations" ON "public"."_prisma_migrations";
CREATE POLICY "No api access to prisma migrations"
ON "public"."_prisma_migrations"
FOR ALL
TO public
USING (false)
WITH CHECK (false);
