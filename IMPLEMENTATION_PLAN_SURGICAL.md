# SURGICAL IMPLEMENTATION PLAN
## SocialClubsMaps - Production Readiness Execution Document

**Version:** 3.0  
**Date:** February 14, 2026  
**Classification:** IMPLEMENTATION READY  
**Total Effort:** 228 hours across 8 phases  
**Recommended Team:** 2 Senior Developers  

---

# STRATEGIC OVERVIEW

## Mission Objective
Transform the Cannabis Social Club platform from **NOT PRODUCTION READY (4.2/10)** to **PRODUCTION READY (8.5+/10)** in 8 waves of surgical interventions.

## Execution Philosophy
```
EACH FIX MUST BE:
├── Isolated (one concern per commit)
├── Testable (verification step included)
├── Reversible (rollback strategy defined)
├── Documented (why + what + how)
└── Non-Breaking (existing functionality preserved)
```

## Wave Structure
| Wave | Focus | Hours | Risk | Dependencies |
|------|-------|-------|------|--------------|
| **WAVE 0** | Environment Setup | 4 | LOW | None |
| **WAVE 1** | Security Lockdown | 20 | HIGH | Wave 0 |
| **WAVE 2** | Performance Foundation | 16 | MEDIUM | Wave 1 |
| **WAVE 3** | Caching Layer | 12 | MEDIUM | Wave 2 |
| **WAVE 4** | Testing Infrastructure | 32 | LOW | Wave 0 |
| **WAVE 5** | Feature Completion | 24 | MEDIUM | Wave 3 |
| **WAVE 6** | Compliance & Legal | 16 | LOW | Wave 1 |
| **WAVE 7** | DevOps & Monitoring | 16 | LOW | Wave 6 |
| **WAVE 8** | Translation Completion | 40 | LOW | Wave 0 |

**Parallel Execution Opportunities:**
- Wave 4 (Testing) can run parallel to Waves 1-3
- Wave 8 (Translations) can run parallel to all waves
- Wave 6 (Compliance) can run parallel to Waves 1-3

---

# WAVE 0: ENVIRONMENT SETUP
**Duration:** 4 hours  
**Risk Level:** LOW  
**Objective:** Establish development foundation and tooling  

## PHASE 0.1: Dependency Installation
**Time:** 1 hour  
**Blocking:** YES (all subsequent waves depend on this)

### Step 0.1.1: Install Security Dependencies
```bash
# Execute in project root
npm install @upstash/ratelimit @upstash/redis
npm install pino pino-pretty
npm install @sentry/nextjs
npm install react-google-recaptcha-v3
```

**Verification:**
```bash
# Verify installation
npm list @upstash/ratelimit @upstash/redis pino pino-pretty @sentry/nextjs react-google-recaptcha-v3
```

**Rollback:**
```bash
npm uninstall @upstash/ratelimit @upstash/redis pino pino-pretty @sentry/nextjs react-google-recaptcha-v3
```

### Step 0.1.2: Install Development Dependencies
```bash
npm install -D @types/pino
npm install -D sharp
```

### Step 0.1.3: Install Testing Dependencies
```bash
# Already installed - verify versions
npm list vitest @playwright/test @testing-library/react @testing-library/jest-dom
```

---

## PHASE 0.2: Environment Variables Setup
**Time:** 1 hour  
**Blocking:** YES  

### Step 0.2.1: Create Environment Template
**File:** `.env.example` (CREATE NEW)

```bash
# ========================================
# REQUIRED - APPLICATION
# ========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# ========================================
# REQUIRED - DATABASE
# ========================================
DATABASE_URL="postgresql://user:pass@host:5432/db"

# ========================================
# REQUIRED - SUPABASE
# ========================================
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# ========================================
# REQUIRED - ENCRYPTION (PII)
# ========================================
APP_MASTER_KEY=your-32-byte-hex-key-here
ENCRYPTION_SALT=unique-salt-value-change-me

# ========================================
# REQUIRED - RATE LIMITING (Upstash)
# ========================================
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# ========================================
# REQUIRED - ERROR MONITORING
# ========================================
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=xxx

# ========================================
# REQUIRED - CAPTCHA
# ========================================
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=xxx
RECAPTCHA_SECRET_KEY=xxx

# ========================================
# OPTIONAL - LOGGING
# ========================================
LOG_LEVEL=info

# ========================================
# OPTIONAL - ANALYTICS
# ========================================
NEXT_PUBLIC_POSTHOG_KEY=xxx
```

### Step 0.2.2: Create Local Environment
```bash
# Copy template
cp .env.example .env.local

# Fill in values (manual step - DO NOT COMMIT)
```

### Step 0.2.3: Add to .gitignore
**File:** `.gitignore` (VERIFY/UPDATE)

```gitignore
# Environment files
.env
.env.local
.env.*.local

# Ensure .env.example IS tracked
!.env.example
```

**Verification:**
```bash
git status
# Should NOT show .env.local
# Should show .env.example as new file
```

---

## PHASE 0.3: TypeScript Configuration Fix
**Time:** 30 minutes  

### Step 0.3.1: Read Current Config
**File:** `tsconfig.json`

### Step 0.3.2: Update Excludes
**Change:**
```json
// FROM:
{
  "exclude": ["node_modules", "vitest.config.ts", "test/**/*", "**/*.test.ts"]
}

// TO:
{
  "exclude": ["node_modules", ".next"]
}
```

**Reason:** Tests should be type-checked in CI

### Step 0.3.3: Verify
```bash
npx tsc --noEmit
# Should pass without errors
```

---

## PHASE 0.4: Upstash Account Setup
**Time:** 30 minutes  
**Manual Step Required**

### Step 0.4.1: Create Upstash Account
1. Go to https://upstash.com
2. Create account
3. Create new Redis database
4. Copy REST URL and Token to `.env.local`

### Step 0.4.2: Verify Connection
```bash
# Test with curl
curl -X GET "$UPSTASH_REDIS_REST_URL/ping" -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"
# Should return: {"result":"PONG"}
```

---

## PHASE 0.5: Sentry Account Setup
**Time:** 30 minutes  
**Manual Step Required**

### Step 0.5.1: Create Sentry Project
1. Go to https://sentry.io
2. Create new project (Next.js)
3. Copy DSN to `.env.local`

### Step 0.5.2: Generate Auth Token
1. Sentry → Settings → Auth Tokens
2. Create token with `project:write` scope
3. Add to `.env.local` as `SENTRY_AUTH_TOKEN`

---

## WAVE 0 VERIFICATION CHECKLIST

```bash
# Run all checks
npm install                                    # Install dependencies
npm list @upstash/ratelimit                    # Verify rate limiting
npm list pino                                  # Verify logging
npm list @sentry/nextjs                        # Verify Sentry
cat .env.example                               # Verify template exists
cat .gitignore | grep ".env"                   # Verify gitignore
npx tsc --noEmit                               # Verify TypeScript
curl "$UPSTASH_REDIS_REST_URL/ping" -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"  # Verify Redis
```

**Wave 0 Complete When:**
- [ ] All dependencies installed
- [ ] `.env.example` created and committed
- [ ] `.env.local` created (NOT committed)
- [ ] TypeScript compiles without errors
- [ ] Upstash Redis accessible
- [ ] Sentry project created

---

# WAVE 1: SECURITY LOCKDOWN
**Duration:** 20 hours  
**Risk Level:** HIGH  
**Objective:** Eliminate all critical security vulnerabilities  

## PHASE 1.1: Security Headers Implementation
**Time:** 2 hours  
**Priority:** P0 (CRITICAL)  
**Risk:** LOW (configuration only)

### Step 1.1.1: Read Current Config
**File:** `next.config.js` (10 lines)

### Step 1.1.2: Create Security Headers Configuration
**File:** `next.config.js` (REWRITE COMPLETE)

