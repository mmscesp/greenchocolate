# Codebase Audit Report

Date: 2026-03-03
Project: `SCM` (Next.js App Router + TypeScript + Supabase + Prisma)
Scope: Full repository review for logic bugs, security/authorization risks, reliability issues, and QA quality.

## Executive Summary

- Build health is currently green (`lint`, `test:run`, and `build` completed successfully).
- The most serious issues are in pass lifecycle logic and club onboarding consistency, where behavior can be incorrect under realistic conditions.
- Several exported server actions and legacy modules appear unused, increasing maintenance risk and potential future misuse.
- Test suite passes, but key E2E assertions are brittle and can pass with weak guarantees.

## Verification Evidence

### Commands executed

```bash
npm run lint
npm run test:run
npm run build
```

### Results

- `npm run lint`: completed without reported lint errors.
- `npm run test:run`: 5 test files passed, 46 tests passed.
- `npm run build`: successful production build and route generation completed.

## Methodology

- Parallel codebase exploration agents for architecture/security and type/test quality.
- External benchmark checks against Next.js server action security guidance and Prisma transaction/integrity best practices.
- Direct manual review of high-risk modules:
  - `app/actions/safety-pass.ts`
  - `app/actions/club-auth.ts`
  - `app/actions/membership.ts`
  - `app/actions/applications.ts`
  - `app/actions/admin-users.ts`
  - `app/actions/admin-clubs.ts`
  - `app/api/auth/audit/route.ts`
  - `proxy.ts`
  - `lib/blog-content.ts`
  - `lib/types.ts`
  - `e2e/i18n-routing.spec.ts`

## Findings (Prioritized)

## 1) CRITICAL - Safety pass validation is forgeable and not source-of-truth driven

- **Where:** `app/actions/safety-pass.ts:111`
- **Evidence:** `validateSafetyPass` derives an ID prefix from user-provided pass number and queries `Profile.id startsWith(...)`.
- **Why this is risky:** pass validation is based on predictable ID prefix matching, not on a persisted/verifiable pass record. This can produce collisions/spoofed positives.
- **Impact:** invalid passes may be treated as valid, and valid pass lifecycle state is not authoritative.
- **Fix recommendation:** store pass state in a dedicated table (`passNumber`, `issuedAt`, `expiresAt`, `status`, `userId`) with unique `passNumber`; validate strictly against persisted record.

## 2) HIGH - Safety pass renewal does not persist renewal state

- **Where:** `app/actions/safety-pass.ts:172`
- **Evidence:** `renewSafetyPass` computes `newExpiryDate` and creates a notification only; no profile/pass record is updated.
- **Why this is risky:** UI/notifications indicate renewal, but backend source state is unchanged.
- **Impact:** users can receive success while effective expiry remains unchanged.
- **Fix recommendation:** persist renewed expiry/status in durable storage and return the persisted value.

## 3) HIGH - Club signup flow is non-atomic and can leave partial state

- **Where:** `app/actions/club-auth.ts:57`
- **Evidence:** flow runs Supabase sign-up, then separate Prisma writes without transaction/compensation.
- **Additional reliability issues:**
  - `cityId: defaultCity?.id || ''` in club create at `app/actions/club-auth.ts:131`
  - membership request user fallback to empty string at `app/actions/club-auth.ts:180`
- **Why this is risky:** failures mid-flow can produce orphaned auth users or inconsistent DB records.
- **Impact:** onboarding failures and difficult operational recovery.
- **Fix recommendation:** transactionalize Prisma operations and add compensation path for Supabase user if DB stage fails; never write empty FK values.

## 4) HIGH - Duplicate submission race handling is weak in membership/application flows

- **Where:**
  - `app/actions/membership.ts:174`
  - `app/actions/applications.ts:151`
- **Evidence:** both perform check-then-create for `(userId, clubId)` duplicates.
- **Why this is risky:** concurrent requests can still race; DB unique constraints block duplicates, but code currently falls back to generic error handling.
- **Impact:** non-deterministic UX/errors under concurrency bursts.
- **Fix recommendation:** catch Prisma unique violation (`P2002`) and map to explicit `already exists` result.

## 5) MEDIUM - Admin list filters can throw instead of returning safe error state

- **Where:**
  - `app/actions/admin-users.ts:40`
  - `app/actions/admin-clubs.ts:37`
- **Evidence:** both use `schema.parse(rawInput)` (throwing) in action entrypoint.
- **Why this is risky:** malformed query payloads can trigger unhandled exceptions instead of controlled response.
- **Impact:** avoidable 500s and brittle admin UX.
- **Fix recommendation:** use `safeParse` + fallback/default return object.

