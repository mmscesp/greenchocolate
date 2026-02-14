# Enterprise Readiness Audit (Preparation Only)

Date: 2026-02-15
Scope: full repository review for production launch readiness (functionality, robustness, optimization, best-practice alignment)
Sources used: repository code, `scm_blueprint.md`, `docs/knowledge-vault.md`, official-stack best-practice research (Next.js, Supabase, Prisma)

---

## 1) What was done in this phase

- Full codebase structure mapping across `app/`, `components/`, `hooks/`, `lib/`, `prisma/`, `supabase/`, `data/`, `docs/`, `e2e/`, `test/`
- Parallel internal and external research (architecture patterns, risk scan, official best practices)
- Baseline verification run:
  - `npm run lint` -> pass with 17 warnings (0 errors)
  - `npm run build` -> pass
- No code fixes were applied (preparation-only phase)

---

## 2) High-level architecture snapshot

### Runtime stack

- Framework: Next.js App Router (`next@16.1.6`) with localized segment routes under `app/[lang]/`
- Auth: Supabase SSR/browser clients (`lib/supabase/server.ts`, `lib/supabase/client.ts`, `components/auth/AuthProvider.tsx`)
- Data: Prisma + Postgres (`lib/prisma.ts`, `prisma/schema.prisma`)
- Validation: Zod used widely in server actions
- Content + i18n: JSON dictionaries in `dictionaries/*.json`, content and strategy docs in `docs/` and root markdown files
- Testing: Vitest + Playwright configured (`vitest.config.ts`, `playwright.config.ts`), low test coverage currently

### Key domains found

- Public discovery and SEO pages (`app/[lang]/clubs`, `app/[lang]/learn`, `app/[lang]/editorial`, `app/[lang]/spain/*`, `app/[lang]/events/*`)
- Account and membership workflows (`app/[lang]/account/*`, `app/actions/membership.ts`, `app/actions/users.ts`)
- Club admin workflows (`app/[lang]/club-panel/*`, `app/actions/clubs.ts`, `app/actions/club-auth.ts`)
- Shared data-access layer via server actions (`app/actions/*.ts`)

---

## 3) Repository structure map (functional)

### Core app layers

- `app/`
  - Root metadata/layout, sitemap, robots, global styles
  - `app/[lang]/...` localized application routes
  - `app/actions/*.ts` server-side business/data operations
  - `app/api/profile/me/route.ts` profile API bridge for auth context
- `components/`
  - UI primitives (`components/ui/`)
  - Domain components (`club/`, `city/`, `auth/`, `profile/`, `marketing/`, `layout/`)
- `hooks/`
  - Language context and translator
  - Club fetching hook
  - Toast helper
- `lib/`
  - Auth helpers, data helpers, i18n, dictionary loader
  - Prisma singleton and Supabase client factories
  - Encryption service for PII
- `prisma/`
  - Schema with City/Club/Profile/Membership/Article/Event/etc.
- `supabase/`
  - SQL/triggers assets
- `data/`
  - Mock JSON datasets

---

## 4) Priority findings (gaps and risks)

## Critical

1. SQL injection risk via unsafe raw SQL
   - Evidence: `app/actions/clubs.ts:470`, `app/actions/clubs.ts:495`
   - Problem: `$queryRawUnsafe` with interpolated slug in query string
   - Impact: potential injection vector in high-traffic filtering endpoints

2. Type safety bypass in production auth path
   - Evidence: `app/actions/club-auth.ts:150`
   - Problem: `@ts-ignore` used for `managedClubId`
   - Impact: hidden schema/type drift in auth-critical workflow

## High

3. Auth protection mismatch against localized paths
   - Evidence: `proxy.ts:90`-`proxy.ts:103`
   - Problem: route checks use non-localized prefixes (`/profile`, `/account/requests`, etc.) while actual app routes are under `/{lang}/...`
   - Impact: middleware/proxy protection logic can miss expected paths and behave inconsistently