```javascript
/** @type {import('next').NextConfig} */

// Security Headers Configuration
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self)',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://o*.ingest.sentry.io",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig = {
  images: {
    unoptimized: true, // WILL BE FIXED IN WAVE 2
    qualities: [75, 85, 90],
  },
  
  // Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
```

### Step 1.1.3: Verify Headers
```bash
# Start dev server
npm run dev

# In another terminal, test headers
curl -I http://localhost:3000/es

# Expected output should include:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Referrer-Policy: strict-origin-when-cross-origin
# Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
# Content-Security-Policy: default-src 'self'; ...
```

### Step 1.1.4: Test CSP Doesn't Break App
```bash
# Check browser console for CSP violations
# Open http://localhost:3000/es
# Open DevTools → Console
# Look for "Refused to..." errors
# If found, adjust CSP directives
```

**Rollback:** Revert `next.config.js` to original state

**Verification:**
```bash
# Automated test
curl -s -I http://localhost:3000/es | grep -i "x-frame-options"
# Should output: x-frame-options: DENY
```

---

## PHASE 1.2: Rate Limiting Implementation
**Time:** 6 hours  
**Priority:** P0 (CRITICAL)  
**Risk:** MEDIUM (requires testing)

### Step 1.2.1: Create Rate Limit Module
**File:** `lib/rate-limit.ts` (CREATE NEW)

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Redis client from environment
const redis = Redis.fromEnv();

// Different rate limits for different contexts
export const ratelimits = {
  // Auth endpoints: 5 attempts per minute
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    analytics: true,
    prefix: 'ratelimit:auth',
  }),
  
  // API endpoints: 100 requests per minute
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
    prefix: 'ratelimit:api',
  }),
  
  // Membership requests: 3 per hour
  membership: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    analytics: true,
    prefix: 'ratelimit:membership',
  }),
  
  // Password reset: 3 per hour
  passwordReset: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    analytics: true,
    prefix: 'ratelimit:password-reset',
  }),
};

/**
 * Get client identifier for rate limiting
 * Uses IP address, falls back to user agent hash
 */
export function getClientIdentifier(request?: Request): string {
  // In server actions, we need to get headers
  if (typeof request !== 'undefined') {
    const ip = request.headers.get('x-forwarded-for') 
            || request.headers.get('x-real-ip') 
            || '127.0.0.1';
    return ip;
  }
  
  // Fallback for server actions (will use user ID if available)
  return 'server-action';
}

/**
 * Rate limit result type
 */
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}

/**
 * Check rate limit and return result
 */
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string
): Promise<RateLimitResult> {
  const { success, limit, remaining, reset } = await limiter.limit(identifier);
  
  return {
    success,
    limit,
    remaining,
    reset: new Date(reset),
  };
}
```

### Step 1.2.2: Create Headers Utility
**File:** `lib/headers.ts` (CREATE NEW)

```typescript
// lib/headers.ts
import { headers } from 'next/headers';

/**
 * Get client IP address from headers
 * Works in Server Actions and Route Handlers
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers();
  
  return (
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
    headersList.get('x-real-ip') ||
    headersList.get('cf-connecting-ip') || // Cloudflare
    '127.0.0.1'
  );
}

/**
 * Get user agent from headers
 */
export async function getUserAgent(): Promise<string> {
  const headersList = await headers();
  return headersList.get('user-agent') || 'unknown';
}

/**
 * Generate a unique identifier combining IP and user agent hash
 * Useful for rate limiting
 */
export async function getClientFingerprint(): Promise<string> {
  const ip = await getClientIp();
  const ua = await getUserAgent();
  
  // Simple hash of user agent for additional uniqueness
  const uaHash = ua.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
  }, 0);
  
  return `${ip}:${Math.abs(uaHash).toString(16)}`;
}
```

### Step 1.2.3: Apply Rate Limiting to Auth Actions
**File:** `app/actions/auth.ts` (MODIFY)

**Changes Required:**

1. Add imports at top of file:
```typescript
// Add after existing imports
import { ratelimits, checkRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/headers';
```

2. Modify `signUp` function (line 80):
```typescript
export async function signUp(prevState: ActionState, formData: FormData): Promise<ActionState> {
  // RATE LIMITING: Check before processing
  const ip = await getClientIp();
  const rateResult = await checkRateLimit(ratelimits.auth, ip);
  
  if (!rateResult.success) {
    return {
      success: false,
      message: `Too many signup attempts. Please try again in ${Math.ceil((rateResult.reset.getTime() - Date.now()) / 60000)} minutes.`,
    };
  }
  
  // ... rest of existing signUp logic
}
```

3. Modify `login` function (line 217):
```typescript
export async function login(prevState: ActionState, formData: FormData): Promise<ActionState> {
  // RATE LIMITING: Check before processing
  const ip = await getClientIp();
  const rateResult = await checkRateLimit(ratelimits.auth, ip);
  
  if (!rateResult.success) {
    return {
      success: false,
      message: `Too many login attempts. Please try again in ${Math.ceil((rateResult.reset.getTime() - Date.now()) / 60000)} minutes.`,
    };
  }
  
  // ... rest of existing login logic
}
```

### Step 1.2.4: Apply Rate Limiting to Club Auth
**File:** `app/actions/club-auth.ts` (MODIFY)

Same pattern as above:
- Add imports
- Add rate limit check at start of `login` function

### Step 1.2.5: Apply Rate Limiting to Membership Requests
**File:** `app/actions/membership.ts` (MODIFY)

```typescript
// In submitMembershipRequest function (line 144)

export async function submitMembershipRequest(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // RATE LIMITING: Check before processing
  const ip = await getClientIp();
  const rateResult = await checkRateLimit(ratelimits.membership, ip);
  
  if (!rateResult.success) {
    return {
      success: false,
      message: `Too many membership requests. Please try again later.`,
    };
  }
  
  // ... rest of existing logic
}
```

### Step 1.2.6: Apply Rate Limiting to API Route
**File:** `app/api/profile/me/route.ts` (MODIFY)

```typescript
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { ratelimits, checkRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/headers';

// GET /api/profile/me - Get current user's profile
export async function GET(request: Request) {
  // RATE LIMITING
  const ip = await getClientIp();
  const rateResult = await checkRateLimit(ratelimits.api, ip);
  
  if (!rateResult.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateResult.limit.toString(),
          'X-RateLimit-Remaining': rateResult.remaining.toString(),
          'X-RateLimit-Reset': rateResult.reset.toISOString(),
        }
      }
    );
  }
  
  try {
    // ... existing logic
  } catch (error) {
    // ... existing error handling
  }
}
```

### Step 1.2.7: Verify Rate Limiting Works
```bash
# Start dev server
npm run dev

# Test auth rate limiting (should succeed first 5 times)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' \
    -w "\nStatus: %{http_code}\n"
done

# Expected: 6th request should return 429 or rate limit message
```

**Rollback:** Remove rate limit imports and checks from all modified files

**Verification:**
```bash
# Check Upstash dashboard for rate limit keys
# Go to Upstash Console → Your Database → CLI
# Run: KEYS ratelimit:*
# Should see entries after testing
```

---

## PHASE 1.3: CAPTCHA Implementation
**Time:** 3 hours  
**Priority:** P0 (CRITICAL)  
**Risk:** MEDIUM

### Step 1.3.1: Create CAPTCHA Provider Component
**File:** `components/auth/CaptchaProvider.tsx` (CREATE NEW)

```typescript
'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { ReactNode } from 'react';

interface CaptchaProviderProps {
  children: ReactNode;
}

