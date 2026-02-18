# Surgical Backend Refinement Plan (Supabase Free + Netlify)

## TL;DR

> **Quick Summary**: Refine the backend implementation strategy to match the real codebase (Prisma + Supabase Auth + server actions), lock a strict $0 operational posture, and remove Vercel/paid-stack drift before any coding.
>
> **Deliverables**:
> - A corrected backend strategy centered on existing primitives (`MembershipRequest`, existing `Notification`, current security stack)
> - A Netlify-first deployment posture with explicit free-tier guardrails
> - A phased NOW vs DEFERRED scope split to prevent cost/scope creep
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 4 waves + final verification wave
> **Critical Path**: 1 -> 3 -> 8 -> 10 -> 12 -> F1-F4

---

## Context

### Original Request
Refine `docs/backendimplementationplan.md` to be more surgical and aligned with current needs: strict $0 cost now, Supabase-native where possible, Netlify instead of Vercel, and planning-only (no coding yet).

### Interview Summary
**Key Discussions**:
- User explicitly prioritized zero-dollar operations until monetization.
- User requested Supabase-native, lightweight architecture and Netlify hosting.
- User requested no coding yet; planning-only refinement.
- Test strategy selected: **Tests-after**.

**Research Findings**:
- Current app already has real backend paths (not mock-only): Prisma + Supabase Auth + server actions.
- Existing plan is over-scoped and includes paid assumptions and provider drift.
- Docs are inconsistent (Netlify intent + Vercel references coexist).
- Supabase free tier and Netlify free tier require explicit quota/usage guardrails.

### Metis Review
**Identified Gaps (addressed in this plan)**:
- Missing hard definition of $0 posture -> resolved with strict NOW/DEFERRED boundaries and paid-service exclusion.
- Missing anti-creep enforcement -> resolved with explicit Must NOT Have and compliance checks.
- Missing doc-to-code alignment checks -> resolved with executable verification gates tied to current files.
- Missing edge-case handling (quota exhaustion, callback mismatch) -> resolved with guardrail tasks.

---

## Work Objectives

### Core Objective
Produce an execution-ready, cost-constrained backend plan that reflects the current architecture, removes provider drift, and defines a minimal first implementation envelope with explicit deferrals.

### Concrete Deliverables
- Refined backend implementation plan content architecture and scope boundaries.
- Netlify + Supabase free-tier infra policy section.
- Phase-by-phase task map with verifiable acceptance criteria and QA scenarios.

### Definition of Done
- [ ] Plan contains zero paid-provider assumptions for phase NOW.
- [ ] Plan uses Netlify as deployment target and removes Vercel dependency language.
- [ ] Plan prioritizes existing backend primitives before introducing new systems.
- [ ] Plan includes quota guardrails and fallback behavior for free-tier limits.

### Must Have
- Documentation-only refinement scope.
- Supabase free-tier-native and Netlify-first strategy.
- Existing security controls preserved as non-negotiable.
- Tests-after strategy embedded in rollout.

### Must NOT Have (Guardrails)
- No immediate migration to expensive/parallel architecture for phase NOW.
- No mandatory paid email/SMS/push/webhook infrastructure in phase NOW.
- No Vercel-specific runtime/deployment assumptions.
- No acceptance criterion that requires human-only/manual validation.

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** - verification is agent-executed.

### Test Decision
- **Infrastructure exists**: YES
- **Automated tests**: Tests-after
- **Framework**: Vitest + Playwright
- **Policy**: Add/expand tests after each implementation slice, not strict TDD.

### QA Policy
Every implementation task in this plan includes explicit agent-executed QA scenarios with evidence paths in `.sisyphus/evidence/`.

| Deliverable Type | Verification Tool | Method |
|------------------|-------------------|--------|
| Planning/docs alignment | Bash + Grep + Read | Search forbidden terms, validate required sections |
| Backend/API behavior | Bash (curl) | Assert status codes, JSON shape, auth behavior |
| UI wiring | Playwright | Validate status views and state changes |
| CLI/migration flow | Bash | Run schema/migration and lint/test commands |

---

## Execution Strategy

### Parallel Execution Waves

Wave 1 (Start Immediately - baseline alignment, 5 parallel):
- Task 1: Build doc-to-code gap matrix from current repo
- Task 2: Extract free-tier quota guardrail table (Supabase + Netlify)
- Task 3: Define NOW vs DEFERRED capability boundary
- Task 4: Normalize deployment target policy (Netlify-only language)
- Task 5: Define test policy and minimum backend smoke gate

