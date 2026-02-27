-- SQL Migration: Create Profile Auto-Creation Trigger
-- Run this in Supabase SQL Editor after applying Prisma migration
-- Based on Supabase official best practices

-- Function to auto-create profile on user signup
-- Uses gen_random_uuid() for the primary key id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."Profile" (
    id,
    "authId",
    email,
    role,
    "encryptedData",
    "displayName",
    "updatedAt"
  )
  VALUES (
    gen_random_uuid(),
    NEW.id,
    NEW.email,
    'USER',
    NULL,
    NULL,
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Drop existing trigger and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