export function CaptchaProvider({ children }: CaptchaProviderProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  
  if (!siteKey) {
    console.warn('reCAPTCHA site key not configured');
    return <>{children}</>;
  }
  
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
```

### Step 1.3.2: Create CAPTCHA Verification Utility
**File:** `lib/captcha.ts` (CREATE NEW)

```typescript
// Server-side CAPTCHA verification

interface CaptchaVerificationResult {
  success: boolean;
  score?: number;
  action?: string;
  error?: string;
}

/**
 * Verify reCAPTCHA v3 token on the server
 */
export async function verifyCaptcha(
  token: string,
  expectedAction?: string
): Promise<CaptchaVerificationResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.warn('reCAPTCHA secret key not configured - skipping verification');
    return { success: true }; // Allow in development
  }
  
  try {
    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${token}`,
      }
    );
    
    const data = await response.json();
    
    // Check if verification passed
    if (!data.success) {
      return {
        success: false,
        error: 'CAPTCHA verification failed',
      };
    }
    
    // Check action matches (if provided)
    if (expectedAction && data.action !== expectedAction) {
      return {
        success: false,
        error: 'Invalid CAPTCHA action',
      };
    }
    
    // Check score threshold (0.5 is recommended minimum)
    const minScore = 0.5;
    if (data.score < minScore) {
      return {
        success: false,
        score: data.score,
        error: `CAPTCHA score too low: ${data.score}`,
      };
    }
    
    return {
      success: true,
      score: data.score,
      action: data.action,
    };
  } catch (error) {
    console.error('CAPTCHA verification error:', error);
    return {
      success: false,
      error: 'CAPTCHA verification failed',
    };
  }
}
```

### Step 1.3.3: Create Client CAPTCHA Hook
**File:** `hooks/useCaptcha.ts` (CREATE NEW)

```typescript
'use client';

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useCallback } from 'react';

export function useCaptcha() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  
  const getToken = useCallback(async (action: string): Promise<string | null> => {
    if (!executeRecaptcha) {
      console.warn('reCAPTCHA not loaded');
      return null;
    }
    
    try {
      const token = await executeRecaptcha(action);
      return token;
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      return null;
    }
  }, [executeRecaptcha]);
  
  return { getToken };
}
```

### Step 1.3.4: Wrap App with CAPTCHA Provider
**File:** `app/layout.tsx` (MODIFY)

```typescript
// Import at top
import { CaptchaProvider } from '@/components/auth/CaptchaProvider';

// Wrap children in the body section
<body>
  <CaptchaProvider>
    {children}
  </CaptchaProvider>
</body>
```

### Step 1.3.5: Modify Registration Form
**File:** `app/[lang]/account/register/page.tsx` (MODIFY)

```typescript
// Add import
import { useCaptcha } from '@/hooks/useCaptcha';

// In the form component:
const { getToken } = useCaptcha();

// In the form submit handler:
const handleSubmit = async (formData: FormData) => {
  // Get CAPTCHA token
  const captchaToken = await getToken('signup');
  
  // Add to form data
  if (captchaToken) {
    formData.append('captchaToken', captchaToken);
  }
  
  // Call server action
  await signUp(prevState, formData);
};
```

### Step 1.3.6: Verify CAPTCHA in Server Action
**File:** `app/actions/auth.ts` (MODIFY)

```typescript
// Add import
import { verifyCaptcha } from '@/lib/captcha';

// In signUp function (after rate limiting, before auth):
export async function signUp(prevState: ActionState, formData: FormData): Promise<ActionState> {
  // ... rate limiting code ...
  
  // CAPTCHA VERIFICATION
  const captchaToken = formData.get('captchaToken') as string;
  if (captchaToken) {
    const captchaResult = await verifyCaptcha(captchaToken, 'signup');
    if (!captchaResult.success) {
      return {
        success: false,
        message: 'Bot detection triggered. Please try again.',
      };
    }
  }
  
  // ... rest of signup logic ...
}
```

### Step 1.3.7: Test CAPTCHA
```bash
# In browser console on registration page:
localStorage.setItem('recaptcha_debug', 'true');

# Submit form and check Network tab for:
# - Request to google.com/recaptcha/api/siteverify
```

---

## PHASE 1.4: Structured Logging Implementation
**Time:** 3 hours  
**Priority:** P1 (HIGH)  

### Step 1.4.1: Create Logger Module
**File:** `lib/logger.ts` (CREATE NEW)

```typescript
import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Structured logger configuration
 * Uses pino-pretty in development for readable logs
 * Uses JSON format in production for log aggregation
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  
  // Pretty printing for development
  transport: isDevelopment 
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  
  // Base fields for all logs
  base: {
    service: 'socialclubsmaps',
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
  },
  
  // Redact sensitive fields
  redact: {
    paths: ['password', 'token', 'secret', 'apiKey', '*.password', '*.token'],
    censor: '[REDACTED]',
  },
  
  // Timestamp format
  timestamp: pino.stdTimeFunctions.isoTime,
});

/**
 * Create a child logger with additional context
 */
export function createContextLogger(context: Record<string, unknown>) {
  return logger.child(context);
}

/**
 * Log levels type
 */
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * Log entry interface
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  data?: Record<string, unknown>;
  error?: Error;
}

/**
 * Helper for logging errors with stack traces
 */
export function logError(
  message: string, 
  error: unknown, 
  context?: Record<string, unknown>
) {
  const errorObj = error instanceof Error 
    ? { message: error.message, stack: error.stack, name: error.name }
    : { error };
    
  logger.error({ ...context, error: errorObj }, message);
}

/**
 * Helper for logging operations
 */
export function logOperation(
  operation: string,
  data: Record<string, unknown>,
  level: LogLevel = 'info'
) {
  logger[level]({ operation, ...data }, `${operation} executed`);
}
```

### Step 1.4.2: Replace Console Logs in Auth Actions
**File:** `app/actions/auth.ts` (MODIFY)

```typescript
// Add import
import { logger, logError } from '@/lib/logger';

// Replace console.error calls:

// Line 158 (was: console.error('Profile upsert failed after retries:', error))
logError('Profile upsert failed after retries', error, { authId: user.id });

// Line 205 (was: console.error('Signup error:', error))
logError('Signup error', error, { email: validated.data.email });

// Line 259 (was: console.error('Login error:', error))
logError('Login error', error, { email: validated.data.email });

// Line 344 (was: console.error('Update profile error:', error))
logError('Update profile error', error, { authId: user.id });

// Line 419 (was: console.error('Decrypt PII error:', error))
logError('Decrypt PII error', error, { userId });
```

### Step 1.4.3: Add Operation Logging
**File:** `app/actions/auth.ts` (ADD LOGGING)

```typescript
// In signUp function, after successful profile creation:
logger.info(
  { userId: profile.id, authId: user.id, hasEmail: !!validated.data.email },
  'User signed up successfully'
);

// In login function, after successful login:
logger.info(
  { userId: profile.id, role: profile.role },
  'User logged in successfully'
);

// In signOut function:
logger.info('User signed out');
```

### Step 1.4.4: Verify Logging Works
```bash
# Start dev server
npm run dev

# Perform a login attempt
# Check terminal for formatted log output like:
# [15:30:45] INFO (socialclubsmaps): User logged in successfully
#     userId: "abc-123"
#     role: "USER"
```

---

## PHASE 1.5: Sentry Integration
**Time:** 2 hours  
**Priority:** P0 (CRITICAL)  

### Step 1.5.1: Initialize Sentry
```bash
# Run Sentry wizard
npx @sentry/wizard@latest -i nextjs
```

This will create:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- Update `next.config.js`

### Step 1.5.2: Configure Sentry
**File:** `sentry.client.config.ts` (VERIFY)

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust sampling in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Capture sessions for replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Ignore specific errors
  ignoreErrors: [
    'NEXT_NOT_FOUND',
    'NEXT_REDIRECT',
  ],
});
```

### Step 1.5.3: Add Sentry to Error Boundaries
**File:** `app/error.tsx` (MODIFY)

```typescript
'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Capture error in Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### Step 1.5.4: Test Sentry Integration
```bash
# Start dev server
npm run dev

# Trigger test error
curl http://localhost:3000/api/test-sentry-error

# Check Sentry dashboard for error
```

---

## PHASE 1.6: Security Audit
**Time:** 4 hours  
**Priority:** P1 (HIGH)  
**Manual Step**