Wave 2 (After Wave 1 - architecture shaping, 5 parallel):
- Task 6: Refactor data-model roadmap to evolve existing primitives first
- Task 7: Refactor API/server-action roadmap to server-actions-first
- Task 8: Add security invariants section and non-regression rules
- Task 9: Add free-tier cost control and quota fallback strategy
- Task 10: Add deployment/runtime caveat checklist for Netlify + Next.js

Wave 3 (After Wave 2 - operational detail, 4 parallel):
- Task 11: Add migration policy (Prisma-first now, Supabase-native expansion path)
- Task 12: Add phased execution roadmap with acceptance gates
- Task 13: Add risk register + trigger-based defer criteria
- Task 14: Add verification command catalog (doc and runtime checks)

Wave 4 (After Wave 3 - polish and compliance, 3 parallel):
- Task 15: Add evidence and QA scenario templates
- Task 16: Add commit/PR strategy aligned to phased execution
- Task 17: Final internal consistency pass (remove drift/duplication)

Wave FINAL (After ALL tasks - independent review, 4 parallel):
- Task F1: Plan compliance audit (oracle)
- Task F2: Code quality/reality review (unspecified-high)
- Task F3: Real QA scenario dry-run check (unspecified-high)
- Task F4: Scope fidelity check (deep)

Critical Path: 1 -> 3 -> 8 -> 10 -> 12 -> F1-F4
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 5

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|------------|--------|------|
| 1 | - | 6, 7, 8 | 1 |
| 2 | - | 9 | 1 |
| 3 | - | 6, 7, 12, 13 | 1 |
| 4 | - | 10, 17 | 1 |
| 5 | - | 12, 15 | 1 |
| 6 | 1, 3 | 11, 12 | 2 |
| 7 | 1, 3 | 12, 14 | 2 |
| 8 | 1 | 12, 17 | 2 |
| 9 | 2 | 12, 13 | 2 |
| 10 | 4 | 12, 14 | 2 |
| 11 | 6 | 12 | 3 |
| 12 | 3, 5, 6, 7, 8, 9, 10, 11 | 16, 17 | 3 |
| 13 | 3, 9 | 17 | 3 |
| 14 | 7, 10 | 15 | 3 |
| 15 | 5, 14 | 17 | 4 |
| 16 | 12 | 17 | 4 |
| 17 | 4, 8, 12, 13, 15, 16 | F1-F4 | 4 |

### Agent Dispatch Summary

| Wave | # Parallel | Tasks -> Agent Category |
|------|------------|-------------------------|
| 1 | 5 | T1 `deep`, T2 `unspecified-high`, T3 `deep`, T4 `quick`, T5 `quick` |
| 2 | 5 | T6 `deep`, T7 `quick`, T8 `unspecified-high`, T9 `unspecified-high`, T10 `quick` |
| 3 | 4 | T11 `deep`, T12 `deep`, T13 `unspecified-high`, T14 `quick` |
| 4 | 3 | T15 `unspecified-high`, T16 `quick`, T17 `deep` |
| FINAL | 4 | F1 `oracle`, F2 `unspecified-high`, F3 `unspecified-high`, F4 `deep` |

---

## TODOs

- [ ] 1. Produce doc-to-code gap matrix

  **What to do**:
  - Enumerate current backend primitives in repo and map each to current plan sections.
  - Mark each plan line item as `MATCH`, `DRIFT`, `MISSING`, or `OVER-SCOPED`.
  - Create a correction table used by all downstream tasks.

  **Must NOT do**:
  - Invent new components not represented in codebase evidence.

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: cross-file synthesis with architectural implications.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - `playwright`: not needed for static architecture analysis.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4, 5)
  - **Blocks**: 6, 7, 8
  - **Blocked By**: None

  **References**:
  - `docs/backendimplementationplan.md` - baseline plan content to refine.
  - `prisma/schema.prisma` - actual domain model currently implemented.
  - `app/actions/membership.ts` - existing membership workflow behavior.
  - `app/actions/auth.ts` - existing auth and profile lifecycle behavior.

  **WHY Each Reference Matters**:
  - Plan refinement must anchor to real schema/action contracts, not assumptions.

  **Acceptance Criteria**:
  - [ ] Gap matrix exists with status per major plan section.
  - [ ] Every drift item includes exact file reference proving current behavior.

  **QA Scenarios**:
  ```
  Scenario: Happy path - matrix completeness
    Tool: Bash (rg)
    Preconditions: Plan and backend files present
    Steps:
      1. Search for all target domains in matrix source notes (auth, membership, notification, infra)
      2. Verify each has at least one code reference
      3. Assert no uncategorized section remains
    Expected Result: 100% sections labeled MATCH/DRIFT/MISSING/OVER-SCOPED
    Failure Indicators: Any section lacks status or evidence
    Evidence: .sisyphus/evidence/task-1-gap-matrix.txt

  Scenario: Edge case - stale assumption detected
    Tool: Bash (rg)
    Preconditions: Existing plan still contains paid/provider assumptions
    Steps:
      1. Search for Vercel and paid cost anchors
      2. Confirm each appears in drift list
    Expected Result: All found assumptions are captured as DRIFT
    Evidence: .sisyphus/evidence/task-1-stale-assumptions.txt
  ```

