# Landing Page 1000/10 Master Plan

Date: 2026-02-24
Owner: Product + Design + Frontend + Content
Status: Planning complete, execution pending

## Mission

Transform the landing page from "good" to category-defining by combining:

1. Frictionless conversion UX.
2. Trust-first compliance narrative.
3. Premium visual and interaction quality.
4. Measurement-driven iteration cadence.

This plan assumes the current live architecture remains trust-first and will be improved with precise upgrades, not random redesign.

## North-Star Outcomes

### Primary

- Increase qualified lead conversion rate (Safety Kit / Newsletter / Account starts).
- Increase CTA reliability to 100% (no dead buttons, no missing destinations).
- Reduce early drop-off in first 25 seconds.

### Secondary

- Improve mobile scan clarity and section comprehension.
- Improve trust confidence before commitment asks.
- Preserve legal/compliance-safe positioning and avoid broker-like behavior.

## Strategic Principles (Non-Negotiable)

1. Education before transaction-like intent.
2. Trust before data capture.
3. One clear primary CTA per decision stage.
4. Every CTA must map to a real path/action.
5. Progressive disclosure: compact proof early, detail later.
6. Mobile-first readability and interaction affordance.
7. No compliance theater: transparent, specific claims only.

## Ground Truth Baseline

### Current top-level structure

- `HeroSection`
- `EditorialConciergeFlow` with blocks:
  - `TrustStrip`
  - `BeginnersOnramp`
  - `KnowledgeRouter`
  - `FeaturedVault`
  - `RealityCheck`
  - `VerificationStandard`
  - `ConciergeTools`
  - `NewsletterDrop`
  - `EditorialFAQ`
  - `CommunityRoadmap`
  - `FinalMicDrop`

### Current high-impact issues to eliminate first

1. CTA destination integrity gaps (missing routes and non-wired buttons).
2. Locale path inconsistencies for some action links.
3. Mid-flow copy density that can lower scanning momentum.
4. Objection handling and final CTA logic not fully unified.

## Master Execution Architecture

## Phase 0: Tracking and Guardrails (Foundation)

Goal: no blind optimization.

Deliverables:

- Event taxonomy for all landing interactions (view, scroll-depth, CTA click, form submit, success, exit intent).
- Unified KPI dashboard definition (top-of-funnel, mid-funnel, final conversion).
- Baseline snapshot before any visual/flow edits.

Definition of done:

- Every major interaction has measurable telemetry.
- Baseline metrics captured and frozen for comparison.

## Phase 1: Conversion Integrity Hardening (Must ship first)

Goal: remove trust-breaking friction.

Deliverables:

- CTA integrity audit resolved for all landing sections.
- Hero CTA paths mapped to valid language-aware routes.
- Replace dead button affordances with real links or explicit disabled/coming-soon treatment.
- Ensure form submit flows have clear success/error states.

Definition of done:

- 0 dead CTAs.
- 0 broken route transitions from landing.
- 100% primary CTA click path continuity.

## Phase 2: Narrative Compression and Clarity

Goal: improve comprehension speed without losing authority.

Deliverables:

- Rewrite high-density blocks into scan-first structures (headline + short bullets + action).
- Sharpen second section (`BeginnersOnramp`) to explicit outcomes + compact proof.
- De-duplicate trust copy across `TrustStrip` and `VerificationStandard`.

Definition of done:

- First 3 sections understandable in under 15 seconds of scanning.
- Reduced repeated claims and cognitive load.

## Phase 3: Section Flow Optimization (Not radical reorder)

Goal: strengthen conversion momentum while preserving trust-first architecture.

Target flow:

1. Hero
2. TrustStrip
3. BeginnersOnramp
4. KnowledgeRouter
5. FeaturedVault
6. RealityCheck
7. VerificationStandard
8. ConciergeTools
9. NewsletterDrop
10. EditorialFAQ
11. CommunityRoadmap
12. FinalMicDrop

Adjustments inside this flow:

- Earlier lightweight email hook near section 2-3.
- Keep heavy asks lower until trust and clarity are established.
- Keep legal/safety facts visible but concise.

Definition of done:

- Clear staged path: Discover -> Trust -> Understand -> Act.

## Phase 4: Premium UI/UX Quality Lift

Goal: make the page unmistakably premium without reducing clarity.

Deliverables:

- Tight typography scale and spacing system by section intent.
- Visual hierarchy polish for CTA prominence and supporting copy.
- Interaction pass for hover/focus/active states across all actionable elements.
- Motion audit: meaningful animation only, avoid decorative noise.

Definition of done:

- No visual ambiguity about primary vs secondary actions.
- Smooth, intentional micro-interactions across desktop and mobile.

## Phase 5: Mobile and Accessibility Excellence

Goal: conversion and trust parity on mobile.

Deliverables:

- Refactor hover-dependent interactions to explicit tap-friendly patterns.
- Ensure readable line lengths, touch targets, and section spacing on small screens.
- Keyboard navigation and visible focus rings across all CTAs and forms.
- Accessibility checks on contrast, headings, and interaction semantics.

Definition of done:

- No critical mobile UX blockers.
- Accessibility checks pass for priority landing interactions.

## Phase 6: Trust and Compliance Precision Layer

