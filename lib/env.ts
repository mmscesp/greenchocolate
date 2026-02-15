import { z } from 'zod';

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

const serverEnvSchema = publicEnvSchema.extend({
  DATABASE_URL: z.string().min(1),
  APP_MASTER_KEY: z.string().min(1),
  ENCRYPTION_SALT: z.string().min(16),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

let cachedServerEnv: z.infer<typeof serverEnvSchema> | null = null;

export function getServerEnv() {
  if (cachedServerEnv) {
    return cachedServerEnv;
  }

  if (typeof window !== 'undefined') {
    throw new Error('Server environment can only be accessed on the server.');
  }

  cachedServerEnv = serverEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    APP_MASTER_KEY: process.env.APP_MASTER_KEY,
    ENCRYPTION_SALT: process.env.ENCRYPTION_SALT,
    NODE_ENV: process.env.NODE_ENV,
  });

  return cachedServerEnv;
}