- [ ] 2. Build free-tier quota guardrail table

  **What to do**:
  - Consolidate Supabase and Netlify free-tier constraints into one operational table.
  - Define budget thresholds (warn level, hard-stop level) per quota type.
  - Define fallback behavior when quota risk is detected.

  **Must NOT do**:
  - Leave quotas as narrative-only text without actionable thresholds.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: requires precise external-doc extraction and policy framing.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: 9
  - **Blocked By**: None

  **References**:
  - `https://supabase.com/docs/guides/platform/billing-on-supabase` - authoritative free quotas.
  - `https://supabase.com/docs/guides/realtime/limits` - realtime technical constraints.
  - `https://docs.netlify.com/frameworks/next-js/overview/` - runtime support and caveats.
  - `https://www.netlify.com/pricing/` - free plan credit model.

  **WHY Each Reference Matters**:
  - Guardrails must derive from official constraints to avoid accidental upgrades.

  **Acceptance Criteria**:
  - [ ] Table includes DB, storage, egress, realtime, function/compute constraints.
  - [ ] Each row has threshold + fallback action.

  **QA Scenarios**:
  ```
  Scenario: Happy path - quota table completeness
    Tool: Read
    Preconditions: Guardrail table drafted
    Steps:
      1. Check rows for DB/storage/egress/realtime/functions
      2. Verify each row has "warn", "hard stop", and "fallback"
    Expected Result: All required rows and columns present
    Failure Indicators: Missing quota dimension or missing action column
    Evidence: .sisyphus/evidence/task-2-quota-table.md

  Scenario: Failure path - missing source citation
    Tool: Bash (rg)
    Preconditions: Table exists
    Steps:
      1. Search table section for links
      2. Assert each quota row has source link
    Expected Result: 0 uncited quota rows
    Evidence: .sisyphus/evidence/task-2-citations.txt
  ```

- [ ] 3. Define NOW vs DEFERRED capability boundary

  **What to do**:
  - Mark each backend capability as `NOW` or `DEFERRED` with trigger criteria.
  - Keep NOW strictly inside zero-cost, low-complexity envelope.
  - Explicitly defer webhook platform, multi-channel messaging, and advanced realtime fan-out.

  **Must NOT do**:
  - Leave DEFERRED without measurable trigger criteria.

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: strategy and scope control task.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: 6, 7, 12, 13
  - **Blocked By**: None

  **References**:
  - `docs/backendimplementationplan.md` - source capabilities inventory.
  - `INFRASTRUCTURE.md` - zero-budget direction and hosting intent.
  - `app/actions/membership.ts` - current workflow baseline.

  **WHY Each Reference Matters**:
  - Boundary decisions must preserve current delivery baseline and budget constraints.

  **Acceptance Criteria**:
  - [ ] Every major capability has NOW/DEFERRED tag.
  - [ ] Every DEFERRED item has concrete trigger (traffic/revenue/team need).

  **QA Scenarios**:
  ```
  Scenario: Happy path - full boundary tagging
    Tool: Bash (rg)
    Preconditions: Plan updated with boundary section
    Steps:
      1. Search capability list
      2. Assert each bullet contains NOW or DEFERRED
    Expected Result: 100% coverage
    Failure Indicators: Any untagged capability
    Evidence: .sisyphus/evidence/task-3-boundary-tags.txt

  Scenario: Edge case - deferred item without trigger
    Tool: Read
    Preconditions: DEFERRED entries exist
    Steps:
      1. Inspect each DEFERRED row
      2. Confirm trigger field is present and measurable
    Expected Result: No triggerless deferrals
    Evidence: .sisyphus/evidence/task-3-trigger-check.md
  ```