Goal: increase confidence while reducing legal/platform risk.

Deliverables:

- Standardize claim language (what we do / do not do).
- Place disclosures contextually near relevant CTAs/forms.
- Validate compliance tone against blueprint guardrails.
- Ensure "education-first, not brokering" remains explicit and consistent.

Definition of done:

- Trust proof is specific and verifiable.
- No copy implies illicit facilitation.

## Phase 7: Experimentation System (Ongoing)

Goal: move from opinion-led design to evidence-led optimization.

Experiment tracks:

1. Section 2 variants:
   - A: Benefits-first cards.
   - B: Benefits + compact proof strip.
2. Hero CTA framing variants:
   - safety-led vs confidence-led phrasing.
3. Mid-page capture timing:
   - early hook (section 3) vs current position (section 9).

Cadence:

- 1 high-impact experiment per sprint.
- Predefined success thresholds before rollout.
- Weekly operating rhythm:
  - Monday: prioritize backlog (impact x confidence x effort).
  - Tuesday: instrumentation QA and data-quality preflight.
  - Wednesday: controlled ramp (1% -> 5% -> 25% -> target).
  - Thursday-Friday: monitor OEC + guardrails + trust metrics.

Experiment governance model:

- OEC (primary outcome) + guardrails + diagnostics + data-quality checks.
- Mandatory SRM and telemetry integrity checks before interpreting results.
- No early winner declaration without predefined stopping rule.

Hypothesis template:

```text
If we change [X] for [segment Y],
then [behavior Z] will improve because [evidence/principle],
which should move [primary metric] by at least [MDE],
without harming [guardrails].
```

Metric quality standard:

- Metrics must be sensitive, trustworthy, interpretable, and actionable.
- Metrics that fail quality checks are not decision-grade.

Definition of done:

- Documented experiment backlog, hypotheses, and decision log.

## Phase 8: Content Operating System for Sustained Performance

Goal: keep landing quality compounding, not decaying.

Deliverables:

- Content refresh cadence for trust facts, legal references, and featured editorial blocks.
- Quarterly landing quality review checklist.
- Change control for CTA, route, and copy consistency.

Definition of done:

- No stale trust claims.
- No regression in CTA integrity after updates.

## KPI Tree (What to Measure)

Top funnel:

- Hero primary CTA CTR.
- Scroll depth to section 3 and section 9.
- Bounce/exit within first 20 seconds.

Mid funnel:

- KnowledgeRouter interaction rate.
- FeaturedVault engagement rate.
- RealityCheck -> VerificationStandard progression rate.

Bottom funnel:

- Newsletter form completion rate.
- Final CTA click-through rate.
- Account/register initiation rate.

Quality and trust:

- CTA error rate (target 0).
- Form error abandonment rate.
- Trust copy comprehension proxy (FAQ open and completion).
- Compliance confidence pulse after key actions (target >= 4.2/5).
- Qualified intent rate (QIR) as primary quality metric.

## Guardrail Metrics (Go/No-Go)

Promote changes only if all are true:

1. QIR improves by at least 10% vs baseline.
2. Compliance confidence is non-inferior (no meaningful drop).
3. CTA mismatch rate stays below 0.5%.

Block or roll back if any occur:

1. CTA mismatch rate above 0.5%.
2. Legal/support contacts increase by more than 10%.
3. Ineligibility dead-end abandonment rises by more than 8%.

Rollback SLA target: under 24 hours after confirmed breach.

## Trust/Compliance UX Pattern Checklist

Apply these patterns section-by-section during implementation:

1. Value-first hero with no forced data capture.
2. Eligibility checks as guided questions, not dense legal paragraphs.
3. Progressive legal disclosure (summary first, deep detail on demand).
4. Upfront fee and requirement transparency before any form.
5. Symmetric consent controls (accept and reject equally clear).
6. Trust proof ladder before hard commitment asks.
7. Persistent legal utility links (privacy, cookie settings, contact, methodology).

Anti-patterns to explicitly avoid:

1. Forced signup/login before value context.
2. Pre-checked consent or hidden reject path.
3. Non-essential cookie behavior before consent.
4. Buried mandatory terms/fees.
5. Fake urgency or deceptive interaction patterns.

## Risks and Mitigations

1. Risk: overloading users with legal copy.
   - Mitigation: concise safety facts + expandable detail.
2. Risk: visual polish hurting clarity.
   - Mitigation: hierarchy-first reviews before style refinements.
3. Risk: frequent edits break routes/CTAs.
   - Mitigation: CTA integrity checklist as release gate.
4. Risk: platform/compliance tone drift.
   - Mitigation: fixed copy guardrails and periodic compliance review.

## Release Gates (Ship Criteria)

No phase can be marked complete unless:

1. CTA integrity check passes.
2. Mobile UX sanity checks pass.
3. Accessibility priority checks pass.
4. KPI instrumentation covers changed surfaces.
5. Copy remains aligned with trust/compliance blueprint.

## Execution Readiness

Status: Ready to execute once this plan is approved.

Immediate first sprint:

1. Phase 0 baseline instrumentation setup.
2. Phase 1 CTA and route integrity fixes.
3. Phase 2 second-section compression and trust-proof tuning.
