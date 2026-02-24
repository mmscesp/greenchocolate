# Landing Page Execution Todo Tracker

Date: 2026-02-24
Status legend: `[ ]` not started, `[-]` in progress, `[x]` done

Use this file as the single source of truth during implementation.

## Phase 0 - Instrumentation and Baseline

- [ ] Define event taxonomy for landing funnel (hero CTA, section CTA, form start, form submit, success, error, drop-off).
- [ ] Add tracking utilities and typed event names.
- [ ] Instrument all CTA clicks in landing blocks.
- [ ] Instrument form success/error for newsletter/safety-kit paths.
- [ ] Capture baseline metrics snapshot before UI changes.

## Phase 1 - CTA Integrity (Critical)

### Hero and top-level actions

- [ ] Resolve missing hero route for `Get the Free Safety Guide` (`/safety-guide`).
- [ ] Resolve missing hero route for `How It Works` (`/how-it-works`).
- [ ] Normalize hero CTA routes to locale-aware paths.
- [ ] Ensure primary CTA is singularly dominant in hero (visual + copy).

### Editorial concierge blocks

- [ ] Wire `BeginnersOnramp` "Read the Guide" action.
- [ ] Wire `FeaturedVault` "Explore Archive" action.
- [ ] Wire `ConciergeTools` "Read the Legal Basics" action.
- [ ] Wire `EditorialFAQ` "Get the Safety Kit" action.
- [ ] Wire both `FinalMicDrop` buttons to real destinations/actions.
- [ ] Validate `CommunityRoadmap` register CTA for locale-safe routing.
- [ ] Implement working submit flow for `NewsletterDrop` (submit, success, error states).

### Footer and global trust links

- [ ] Replace all footer `href="#"` social/support placeholders with valid URLs or remove temporarily.
- [ ] Implement or remap `/terms` to an existing valid legal page.
- [ ] Implement or remap `/privacy` to an existing valid legal page.
- [ ] Implement or remap `/cookies` to an existing valid legal page.

### Release gate for phase 1

- [ ] CTA audit table completed with 0 dead actions.
- [ ] All CTA destinations open valid pages for all supported locales.
- [ ] All footer legal/support links are valid and intentional.

## Phase 2 - Interaction Contract and Accessibility

### FAQ and disclosure interactions

- [ ] Replace hover-only FAQ reveal with explicit accordion behavior.
- [ ] Ensure all FAQ entries are keyboard and touch accessible.

### Clickable semantics

- [ ] Convert clickable non-semantic cards/divs to proper buttons or links.
- [ ] Remove fake affordances (`cursor-pointer`) from non-interactive elements.
- [ ] Add accessible names to icon-only controls (carousel, modal close, etc.).

### Form accessibility

- [ ] Add explicit labels/ARIA descriptions for waitlist and safety-kit inputs.
- [ ] Ensure input error and success states are announced clearly.

### Release gate for phase 2

- [ ] Keyboard traversal check passes on all interactive landing elements.
- [ ] Mobile touch interaction parity achieved for all FAQ and card interactions.

## Phase 3 - Narrative Compression and Hierarchy

- [ ] Refactor hero copy stack to reduce cognitive overload.
- [ ] Keep one primary action per stage, demote secondary actions.
- [ ] Tighten `BeginnersOnramp` copy into outcome-first bullets.
- [ ] Add compact trust proof near the second-section CTA.
- [ ] Remove repetitive trust claims between `TrustStrip` and `VerificationStandard`.
- [ ] Ensure legal messaging remains clear but not overwhelming.

## Phase 4 - Flow and Information Architecture

- [ ] Preserve approved section order from master plan.
- [ ] Add lightweight early subscription hook near section 2/3.
- [ ] Reduce mid-page branch noise in `KnowledgeRouter` for mobile-first scanning.
- [ ] Ensure `FeaturedVault` emphasizes essential starter paths.
- [ ] Validate transition continuity from `RealityCheck` -> `VerificationStandard` -> action.