- [ ] 4. Normalize deployment target policy to Netlify-only

  **What to do**:
  - Replace deployment/provider assumptions in plan content with Netlify-first equivalents.
  - Add a compatibility caveat subsection for Next.js behavior differences on Netlify.
  - Explicitly prohibit Vercel-only instructions in NOW scope.

  **Must NOT do**:
  - Keep mixed-provider guidance in the same execution path.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: focused documentation normalization.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: 10, 17
  - **Blocked By**: None

  **References**:
  - `PRD.md` - contains Vercel hosting references to reconcile.
  - `SYSTEM_ARCHITECTURE.md` - contains Vercel runtime assumptions.
  - `docs/ARCHITECTURE_SCHEMA.md` - contains provider-specific references.
  - `https://docs.netlify.com/frameworks/next-js/overview/` - authoritative Netlify runtime details.

  **Acceptance Criteria**:
  - [ ] Refined plan has zero Vercel instructions in NOW scope.
  - [ ] Netlify caveat checklist is included.

  **QA Scenarios**:
  ```
  Scenario: Happy path - provider normalization
    Tool: Bash (rg)
    Preconditions: Plan draft updated
    Steps:
      1. Search refined plan for "Vercel"
      2. Validate occurrences are only in historical drift notes, not execution steps
    Expected Result: No Vercel in actionable sections
    Evidence: .sisyphus/evidence/task-4-provider-scan.txt

  Scenario: Failure path - missing caveat section
    Tool: Read
    Preconditions: Netlify policy section added
    Steps:
      1. Check for explicit caveat bullets (middleware/order/rewrite constraints)
      2. Assert each caveat has mitigation note
    Expected Result: Caveat + mitigation pairs present
    Evidence: .sisyphus/evidence/task-4-caveats.md
  ```

- [ ] 5. Lock tests-after policy and backend smoke gate

  **What to do**:
  - Add explicit tests-after policy statement in roadmap.
  - Define minimum smoke gate: each changed action/route gets at least one automated test.
  - Define non-UI verification command set for backend tasks.

  **Must NOT do**:
  - Leave testing as optional guidance.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: policy codification task.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: 12, 15
  - **Blocked By**: None

  **References**:
  - `package.json` - current test scripts.
  - `vitest.config.ts` - unit test framework baseline.
  - `playwright.config.ts` - e2e framework baseline.
  - `app/actions/auth.test.ts` - existing backend test pattern.

  **Acceptance Criteria**:
  - [ ] Plan states tests-after as required strategy.
  - [ ] Smoke gate criteria are explicit and measurable.

  **QA Scenarios**:
  ```
  Scenario: Happy path - policy clarity
    Tool: Read
    Preconditions: test strategy section updated
    Steps:
      1. Verify tests-after appears in verification strategy
      2. Verify minimum smoke gate rule appears in execution steps
    Expected Result: Both rules present and unambiguous
    Evidence: .sisyphus/evidence/task-5-test-policy.md

  Scenario: Failure path - ambiguous gate language
    Tool: Bash (rg)
    Preconditions: policy text exists
    Steps:
      1. Search for weak language ("optional", "if possible") in test gate section
      2. Assert none present
    Expected Result: 0 ambiguous qualifiers
    Evidence: .sisyphus/evidence/task-5-ambiguity-scan.txt
  ```

- [ ] 6. Refactor data-model roadmap to evolve current primitives

  **What to do**:
  - Rework data model section to start from existing `MembershipRequest` and `Notification`.
  - Specify additive evolution path instead of introducing parallel core models immediately.
  - Include explicit migration safety notes for Prisma + Supabase trigger coexistence.

  **Must NOT do**:
  - Mandate immediate wholesale replacement with new model families.

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: schema evolution planning with operational risk.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: 11, 12
  - **Blocked By**: 1, 3

  **References**:
  - `prisma/schema.prisma` - active models and enums.
  - `supabase/triggers.sql` - profile creation trigger dependencies.
  - `prisma/migrations/20260217193000_enforce_profile_role_immutability/migration.sql` - existing trigger-based hardening pattern.

  **Acceptance Criteria**:
  - [ ] New data roadmap starts with additive fields/states to existing models.
  - [ ] Any net-new model includes explicit justification and defer check.

  **QA Scenarios**:
  ```
  Scenario: Happy path - additive roadmap
    Tool: Read
    Preconditions: data-model section updated
    Steps:
      1. Verify first migration steps target MembershipRequest/Notification evolution
      2. Verify no mandatory immediate replacement language
    Expected Result: Evolution-first plan confirmed
    Evidence: .sisyphus/evidence/task-6-additive-roadmap.md

  Scenario: Edge case - trigger regression risk
    Tool: Bash (rg)
    Preconditions: migration notes present
    Steps:
      1. Search for trigger-safe caveat around profile sync
      2. Ensure rollback note is present for auth/profile coupling
    Expected Result: Trigger safety + rollback included
    Evidence: .sisyphus/evidence/task-6-trigger-safety.txt
  ```

