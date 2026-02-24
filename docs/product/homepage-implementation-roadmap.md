# SocialClubsMaps Homepage Implementation Roadmap

This document outlines the tactical, step-by-step execution plan for the "Editorial Concierge" homepage rebranding. It follows the approved Architecture and Masterplan docs.

## Execution Strategy: "The Parallel Path"
We will build the new homepage components in a dedicated `components/landing/editorial-concierge` directory. This allows us to build and test the new "God-Level" design in isolation before switching the main route.

---

## Phase 1: Foundation & Design System
**Goal**: Establish the premium aesthetic (Serif/Sans split) and centralized motion logic.

1.  **Typography Setup**:
    *   Integrate premium Serif font (e.g., `Playfair Display` or `Editorial New`) into Tailwind config.
    *   Create `typography/EditorialHeading.tsx` and `typography/ConciergeLabel.tsx` wrappers.
2.  **Motion Foundation**:
    *   Create `motion/config.ts` with the "Premium Spring" and "Fade Up" variants.
3.  **Core Layout**:
    *   Scaffold `components/landing/editorial-concierge/EditorialConciergeFlow.tsx` (Server Component).
    *   Create basic structural wrappers in `layout/SectionWrapper.tsx`.

## Phase 2: Structural Scaffolding (The Server Shell)
**Goal**: Build the primary layout of the new 11 sections using static data to verify spatial rhythm.

1.  **Trust Strip**: Build `blocks/TrustStrip.tsx` with its Monospace "Last Audited" label.
2.  **Topic Router (Bento Grid)**:
    *   Create the 8 topic cards in a responsive grid.
    *   Use macro-photography placeholders (Laws, CBD, Body, etc.).
3.  **Beginners Onramp**: Build the split-screen layout for "First time?" and "What does it feel like?".
4.  **Stay Highly Informed**: Build the newsletter section skeleton with the large minimal input.
5.  **Roadmap & FAQ Shell**: Migrate data into the new editorial-style layouts.

## Phase 3: Interactive Refinement (Client Islands)
**Goal**: Inject the "God-Level" polish via isolated Framer Motion components.

1.  **Interactive Router**: Implement hover-zoom and description-reveal on the Bento cards.
2.  **Tool Upgrade - Fine Calculator**: Refactor the calculator into a "Concierge Tool" with haptic-feel motion.
3.  **Tool Upgrade - Eligibility Quiz**: Refactor into a multi-step "Concierge Onboarding" flow.
4.  **Sticky Accordion**: Implement the stacking "Reality Check" cards.
5.  **Timeline & Glow**: Add the `useScroll` glowing line to the Barcelona Roadmap.

## Phase 4: Content & Editorial Integration
**Goal**: Connect real articles, fix i18n, and ensure 100% compliance with tone guardrails.

1.  **Article Integration**: Connect `FeaturedVault` to `getFeaturedArticles` with the new card design.
2.  **i18n Migration**: Move all hardcoded strings into dictionary keys (ES/EN/CA/DE/IT/FR).
3.  **Tone Cleanup**: Review every string against the "Non-promotional / Safety-first" guardrails.
4.  **The Weekly Drop**: Implement the static-but-fresh "This Week In Barcelona" timeline.

## Phase 5: Launch & Transition
**Goal**: Switch the homepage and cleanup the legacy code.

1.  **The Switch**: Update `app/[lang]/page.tsx` to render `EditorialConciergeFlow` after the Hero.
2.  **Performance Check**: Verify Core Web Vitals (LCP, INP, CLS) specifically on mobile.
3.  **Cleanup**:
    *   Archive legacy `HomePageContent.tsx`.
    *   Delete unused marketing components from `components/marketing/`.
4.  **Verification**: Final walkthrough with the "Is this AI Slop?" test (it should feel like a premium boutique agency).

---

## 📅 High-Level Todo List (Implementation Track)

### 🧱 Phase 1: Foundations
- [ ] [F1] Configure Serif/Sans fonts in `tailwind.config.ts`
- [ ] [F2] Create `motion/config.ts` with premium animation presets
- [ ] [F3] Create typography atomic components (`EditorialHeading`, `ConciergeLabel`)

### 🏗️ Phase 2: Building the Shell
- [ ] [S1] Build `TrustStrip` with real-time status UI
- [ ] [S2] Implement `KnowledgeRouter` Bento Grid layout
- [ ] [S3] Build `BeginnersOnramp` split-screen section
- [ ] [S4] Scaffold `StayHighlyInformed` newsletter section

### ✨ Phase 3: Adding Polish (Client Islands)
- [ ] [P1] Build `BentoCard` interactive hover states
- [ ] [P2] Redesign `FineCalculator` for "Pro" feel
- [ ] [P3] Redesign `EligibilityQuiz` into a "Concierge Onboarding"
- [ ] [P4] Add `StickyAccordion` for Reality Check sections

### 📖 Phase 4: Data & Tone
- [ ] [D1] Implement `FeaturedVault` article cards
- [ ] [D2] Complete i18n migration for all new homepage sections
- [ ] [D3] Write "This Week In Barcelona" content block
- [ ] [D4] Fix corrupted FAQ text and apply new "High-Trust" answers

### 🚀 Phase 5: Deployment
- [ ] [L1] Integrate `EditorialConciergeFlow` into the main `page.tsx`
- [ ] [L2] Run Core Web Vitals audit and optimize image sizes
- [ ] [L3] Archive legacy homepage code