### Step 1.6.1: Run Automated Security Checks
```bash
# Install security audit tools
npm install -g snyk

# Run Snyk security scan
snyk test

# Run npm audit
npm audit

# Run npm audit fix for non-breaking fixes
npm audit fix
```

### Step 1.6.2: Manual Security Checklist

```markdown
## Authentication Security
- [ ] Password minimum length enforced (8+ chars)
- [ ] Email validation with Zod
- [ ] Rate limiting on all auth endpoints
- [ ] CAPTCHA on registration
- [ ] Session timeout configured
- [ ] Logout clears session properly

## Authorization Security
- [ ] Role checks in proxy.ts working
- [ ] Club admin access verified
- [ ] No IDOR vulnerabilities
- [ ] No privilege escalation possible

## Input Validation
- [ ] All form inputs validated with Zod
- [ ] No SQL injection possible (Prisma)
- [ ] No XSS possible (React escapes)
- [ ] File upload validation (if any)

## Data Protection
- [ ] PII encrypted at rest
- [ ] Sensitive data not in logs
- [ ] Secrets in environment variables
- [ ] No secrets in git history
```

---

## WAVE 1 VERIFICATION CHECKLIST

```bash
# Security Headers
curl -I http://localhost:3000/es | grep -i "x-frame-options"
# Expected: x-frame-options: DENY

# Rate Limiting
redis-cli -u $UPSTASH_REDIS_REST_URL KEYS "ratelimit:*"
# Expected: List of rate limit keys

# CAPTCHA
curl http://localhost:3000/es/account/register | grep -i "recaptcha"
# Expected: reCAPTCHA script included

# Logging
npm run dev 2>&1 | grep "User logged"
# Expected: Structured log output

# Sentry
# Check Sentry dashboard for test error
```

**Wave 1 Complete When:**
- [ ] Security headers present in all responses
- [ ] Rate limiting blocks after threshold
- [ ] CAPTCHA visible on registration
- [ ] Structured logs appear in console
- [ ] Errors appear in Sentry dashboard
- [ ] Security audit passed

---

# WAVE 2: PERFORMANCE FOUNDATION
**Duration:** 16 hours  
**Risk Level:** MEDIUM  
**Objective:** Enable image optimization and fix performance issues  

## PHASE 2.1: Image Optimization
**Time:** 4 hours  
**Priority:** P0 (CRITICAL)  

### Step 2.1.1: Update Next.js Config
**File:** `next.config.js` (MODIFY)

```javascript
const nextConfig = {
  images: {
    // ENABLE optimization
    unoptimized: false,
    
    // Modern formats
    formats: ['image/avif', 'image/webp'],
    
    // Device sizes for srcset
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    
    // Image sizes for srcset
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Allowed domains
    remotePatterns: [
      { hostname: 'localhost' },
      { hostname: '*.supabase.co' },
      { hostname: '*.cloudinary.com' },
    ],
    
    // Cache TTL
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    
    // Disable static imports in development for faster builds
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // ... rest of config
};
```

### Step 2.1.2: Audit Existing Image Usage
```bash
# Find all img tags that should be Image components
grep -rn "<img" --include="*.tsx" app/ components/
```

**Expected Files to Review:**
- `components/ClubCard.tsx` - Uses `Image` ✓
- `components/HeroSection.tsx` - Uses `Image` ✓
- `app/[lang]/clubs/[slug]/ClubProfileContent.tsx` - Uses `Image` ✓

### Step 2.1.3: Add Missing width/height Props
**File:** `components/ClubCard.tsx` (VERIFY)

```typescript
// Ensure all Image components have width/height or fill

// Example fix:
<Image
  src={club.images[0]}
  alt={club.name}
  fill  // If inside relative container
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={index < 4}  // Prioritize above-fold images
/>
```

### Step 2.1.4: Add Image Placeholder
**File:** `components/ui/image-placeholder.tsx` (CREATE NEW)

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
  sizes,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <div className="bg-gray-200 flex items-center justify-center" style={{ width, height }}>
        <span className="text-gray-400">Image unavailable</span>
      </div>
    );
  }
  
  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''}`}>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        priority={priority}
        sizes={sizes}
        onLoad={() => setIsLoading(false)}
        onError={() => setError(true)}
      />
    </div>
  );
}
```

### Step 2.1.5: Verify Image Optimization
```bash
# Build and check image optimization
npm run build

# Start production server
npm run start

# Check Network tab for:
# - WebP/AVIF formats
# - Multiple srcset sizes
# - Lazy loading
```

---

## PHASE 2.2: Database Query Optimization
**Time:** 4 hours  
**Priority:** P1 (HIGH)  

### Step 2.2.1: Analyze Current Queries
**File:** `app/actions/clubs.ts` (lines 162-200)

```typescript
// CURRENT: Two separate queries
// 1. Find city by slug
const city = await prisma.city.findUnique({ where: { slug } });
// 2. Find clubs with cityId
const clubs = await prisma.club.findMany({ where: { cityId: city.id } });
```

### Step 2.2.2: Optimize with Relation Filter
```typescript
// OPTIMIZED: Single query with relation
const clubs = await prisma.club.findMany({
  where: {
    isActive: true,
    isVerified: true,
    city: { slug: citySlug },  // Direct relation filter
  },
  include: {
    city: {
      select: { name: true, slug: true }
    }
  }
});
```

### Step 2.2.3: Add Database Indexes
**File:** `prisma/schema.prisma` (VERIFY/ADD)

```prisma
model Club {
  // ... existing fields ...
  
  // Ensure these indexes exist:
  @@index([slug])
  @@index([cityId])
  @@index([neighborhood])
  @@index([isVerified, isActive])
  @@index([cityId, isVerified, isActive])  // Compound index for filtered queries
}
```

### Step 2.2.4: Run Migration
```bash
# Create migration for new indexes
npx prisma migrate dev --name add_club_indexes

# Apply to production
npx prisma migrate deploy
```

---

## PHASE 2.3: Health Check Endpoint
**Time:** 1 hour  
**Priority:** P2 (MEDIUM)  

### Step 2.3.1: Create Health Check API
**File:** `app/api/health/route.ts` (CREATE NEW)

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

interface HealthCheck {
  name: string;
  healthy: boolean;
  latency?: number;
  error?: string;
}

async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { name: 'database', healthy: true, latency: Date.now() - start };
  } catch (error) {
    return { name: 'database', healthy: false, error: String(error) };
  }
}

async function checkSupabase(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.getSession();
    if (error) throw error;
    return { name: 'supabase', healthy: true, latency: Date.now() - start };
  } catch (error) {
    return { name: 'supabase', healthy: false, error: String(error) };
  }
}

async function checkRedis(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const { Redis } = await import('@upstash/redis');
    const redis = Redis.fromEnv();
    await redis.ping();
    return { name: 'redis', healthy: true, latency: Date.now() - start };
  } catch (error) {
    return { name: 'redis', healthy: false, error: String(error) };
  }
}

export async function GET() {
  const checks = await Promise.all([
    checkDatabase(),
    checkSupabase(),
    checkRedis(),
  ]);
  
  const healthy = checks.every((c) => c.healthy);
  const status = healthy ? 200 : 503;
  
  return NextResponse.json(
    {
      status: healthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
    },
    { status }
  );
}
```

### Step 2.3.2: Test Health Endpoint
```bash
curl http://localhost:3000/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2026-02-14T...",
  "checks": [
    { "name": "database", "healthy": true, "latency": 5 },
    { "name": "supabase", "healthy": true, "latency": 120 },
    { "name": "redis", "healthy": true, "latency": 15 }
  ]
}
```

---

## WAVE 2 VERIFICATION CHECKLIST

```bash
# Image Optimization
npm run build
# Check for: "Generating static pages" with optimized images

# Database Queries
# Enable Prisma query logging:
# DATABASE_URL="...?pgbouncer=true&logging=true"
npm run dev
# Check console for query times