- [ ] 7. Refactor API strategy to server-actions-first

  **What to do**:
  - Reframe plan API layer to preserve server-actions-first pattern.
  - Restrict new route handlers to external integrations/webhooks only.
  - Add contract consistency rule for action signatures and return shapes.

  **Must NOT do**:
  - Propose broad new `/api/*` surface when server actions suffice.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: pattern normalization from existing architecture.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: 12, 14
  - **Blocked By**: 1, 3

  **References**:
  - `app/actions/auth.ts` - canonical action structure.
  - `app/actions/membership.ts` - existing business workflow action style.
  - `app/api/auth/audit/route.ts` - valid case for dedicated route handler.

  **Acceptance Criteria**:
  - [ ] Plan explicitly states server actions as default backend interface.
  - [ ] Route-handler creation conditions are constrained and listed.

  **QA Scenarios**:
  ```
  Scenario: Happy path - interface policy
    Tool: Read
    Preconditions: API strategy section updated
    Steps:
      1. Confirm default interface policy says "server actions first"
      2. Confirm exceptions list exists for route handlers
    Expected Result: Clear default + exception policy
    Evidence: .sisyphus/evidence/task-7-interface-policy.md

  Scenario: Failure path - API sprawl language
    Tool: Bash (rg)
    Preconditions: strategy text drafted
    Steps:
      1. Search for broad endpoint mandates (e.g. "create API for each flow")
      2. Assert no such mandate exists
    Expected Result: No API-sprawl directives
    Evidence: .sisyphus/evidence/task-7-api-sprawl-scan.txt
  ```

- [ ] 8. Add security invariants and non-regression rules

  **What to do**:
  - Codify encryption, audit logging, origin validation, and role-immutability safeguards as mandatory invariants.
  - Tie each invariant to concrete checks in final verification.

  **Must NOT do**:
  - Downgrade existing security controls to optional.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: 12, 17
  - **Blocked By**: 1

  **References**:
  - `lib/encryption.ts` - current sensitive-data protection pattern.
  - `lib/security/auth-audit.ts` - audit event logging baseline.
  - `lib/security/origin.ts` - mutation origin validation controls.
  - `prisma/migrations/20260217193000_enforce_profile_role_immutability/migration.sql` - DB-level role protection precedent.

  **Acceptance Criteria**:
  - [ ] Invariant list includes all four controls.
  - [ ] Each control has executable verification.

  **QA Scenarios**:
  ```
  Scenario: Happy path - security coverage
    Tool: Read
    Preconditions: Security section drafted
    Steps:
      1. Confirm all four invariants are listed
      2. Confirm each has a verification check
    Expected Result: 4/4 mapped with checks
    Evidence: .sisyphus/evidence/task-8-security-coverage.md

  Scenario: Failure path - invariant drift
    Tool: Bash (rg)
    Preconditions: section present
    Steps:
      1. Search for "must preserve" markers
      2. Assert encryption/audit/origin/role all tagged
    Expected Result: No unprotected invariant
    Evidence: .sisyphus/evidence/task-8-drift-scan.txt
  ```

- [ ] 9. Add free-tier cost control and fallback strategy

  **What to do**:
  - Translate quotas into operation rules: warn threshold, hard-stop threshold, degrade mode.
  - Define fallback behaviors for realtime, storage, egress, and function pressure.

  **Must NOT do**:
  - Keep vague cost guidance without actions.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: 12, 13
  - **Blocked By**: 2

  **References**:
  - `https://supabase.com/docs/guides/platform/manage-your-usage` - monitoring and usage control source.
  - `https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages` - fan-out cost dynamics.
  - `https://supabase.com/docs/guides/storage/serving/bandwidth` - egress optimization constraints.
  - `https://www.netlify.com/pricing/` - free-plan hard-limit model.

  **Acceptance Criteria**:
  - [ ] Each quota vector includes threshold + fallback.
  - [ ] Hard-stop policy is explicit.

  **QA Scenarios**:
  ```
  Scenario: Happy path - fallback completeness
    Tool: Read
    Preconditions: Cost strategy section drafted
    Steps:
      1. Check rows for realtime/storage/egress/functions
      2. Confirm each row has fallback actions
    Expected Result: Full coverage
    Evidence: .sisyphus/evidence/task-9-fallbacks.md

  Scenario: Failure path - missing hard stop
    Tool: Bash (rg)
    Preconditions: strategy text exists
    Steps:
      1. Search for "hard stop"
      2. Assert at least one policy statement exists
    Expected Result: Hard stop present
    Evidence: .sisyphus/evidence/task-9-hardstop.txt
  ```

