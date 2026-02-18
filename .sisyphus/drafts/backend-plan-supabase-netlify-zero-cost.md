# Draft: Backend Plan Refinement (Supabase + Netlify, Zero Cost)

## Requirements (confirmed)
- Refine existing backend implementation plan to be more surgical and aligned with current business phase.
- Keep platform cost at $0 until monetization phase.
- Prefer Supabase free-tier-native architecture and primitives.
- Use Netlify (not Vercel) for hosting strategy.
- No coding yet; planning only.
- Review latest repository commit to understand most recent completed work.

## Technical Decisions
- Planning artifact will be produced under `.sisyphus/plans/` per planner constraints.
- Existing `docs/backendimplementationplan.md` is treated as source context to improve.

## Research Findings
- Initial source plan heavily references Prisma-centric modeling and includes paid-cost assumptions (`$55/month`, Supabase Pro, Vercel Pro).
- Latest commit reviewed: `680d21f8dd47c8ef332ec5e1830b741248a23aba` (`feat(conversion): implement trust-gated member journey and passport dashboard`).
- Current backend stack in code: Supabase Auth (`@supabase/ssr`) + Prisma/Postgres data layer (`@prisma/client`, Prisma adapter-pg, server actions in `app/actions/*.ts`).
- Existing DB schema currently includes `Notification` and `MembershipRequest`, but does NOT include planned models such as `SafetyPass`, `MembershipApplication`, `ApplicationStageHistory`, `ClubAdminNotification`.
- UI components for status/passport are currently presentation-level (`components/profile/ApplicationStatusTracker.tsx`, `components/profile/MemberPassport.tsx`) without corresponding backend workflow models/actions.
- Infrastructure docs are mixed: `INFRASTRUCTURE.md` already points to Netlify + Supabase free tier; other docs still contain Vercel assumptions.
- Repo currently has no `netlify.toml` and no CI workflows under `.github/workflows/`.
- Supabase MCP state confirms current deployed tables and migrations exist; RLS coverage is partial (some tables show `rls_enabled: false`).
- Test tooling exists (`vitest`, `playwright`) and at least one backend-oriented test file exists (`app/actions/auth.test.ts`), but coverage is shallow and mock-heavy.
- Supabase official free-tier guidance (librarian result): design around strict quotas and favor Postgres-native logic + selective Edge Function usage to avoid invocation/egress spikes.
- Explore backend architecture audit result:
  - Current architecture is already partially real backend (not mock-only): Prisma + Supabase Auth + server actions.
  - Existing domain primitives are centered on `MembershipRequest`, not `MembershipApplication`.
  - Existing security primitives are present and should be preserved: encryption, audit logs, origin validation, DB triggers.
  - Current plan doc overstates new architecture compared to repo reality and introduces parallel model/API surface too early.
  - Recommended surgical direction: evolve existing primitives incrementally; defer multi-channel notifications/realtime/webhooks.
- Testing infrastructure assessment result:
  - Tooling exists (`vitest`, `playwright`) with scripts + configs.
  - Current backend test depth is minimal and mock-heavy (`app/actions/auth.test.ts`).
  - No active CI workflows detected.
  - Recommendation: `tests-after` with mandatory smoke coverage per changed backend unit.
- Netlify deployment research result:
  - Netlify officially supports App Router, SSR/ISR, Route Handlers, Server Actions via OpenNext adapter.
  - Important caveats for plan: middleware/runtime behavior differences, edge limitations, environment variable scoping nuances, free-tier budget enforcement.
  - Practical direction: keep zero-config adapter defaults; avoid pinning plugin unless required.

## Cost Baseline (Supabase + Netlify)
- Supabase Free (official): 500 MB DB/project, 1 GB storage, 5 GB egress, 50k MAU, 500k edge function invocations, 2M realtime messages, 200 peak realtime connections.
- Netlify Free (official): free plan with hard monthly limits/credits and pause behavior when limits are exceeded.
- Zero-cost guardrail implication: architecture must be explicit about rate limits, payload minimization, realtime fan-out control, and storage discipline.

## Plan Drift Detected in Source Doc
- Uses Prisma schema snippets for future models but does not reconcile with Supabase-native options (SQL migrations, RLS-first design).
- Assumes paid stack in cost section (`Supabase Pro`, `Vercel Pro`, paid email provider).
- Over-scopes channels (`SMS`, `PUSH`) and webhook complexity before MVP core pipeline is stable.
- Mentions realtime and email automation without free-tier quota controls or fallback envelopes.

## Open Questions
- Determine exact zero-cost scope boundaries for launch (email volume, realtime usage, storage, cron).
- Confirm whether Prisma should remain in roadmap or be replaced by Supabase-native SQL + migrations.
- One background hosting audit agent (`bg_7dd978d9`) is still pending final result and may add additional Vercel->Netlify doc drift items.

## Test Strategy Decision
- Infrastructure exists: YES (`vitest` + `playwright` present)
- Automated tests: YES (Tests-after)
- Agent-executed QA: mandatory in final plan

## Scope Boundaries
- INCLUDE: backend architecture planning, infra-cost strategy, deployment/runtime decisions.
- EXCLUDE: implementation/code changes.