# Health Check
curl http://localhost:3000/api/health
# Expected: All checks healthy
```

**Wave 2 Complete When:**
- [ ] Images optimized (WebP/AVIF)
- [ ] Lighthouse score > 80
- [ ] Database queries optimized
- [ ] Health endpoint returns 200

---

# WAVE 3: CACHING LAYER
**Duration:** 12 hours  
**Risk Level:** MEDIUM  
**Objective:** Implement Redis caching for database queries  

## PHASE 3.1: Create Cache Utilities
**Time:** 2 hours  

### Step 3.1.1: Create Cache Module
**File:** `lib/cache.ts` (CREATE NEW)

```typescript
import { Redis } from '@upstash/redis';
import { unstable_cache } from 'next/cache';

const redis = Redis.fromEnv();

/**
 * Cache configuration by data type
 */
export const cacheConfig = {
  clubs: {
    ttl: 300,       // 5 minutes
    revalidateTags: ['clubs'],
  },
  club: {
    ttl: 3600,      // 1 hour
    revalidateTags: ['club'],
  },
  cities: {
    ttl: 86400,     // 24 hours
    revalidateTags: ['cities'],
  },
  articles: {
    ttl: 3600,      // 1 hour
    revalidateTags: ['articles'],
  },
  user: {
    ttl: 60,        // 1 minute
    revalidateTags: ['user'],
  },
} as const;

/**
 * Redis-backed cache wrapper
 */
export async function withCache<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  // Try to get from cache
  const cached = await redis.get<T>(key);
  if (cached !== null) {
    return cached;
  }
  
  // Fetch fresh data
  const data = await fetcher();
  
  // Store in cache
  await redis.setex(key, ttl, JSON.stringify(data));
  
  return data;
}

/**
 * Invalidate cache by pattern
 */
export async function invalidateCache(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

/**
 * Next.js unstable_cache wrapper with Redis backing
 */
export function createCachedFunction<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  keys: string[],
  options: { revalidate?: number; tags?: string[] } = {}
) {
  return unstable_cache(fn, keys, {
    revalidate: options.revalidate ?? 300,
    tags: options.tags ?? [],
  });
}
```

---

## PHASE 3.2: Cache Club Data
**Time:** 4 hours  

### Step 3.2.1: Wrap getClubs with Cache
**File:** `app/actions/clubs.ts` (MODIFY)

```typescript
import { unstable_cache } from 'next/cache';
import { cacheConfig, withCache } from '@/lib/cache';

// Create cached version of getClubs
export const getClubs = unstable_cache(
  async (filters?: ClubFilters): Promise<ClubCard[]> => {
    // ... existing implementation ...
  },
  ['clubs-list'],
  { 
    revalidate: cacheConfig.clubs.ttl,
    tags: cacheConfig.clubs.revalidateTags 
  }
);

// Create cached version of getClubBySlug
export const getClubBySlug = unstable_cache(
  async (slug: string): Promise<ClubDetail | null> => {
    // ... existing implementation ...
  },
  ['club-detail'],
  { 
    revalidate: cacheConfig.club.ttl,
    tags: cacheConfig.club.revalidateTags 
  }
);
```

### Step 3.2.2: Invalidate Cache on Updates
**File:** `app/actions/clubs.ts` (ADD INVALIDATION)

```typescript
import { revalidateTag } from 'next/cache';

// After club update:
export async function updateClub(...) {
  // ... update logic ...
  
  // Invalidate relevant caches
  revalidateTag('clubs');
  revalidateTag('club');
  
  // Also invalidate specific club
  revalidatePath(`/clubs/${clubSlug}`);
}
```

---

## PHASE 3.3: Cache Cities and Articles
**Time:** 2 hours  

### Step 3.3.1: Cache City Data
**File:** `app/actions/cities.ts` (MODIFY)

```typescript
import { unstable_cache } from 'next/cache';
import { cacheConfig } from '@/lib/cache';

export const getCities = unstable_cache(
  async () => {
    return prisma.city.findMany({
      where: { country: 'Spain' },
      orderBy: { name: 'asc' },
    });
  },
  ['cities-list'],
  { 
    revalidate: cacheConfig.cities.ttl,
    tags: cacheConfig.cities.revalidateTags 
  }
);

export const getCityBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.city.findUnique({
      where: { slug },
      include: { clubs: { where: { isActive: true } } },
    });
  },
  ['city-detail'],
  { 
    revalidate: cacheConfig.cities.ttl,
    tags: ['cities', 'clubs'] 
  }
);
```

### Step 3.3.2: Cache Articles
**File:** `app/actions/articles.ts` (MODIFY)

```typescript
import { unstable_cache } from 'next/cache';
import { cacheConfig } from '@/lib/cache';

export const getArticles = unstable_cache(
  async (filters?: ArticleFilters) => {
    // ... existing implementation ...
  },
  ['articles-list'],
  { 
    revalidate: cacheConfig.articles.ttl,
    tags: cacheConfig.articles.revalidateTags 
  }
);

export const getArticleBySlug = unstable_cache(
  async (slug: string) => {
    // ... existing implementation ...
  },
  ['article-detail'],
  { 
    revalidate: cacheConfig.articles.ttl,
    tags: cacheConfig.articles.revalidateTags 
  }
);
```

---

## PHASE 3.4: Verify Caching
**Time:** 2 hours  

### Step 3.4.1: Test Cache Hit/Miss
```bash
# First request (cache miss)
curl -w "Time: %{time_total}s\n" http://localhost:3000/api/clubs

# Second request (cache hit)
curl -w "Time: %{time_total}s\n" http://localhost:3000/api/clubs

# Second request should be significantly faster
```

### Step 3.4.2: Monitor Redis
```bash
# Check Redis for cached keys
redis-cli -u $UPSTASH_REDIS_REST_URL KEYS "*"

# Should see keys like:
# clubs-list:xxx
# club-detail:xxx
```

---

## WAVE 3 VERIFICATION CHECKLIST

```bash
# Check cache implementation
grep -r "unstable_cache" app/actions/
# Should find: clubs.ts, cities.ts, articles.ts

# Test response times
# First call (cold cache)
curl -w "%{time_total}" http://localhost:3000/es/clubs -o /dev/null -s
# Second call (warm cache)
curl -w "%{time_total}" http://localhost:3000/es/clubs -o /dev/null -s
# Second should be faster

# Check Redis
curl "$UPSTASH_REDIS_REST_URL/KEYS/*" -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"
```

**Wave 3 Complete When:**
- [ ] Cache module created
- [ ] Club data cached
- [ ] City data cached
- [ ] Article data cached
- [ ] Cache invalidation working
- [ ] Response times improved

---

# WAVE 4: TESTING INFRASTRUCTURE
**Duration:** 32 hours  
**Risk Level:** LOW  
**Objective:** Establish comprehensive test coverage  

## PHASE 4.1: E2E Critical Path Tests
**Time:** 12 hours  

### Step 4.1.1: Create Auth Flow Tests
**File:** `e2e/auth-flow.spec.ts` (CREATE NEW)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test.describe('User Registration', () => {
    test('should register a new user with valid data', async ({ page }) => {
      await page.goto('/es/account/register');
      
      // Fill registration form
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'Password123!');
      await page.fill('input[name="fullName"]', 'Test User');
      await page.check('input[name="consent"]');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should show success or redirect
      await expect(page).toHaveURL(/\/(es\/|verify)/);
    });
    
    test('should show error for invalid email', async ({ page }) => {
      await page.goto('/es/account/register');
      
      await page.fill('input[name="email"]', 'invalid-email');
      await page.fill('input[name="password"]', 'Password123!');
      await page.fill('input[name="fullName"]', 'Test User');
      await page.click('button[type="submit"]');
      
      await expect(page.locator('text=/email/i')).toBeVisible();
    });
    
    test('should show error for short password', async ({ page }) => {
      await page.goto('/es/account/register');
      
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'short');
      await page.fill('input[name="fullName"]', 'Test User');
      await page.click('button[type="submit"]');
      
      await expect(page.locator('text=/8 char/i')).toBeVisible();
    });
  });
  
  test.describe('User Login', () => {
    test('should login with valid credentials', async ({ page }) => {
      // Create test user first (or use seed data)
      await page.goto('/es/account/login');
      
      await page.fill('input[name="email"]', 'existing@test.com');
      await page.fill('input[name="password"]', 'Password123!');
      await page.click('button[type="submit"]');
      
      // Should redirect to profile or home
      await expect(page).toHaveURL(/\/(profile|es\/?$)/);
    });
    
    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/es/account/login');
      
      await page.fill('input[name="email"]', 'wrong@test.com');
      await page.fill('input[name="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      await expect(page.locator('text=/invalid|incorrect/i')).toBeVisible();
    });
  });
});

test.describe('Rate Limiting', () => {
  test('should block after too many login attempts', async ({ page }) => {
    await page.goto('/es/account/login');
    
    // Attempt login 6 times
    for (let i = 0; i < 6; i++) {
      await page.fill('input[name="email"]', 'test@test.com');
      await page.fill('input[name="password"]', 'wrong');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(100);
    }
    
    // 6th attempt should show rate limit message
    await expect(page.locator('text=/too many|try again/i')).toBeVisible();
  });
});
```