- [ ] 10. Add Netlify runtime caveat checklist for Next.js

  **What to do**:
  - Create validation checklist for proxy/middleware, rewrites, server actions, route handlers, env matrix.
  - Include callback URL and origin-validation checks.

  **Must NOT do**:
  - Assume host parity without explicit caveat checks.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: 12, 14
  - **Blocked By**: 4

  **References**:
  - `proxy.ts` - highest-risk runtime behavior.
  - `lib/env.ts` - runtime variable requirements.
  - `prisma.config.ts` - migration-time env requirements.
  - `https://docs.netlify.com/frameworks/next-js/overview/` - official compatibility notes.

  **Acceptance Criteria**:
  - [ ] Checklist includes all required runtime domains.
  - [ ] Each checklist item has pass/fail condition.

  **QA Scenarios**:
  ```
  Scenario: Happy path - checklist quality
    Tool: Read
    Preconditions: checklist section drafted
    Steps:
      1. Verify all runtime domains are present
      2. Verify each has pass/fail rule
    Expected Result: Checklist fully testable
    Evidence: .sisyphus/evidence/task-10-checklist.md

  Scenario: Failure path - env matrix gap
    Tool: Bash (rg)
    Preconditions: env matrix drafted
    Steps:
      1. Search for NEXT_PUBLIC_APP_URL, DATABASE_URL, DIRECT_URL, APP_MASTER_KEY, ENCRYPTION_SALT
      2. Assert each variable has scope/purpose
    Expected Result: No missing required env row
    Evidence: .sisyphus/evidence/task-10-env.txt
  ```

- [ ] 11. Add migration policy (Prisma-first now, Supabase-native expansion path)

  **What to do**:
  - Define NOW migration path using existing Prisma workflow.
  - Define controlled expansion path for Supabase-native SQL/triggers later.
  - Add rollback guidance per migration type.

  **Must NOT do**:
  - Force immediate ORM replacement.

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: 12
  - **Blocked By**: 6

  **References**:
  - `prisma.config.ts` - current migration execution model.
  - `prisma/migrations/` - existing style and sequencing.
  - `supabase/triggers.sql` - existing SQL extension precedent.
  - `https://supabase.com/docs/guides/deployment/database-migrations` - migration discipline guidance.

  **Acceptance Criteria**:
  - [ ] NOW path explicitly says Prisma-first.
  - [ ] Expansion path defines when Supabase-native SQL is allowed.
  - [ ] Rollback rules included for both paths.

  **QA Scenarios**:
  ```
  Scenario: Happy path - migration split clarity
    Tool: Read
    Preconditions: migration policy drafted
    Steps:
      1. Verify Prisma-first NOW statement
      2. Verify deferred SQL expansion conditions
    Expected Result: Two-tier policy is explicit
    Evidence: .sisyphus/evidence/task-11-policy.md

  Scenario: Failure path - rollback omission
    Tool: Bash (rg)
    Preconditions: migration section present
    Steps:
      1. Search for rollback clauses
      2. Ensure both Prisma and SQL paths are covered
    Expected Result: Rollback complete
    Evidence: .sisyphus/evidence/task-11-rollback.txt
  ```

- [ ] 12. Build phased execution roadmap with acceptance gates

  **What to do**:
  - Build a phase map that sequences NOW scope without overbuilding.
  - Add gate criteria between phases (compliance, budget, behavior stability).
  - Ensure each phase has explicit out-of-scope list.

  **Must NOT do**:
  - Bundle all features into one non-gated rollout.

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: 16, 17
  - **Blocked By**: 3, 5, 6, 7, 8, 9, 10, 11

  **References**:
  - `.sisyphus/drafts/backend-plan-supabase-netlify-zero-cost.md` - consolidated requirements and research outcomes.
  - `docs/backendimplementationplan.md` - source structure to surgically refine.

  **Acceptance Criteria**:
  - [ ] Roadmap has phase entry/exit gates.
  - [ ] Out-of-scope items are explicit per phase.

  **QA Scenarios**:
  ```
  Scenario: Happy path - gate-driven roadmap
    Tool: Read
    Preconditions: roadmap section drafted
    Steps:
      1. Verify each phase includes entry and exit criteria
      2. Verify each phase includes out-of-scope bullets
    Expected Result: No ungated phase
    Evidence: .sisyphus/evidence/task-12-roadmap.md

  Scenario: Failure path - hidden scope creep
    Tool: Bash (rg)
    Preconditions: roadmap exists
    Steps:
      1. Search for deferred features in NOW phases
      2. Assert no cross-over unless trigger met
    Expected Result: Scope boundaries intact
    Evidence: .sisyphus/evidence/task-12-scope-scan.txt
  ```

