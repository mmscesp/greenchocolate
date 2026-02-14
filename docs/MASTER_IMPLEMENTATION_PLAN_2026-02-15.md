# Master Implementation Plan (Preparation Only)

Date: 2026-02-15
Objective: move current codebase from transitional MVP to robust, deployable launch platform aligned with `scm_blueprint.md` and `docs/knowledge-vault.md`
Constraint for this phase: planning only (no code fixes executed)

---

## 0) Execution rules for all phases

- Do not do broad rewrites; use surgical deltas only
- Every phase closes with evidence:
  - lint/build status
  - targeted test status
  - regression notes
- Keep feature and hardening work separated (one concern per PR/commit batch)
- Update docs and operational runbooks in the same phase as behavior change

---

## 1) Current-state summary

- Build: passes
- Lint: passes with warnings
- Core foundations present: Next.js App Router, Supabase auth, Prisma models, i18n structure, SEO scaffolding
- Main blockers before enterprise launch:
  - critical query safety issue
  - auth/route protection mismatch under localized pathing
  - incomplete public route families (events/spain/city deep pages)
  - SEO and i18n canonical consistency gaps
  - limited automated validation of high-risk flows

---

## 2) Phase roadmap (ordered)

## Phase 1 - Security and correctness foundation (P0)

Goal: remove high-risk vulnerabilities and stabilize access control pathing.

Scope:
- Replace unsafe SQL usage with parameterized safe alternatives
- Remove type suppression in auth-critical path and regenerate/alignment of Prisma types
- Normalize localized route checks in proxy protection logic
- Confirm sensitive snapshot storage approach is encrypted and policy-aligned

Deliverables:
- No `queryRawUnsafe` in request-facing actions
- No `@ts-ignore` in auth/role workflow
- Route protection works for `/{lang}/...` path families
- Security notes updated in `SECURITY.md`

Acceptance criteria:
- `npm run lint` (no new warnings introduced)
- `npm run build` passes
- manual auth traversal matrix passes:
  - unauthenticated -> blocked on protected pages
  - authenticated user -> blocked from admin-only pages
  - CLUB_ADMIN -> permitted in own panel only

Commit strategy:
- Commit 1: query safety fixes
- Commit 2: auth/proxy localized guard correctness
- Commit 3: type safety cleanup + docs notes

---

## Phase 2 - Route and SEO unification (P0/P1)

Goal: make routing, canonicalization, and crawl behavior coherent for multilingual launch.

Scope:
- Standardize links to locale-aware URLs in app pages/components
- Align metadata/canonical generation with actual route topology
- Consolidate sitemap/robots strategy (root vs localized duplication)
- enforce public vs gated crawl policy in line with compliance-first blueprint

Deliverables:
- locale-safe navigation primitives used across pages
- canonical + alternates strategy defined and consistently applied
- one authoritative sitemap generation approach with clear inclusion rules

Acceptance criteria:
- internal link crawl has no locale breakage
- metadata snapshots for key pages validated
- robots/sitemap outputs match intended index policy

Commit strategy:
- Commit 1: locale-safe link normalization
- Commit 2: metadata/canonical consistency
- Commit 3: sitemap/robots consolidation

---

## Phase 3 - Data-access and domain service cleanup (P1)

Goal: reduce drift and improve maintainability/reliability of business logic.

Scope:
- De-duplicate overlapping membership/user action logic
- Introduce explicit action response contracts (`success/data/error`) for critical reads/writes
- tighten JSON field typing/validation boundaries where currently permissive
- centralize env validation contract

Deliverables:
- single-source ownership per business operation
- predictable error surfaces for UI and logs
- validated env contract loaded at startup

Acceptance criteria:
- no duplicate endpoint/action responsibilities for same operation
- action contract test coverage for negative paths
- startup fails fast on invalid/missing required env vars

Commit strategy:
- Commit 1: action ownership consolidation
- Commit 2: response-contract standardization
- Commit 3: env contract + type boundary cleanup

---

## Phase 4 - Launch-critical feature completion (P1)

Goal: complete currently placeholder route families needed by business plan.

Scope:
- productionize `spain`, `city`, `neighborhood`, `events`, and `city-club` routes
- connect pages to real data contracts (not mock stubs)
- enforce public teaser vs gated detail split in sensitive areas

Deliverables:
- no placeholder pages in indexed/high-intent routes
- consistent city/neighborhood/event data pipelines
- compliant public copy and gated operational details

Acceptance criteria:
- smoke traversal over all high-intent route templates
- content contracts validated for missing/empty edge cases
- no broken SSR/SSG builds from route param/data mismatch

Commit strategy:
- one commit per route family to keep rollback safe

---

## Phase 5 - Testing and operational hardening (P1/P2)

Goal: verify reliability and deploy with confidence.

Scope:
- expand Vitest coverage for server actions and validation logic
- implement Playwright happy-path + auth-protection E2E tests
- introduce lightweight observability/logging policy (sanitized logs)
- produce deployment checklist and rollback playbook

Deliverables:
- minimum test suite for core funnels:
  - auth signup/login/logout
  - membership request submit/approve/reject/cancel
  - role-based page access
  - SEO critical pages render and metadata present

Acceptance criteria:
- `npm run test:run` passes
- `npm run test:e2e` passes on CI profile
- release checklist complete with rollback path

---

## 3) Workstream matrix

- Security: query safety, PII handling, auth gates, logging sanitization
- Platform reliability: error contracts, env validation, action consolidation
- SEO/i18n: canonical/hreflang/link consistency, sitemap/robots policy
- Product completion: city/neighborhood/event route maturity
- QA and release: unit+e2e coverage, deploy/rollback procedures

---

## 4) Suggested execution cadence

- Sprint A (3-4 days): Phase 1
- Sprint B (3-4 days): Phase 2
- Sprint C (4-5 days): Phase 3
- Sprint D (5-7 days): Phase 4
- Sprint E (3-5 days): Phase 5

Total: ~3-4 weeks to robust deployable baseline, assuming focused execution and no major schema pivots.

---

## 5) Verification command checklist (every phase)

Mandatory:
- `npm run lint`
- `npm run build`

When tests are touched:
- `npm run test:run`
- `npm run test:e2e` (or targeted spec)

Release candidate gate:
- production build output review
- robots/sitemap sanity check
- auth and role path matrix pass

---

## 6) Definition of done for "deployable enterprise-ready MVP"

- No critical/high known security findings open
- Localized route protection and navigation are consistent
- High-intent public pages are complete (not placeholder)
- SEO baseline is coherent and crawlable
- Core business flows are covered by tests and pass in CI-like run
- Operational runbook exists for deploy, monitor, and rollback
