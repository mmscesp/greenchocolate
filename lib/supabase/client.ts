// Supabase Browser Client for Client Components
// Reference: https://supabase.com/docs/guides/auth/server-side/nextjs

import { createBrowserClient } from '@supabase/ssr';
import { publicEnv } from '@/lib/env';

export function createClient() {
  return createBrowserClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