- [ ] 13. Add risk register and defer-trigger criteria

  **What to do**:
  - Create risk table (cost, runtime, security, delivery drift) with mitigation and owner.
  - Add objective triggers that move DEFERRED items into active scope.

  **Must NOT do**:
  - Keep deferral logic subjective.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: 17
  - **Blocked By**: 3, 9

  **References**:
  - `INFRASTRUCTURE.md` - cost and platform posture.
  - `SYSTEM_ARCHITECTURE.md` - current architecture drift risks.

  **Acceptance Criteria**:
  - [ ] Top risks have probability, impact, mitigation, trigger.
  - [ ] DEFERRED trigger metrics are numeric where possible.

  **QA Scenarios**:
  ```
  Scenario: Happy path - risk table quality
    Tool: Read
    Preconditions: risk register added
    Steps:
      1. Confirm each risk row has probability/impact/mitigation
      2. Confirm each DEFERRED trigger has measurable threshold
    Expected Result: Actionable risk register
    Evidence: .sisyphus/evidence/task-13-risk-register.md

  Scenario: Failure path - non-measurable trigger
    Tool: Bash (rg)
    Preconditions: defer criteria drafted
    Steps:
      1. Search for vague trigger phrases ("when needed", "later")
      2. Assert none remain unqualified
    Expected Result: No vague trigger text
    Evidence: .sisyphus/evidence/task-13-trigger-vagueness.txt
  ```

- [ ] 14. Build verification command catalog

  **What to do**:
  - Compile commands for doc compliance, backend behavior checks, and quota-risk checks.
  - Map each command to expected result and failure indicator.

  **Must NOT do**:
  - Provide command list without expected outputs.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: 15
  - **Blocked By**: 7, 10

  **References**:
  - `app/api/auth/audit/route.ts` - representative API behavior to validate.
  - `app/actions/membership.ts` - representative action behavior to validate.
  - `package.json` - canonical script commands.

  **Acceptance Criteria**:
  - [ ] Each command has expected success and failure signatures.
  - [ ] Commands cover doc, API, and test layers.

  **QA Scenarios**:
  ```
  Scenario: Happy path - command completeness
    Tool: Read
    Preconditions: catalog drafted
    Steps:
      1. Verify each command has expected output text
      2. Verify each command has failure indicator text
    Expected Result: Fully actionable catalog
    Evidence: .sisyphus/evidence/task-14-command-catalog.md

  Scenario: Failure path - unbounded command
    Tool: Bash (rg)
    Preconditions: catalog exists
    Steps:
      1. Search for commands lacking expected result line
      2. Assert zero missing metadata
    Expected Result: All commands bounded
    Evidence: .sisyphus/evidence/task-14-command-bounds.txt
  ```

- [ ] 15. Add QA evidence template set

  **What to do**:
  - Define uniform evidence naming and minimum proof requirements per scenario type.
  - Include API logs, grep outputs, and Playwright screenshots where relevant.

  **Must NOT do**:
  - Allow task completion without evidence file requirements.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: 17
  - **Blocked By**: 5, 14

  **References**:
  - `.sisyphus/evidence/` - canonical evidence directory target.
  - `playwright.config.ts` - screenshot and trace behavior baseline.

  **Acceptance Criteria**:
  - [ ] Evidence pattern documented for all scenario classes.
  - [ ] Missing-evidence condition explicitly fails task completion.

  **QA Scenarios**:
  ```
  Scenario: Happy path - evidence standardization
    Tool: Read
    Preconditions: evidence template section drafted
    Steps:
      1. Verify naming convention includes task id + scenario slug
      2. Verify required artifact type per scenario is listed
    Expected Result: Standard template complete
    Evidence: .sisyphus/evidence/task-15-template.md

  Scenario: Failure path - weak evidence policy
    Tool: Bash (rg)
    Preconditions: section exists
    Steps:
      1. Search for "optional evidence" language
      2. Assert none exists
    Expected Result: Evidence mandatory policy enforced
    Evidence: .sisyphus/evidence/task-15-policy-scan.txt
  ```

- [ ] 16. Add commit and PR strategy aligned to phases

  **What to do**:
  - Define commit granularity and message style per wave.
  - Add merge readiness criteria tied to verification gates.

  **Must NOT do**:
  - Bundle all execution into one large final commit.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: 17
  - **Blocked By**: 12

  **References**:
  - `package.json` - verification commands for pre-commit checks.
  - `AGENTS.md` - repo conventions baseline.

  **Acceptance Criteria**:
  - [ ] Strategy defines commit boundaries by task group.
  - [ ] PR readiness checks are explicit and executable.

  **QA Scenarios**:
  ```
  Scenario: Happy path - commit strategy clarity
    Tool: Read
    Preconditions: commit strategy section drafted
    Steps:
      1. Verify per-wave commit boundaries
      2. Verify pre-merge checks listed
    Expected Result: Executable commit/PR policy
    Evidence: .sisyphus/evidence/task-16-commit-policy.md

  Scenario: Failure path - atomicity risk
    Tool: Bash (rg)
    Preconditions: strategy text exists
    Steps:
      1. Search for "single mega commit" style language
      2. Assert not present
    Expected Result: Atomic strategy preserved
    Evidence: .sisyphus/evidence/task-16-atomicity-scan.txt
  ```

