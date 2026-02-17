-- Enforce immutable Profile.role after row creation.
-- Break-glass override: SET LOCAL app.allow_role_change = 'on';

CREATE OR REPLACE FUNCTION "public"."prevent_profile_role_change"()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW."role" IS DISTINCT FROM OLD."role"
     AND COALESCE(current_setting('app.allow_role_change', true), 'off') <> 'on' THEN
    RAISE EXCEPTION 'Profile role is immutable';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS "profile_role_immutable_trigger" ON "public"."Profile";

CREATE TRIGGER "profile_role_immutable_trigger"
BEFORE UPDATE ON "public"."Profile"
FOR EACH ROW
EXECUTE FUNCTION "public"."prevent_profile_role_change"();
