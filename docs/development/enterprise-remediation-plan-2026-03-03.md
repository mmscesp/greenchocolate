# Enterprise Remediation And Patching Plan

Date: 2026-03-03
Input baseline: `docs/development/codebase-audit-2026-03-03.md`
Goal: Move current codebase to enterprise-grade production readiness with deterministic security, data integrity, and operational reliability.

## 1) Operating Principles (authoritative)

- Treat every Server Action as a public mutation endpoint; enforce authorization at mutation boundary (not only route/UI).
- Validate all untrusted input server-side with `safeParse` and explicit return contracts.
- Use explicit cache invalidation strategy after mutation (`refresh`, `revalidateTag`, `revalidatePath`) based on data ownership.
- For transactional hotspots, prefer Serializable isolation + bounded retry on `P2034`; map unique conflicts (`P2002`) to deterministic domain errors.
- Keep security event logging structured, minimal, and non-sensitive; constrain event taxonomy.

References used (Context7):
- Next.js v16.1.6: Server Actions authz/input/origin/caching guidance.
- Prisma docs: transactions, isolation, retries (`P2034`), upsert conflict handling (`P2002`).
- OWASP Cheat Sheet Series: CSRF and secure logging controls.

## 2) Delivery Strategy (surgical sequence)

Execution order is dependency-aware and risk-first. Do not reorder unless blockers force it.

1. Safety-pass correctness (critical trust bug)
2. Club onboarding transactional integrity
3. Membership/application concurrency and deterministic error mapping
4. Admin action input hardening (`parse` -> `safeParse`)
5. Content parsing reliability and date guards
6. Dead action/API surface reduction
7. Test hardening and verification expansion
8. Typing debt reduction in high-risk paths

## 3) Workstream Plan

## WS-1: Safety Pass Security And Lifecycle (CRITICAL)

### Files
- `app/actions/safety-pass.ts`
- `prisma/schema.prisma`
- `prisma/migrations/*` (new migration)

### Patch plan
- Introduce dedicated persisted pass model (single source of truth), e.g. `SafetyPass`:
  - `id`, `userId` (unique or 1:N by design), `passNumber` (unique), `tier`, `status`, `issuedAt`, `expiresAt`, `renewedAt`, `revokedAt`, `metadata`.
- Replace prefix-based validation in `validateSafetyPass` with strict lookup by `passNumber` and status/time checks.
- Update `generateSafetyPass` to:
  - compute deterministic/unguessable pass number,
  - write pass record transactionally,
  - avoid embedding authoritative pass state solely in encrypted profile blob.
- Update `renewSafetyPass` to persist `expiresAt` update and renewal audit metadata.

### Validation
- Unit tests:
  - valid pass, expired pass, revoked/suspended pass, unknown pass.
  - renewal updates persisted expiry.
- Data tests:
  - uniqueness of `passNumber` enforced.
- Security tests:
  - forged prefix-like pass no longer validates.

### Done when
- No pass decision is derived from `Profile.id` prefix.
- Renewal changes durable backend state.

## WS-2: Club Signup Transactional Integrity (HIGH)

### Files
- `app/actions/club-auth.ts`
- possibly `app/actions/auth.ts` (shared profile bootstrap utility)

### Patch plan
- Split external side effect vs DB phase explicitly:
  1) Supabase user create
  2) Prisma transactional phase (`$transaction`) for club + profile link + membership request
- Add compensation path: if DB phase fails after Supabase success, perform controlled rollback/deactivation for created auth user.
- Remove invalid fallbacks:
  - eliminate `cityId: ''`
  - eliminate `userId: ''`
- Introduce deterministic slug generation with collision retry loop bounded by unique constraint handling (`P2002`).
- Make default city resolution explicit failure (return typed error) if no configured default city.

### Validation
- Tests for partial failure scenarios (club create fails, profile link fails, membership request fails).
- Ensure no orphaned records in failure path.

### Done when
- No empty foreign keys are written.
- Cross-system flow is failure-safe and recoverable.

## WS-3: Concurrency + Idempotency In Membership/Application (HIGH)

### Files
- `app/actions/membership.ts`
- `app/actions/applications.ts`

### Patch plan
- Keep existing DB uniqueness (`@@unique([userId, clubId])`) as hard invariant.
- Replace check-then-create dependency with create-first flow + Prisma error mapping:
  - catch `PrismaClientKnownRequestError` code `P2002` -> return `already exists` domain state.
- For multi-write state transitions, use transactions with `Serializable` for contention hotspots.
- Add bounded retry wrapper for `P2034` on transaction conflicts.

### Validation
- Concurrency tests using parallel submissions (`Promise.all`) to confirm deterministic result:
  - exactly one success
  - others get stable `already exists` response.

### Done when
- No generic error returned for duplicate race path.
- State transitions are deterministic under parallel load.

## WS-4: Admin Input Hardening (MEDIUM)

### Files
- `app/actions/admin-users.ts`
- `app/actions/admin-clubs.ts`