## Phase 5 - Clubs Flow Friction Fixes

- [ ] Remove or disable non-functional map mode until it is fully shipped.
- [ ] Implement progressive filter disclosure for mobile.
- [ ] Reduce initial filter cognitive load (top 1-2 high-signal filters visible first).
- [ ] Ensure listing-to-profile flow prioritizes user momentum.

## Phase 6 - Premium UI/UX Polish

- [ ] Establish final type scale and spacing tokens for landing sections.
- [ ] Unify CTA visual language (primary, secondary, tertiary).
- [ ] Tighten animation timing and remove non-essential motion noise.
- [ ] Run contrast and readability checks on all major section backgrounds.
- [ ] Align desktop and mobile visual intent for every section.

## Phase 7 - Experimentation Program

- [ ] Define OEC + guardrails + diagnostics + data-quality checks for each test.
- [ ] Add SRM checks to experiment runbook.
- [ ] Define default MDE and sample-size calculation workflow.
- [ ] Create experiment readout template (primary, guardrail, trust, data-quality sections).

### Experiment track A: second section

- [ ] Variant A: outcomes-first cards.
- [ ] Variant B: outcomes + compact proof strip.
- [ ] Define success metrics (CTR, progression, lead conversion).
- [ ] Run experiment and log decision.

### Experiment track B: CTA timing and placement

- [ ] Test early subscription hook vs current newsletter position.
- [ ] Test hero CTA wording variants (safety-led vs confidence-led).
- [ ] Compare final CTA pair phrasing for action clarity.

## Phase 8 - Compliance and Trust Governance

- [ ] Build copy guardrail sheet (allowed and forbidden phrasing).
- [ ] Place relevant disclosures near forms and high-intent CTAs.
- [ ] Verify all trust claims are specific and supportable.
- [ ] Ensure "education-first, not brokering" remains consistent sitewide.

## Phase 9 - QA, Verification, and Launch

- [ ] Component-level QA on all edited landing sections.
- [ ] Responsive QA (mobile, tablet, desktop) for layout and interactions.
- [ ] Accessibility QA for keyboard/focus/labels.
- [ ] Verify analytics events firing and dashboard capture.
- [ ] Capture post-launch benchmark against baseline metrics.

## File-Scoped Work Queue (Implementation Map)

### High-priority landing files

- [ ] `components/HeroSection.tsx`
- [ ] `components/landing/editorial-concierge/EditorialConciergeFlow.tsx`
- [ ] `components/landing/editorial-concierge/blocks/BeginnersOnramp.tsx`
- [ ] `components/landing/editorial-concierge/blocks/FeaturedVault.tsx`
- [ ] `components/landing/editorial-concierge/blocks/ConciergeTools.tsx`
- [ ] `components/landing/editorial-concierge/blocks/NewsletterDrop.tsx`
- [ ] `components/landing/editorial-concierge/blocks/EditorialFAQ.tsx`
- [ ] `components/landing/editorial-concierge/blocks/CommunityRoadmap.tsx`
- [ ] `components/landing/editorial-concierge/blocks/FinalMicDrop.tsx`

### Shared UX-risk files

- [ ] `components/marketing/TouristMistakes.tsx`
- [ ] `components/marketing/WaitlistForm.tsx`
- [ ] `components/marketing/SafetyKitForm.tsx`
- [ ] `components/FilterBar.tsx`
- [ ] `app/[lang]/clubs/ClubsPageClient.tsx`
- [ ] `app/[lang]/clubs/[slug]/ClubProfileContent.tsx`

## Sprint Kickoff Order

1. Phase 1 CTA integrity.
2. Phase 2 interaction/accessibility fixes.
3. Phase 3 narrative compression.
4. Phase 4-5 flow improvements.
5. Phase 6 premium polish.
6. Phase 7 experimentation.
