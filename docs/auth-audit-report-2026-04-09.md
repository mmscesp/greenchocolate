# Auth Audit Report

Date: 2026-04-09
Repository: `SCM`
Scope: user auth, club auth, admin auth, redirects, session/profile state, password reset flow, route protection, audit logging, and auth-related tests

## Executive Summary

The platform uses Supabase Auth for identity/session cookies, Prisma for the application profile and role model, and `proxy.ts` for route protection. The overall direction is reasonable, but the current implementation is split across two auth models:

- server actions for primary sign-in/sign-up
- client-side `AuthProvider` logic for session/profile state, password recovery, and sign-out

That split is the main source of instability risk. I found several concrete issues that affect correctness and security:

1. Login rate limiting counts successful logins, so users can lock themselves out after repeated successful sign-ins.
2. The callback and reset-password flows are timing-sensitive and can hang or fail depending on when Supabase finishes hydrating the browser session.
3. The browser has a live Supabase client while the repo does not show RLS policies for `Profile`; if that table is exposed as usual in Supabase, authenticated users may be able to query profile rows directly.
4. Password complexity is enforced at registration, but not enforced consistently for reset/change-password paths.
5. The system has duplicated auth logic and partially implemented UX states such as `rememberMe`, which makes behavior less predictable and harder to secure.

## Architecture Map

### Identity and sessions

- Supabase server client: `lib/supabase/server.ts`
- Supabase browser client: `lib/supabase/client.ts`
- Browser auth context: `components/auth/AuthProvider.tsx`
- Session-to-profile bridge: `lib/session-profile.ts`

### Route protection

- Locale + route gating: `proxy.ts`
- Admin server guard helper: `lib/security/admin-guard.ts`

### Entry points

- User sign-up/login: `app/actions/auth.ts`
- Club sign-up: `app/actions/club-auth.ts`
- Admin login: `app/actions/admin-auth.ts`
- Auth callback UI: `app/[lang]/auth/callback/page.tsx`
- Forgot/reset password UI: `app/[lang]/forgot-password/page.tsx`, `app/[lang]/reset-password/page.tsx`

### Audit and rate limiting

- Audit writer: `lib/security/auth-audit.ts`
- Audit API: `app/api/auth/audit/route.ts`
- Rate limiter: `lib/security/auth-rate-limit.ts`

## Current Flow Summary

### Standard user sign-up

1. `components/auth/RegisterForm.tsx` posts to `signUp`.
2. `app/actions/auth.ts` validates fields and password policy.
3. Supabase `auth.signUp()` creates the auth user.
4. `ensureProfileForUser()` creates or updates a Prisma `Profile`.
5. PII is encrypted into `Profile.encryptedData`.
6. A GDPR consent record is inserted.
7. If no session exists, the user is told to confirm email; otherwise they are redirected.

### Standard user login

1. `components/auth/LoginForm.tsx` posts to `login`.
2. `app/actions/auth.ts` validates credentials and checks rate limit.
3. Supabase `signInWithPassword()` creates the session.
4. `getSessionProfile({ ensure: true, touchLastActive: true })` syncs Prisma profile state.
5. Redirect is resolved from the safe redirect helper plus role.

### OAuth login

1. Login/register UI calls `signInWithOAuth()`.
2. User is sent to Supabase provider flow.
3. Callback page tries to recover the session from URL hash or `code`.
4. Callback fetches `/api/profile/me` to infer role and redirect target.

### Admin login

1. `app/[lang]/admin/login/page.tsx` posts to `adminLogin`.
2. Supabase password auth succeeds first.
3. Prisma `Profile.role` is checked for `ADMIN`.
4. Non-admin users are signed back out and rejected.
5. Successful admin users are redirected to `/{lang}/admin`.

### Session/profile hydration

- The app-wide locale layout wraps all localized pages in `AuthProvider`.
- `AuthProvider` reads the browser session via Supabase and fetches `/api/profile/me`.
- `/api/profile/me` calls `getSessionProfile({ ensure: true })`, which may create a Prisma profile row on demand for authenticated users.

## Findings

### Critical

#### 1. `Profile` table appears to lack RLS coverage while a browser Supabase client is present

Evidence:

- Browser Supabase client is globally available through `components/auth/AuthProvider.tsx`.
- The repo contains RLS hardening for several public tables, but no matching RLS migration or policy for `Profile`.
- `proxy.ts` reads `Profile` through Supabase directly, which suggests the table is exposed through the public API surface.

Relevant files:

- `components/auth/AuthProvider.tsx`
- `proxy.ts`
- `prisma/migrations/20260312170000_admin_public_rls_hardening/migration.sql`

Risk:

If `Profile` is exposed in Supabase without RLS, any authenticated user may be able to query profile data directly from the browser, potentially including emails, roles, `managedClubId`, verification state, and other sensitive account metadata.

Confidence:

High that the repo does not define `Profile` RLS.
Medium that production is vulnerable, because it is possible you configured policies outside this repo.

Recommendation:

- Explicitly enable RLS on `Profile`.
- Add least-privilege policies:
  - user can read only their own profile
  - admin can read/manage all profiles
  - club admin access only when truly required
- Re-check every browser-side Supabase query after that change.

### High

#### 2. Login rate limiting counts successful logins and can lock out valid users

Evidence:

- `isAuthRateLimited()` counts audit rows only by `operation` + `recordId`.
- `login()` checks the limiter with `operation: 'LOGIN'`.
- `login()` writes audit rows with `operation: 'LOGIN'` for both success and failure.
- `adminLogin()` repeats the same pattern with `ADMIN_LOGIN`.

Relevant files:

- `lib/security/auth-rate-limit.ts`
- `app/actions/auth.ts`
- `app/actions/admin-auth.ts`

Impact:

After 5 successful sign-ins within 15 minutes, the same email can be blocked as if it were under attack. That is both a correctness bug and a self-inflicted denial-of-service condition for active users or admins.

Recommendation:

- Count only failed attempts for rate limiting.
- Store explicit failure/success fields in the audit query predicate.
- Reset or ignore failure counters after successful login.

#### 3. Auth callback can get stuck in the `verifying` state

Evidence:

- In `app/[lang]/auth/callback/page.tsx`, the hash-based flow calls `supabase.auth.getSession()`.
- If there is no error and `session` is still null, no success state or error state is set.
- If the page is reached without a hash and without a `code`, it also never exits `verifying`.

Relevant file:

- `app/[lang]/auth/callback/page.tsx`

Impact:

Users can end up on a spinner forever after email confirmation or OAuth if the session is not ready at that exact moment or if the callback URL is malformed/incomplete.

Recommendation:

- Make callback handling deterministic.
- Explicitly handle:
  - hash token flow success
  - `code` flow success
  - no-session timeout/failure
  - missing callback params
- Prefer a server-side callback exchange if possible.

#### 4. Reset-password flow clears the auth hash before session establishment is guaranteed

Evidence:

- `app/[lang]/reset-password/page.tsx` checks `session`.
- If there is no session but the URL hash contains `access_token`, it clears the hash immediately and unlocks the form.
- `updatePassword()` in `AuthProvider` assumes the browser already has a valid Supabase recovery session.

Relevant files:

- `app/[lang]/reset-password/page.tsx`
- `components/auth/AuthProvider.tsx`

Impact:

This flow depends on Supabase finishing URL-session hydration before the hash is cleared. That race can cause intermittent reset failures, especially on slower devices or first loads.

Recommendation:

- Wait explicitly for a valid recovery session before clearing the hash.
- Handle `PASSWORD_RECOVERY` or perform an explicit session bootstrap step.
- Add an error state for “recovery link invalid or expired”.

### Medium

#### 5. Password strength rules are inconsistent across sign-up vs reset/change-password

Evidence:

- Registration enforces uppercase, number, special character, and minimum length in `app/actions/auth.ts`.
- Reset-password page only checks minimum length.
- `AuthProvider.updatePassword()` and `AuthProvider.changePassword()` do not enforce the same complexity rules.

Relevant files:

- `app/actions/auth.ts`
- `app/[lang]/reset-password/page.tsx`
- `components/auth/AuthProvider.tsx`

Impact:

Users can end up with weaker passwords via recovery/change flows than via registration, weakening your effective password policy.

Recommendation:

- Centralize one password policy.
- Reuse it in sign-up, reset-password, and change-password.
- Mirror validation in both UI and server-side enforcement where applicable.

#### 6. Sign-up reveals raw backend error messages

Evidence:

- `signUp()` returns `error?.message` directly on Supabase sign-up failure.

Relevant file:

- `app/actions/auth.ts`

Impact:

Depending on Supabase configuration, this may leak account-existence or internal auth-state detail more than necessary. Your login path is already safer by returning a generic message.

Recommendation:

- Normalize sign-up failure messages the same way login does.
- Log detailed errors to audit/internal logs only.

#### 7. User and club sign-up create application records before email confirmation completes

Evidence:

- `signUp()` creates/syncs a Prisma `Profile` before checking whether a confirmed session exists.
- `clubSignUp()` creates a `Profile`, `Club`, and `ClubRegistrationRequest` before checking whether a session exists.

Relevant files:

- `app/actions/auth.ts`
- `app/actions/club-auth.ts`

Impact:

This is not always wrong, but it does mean unconfirmed or abandoned registrations leave database state behind. For club sign-up in particular, an attacker can create many pending inactive clubs and registration requests unless other controls exist.

Recommendation:

- Add sign-up throttling for user and club registration.
- Consider delayed record creation until confirmation, or scheduled cleanup for stale/unconfirmed records.

#### 8. `rememberMe` is presented in the UI but not implemented

Evidence:

- Login UI posts a hidden `rememberMe` field.
- `login()` never reads or applies it.
- Club login has the same issue.

Relevant files:

- `components/auth/LoginForm.tsx`
- `app/[lang]/club-panel/login/page.tsx`
- `app/actions/auth.ts`

Impact:

This is a UX correctness issue. Users are told a session-persistence choice exists, but the backend ignores it.

Recommendation:

- Either implement session persistence semantics with Supabase-supported settings, or remove the control.

#### 9. Mixed auth architecture increases the chance of drift and session bugs

Evidence:

- Primary login/register uses server actions.
- Password reset, sign-out, profile hydration, and some gated UI depend on `AuthProvider`.
- Both layers contain their own logging, redirects, and session handling assumptions.

Relevant files:

- `app/actions/auth.ts`
- `components/auth/AuthProvider.tsx`
- `app/[lang]/layout.tsx`

Impact:

This makes behavior harder to reason about and test. It also explains the current callback/reset fragility.

Recommendation:

- Choose one dominant auth orchestration model.
- Best option here: keep server actions for mutations and make the client provider a thin state reflector only.

### Low

#### 10. Server-action sign-out ignores the active locale

Evidence:

- `signOut()` in `app/actions/auth.ts` uses `resolveLocale(null)` and redirects to the default-locale home.

Impact:

If this action is used directly, localized users may land on the default locale instead of their current locale.

Recommendation:

- Pass the current locale into sign-out, or derive it from request context.

#### 11. Redirect continuity is not preserved consistently between auth pages

Evidence:

- Login/register links do not preserve the existing `redirect` parameter when moving between auth pages.

Impact:

Deep-link intent can be lost, which hurts conversion and post-login smoothness.

Recommendation:

- Preserve sanitized redirect params when navigating between auth pages.

## Positive Notes

- Redirect sanitization is present and blocks external redirect targets: `lib/auth-urls.ts`.
- Admin login correctly requires both valid credentials and `Profile.role === 'ADMIN'`.
- Route protection in `proxy.ts` covers localized user, admin, and club dashboard entry points.
- Profile role immutability is enforced at the database layer with a break-glass override.
- Auth audit logging exists across user and admin paths.
- `getSessionProfile({ ensure: true })` avoids many null-profile edge cases after successful auth.

## Session and State Assessment

### What is working

- Supabase handles session cookies.
- The app can reconstruct an app-level profile from an auth user.
- Route gating happens before page render for protected routes.

### What is fragile

- Callback success depends on browser timing.
- Reset-password recovery depends on browser timing.
- Client and server auth flows are not unified.
- The app creates profile rows lazily from `/api/profile/me`, which is convenient but can hide lifecycle bugs.

## Test Coverage Assessment

Existing auth tests are useful but shallow.

Covered:

- URL helper behavior
- Session-profile creation/update basics
- Auth audit writer basics
- Auth action validation smoke tests
- Basic unauthenticated redirect checks in Playwright

Missing:

- Successful login redirect by role
- Failed-attempt-only rate limiting
- OAuth callback success/failure states
- Email-confirmation callback success/failure states
- Reset-password recovery session handling
- Authenticated-user redirect-away behavior
- Club/admin auth edge cases
- Sign-up and club sign-up abuse throttling

I ran:

- `npm run test:run -- app/actions/auth.test.ts lib/auth-urls.test.ts lib/session-profile.test.ts lib/security/auth-audit.test.ts`

Result:

- 4 test files passed, 20 tests passed
- The current auth tests are mostly smoke tests and do not exercise the high-risk callback/rate-limit paths above

## Priority Fix Plan

### Phase 1: Immediate security/correctness

1. Fix rate limiting to count failures only.
2. Audit and lock down `Profile` with explicit RLS policies.
3. Rebuild callback/reset flows so they do not depend on hash/session races.
4. Enforce one password policy everywhere.

### Phase 2: Stability and UX

1. Remove or implement `rememberMe`.
2. Preserve redirect intent across login/register screens.
3. Normalize sign-up error messages.
4. Add throttling and cleanup for abandoned registrations, especially club sign-up.

### Phase 3: Simplification

1. Consolidate auth mutations around server actions.
2. Keep `AuthProvider` only for reflecting current state, not owning business logic.
3. Add integration tests for the full auth lifecycle.

## Recommended End State

The target system should have:

- one canonical auth flow model
- deterministic callback/reset handling
- explicit RLS on every exposed auth-related table
- centralized password policy
- failure-only rate limiting
- full redirect continuity
- end-to-end tests for sign-up, login, OAuth, reset-password, and sign-out

## Final Verdict

The auth foundation is good enough to evolve, but it is not yet “smooth, perfect, safe, optimized, stable, and robust.” The most urgent problems are not cosmetic; they are correctness and security issues in rate limiting, callback recovery, and likely `Profile` exposure. Those should be fixed before doing polish work.