### Patch plan
- Replace `schema.parse(rawInput)` with `safeParse`.
- On invalid input, return stable typed fallback response instead of throw.
- Add centralized helper for admin list filter parsing to enforce consistent behavior.

### Validation
- Unit tests for malformed query params and boundary values.
- Ensure no unhandled throw from filter parsing path.

### Done when
- Invalid admin filter input cannot produce 500 due to Zod throw.

## WS-5: Content Loader Reliability (MEDIUM)

### Files
- `lib/blog-content.ts`

### Patch plan
- Guard date parsing:
  - parse date
  - if invalid, set `publishedAt = null` (or explicit fallback policy)
  - never call `toISOString()` on invalid date.
- Add tolerant metadata parsing tests for malformed frontmatter.

### Validation
- Test fixtures with invalid/empty/non-ISO dates.
- Ensure `getAllBlogArticles()` still returns without exception.

### Done when
- Malformed article metadata cannot crash article loading.

## WS-6: Security Logging And Audit Ingestion Hardening (MEDIUM)

### Files
- `app/api/auth/audit/route.ts`
- `lib/security/auth-audit.ts`

### Patch plan
- Restrict `operation` to explicit enum/allowlist.
- Enforce metadata shape per operation (schema map), reject unknown keys where needed.
- Add optional rate limiting/throttling at endpoint boundary.
- Ensure log payload excludes sensitive values (tokens, passwords, raw PII, secrets).
- Add correlation identifier for incident tracing.

### Validation
- API tests for invalid operation, oversized metadata, and disallowed keys.

### Done when
- Audit stream is high-signal, schema-controlled, and abuse-resistant.

## WS-7: Dead Surface Reduction (MEDIUM)

### Files
- `lib/clubs.ts`
- potentially unused exports in `app/actions/clubs.ts`, `app/actions/safety-pass.ts`, `app/actions/membership.ts`

### Patch plan
- Remove unreferenced legacy module `lib/clubs.ts` or explicitly deprecate/internalize if contractual.
- Remove unused aliases in membership actions if no importers.
- For retained but currently uncalled actions, document intended call path and add tests before exposure.

### Validation
- LSP/reference scan clean after removals.
- Build and typecheck pass.

### Done when
- No orphaned action/module remains without explicit ownership.

## WS-8: Test And Quality Hardening (LOW-MEDIUM but mandatory)

### Files
- `e2e/i18n-routing.spec.ts`
- `app/actions/*.test.ts` (targeted additions)

### Patch plan
- Replace count-only assertions with semantic assertions.
- Remove conditional no-op assertion patterns in language switcher test.
- Add focused tests for:
  - safety pass lifecycle
  - club signup compensation/transaction failures
  - duplicate submission concurrency behavior
  - admin malformed filter inputs

### Validation
- `npm run test:run`
- `npm run test:e2e` (or scoped e2e file)

### Done when
- Test suite catches audited failure modes directly.

## 4) Implementation Batches (PR slicing)

- PR-1: WS-1 (safety pass + migration + tests)
- PR-2: WS-2 + WS-3 (onboarding and concurrency integrity)
- PR-3: WS-4 + WS-5 + WS-6 (input hardening, content parsing, audit controls)
- PR-4: WS-7 + WS-8 (surface cleanup + test strengthening)

Each PR must be independently deployable and rollback-safe.

## 5) Verification Gates (must pass per PR)

### Static and type gates
- LSP diagnostics clean on modified files.
- `npm run lint` passes.

### Runtime gates
- `npm run test:run` passes.
- For PRs affecting end-to-end behavior: relevant `npm run test:e2e` scope passes.
- `npm run build` passes.

### Security/data integrity gates
- No mutation endpoint missing authz check.
- No mutation path uses unchecked `parse` where user input is involved.
- No duplicate race path returns generic failure for uniqueness conflicts.

## 6) Rollout And Risk Control

- Use feature flags for disruptive behavior changes (especially pass validation path) if backward compatibility is required.
- Apply DB migration first in safe mode (additive schema), then switch read/write path, then remove legacy logic.
- Add temporary observability counters:
  - duplicate submission conflict count (`P2002` mapped path),
  - transaction retry count (`P2034`),
  - audit endpoint reject count by reason.
- Rollback strategy per PR: keep previous read path behind flag until confidence threshold reached.

## 7) Ownership And Timeline (recommended)

- Week 1: PR-1 (critical pass trust model)
- Week 2: PR-2 (transactional integrity + concurrency correctness)
- Week 3: PR-3 and PR-4 (hardening + cleanup + testing uplift)

## 8) Definition Of 10/10 Completion

- All critical/high findings in audit are closed with tests.
- Mutation security model is explicit and enforced at action boundary.
- Concurrency paths are deterministic and user-facing errors are stable.
- No known crash-on-bad-input path remains in reviewed modules.
- Dead high-risk surface removed or formally owned and tested.