### Step 4.1.2: Create Membership Flow Tests
**File:** `e2e/membership-flow.spec.ts` (CREATE NEW)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Membership Request Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as test user
    await page.goto('/es/account/login');
    await page.fill('input[name="email"]', 'testuser@test.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|es)/);
  });
  
  test('should submit membership request', async ({ page }) => {
    // Go to a club page
    await page.goto('/es/clubs/test-club');
    
    // Click join button
    await page.click('text=/únete|join/i');
    
    // Fill form
    await page.fill('textarea[name="message"]', 'I would like to join');
    await page.click('button[type="submit"]');
    
    // Should show success
    await expect(page.locator('text=/success|enviada/i')).toBeVisible();
  });
  
  test('club admin can approve request', async ({ page }) => {
    // Login as club admin
    await page.goto('/es/club-panel/login');
    await page.fill('input[name="email"]', 'clubadmin@test.com');
    await page.fill('input[name="password"]', 'AdminPassword123!');
    await page.click('button[type="submit"]');
    
    // Go to requests
    await page.goto('/es/club-panel/dashboard/requests');
    
    // Approve first pending request
    await page.click('button:has-text("Approve")').first();
    
    // Should show success
    await expect(page.locator('text=/approved|aprobada/i')).toBeVisible();
  });
});
```

---

## PHASE 4.2: Server Action Unit Tests
**Time:** 10 hours  

### Step 4.2.1: Create Clubs Action Tests
**File:** `app/actions/clubs.test.ts` (CREATE NEW)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mocks
vi.mock('@/lib/supabase/server', () => ({
  createClient: () => ({
    auth: { getUser: vi.fn() },
  }),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    club: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    city: {
      findUnique: vi.fn(),
    },
  },
}));

import { getClubs, getClubBySlug } from './clubs';
import { prisma } from '@/lib/prisma';

describe('Club Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('getClubs', () => {
    it('should return clubs with no filters', async () => {
      const mockClubs = [
        { id: '1', name: 'Club 1', slug: 'club-1' },
        { id: '2', name: 'Club 2', slug: 'club-2' },
      ];
      
      vi.mocked(prisma.club.findMany).mockResolvedValue(mockClubs as any);
      
      const result = await getClubs();
      
      expect(result).toHaveLength(2);
      expect(prisma.club.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
          }),
        })
      );
    });
    
    it('should filter by city slug', async () => {
      vi.mocked(prisma.city.findUnique).mockResolvedValue({ id: 'city-1' } as any);
      vi.mocked(prisma.club.findMany).mockResolvedValue([]);
      
      await getClubs({ citySlug: 'barcelona' });
      
      expect(prisma.city.findUnique).toHaveBeenCalledWith({
        where: { slug: 'barcelona' },
      });
    });
    
    it('should filter by neighborhood', async () => {
      vi.mocked(prisma.club.findMany).mockResolvedValue([]);
      
      await getClubs({ neighborhood: 'Gràcia' });
      
      expect(prisma.club.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            neighborhood: 'Gràcia',
          }),
        })
      );
    });
    
    it('should filter by amenities', async () => {
      vi.mocked(prisma.club.findMany).mockResolvedValue([]);
      
      await getClubs({ amenities: ['wifi', 'parking'] });
      
      expect(prisma.club.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            amenities: { hasEvery: ['wifi', 'parking'] },
          }),
        })
      );
    });
  });
  
  describe('getClubBySlug', () => {
    it('should return club by slug', async () => {
      const mockClub = {
        id: '1',
        name: 'Test Club',
        slug: 'test-club',
        city: { name: 'Barcelona', slug: 'barcelona' },
      };
      
      vi.mocked(prisma.club.findUnique).mockResolvedValue(mockClub as any);
      
      const result = await getClubBySlug('test-club');
      
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Test Club');
    });
    
    it('should return null for non-existent slug', async () => {
      vi.mocked(prisma.club.findUnique).mockResolvedValue(null);
      
      const result = await getClubBySlug('non-existent');
      
      expect(result).toBeNull();
    });
  });
});
```

### Step 4.2.2: Create Membership Action Tests
**File:** `app/actions/membership.test.ts` (CREATE NEW)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mocks
vi.mock('@/lib/supabase/server', () => ({
  createClient: () => ({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
  }),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    profile: {
      findUnique: vi.fn(),
    },
    membershipRequest: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    club: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/lib/rate-limit', () => ({
  ratelimits: {
    membership: { limit: vi.fn().mockResolvedValue({ success: true }) },
  },
  checkRateLimit: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('@/lib/headers', () => ({
  getClientIp: vi.fn().mockResolvedValue('127.0.0.1'),
}));

import { submitMembershipRequest, getMembershipRequests } from './membership';
import { prisma } from '@/lib/prisma';

describe('Membership Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('submitMembershipRequest', () => {
    it('should create membership request for authenticated user', async () => {
      vi.mocked(prisma.profile.findUnique).mockResolvedValue({
        id: 'user-1',
        role: 'USER',
      } as any);
      
      vi.mocked(prisma.membershipRequest.create).mockResolvedValue({
        id: 'request-1',
      } as any);
      
      const formData = new FormData();
      formData.append('clubId', 'club-1');
      
      const result = await submitMembershipRequest(
        { success: false },
        formData
      );
      
      expect(result.success).toBe(true);
    });
    
    it('should reject unauthenticated users', async () => {
      vi.mocked(prisma.profile.findUnique).mockResolvedValue(null);
      
      const formData = new FormData();
      formData.append('clubId', 'club-1');
      
      const result = await submitMembershipRequest(
        { success: false },
        formData
      );
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('logged in');
    });
  });
});
```

---

## PHASE 4.3: Component Tests
**Time:** 6 hours  

### Step 4.3.1: Create ClubCard Tests
**File:** `components/ClubCard.test.tsx` (CREATE NEW)

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClubCard } from './ClubCard';

const mockClub = {
  id: '1',
  name: 'Test Club',
  slug: 'test-club',
  shortDescription: 'A test club',
  neighborhood: 'Gràcia',
  cityName: 'Barcelona',
  citySlug: 'barcelona',
  images: ['/test.jpg'],
  logoUrl: null,
  rating: 4.5,
  reviewCount: 10,
  priceRange: '€€',
  amenities: ['wifi', 'parking'],
  vibeTags: ['relaxed'],
  isVerified: true,
  capacity: 50,
  foundedYear: 2020,
};

describe('ClubCard', () => {
  it('should render club name', () => {
    render(<ClubCard club={mockClub} />);
    
    expect(screen.getByText('Test Club')).toBeInTheDocument();
  });
  
  it('should show verified badge for verified clubs', () => {
    render(<ClubCard club={mockClub} />);
    
    expect(screen.getByText(/verified/i)).toBeInTheDocument();
  });
  
  it('should display rating', () => {
    render(<ClubCard club={mockClub} />);
    
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });
  
  it('should show neighborhood', () => {
    render(<ClubCard club={mockClub} />);
    
    expect(screen.getByText(/Gràcia/)).toBeInTheDocument();
  });
  
  it('should link to club page', () => {
    render(<ClubCard club={mockClub} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/es/clubs/test-club');
  });
});
```

