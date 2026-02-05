-- SQL Migration: Create Profile Auto-Creation Trigger
-- Run this in Supabase SQL Editor after applying Prisma migration

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."Profile" (
    id,
    "authId",
    email,
    role,
    "encryptedData",
    "displayName"
  )
  VALUES (
    gen_random_uuid(),
    NEW.id,
    NEW.email,
    'USER',
    NULL,
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function on new auth user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