## 6) MEDIUM - Content loader can crash on invalid article date metadata

- **Where:** `lib/blog-content.ts:193`
- **Evidence:** `new Date(publishedAtRaw).toISOString()` is called without date validity guard.
- **Why this is risky:** invalid frontmatter date yields `RangeError`, interrupting content load.
- **Impact:** one malformed article can break aggregate loading path.
- **Fix recommendation:** validate date before ISO conversion; fallback to `null` for invalid values.

## 7) MEDIUM - Unused exported server actions and legacy module increase risk surface

- **Where:**
  - `app/actions/safety-pass.ts` (exports unused)
  - `app/actions/clubs.ts` functions `getUserFavorites`, `addFavorite`, `removeFavorite`, `addReview` appear unreferenced
  - `lib/clubs.ts` appears unreferenced and contains placeholder behavior
- **Evidence:** LSP reference lookup found no usages for these exports.
- **Why this is risky:** dead or orphaned action APIs accumulate security and maintenance debt.
- **Impact:** future accidental wiring can expose poorly constrained operations.
- **Fix recommendation:** remove dead exports/files or explicitly mark internal-only and cover with tests.

## 8) MEDIUM - Type safety erosion in shared types and action casts

- **Where:**
  - `lib/types.ts` (`any` in core interfaces)
  - `app/actions/membership.ts`, `app/actions/users.ts`, `app/actions/applications.ts`, `app/actions/notifications.ts` (`as unknown as` patterns)
- **Evidence:** broad `any` + unsound casts around JSON/profile shapes.
- **Why this is risky:** compile-time guarantees are bypassed in auth and mutation-critical paths.
- **Impact:** runtime shape mismatches can slip through CI.
- **Fix recommendation:** replace `any` with typed JSON/domain interfaces; introduce explicit type guards/adapters at boundaries.

## 9) MEDIUM - Audit ingestion endpoint allows highly flexible operation payloads

- **Where:** `app/api/auth/audit/route.ts:8`
- **Evidence:** `operation` is unconstrained string and metadata is arbitrary object.
- **Why this is risky:** authenticated/anonymous callers from allowed origin can inject noisy or low-quality audit events.
- **Impact:** degraded audit signal quality and forensic usefulness.
- **Fix recommendation:** restrict `operation` to enum/allowlist, enforce metadata schema per operation, and rate-limit endpoint.

## 10) LOW-MEDIUM - E2E i18n tests include weak and conditional assertions

- **Where:** `e2e/i18n-routing.spec.ts`
- **Evidence:**
  - count-only assertions (`toHaveCount(1)`) at lines such as `:45`, `:52`, `:118`, `:131`, `:149`, `:156`
  - conditional branch in language switcher test can skip assertions entirely (`if (await langSwitcher.isVisible().catch(() => false))` at `:224`)
- **Why this is risky:** tests can pass while missing behavior regressions.
- **Impact:** lower confidence in i18n navigation correctness.
- **Fix recommendation:** assert semantic content/URL transitions unconditionally with stable locators.

## Good Signals Observed

- Consistent auth-role checks in many admin paths via `getAdminSessionProfile`.
- Presence of unique DB constraints for membership/favorites/reviews (`prisma/schema.prisma`).
- Audit logging integration exists across key auth/admin actions.
- Build and tests currently pass.

## Recommended Remediation Order

1. Fix safety-pass validation and renewal persistence (`app/actions/safety-pass.ts`).
2. Make club signup robust and atomic (`app/actions/club-auth.ts`).
3. Harden duplicate/concurrency handling with explicit Prisma error mapping (`membership.ts`, `applications.ts`).
4. Convert throwing parses in admin actions to safe parse flows.
5. Tighten test assertions and remove conditional no-op pass cases in E2E.
6. Remove or quarantine dead exports/modules and tighten typing in shared contracts.

## External Standards Used for Benchmarking

- Next.js App Router server action security and data-access guidance:
  - https://nextjs.org/docs/app/guides/data-security
  - https://nextjs.org/docs/app/guides/authentication
  - https://nextjs.org/docs/app/getting-started/caching-and-revalidating
- Prisma integrity/concurrency/error handling guidance:
  - https://www.prisma.io/docs/orm/prisma-client/queries/transactions
  - https://www.prisma.io/docs/orm/prisma-client/debugging-and-troubleshooting/handling-exceptions-and-errors
  - https://www.prisma.io/docs/orm/reference/error-reference