- [ ] 17. Final internal consistency pass

  **What to do**:
  - Validate full document consistency: terms, phases, dependencies, and provider posture.
  - Remove contradictions and duplicate directives.

  **Must NOT do**:
  - Leave unresolved conflicts across sections.

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential closeout
  - **Blocks**: F1, F2, F3, F4
  - **Blocked By**: 4, 8, 12, 13, 15, 16

  **References**:
  - `.sisyphus/plans/backend-supabase-netlify-zero-cost-surgical.md` - full-plan coherence target.
  - `.sisyphus/drafts/backend-plan-supabase-netlify-zero-cost.md` - source decisions and constraints.

  **Acceptance Criteria**:
  - [ ] No conflicting instructions remain.
  - [ ] All task dependencies align with matrix.
  - [ ] All guardrails appear in execution and verification sections.

  **QA Scenarios**:
  ```
  Scenario: Happy path - coherence validation
    Tool: Read
    Preconditions: all prior tasks complete
    Steps:
      1. Cross-check waves, dependencies, and task blocks
      2. Cross-check Must NOT Have against TODO content
    Expected Result: No internal conflicts
    Evidence: .sisyphus/evidence/task-17-coherence.md

  Scenario: Failure path - contradiction scan
    Tool: Bash (rg)
    Preconditions: final draft exists
    Steps:
      1. Search for mixed provider directives (Netlify + Vercel actionable text)
      2. Search for both NOW and DEFERRED tags on same item without condition
    Expected Result: 0 unresolved contradictions
    Evidence: .sisyphus/evidence/task-17-contradictions.txt
  ```

---

## Final Verification Wave (MANDATORY - after ALL implementation tasks)

- [ ] F1. **Plan Compliance Audit** - `oracle`
  - Verify each Must Have and Must NOT Have using grep/read evidence.
  - Verify no paid-stack or Vercel assumptions remain in final plan.
  - Output: `Must Have [N/N] | Must NOT Have [N/N] | VERDICT`

- [ ] F2. **Code/Reality Review** - `unspecified-high`
  - Validate refined plan aligns with current files and primitives.
  - Output: `Alignment [PASS/FAIL] | Drift Issues [N] | VERDICT`

- [ ] F3. **Scenario Dry-Run Check** - `unspecified-high`
  - Ensure all QA scenarios are executable and evidence paths are valid.
  - Output: `Scenarios [N/N valid] | Evidence Paths [N/N] | VERDICT`

- [ ] F4. **Scope Fidelity Check** - `deep`
  - Ensure no scope creep beyond approved NOW boundary.
  - Output: `Scope [CLEAN/ISSUES] | Deferred Boundaries [OK/FAIL] | VERDICT`

---

## Commit Strategy

| After Task Group | Message | Files | Verification |
|------------------|---------|-------|--------------|
| Wave 1 docs | `docs(plan): align backend scope with zero-cost constraints` | planning docs | grep/read checks |
| Wave 2 docs | `docs(plan): add architecture and guardrail detail` | planning docs | grep/read checks |
| Wave 3-4 docs | `docs(plan): finalize rollout, risk, and verification` | planning docs | lint + checks |

---

## Success Criteria

### Verification Commands
```bash
rg -n --hidden -S "Vercel|\$55/month|Supabase \$25|Vercel \$20|SendGrid|Resend" "docs/backendimplementationplan.md"
# Expected: no active NOW-scope references requiring paid stack or Vercel

rg -n --hidden -S "NOW|DEFERRED|Must NOT Have|free tier|Netlify|Supabase" "docs/backendimplementationplan.md"
# Expected: sections present and populated

rg -n --hidden -S "MembershipRequest|Notification|server action|Prisma|Supabase" "docs/backendimplementationplan.md"
# Expected: roadmap anchored to current primitives
```

### Final Checklist
- [ ] All Must Have requirements are represented.
- [ ] All Must NOT Have guardrails are enforceable.
- [ ] Netlify + Supabase free-tier constraints are explicit.
- [ ] Deferred items have clear trigger criteria.
- [ ] QA scenarios are executable with evidence paths.
