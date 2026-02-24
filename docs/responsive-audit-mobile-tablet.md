# Responsive Audit - Mobile/Tablet Hardening

Date: 2026-02-24
Scope: Next.js app responsive hardening in two phases.
Constraint honored: no visual/layout/styling edits were made in `components/HeroSection.tsx`.

## 1) Phase 1 issues found

- Conversion-critical surfaces had mobile pressure from large fixed paddings (`p-8`, `p-10`, `p-12`) and dense CTA clusters.
- Several high-intent controls were below practical touch target size in filter toggles, carousel/image controls, and action pills.
- Some sections used non-wrapping/truncation patterns that risked clipping or crowding in 320-390 widths.
- Clubs browse flow had cramped mobile control bars and oversized empty-state spacing.
- Safety/safety-kit conversion sections had CTA rows that could be less stable on narrow widths.

## 2) Phase 1 fixes implemented (file-by-file)

- `components/landing/editorial-concierge/layout/SectionWrapper.tsx`
  - Reduced base container side padding to `px-4 sm:px-6 lg:px-8` to protect 320-390 widths.

- `components/marketing/SafetyKitForm.tsx`
  - Made panel spacing responsive (`p-6 sm:p-8 md:p-10`).
  - Reduced heading scale on small screens (`text-2xl sm:text-3xl`).

- `app/[lang]/safety-kit/page.tsx`
  - Improved CTA tap target and click area with rounded full-width-friendly link sizing (`min-h-11`, `px-4 py-2`).
  - Tuned hero vertical rhythm for small screens.

- `components/FilterBar.tsx`
  - Header now stacks/wraps on mobile (`flex-col ... sm:flex-row`).
  - Increased interactive chip/toggle targets to practical tap size (`min-h-11`, slightly larger vertical padding).
  - Improved clear-all action tapability.

- `app/[lang]/clubs/ClubsPageClient.tsx`
  - Mobile-friendly horizontal padding (`px-4 sm:px-6`).
  - Responsive control-row behavior (`flex-wrap`, mobile stack for view controls).
  - Improved toggle button and reset button hit area (`min-h-11`).
  - Reduced empty-state spacing on mobile (`p-8 sm:p-12 lg:p-20`).

- `app/[lang]/safety/page.tsx`
  - Responsive spacing harmonized across hero/cards/emergency/CTA sections (`p-6 sm:p-8 md:p-12`).
  - Ensured CTA button can fill available width on mobile and remains prominent.

- `app/[lang]/clubs/[slug]/ClubProfileContent.tsx`
  - Trust strip now uses responsive padding/gaps and safer small-screen layout behavior.
  - Increased carousel-like image nav controls to practical mobile tap area (`min-h-11 min-w-11`).
  - Standardized card paddings across profile sections for mobile/tablet.
  - Improved CTA and modal close button hit areas.

- `components/Footer.tsx`
  - Bottom legal links now wrap cleanly on small screens.
  - Copyright text aligns safely for mobile.

- `components/landing/editorial-concierge/*` Phase 1 conversion-impact blocks
  - Updated: `TrustStrip.tsx`, `BeginnersOnramp.tsx`, `VerificationStandard.tsx`, `ConciergeTools.tsx`, `EditorialFAQ.tsx`, `CommunityRoadmap.tsx`, `FinalMicDrop.tsx`, `FeaturedVault.tsx`, `StickyAccordion.tsx`, `EligibilityFlow.tsx`, `RotaryFineEstimator.tsx`.
  - Main changes: responsive paddings, minimum CTA/tap targets, safer text scaling/tracking on mobile, and reduced crowding risk for 320-390 widths.

## 3) Phase 1 validation results (lint/build + key viewport checks)

- LSP diagnostics on all modified Phase 1 files: **0 errors**.
- `npm run lint`: **pass**.
- `npm run build`: **pass**.
- Key viewport checks:
  - Browser automation was intentionally skipped per user instruction.
  - Code-level checks applied for 320/360/375/390/414 and 768/820/834/1024 by enforcing:
    - responsive paddings and wrapping layouts,
    - `min-h-11` on critical controls,
    - reduction of fixed-size crowding patterns.

## 4) Phase 2 issues found

- Sidebar/navigation surfaces used desktop-first width and small toggle controls.
- Dropdown/profile surfaces used fixed-width and icon-button sizes that were tight for touch.
- Carousel controls were too small and positioned off-canvas on mobile.
- Profile reviews filters/actions had small action icons and narrow select behavior under mobile constraints.

## 5) Phase 2 fixes implemented

- `components/admin/DashboardSidebar.tsx`
  - Safer responsive container sizing (`w-full md:w-64`, `h-full md:h-screen`).
  - Increased nav/footer action hit targets (`min-h-11`).

- `components/profile/ProfileSidebar.tsx`
  - Removed nowrap pressure in animated text containers.
  - Increased nav/footer row hit area to `min-h-11`.
  - Increased collapse toggle size (`h-8 w-8`).
  - Mobile sheet width now responsive (`w-[85vw] max-w-80`).

- `components/club/ClubSidebar.tsx`
  - Same responsive/hit-target hardening as profile sidebar.

- `components/UserProfileDropdown.tsx`
  - Dropdown width now clamps to viewport (`w-[min(20rem,calc(100vw-1rem))]`).
  - Increased trigger/avatar/icon container dimensions and item row hit area (`min-h-11`, larger icon bubbles).

- `components/layout/MainNavigation.tsx`
  - Replaced rigid menu panel widths with responsive clamped width progression.

- `components/ui/carousel.tsx`
  - Increased nav controls for touch on mobile (`h-11 w-11` on base).
  - Repositioned controls inside safe viewport edges on small screens.

- `app/[lang]/profile/reviews/page.tsx`
  - Filter select is now mobile-safe width with `min-h-11`.
  - Edit/delete action icons increased to `h-11 w-11`.
  - Review stats row can wrap instead of crowding.

## 6) Remaining follow-ups (if any)

- Optional: run manual visual QA in browser at all target widths (320, 360, 375, 390, 414, 768, 820, 834, 1024, 1280+) for final pixel-level polish.
- Optional: normalize small typography tokens (`text-[10px]` and tight tracking) in remaining non-critical surfaces for full consistency.
- Non-blocking: update Browserslist database (`npx update-browserslist-db@latest`) to remove build warning.
