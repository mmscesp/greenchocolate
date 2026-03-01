# Launch Implementation Anchor

Status: Approved planning baseline (no code changes in this document)
Owner: Engineering (execution), Product (scope lock), Content (article publishing)
Last updated: 2026-03-01

## 1) Purpose

This document is the single execution anchor for launch hardening.

Primary launch condition:
- Zero dead links on all homepage and footer visible paths.
- Required launch assets exist and resolve.
- Public routes use consistent data sources (no mock/live mismatch on exposed paths).

This plan translates:
- `docs/domain/What Must Exist At Launch — Zero Dead Links.md`
- Current codebase reality (homepage sections, route files, actions, sitemap)

into a strict implementation sequence with verification gates.

## 2) Scope

### In scope
- Homepage and footer route integrity.
- Launch-required articles/pages from the zero-dead-links launch doc.
- Route/data consistency for editorial, events, city hubs, and directory surfaces.
- Verification gates and go/no-go rules.

### Out of scope for this launch pass
- New feature expansion not needed for required links.
- Full content quality polish beyond placeholder-safe launch requirements.
- Non-launch cities/features not linked from launch-critical surfaces.

## 3) Current State Snapshot

### Data and routing reality
- Editorial article pages are sourced via article actions/content pipeline (`app/actions/articles.ts`, `lib/blog-content.ts`, `data/content/**`).
- Clubs listing and events listing are Prisma-backed (`app/actions/clubs.ts`, `app/actions/events.ts`).
- Homepage editorial concierge blocks contain hardcoded arrays/slugs/targets in multiple blocks.
- Event detail route has mock/live parity risk (must be normalized in implementation).
- City route behavior currently conflicts with some coming-soon link expectations.
- Footer currently requires launch-safe resolution for contact/help/legal routes.

### Critical launch risk themes
- Hardcoded link target drift.
- List/detail source mismatch.
- Inconsistent coming-soon behavior.
- Missing route stubs for visible navigation.
- Sitemap path strategy drift versus locale-aware routes.

## 4) Non-Negotiable Rules

1. No visible internal link may resolve to 404/500 at launch.
2. No public route may rely on mock data while sibling surfaces use live DB for same entity type.
3. Unknown slugs must return explicit 404, except intentionally non-clickable coming-soon cards.
4. Launch scope is controlled by a single manifest and cannot drift during implementation.
5. Phase gates are binary; failure means no-go.

## 5) Launch Asset Contract

### Required launch assets
- Articles: 8 required (per launch doc)
- Pages: 13 required (per launch doc)

### Contract artifact (to be created in implementation)
Create one canonical launch manifest with these fields:
- id
- type (`article`, `page`, `city`, `club`, `event`)
- route
- source_of_truth (`mdx`, `prisma`, `static_stub`)
- status (`required`, `coming_soon_non_link`, `deferred`)
- owner
- verification_rule

All homepage/footer links must map to a manifest entry.

## 6) Phase Plan and Exit Gates

## Phase A - Integrity Hotfix
Goal: Stop all visible dead-link risk first.

Implementation focus:
- Normalize homepage/footer link targets to launch-approved routes only.
- Add/adjust missing route stubs for required visible links (contact/help/guides/directory aliases as needed).
- Enforce one coming-soon behavior for not-ready cities (non-clickable or real 200 placeholder, not mixed behavior).
- Fix locale/path inconsistencies in visible links.

Exit criteria:
- Every visible homepage/footer link resolves according to policy.
- No launch-visible route points to missing page.

## Phase B - Content Contract
Goal: Remove slug/asset drift.

Implementation focus:
- Create canonical launch manifest.
- Map all launch links and content cards to canonical IDs/slugs.
- Add publish-status checks for required launch assets.

Exit criteria:
- 100% of launch-visible links mapped to manifest rows.
- Required asset list is explicit and locked.

## Phase C - Data Source Unification
Goal: Ensure route/data parity.

Implementation focus:
- Events: list and detail must use same data source and parity rules.
- City hubs: remove mock/live contradiction; define clear launch-safe source.
- Editorial category surfaces: avoid hardcoded slug arrays where dynamic source is required.

Exit criteria:
- No exposed list/detail mismatch for events/clubs/editorial targets.
- No exposed route relies on temporary mock fallback.

## Phase C.5 - Parity Gate (Hard blocker)
Goal: Prove routing and data model alignment before content fill.

Exit criteria:
- `ORPHAN_ROUTES = 0`
- `ORPHAN_RECORDS = 0`
- `SOURCE_CONFLICTS = 0`

## Phase D - Launch Content Fill
Goal: Publish required assets with placeholder-safe text where acceptable.

Implementation focus:
- Publish/seed required 8 articles.
- Ensure required 13 pages exist and render.
- Keep strict slug contract from manifest.

Exit criteria:
- Required article/page counts met.
- Every required route resolves in app.

## Phase E - Verification Gates
Goal: Objective go/no-go evidence.

Mandatory checks:
- Build passes.
- Lint passes.
- Test suite passes (current and/or launch smoke checks).
- Internal link crawl over homepage/footer/sitemap seeds returns zero broken internal links.
- Launch manifest route probes pass.
- Unknown slug behavior validated (proper 404 or intentional non-link).

Exit criteria:
- All checks green with evidence artifacts.

## Phase F - Go-Live Ops
Goal: Controlled release and fast rollback decisioning.

Implementation focus:
- Redirect ledger.
- Owner matrix for each launch-critical surface.
- Rollback thresholds and decision SLA.

Exit criteria:
- Go/no-go signoff completed.
- Rollback procedure validated.

## 7) Verification Framework

## Required evidence artifacts
- Link crawl report
- Launch manifest verification report
- Route/data parity report
- Build/lint/test logs
- Sitemap URL probe report

## Go/no-go rule
- If any Phase E hard check fails, launch is no-go.

## 8) Decision Log Defaults

Unless overridden by product decision:
- Not-ready city previews are non-clickable at launch (preferred for zero dead-link integrity).
- No publicly visible mock-backed detail pages.
- Launch integrity is prioritized over breadth.

## 9) Execution Order (Strict)

1. Phase A
2. Phase B
3. Phase C
4. Phase C.5
5. Phase D
6. Phase E
7. Phase F

No phase can start until previous phase exit criteria are met.

## 10) Working Reference Files

Primary source docs:
- `docs/domain/What Must Exist At Launch — Zero Dead Links.md`
- `docs/domain/CompleteBlogDB.md`

Route/data touchpoints expected during implementation:
- `app/[lang]/page.tsx`
- `components/landing/editorial-concierge/**`
- `components/Footer.tsx`
- `app/[lang]/events/page.tsx`
- `app/[lang]/events/[slug]/page.tsx`
- `app/actions/events.ts`
- `app/[lang]/spain/[city]/page.tsx`
- `app/[lang]/editorial/**`
- `app/actions/articles.ts`
- `lib/blog-content.ts`
- `app/sitemap.ts`

## 11) Done Definition for This Plan

This anchor is considered complete when:
- It is used as the single implementation reference.
- Every implementation PR task maps back to one phase and one gate in this doc.
- Launch decision is made using Phase E evidence, not subjective review.