4. Mixed route generations and inconsistent route strategy
   - Evidence: localized routes under `app/[lang]/*` but many hardcoded links/canonicals point to non-localized URLs, e.g. `app/[lang]/clubs/page.tsx:23`, `app/[lang]/learn/page.tsx:86`, `app/[lang]/editorial/page.tsx:77`
   - Impact: SEO canonical drift, navigation inconsistency, i18n UX breaks

5. Public pages still in placeholder/mock state while indexed routes exist
   - Evidence: `app/[lang]/spain/page.tsx`, `app/[lang]/events/page.tsx`, `app/[lang]/events/[slug]/page.tsx`, `app/[lang]/spain/[city]/clubs/[slug]/page.tsx`
   - Impact: weak launch trust, crawl budget waste, conversion drop

6. Sensitive payload handling inconsistent with encryption intent
   - Evidence: encrypted snapshot object in `app/actions/club-auth.ts:163`-`app/actions/club-auth.ts:173`
   - Impact: sensitive registration details may remain queryable/readable as plain JSON

## Medium

7. Duplicate business logic surfaces increase drift risk
   - Evidence: overlapping membership functions in `app/actions/membership.ts` and `app/actions/users.ts`
   - Impact: inconsistent behavior and bug-fix duplication

8. Error handling often degrades to silent empty results
   - Evidence: multiple action catch blocks returning `[]`/`null` in `app/actions/articles.ts`, `app/actions/cities.ts`, `app/actions/clubs.ts`
   - Impact: operational blind spots and user-facing false "no data" states

9. SEO configuration duplicated at root and localized levels
   - Evidence: both `app/sitemap.ts` + `app/[lang]/sitemap.ts`, and `app/robots.ts` + `app/[lang]/robots.ts`
   - Impact: governance complexity and conflicting crawl directives

10. Legacy/unused artifacts and strategy docs create execution ambiguity
   - Evidence: many overlapping plan/report docs at root (`*_PLAN*.md`, `*_REPORT*.md`)
   - Impact: delivery confusion and stale guidance risk

11. Warnings in lint baseline indicate predictable production debt
   - Evidence:
     - missing effect deps (`hooks/useClubs.ts:55`, `components/club/ClubDashboardClient.tsx:34`)
     - raw `<img>` in performance-sensitive pages/components
   - Impact: stale state bugs and preventable CWV regressions

---

## 5) Product-to-vision gap analysis (blueprint alignment)

Compared against `scm_blueprint.md` and `docs/knowledge-vault.md`:

- Strong foundations already present:
  - i18n shell and multi-route architecture
  - core data model (cities/clubs/articles/events/membership)
  - basic role model (`USER`/`ADMIN`/`CLUB_ADMIN`)
  - security intent via encryption service and consent records

- Major launch gaps still open:
  - compliance-first public/private information split not fully enforced
  - Spain city/neighborhood/guide/event route families are not production-complete
  - trust pages and verification methodology are not fully operationalized in code flows
  - SEO system is only partially productionized (canonical/i18n/sitemap consistency missing)
  - test coverage does not yet validate core business-critical funnels end-to-end

---

## 6) Baseline quality evidence

### Build and lint status

- `npm run lint`
  - Result: pass with warnings only
  - 17 warnings, 0 errors
- `npm run build`
  - Result: successful production build
  - app routes generated successfully

### Current maturity level

- Classification: transitional codebase
  - there is clear architecture intent and domain modeling
  - but production-hardening, route consistency, and critical safety fixes are incomplete

---

## 7) Immediate preparation outcomes

- You now have a concrete, evidence-backed risk map and architecture map
- No fixes were applied yet (per instruction)
- Next phase should be an execution plan with strict order:
  1) critical security/auth/routing correctness
  2) launch-critical route completion and SEO consistency
  3) reliability/performance hardening
  4) full verification gates (lint/build/tests/monitoring)
