import { z } from 'zod';

const numericEnv = (defaultValue: number, min: number, max: number) =>
  z.coerce.number().int().min(min).max(max).default(defaultValue);

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).optional(),
});

const serverEnvSchema = publicEnvSchema.extend({
  DATABASE_URL: z.string().min(1),
  APP_MASTER_KEY: z.string().min(1),
  ENCRYPTION_SALT: z.string().min(16),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  ADMIN_BOOTSTRAP_SECRET: z.string().min(12).optional(),
  BREVO_API_KEY: z.string().min(1).optional(),
  BREVO_SENDER_EMAIL: z.string().email().optional(),
  BREVO_SENDER_NAME: z.string().min(1).optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
  SERVER_ACTION_ALLOWED_ORIGINS: z.string().min(1).optional(),
  MEMBERSHIP_GUEST_SOFT_LIMIT: numericEnv(3, 1, 100),
  MEMBERSHIP_GUEST_HARD_LIMIT: numericEnv(6, 1, 200),
  MEMBERSHIP_AUTH_SOFT_LIMIT: numericEnv(4, 1, 100),
  MEMBERSHIP_AUTH_HARD_LIMIT: numericEnv(8, 1, 200),
  MEMBERSHIP_RATE_LIMIT_WINDOW_MINUTES: numericEnv(60, 1, 1440),
  MEMBERSHIP_LEAD_TTL_HOURS: numericEnv(24, 1, 168),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
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
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    APP_MASTER_KEY: process.env.APP_MASTER_KEY,
    ENCRYPTION_SALT: process.env.ENCRYPTION_SALT,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ADMIN_BOOTSTRAP_SECRET: process.env.ADMIN_BOOTSTRAP_SECRET,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL,
    BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    SERVER_ACTION_ALLOWED_ORIGINS: process.env.SERVER_ACTION_ALLOWED_ORIGINS,
    MEMBERSHIP_GUEST_SOFT_LIMIT: process.env.MEMBERSHIP_GUEST_SOFT_LIMIT,
    MEMBERSHIP_GUEST_HARD_LIMIT: process.env.MEMBERSHIP_GUEST_HARD_LIMIT,
    MEMBERSHIP_AUTH_SOFT_LIMIT: process.env.MEMBERSHIP_AUTH_SOFT_LIMIT,
    MEMBERSHIP_AUTH_HARD_LIMIT: process.env.MEMBERSHIP_AUTH_HARD_LIMIT,
    MEMBERSHIP_RATE_LIMIT_WINDOW_MINUTES: process.env.MEMBERSHIP_RATE_LIMIT_WINDOW_MINUTES,
    MEMBERSHIP_LEAD_TTL_HOURS: process.env.MEMBERSHIP_LEAD_TTL_HOURS,
    NODE_ENV: process.env.NODE_ENV,
  });

  return cachedServerEnv;
}
