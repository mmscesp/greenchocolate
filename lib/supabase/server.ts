// Supabase Server Client for Next.js App Router
// Reference: https://supabase.com/docs/guides/auth/server-side/nextjs

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { publicEnv } from '@/lib/env';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Handle cookie errors in middleware
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Handle cookie errors in middleware
          }
        },
      },
    }
  );
}

// Type augmentation for Supabase SSR
declare module '@supabase/ssr' {
  interface Database {
    public: {
      Tables: {
        Profile: {
          Row: {
            id: string;
            authId: string;
            email: string;
            role: 'USER' | 'ADMIN' | 'CLUB_ADMIN';
          };
        };
      };
    };
  }
}
