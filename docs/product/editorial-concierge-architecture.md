# Editorial Concierge: Component Architecture Plan

**Status**: Pure Planning (No Code Executed)
**Goal**: Map the React component tree, state flow, and animation hooks for the new "High-End Digital Magazine meets Private Concierge" homepage.

This architecture follows the **Next.js App Router Server-First Pattern**: we use Server Components for data fetching, SEO, and structural layout, and inject highly isolated Client Components ("Client Islands") *only* where Framer Motion or interactive state is required.

---

## 1. Directory Structure (The New Isolation)

To avoid breaking the current site while we build, we will create a dedicated `editorial-concierge` folder.

```text
components/
└── landing/
    └── editorial-concierge/
        ├── layout/                 # Structural server wrappers
        ├── blocks/                 # The 11 core visual sections
        ├── interactive/            # Client Islands (Framer Motion, State)
        ├── typography/             # Reusable Serif/Sans components
        └── motion/                 # Centralized Framer Motion variants
```

---

## 2. Component Tree Breakdown

Here is the exact mapping of the 11 planned sections to their React counterparts.

### `app/[lang]/page.tsx` (The Entry Point)
*   **Type**: Server Component.
*   **Role**: Keeps the existing Hero. Imports the new `EditorialConciergeFlow` right below it. Removes old post-hero widget imports.

### Section 1: The Trust Strip
*   **Component**: `blocks/TrustStrip.tsx` (Server Component)
*   **Role**: Renders the slim, frosted-glass "Last Audited" bar.
*   **Client Island**: `interactive/PulsingStatusDot.tsx` (Client) -> Uses a tiny Framer Motion `animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}` loop for the live "verified" dot.

### Section 2: Knowledge Router (Bento Grid)
*   **Component**: `blocks/KnowledgeRouter.tsx` (Server Component)
*   **Role**: Maps over the 8 topics (Laws, CBD, Body, etc.) and renders the grid layout.
*   **Client Island**: `interactive/BentoCard.tsx` (Client)
    *   **Props**: `title`, `description`, `imageSrc`, `href`.
    *   **Motion Hooks**: 
        *   `whileHover={{ scale: 0.98 }}` on the wrapper (subtle press effect).
        *   `animate` on the image child for a smooth 1.05x scale zoom.
        *   `AnimatePresence` to fade in the description text *only* on hover.

### Section 3: Reality Check ("Spain is not Amsterdam")
*   **Component**: `blocks/RealityCheck.tsx` (Server Component)
*   **Role**: Sets the dark Midnight Charcoal background and the massive Serif header.
*   **Client Island**: `interactive/StickyAccordion.tsx` (Client)
    *   **State**: `activeIndex` (number | null).
    *   **Motion Hooks**: `layout` prop on the cards so they smoothly resize when clicked. The content inside uses `initial={{ opacity: 0, y: 10 }}` to fade in like a secure terminal.

### Section 4: Start Here (Split Screen)
*   **Component**: `blocks/BeginnersOnramp.tsx` (Server Component)
*   **Role**: Pure layout CSS Grid. Left side is text/links, right side is the artistic image.
*   **Client Island**: `interactive/MagneticButton.tsx` (Client) for the "Read Guide" CTA. Uses `usePointerEvent` and `useSpring` to subtly pull the button toward the user's cursor within a 20px radius.

### Section 5: Interactive Tools (The Concierge Upgrade)
*   **Component**: `blocks/ConciergeTools.tsx` (Server Component)
*   **Client Island A**: `interactive/RotaryFineEstimator.tsx` (Client)
    *   **State**: `severityLevel` (number 0-100).
    *   **Motion Hooks**: `useMotionValue` and `useTransform` to map the drag distance to the odometer numbers (e.g., `€601` morphing to `€30,000`).
*   **Client Island B**: `interactive/EligibilityFlow.tsx` (Client)
    *   **State**: `currentStep` (number), `answers` (object).
    *   **Motion Hooks**: `AnimatePresence` with `mode="wait"`. As one question fades out `x: -50`, the next fades in `x: 50`, creating a seamless, high-end questionnaire feel.