---

## PHASE 4.4: Test Coverage Setup
**Time:** 4 hours  

### Step 4.4.1: Update Vitest Config
**File:** `vitest.config.ts` (MODIFY)

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        '.next/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types.ts',
      ],
      // Minimum coverage thresholds
      thresholds: {
        lines: 50,
        functions: 50,
        branches: 50,
        statements: 50,
      },
    },
  },
  // ... rest of config
});
```

### Step 4.4.2: Create Test Setup
**File:** `test/setup.ts` (VERIFY/UPDATE)

```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';
```

### Step 4.4.3: Run Tests
```bash
# Run all unit tests
npm run test:run

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

---

## WAVE 4 VERIFICATION CHECKLIST

```bash
# Run all tests
npm run test:run
# Expected: All tests pass

# Check coverage
npm run test:coverage
# Expected: >50% coverage

# Run E2E tests
npm run test:e2e
# Expected: All E2E tests pass
```

**Wave 4 Complete When:**
- [ ] Auth flow E2E tests pass
- [ ] Membership flow E2E tests pass
- [ ] Server action unit tests pass
- [ ] Component tests pass
- [ ] Coverage > 50%

---

# WAVE 5: FEATURE COMPLETION
**Duration:** 24 hours  
**Risk Level:** MEDIUM  
**Objective:** Implement missing database tables and features  

## PHASE 5.1: Add Missing Database Tables
**Time:** 4 hours  

### Step 5.1.1: Update Prisma Schema
**File:** `prisma/schema.prisma` (ADD MODELS)

```prisma
// Add after existing models

model Review {
  id        String   @id @default(uuid())
  rating    Int      // 1-5
  content   String?  @db.Text
  userId    String
  clubId    String
  isPublic  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      Profile @relation(fields: [userId], references: [id], onDelete: Cascade)
  club      Club    @relation(fields: [clubId], references: [id], onDelete: Cascade)
  
  @@unique([userId, clubId])
  @@index([clubId, isPublic])
  @@index([userId])
}

model Favorite {
  id        String   @id @default(uuid())
  userId    String
  clubId    String
  createdAt DateTime @default(now())
  
  user      Profile @relation(fields: [userId], references: [id], onDelete: Cascade)
  club      Club    @relation(fields: [clubId], references: [id], onDelete: Cascade)
  
  @@unique([userId, clubId])
  @@index([userId])
  @@index([clubId])
}

model Event {
  id          String    @id @default(uuid())
  slug        String    @unique
  name        String
  description String    @db.Text
  startDate   DateTime
  endDate     DateTime
  location    String
  cityId      String?
  clubId      String?
  isPublished Boolean   @default(false)
  imageUrl    String?
  eventUrl    String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  city        City?     @relation(fields: [cityId], references: [id])
  club        Club?     @relation(fields: [clubId], references: [id])
  
  @@index([cityId])
  @@index([clubId])
  @@index([startDate])
  @@index([isPublished])
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  type      String   // 'request_approved', 'request_rejected', etc.
  title     String
  message   String
  isRead    Boolean  @default(false)
  data      Json?
  createdAt DateTime @default(now())
  
  user      Profile  @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId, isRead])
  @@index([userId, createdAt])
}
```

### Step 5.1.2: Update Existing Models
**File:** `prisma/schema.prisma` (UPDATE)

```prisma
model Profile {
  // ... existing fields ...
  
  // Add relations
  reviews       Review[]
  favorites     Favorite[]
  notifications Notification[]
}

model Club {
  // ... existing fields ...
  
  // Add relations
  reviews    Review[]
  favorites  Favorite[]
  events     Event[]
}

model City {
  // ... existing fields ...
  
  // Add relation
  events Event[]
}
```

### Step 5.1.3: Run Migration
```bash
# Create migration
npx prisma migrate dev --name add_reviews_favorites_events_notifications

# Generate types
npx prisma generate
```

---

## PHASE 5.2: Implement Favorites
**Time:** 4 hours  

### Step 5.2.1: Create Favorites Actions
**File:** `app/actions/favorites.ts` (CREATE NEW)

```typescript
'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getFavorites() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  return prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      club: {
        include: { city: true },
      },
    },
  });
}

export async function addFavorite(clubId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, message: 'Not authenticated' };
  }
  
  try {
    await prisma.favorite.create({
      data: {
        userId: user.id,
        clubId,
      },
    });
    
    revalidatePath('/profile/favorites');
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Failed to add favorite' };
  }
}

export async function removeFavorite(clubId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, message: 'Not authenticated' };
  }
  
  try {
    await prisma.favorite.delete({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId,
        },
      },
    });
    
    revalidatePath('/profile/favorites');
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Failed to remove favorite' };
  }
}
```

---

## PHASE 5.3: Implement Reviews
**Time:** 6 hours  

### Step 5.3.1: Create Reviews Actions
**File:** `app/actions/reviews.ts` (CREATE NEW)

```typescript
'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const createReviewSchema = z.object({
  clubId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  content: z.string().max(1000).optional(),
});

export async function getClubReviews(clubId: string) {
  return prisma.review.findMany({
    where: {
      clubId,
      isPublic: true,
    },
    include: {
      user: {
        select: {
          displayName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createReview(data: z.infer<typeof createReviewSchema>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, message: 'Not authenticated' };
  }
  
  const validated = createReviewSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten() };
  }
  
  try {
    await prisma.review.create({
      data: {
        userId: user.id,
        clubId: validated.data.clubId,
        rating: validated.data.rating,
        content: validated.data.content,
      },
    });
    
    revalidatePath(`/clubs/${validated.data.clubId}`);
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Failed to create review' };
  }
}
```

---

## WAVE 5 VERIFICATION CHECKLIST

```bash
# Run migration
npx prisma migrate deploy
# Expected: Migration successful

# Generate types
npx prisma generate
# Expected: Types generated

# Test new features
# - Add favorite
# - Remove favorite
# - Create review
# - View reviews
```

**Wave 5 Complete When:**
- [ ] Database tables created
- [ ] Favorites working
- [ ] Reviews working
- [ ] Notifications model ready

---

# WAVE 6: COMPLIANCE & LEGAL
**Duration:** 16 hours  
**Risk Level:** LOW  
**Objective:** Add legal pages and compliance features  

## PHASE 6.1: Privacy Policy Page
**Time:** 2 hours  

### Step 6.1.1: Create Privacy Policy
**File:** `app/[lang]/privacy/page.tsx` (CREATE NEW)

```typescript
import { getDictionary } from '@/lib/dictionaries';

export default async function PrivacyPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dict = await getDictionary(lang);
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">
        {lang === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
      </h1>
      
      <div className="prose prose-lg dark:prose-invert">
        {/* Privacy policy content */}
        <p>Last updated: February 2026</p>
        
        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly, including:
        </p>
        <ul>
          <li>Name and contact information</li>
          <li>Account credentials</li>
          <li>Membership request details</li>
        </ul>
        
        <h2>2. How We Use Your Information</h2>
        <p>
          We use your information to:
        </p>
        <ul>
          <li>Process membership requests</li>
          <li>Communicate with you about clubs</li>
          <li>Improve our services</li>
        </ul>
        
        <h2>3. Data Protection</h2>
        <p>
          We use AES-256-GCM encryption to protect your personal information.
          Your sensitive data is encrypted before storage.
        </p>
        
        <h2>4. Your Rights (GDPR)</h2>
        <ul>
          <li>Right to access your data</li>
          <li>Right to rectification</li>
          <li>Right to erasure</li>
          <li>Right to data portability</li>
        </ul>
        
        <h2>5. Contact</h2>
        <p>
          For privacy inquiries: privacy@socialclubsmaps.es
        </p>
      </div>
    </div>
  );
}
```

---

## PHASE 6.2: Terms of Service
**Time:** 2 hours  

### Step 6.2.1: Create TOS Page
**File:** `app/[lang]/terms/page.tsx` (CREATE NEW)

```typescript
// Similar structure to privacy policy
// Include terms for:
// - User responsibilities
// - Club responsibilities  
// - Prohibited activities
// - Disclaimers
// - Limitation of liability
```

---

## PHASE 6.3: Cookie Consent Banner
**Time:** 4 hours  

### Step 6.3.1: Create Cookie Consent Component
**File:** `components/CookieConsent.tsx` (CREATE NEW)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);
  
  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    setShowBanner(false);
    // Initialize analytics
  };
  
  const acceptNecessary = () => {
    localStorage.setItem('cookie-consent', 'necessary');
    setShowBanner(false);
  };
  
  if (!showBanner) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          We use cookies to enhance your experience. By continuing, you agree to our{' '}
          <a href="/privacy" className="underline">Privacy Policy</a>.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={acceptNecessary}>
            Necessary Only
          </Button>
          <Button size="sm" onClick={acceptAll}>
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Step 6.3.2: Add to Layout
**File:** `app/layout.tsx` (MODIFY)

```typescript
import { CookieConsent } from '@/components/CookieConsent';

// In body:
<body>
  {children}
  <CookieConsent />
</body>
```

---

## WAVE 6 VERIFICATION CHECKLIST

```bash
# Check pages exist
curl http://localhost:3000/es/privacy
curl http://localhost:3000/es/terms
# Expected: 200 OK

# Check cookie banner
# Visit site in incognito
# Expected: Banner appears
```

**Wave 6 Complete When:**
- [ ] Privacy policy accessible
- [ ] Terms of service accessible
- [ ] Cookie banner working
- [ ] GDPR export endpoint ready

---

# WAVE 7: DEVOPS & MONITORING
**Duration:** 16 hours  
**Risk Level:** LOW  
**Objective:** Automate deployment and monitoring  

## PHASE 7.1: CI/CD Pipeline
**Time:** 4 hours  

### Step 7.1.1: Create GitHub Actions Workflow
**File:** `.github/workflows/ci.yml` (CREATE NEW)

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run test:run
      - name: Upload coverage
        uses: codecov/codecov-action@v4

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: .next/

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## PHASE 7.2: Monitoring Dashboard
**Time:** 4 hours  

### Step 7.2.1: Create Monitoring Config
**File:** `lib/monitoring.ts` (CREATE NEW)

```typescript
import * as Sentry from '@sentry/nextjs';

interface MetricEvent {
  name: string;
  value: number;
  tags?: Record<string, string>;
}

/**
 * Track custom metrics
 */
export function trackMetric(event: MetricEvent) {
  // Send to Sentry
  Sentry.captureEvent({
    message: event.name,
    extra: {
      value: event.value,
      tags: event.tags,
    },
  });
  
  // Could also send to PostHog, Datadog, etc.
}

/**
 * Track performance
 */
export function trackPerformance(name: string, duration: number) {
  trackMetric({
    name: `performance.${name}`,
    value: duration,
    tags: { unit: 'ms' },
  });
}
```

---

## WAVE 7 VERIFICATION CHECKLIST

```bash
# Push to GitHub and check Actions
git push origin main
# Go to GitHub → Actions
# Expected: All checks pass

# Check Sentry dashboard
# Go to Sentry → Projects
# Expected: Events appearing
```

**Wave 7 Complete When:**
- [ ] CI pipeline running
- [ ] Tests running on every PR
- [ ] Deploy automation working
- [ ] Monitoring dashboard active

---

# WAVE 8: TRANSLATION COMPLETION
**Duration:** 40 hours  
**Risk Level:** LOW  
**Objective:** Complete all 8 language translations  

## PHASE 8.1: Translation Strategy
**Time:** 2 hours  

### Translation Priority Order
1. **French (fr)** - Highest priority, 51% complete
2. **German (de)** - High priority, 51% complete  
3. **Italian (it)** - Medium priority, 51% complete
4. **Portuguese (pt)** - Medium priority, 51% complete
5. **Polish (pl)** - Lower priority, 51% complete
6. **Russian (ru)** - Lower priority, 51% complete

### Translation Process
```
1. Extract keys from es.json
2. Identify missing keys in target language
3. Generate translation using DeepL API
4. Human review by native speaker
5. Import to dictionary file
6. Test in UI
```

---

## PHASE 8.2: Complete French Translations
**Time:** 8 hours  

### Step 8.2.1: Generate Missing Keys
```bash
# Run translation check
npm run translations:check

# Output will show missing keys
```

### Step 8.2.2: Manual Translation Process
**File:** `dictionaries/fr.json` (UPDATE)

For each missing key, provide professional French translation:
```json
{
  "home.hero.title": "Découvrez les Meilleurs Clubs Sociaux de Cannabis",
  "home.hero.subtitle": "Nous connectons les communautés de cannabis responsables en Espagne. Trouvez votre club idéal, participez à des événements et rejoignez une culture consciente.",
  // ... continue for all missing keys
}
```

---

## PHASE 8.3: Complete German Translations
**Time:** 8 hours  

**File:** `dictionaries/de.json` (UPDATE)

---

## PHASE 8.4: Complete Remaining Languages
**Time:** 20 hours  

- Italian: `dictionaries/it.json`
- Portuguese: `dictionaries/pt.json`
- Polish: `dictionaries/pl.json`
- Russian: `dictionaries/ru.json`

---

## WAVE 8 VERIFICATION CHECKLIST

```bash
# Check translation coverage
npm run translations:check
# Expected: 100% for all languages

# Test each language in browser
# - /es/clubs
# - /en/clubs
# - /fr/clubs
# - /de/clubs
# - etc.

# Verify no placeholder text
grep -r "\[FR\]\|\[DE\]\|\[IT\]" dictionaries/
# Expected: No results
```

**Wave 8 Complete When:**
- [ ] All languages at 100%
- [ ] No placeholder text
- [ ] All pages render correctly
- [ ] Cultural review passed

---

# FINAL VERIFICATION

## Production Readiness Checklist

```markdown
## Security
- [ ] Rate limiting implemented and tested
- [ ] Security headers present on all responses
- [ ] CAPTCHA working on registration
- [ ] PII encryption verified
- [ ] Input validation on all forms
- [ ] Authorization checks working

## Performance
- [ ] Images optimized (WebP/AVIF)
- [ ] Caching implemented
- [ ] Database queries optimized
- [ ] Lighthouse score > 80
- [ ] Core Web Vitals passing

## Testing
- [ ] E2E tests passing
- [ ] Unit tests > 50% coverage
- [ ] Component tests passing
- [ ] Security tests passing

## Features
- [ ] Auth flows working
- [ ] Membership requests working
- [ ] Favorites working
- [ ] Reviews working

## Compliance
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie consent working
- [ ] GDPR export working

## DevOps
- [ ] CI/CD pipeline running
- [ ] Monitoring active
- [ ] Error tracking active
- [ ] Health check endpoint working

## Translations
- [ ] All 8 languages at 100%
- [ ] No placeholder text
- [ ] All pages localized
```

## Final Commands

```bash
# Full verification
npm ci
npm run lint
npm run test:run
npm run test:e2e
npm run build

# Deploy
npm run start
# Or deploy to Vercel
```

---

**END OF IMPLEMENTATION PLAN**

*Document Version: 3.0*  
*Total Waves: 8*  
*Total Hours: 228*  
*Recommended Timeline: 6-8 weeks with 2 developers*