### Section 6: The Vault (Featured Guides)
*   **Component**: `blocks/FeaturedVault.tsx` (Server Component)
*   **Role**: Fetches `getFeaturedArticles(3)` from your existing API and passes data down.
*   **Client Island**: `interactive/VaultCard.tsx` (Client)
    *   **Motion Hooks**: `useInView` (triggers the card to slide up slightly when it enters the viewport). Hovering triggers the arrow `→` icon to `animate={{ x: 5 }}`.

### Section 7: Stay Highly Informed (Weekly Drop)
*   **Component**: `blocks/NewsletterDrop.tsx` (Server Component)
*   **Role**: The full-width, slow-moving gradient section.
*   **Client Island**: `interactive/BespokeSubscriptionForm.tsx` (Client)
    *   **State**: `email` (string), `selectedInterests` (array of strings), `status` (idle/loading/success).
    *   **Interaction**: Selecting the "Laws/Culture/Strains" pill checkboxes uses Framer Motion's `layoutId` to animate a sleek border ring around the selected pills.

### Section 8: Our Standard (The Verification Moat)
*   **Component**: `blocks/VerificationStandard.tsx` (Server Component)
*   **Role**: Renders the stark, beautiful table of "What we check" vs "What we cannot guarantee."
*   **Client Island**: `interactive/TopographicMesh.tsx` (Client) -> A very lightweight, purely decorative background element that slowly pans across the section.

### Section 9: Barcelona Roadmap
*   **Component**: `blocks/CommunityRoadmap.tsx` (Server Component)
*   **Client Island**: `interactive/GlowingTimeline.tsx` (Client)
    *   **Motion Hooks**: `useScroll` and `useTransform` tied to the container ref. As the user scrolls down, the glowing line visually "fills up" to the current milestone.

### Section 10: FAQ (The Apple-Level Simplicity)
*   **Component**: `blocks/EditorialFAQ.tsx` (Server Component)
*   **Role**: Holds the cleaned-up, high-trust FAQ data.
*   **Client Island**: `interactive/MinimalAccordion.tsx` (Client)
    *   **Motion Hooks**: Radix UI Accordion primitives under the hood (for perfect accessibility), wrapped in Framer Motion for a custom, buttery-smooth height expansion (`animate={{ height: "auto" }}`) and a 45-degree `rotate` on the `+` icon.

### Section 11: The Monolithic Final CTA
*   **Component**: `blocks/FinalMicDrop.tsx` (Server Component)
*   **Role**: The massive 100vh block with darkened cinematic imagery.
*   **Client Islands**: Reuses the `MagneticButton` and `BespokeSubscriptionForm` components built for earlier sections.

---

## 3. Data Flow & Typography Strategy

### Centralized Motion Config (`motion/config.ts`)
Instead of hardcoding spring values everywhere, we define them once. This guarantees the entire site feels physically consistent.
```typescript
// Pure planning concept - no execution
export const PREMIUM_SPRING = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  restDelta: 0.001
};

export const EDITORIAL_FADE_UP = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { ...PREMIUM_SPRING }
};
```

### Typography Wrappers (`typography/`)
To enforce the Editorial/Concierge split without rewriting Tailwind classes everywhere:
*   `<EditorialHeading>`: Always uses the Serif font stack, tight tracking (letter-spacing), and optimized line-height.
*   `<ConciergeLabel>`: Always uses the clean Sans/Mono font stack, uppercase, wide tracking, and subtle text colors (e.g., `text-zinc-500`).

---

## 4. Next Steps for Execution

If this architecture plan perfectly aligns with your vision, the surgical execution path is:
1.  **Setup phase:** Install the required premium fonts (Serif/Sans split) and create the `editorial-concierge` folder structure.
2.  **Server phase:** Scaffold the 11 Server Components (`blocks/`) with static mock data to get the spatial rhythm and typography right.
3.  **Client phase:** Inject the `interactive/` Framer Motion islands one by one to add the "God-Level" polish.
4.  **Integration:** Swap the old components in `app/page.tsx` for the new flow.

Does this component blueprint match the level of detail you need before we begin the actual coding phase?