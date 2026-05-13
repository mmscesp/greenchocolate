# SCM UI Layout and Design Audit

**Date:** 2026-05-13  
**Mode:** Engineering Mode  
**Scope:** Static codebase UI scan across public SCM pages, discovery pages, club profiles, editorial pages, account/profile surfaces, admin surfaces, shared layout primitives, and high-impact components.  
**Requested constraint:** No product code changes. This file is the only deliverable created in this round.  
**Active skill stack:** `scm` + `frontend-skill`

## Executive Diagnosis

SCM currently has the ingredients of a strong visual system: dark editorial base, Barcelona imagery, trust-first typography, teal/saffron accents, and real venue assets. The main problem is not lack of design effort. The problem is that the UI has split into several parallel design systems that do not share one layout rhythm.

The codebase now contains at least four competing UI languages:

1. **Cinematic editorial system**: full-bleed dark imagery, serif display headings, teal trust signals, glass panels.
2. **Shadcn/default app system**: `bg-background`, `bg-card`, `text-primary`, rounded cards, light/dark token surfaces.
3. **Dashboard rail system**: slate admin panels, expandable rails, dense utility layout.
4. **Older marketplace/SaaS system**: card mosaics, stats strips, generic icon cards, gradient panels, and some cannabis-leaf iconography.

This produces the exact issues you described: items appear centered where they should be anchored, pages lose alignment between sections, sticky elements fight fixed headers, components have different radii and spacing, and some surfaces feel like they belong to different products.

The highest-priority UI work should be a **layout-system consolidation round**, not isolated pixel fixes. The site needs one shared page-shell rhythm, one spacing scale, one radius policy, one hero/header contract, and a clear distinction between public editorial pages and private/admin app surfaces.

## Audit Method

I scanned:

- `app/[lang]/**` page and layout files.
- Shared UI components under `components/**`.
- Navigation, hero, club discovery, profile, admin, auth, and editorial surfaces.
- Global styling tokens in `app/globals.css`.
- Repeated class patterns for containers, sticky/fixed positioning, radii, viewport sizing, uppercase tracking, background systems, and card usage.

I did **not** modify application code. I did not perform a browser screenshot pass in this round, so several findings are code-evident layout risks rather than screenshot-confirmed rendering defects. Browser validation should be the first step before implementation.

## Severity Legend

- **P0:** High-impact layout/design defect likely visible on major traffic surfaces.
- **P1:** Strong inconsistency or responsive risk that undermines perceived quality.
- **P2:** Local polish issue or maintainability problem that compounds over time.

---

# P0 Findings

## 1. Global Page Rhythm Is Fragmented Across Major Surfaces

**Affected areas**

- `app/[lang]/page.tsx`
- `components/HeroSection.tsx`
- `components/landing/editorial-concierge/**`
- `app/[lang]/editorial/page.tsx`
- `app/[lang]/clubs/ClubsPageClient.tsx`
- `app/[lang]/spain/SpainPageClient.tsx`
- `app/[lang]/spain/[city]/CityPageClient.tsx`
- `app/[lang]/safety-kit/page.tsx`
- `app/[lang]/events/EventsPageClient.tsx`
- `app/[lang]/contact/page.tsx`

**Evidence**

- `components/landing/editorial-concierge/layout/SectionWrapper.tsx:16` hard-codes `py-24`.
- `components/landing/editorial-concierge/layout/SectionWrapper.tsx:27` hard-codes `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- `app/[lang]/editorial/page.tsx:230`, `276`, `339` repeat their own `max-w-7xl` container shell.
- `app/[lang]/clubs/ClubsPageClient.tsx:132` and `206` define separate container shells inside/around `SectionWrapper`.
- `app/[lang]/spain/SpainPageClient.tsx:32` uses another standalone page container and spacing system.
- `app/[lang]/contact/page.tsx:63` uses `max-w-6xl`, diverging from the dominant `max-w-7xl`.

**Visible symptom**

Sections do not feel like they belong to one product. Some pages are cinematic and full-bleed; others are boxed and SaaS-like. Even when individual sections look acceptable, transitions between pages feel inconsistent because gutters, vertical spacing, and section boundaries change too often.

**Likely cause**

Each route owns its own layout shell instead of using a small set of shared page primitives:

- public full-bleed hero shell
- public editorial content shell
- discovery/list shell
- app/dashboard shell
- legal/static document shell

**Recommended fix direction**

Create and enforce page-level layout primitives:

- `PublicHeroShell`
- `PublicSection`
- `EditorialArticleShell`
- `DiscoveryShell`
- `DashboardShell`
- `LegalPageShell`

Then replace repeated `max-w-* px-* pt-* pb-*` chains page by page. Do not start with visual tweaks; start by unifying layout contracts.

---

## 2. Fixed Navbar and Hero Viewport Math Conflict

**Affected areas**

- `components/layout/Navbar.tsx`
- `components/HeroSection.tsx`
- `app/[lang]/editorial/page.tsx`
- `app/[lang]/spain/[city]/CityPageClient.tsx`
- `app/[lang]/clubs/ClubsPageClient.tsx`
- `app/[lang]/clubs/[slug]/ClubProfileContent.tsx`

**Evidence**

- `components/layout/Navbar.tsx:123` uses a fixed nav: `fixed inset-x-0 mx-auto`.
- `components/layout/Navbar.tsx:126-129` changes top/width/radius once scrolled.
- `components/HeroSection.tsx:492-493` uses `min-h-[100dvh]` and `sticky top-0 h-[100dvh]`.
- `components/HeroSection.tsx:662` uses a mobile `min-h-[100dvh]`.
- `app/[lang]/editorial/page.tsx:169` uses `min-h-[calc(100svh-2rem)]`, not the navbar height.
- `app/[lang]/spain/[city]/CityPageClient.tsx:130` uses `min-h-[calc(100svh-4rem)]` plus `pt-24`.
- `app/[lang]/clubs/[slug]/ClubProfileContent.tsx:305` uses sidebar sticky offsets `top-[72px] md:top-[80px]`.

**Visible symptom**

Top content can look vertically off: sometimes too low, sometimes crowded under the floating nav, sometimes not genuinely centered in the viewport. Sticky sidebars may begin too close to or underneath the navbar depending on scroll state because the navbar height and top offset are dynamic.

**Likely cause**

There is no single CSS variable or layout contract for header height. Pages guess with `pt-24`, `md:pt-32`, `top-24`, `top-[72px]`, `top-[80px]`, or viewport calculations that do not include the fixed header.

**Recommended fix direction**

Define header variables:

- `--site-header-height`
- `--site-header-floating-offset`
- `--site-sticky-top`

Then make every hero and sticky component consume those variables. For full-viewport heroes, use `min-height: calc(100svh - var(--site-header-reserved-space))` only when the header is in normal flow; for overlay headers, ensure text safe zones account for the fixed nav.

---

## 3. Public `/spain` and Non-Barcelona City Pages Look Like a Different Product

**Affected areas**

- `app/[lang]/spain/SpainPageClient.tsx`
- `app/[lang]/spain/[city]/CityPageClient.tsx`
- `app/[lang]/spain/[city]/guides/page.tsx`

**Evidence**

- `app/[lang]/spain/SpainPageClient.tsx:31` uses `bg-background`.
- `app/[lang]/spain/SpainPageClient.tsx:35` uses `rounded-3xl border bg-card shadow-lg shadow-primary/5`.
- `app/[lang]/spain/SpainPageClient.tsx:68` displays `100%` verified.
- `app/[lang]/spain/SpainPageClient.tsx:73` displays `24/7`.
- `app/[lang]/spain/SpainPageClient.tsx:152` uses a `Cannabis` icon.
- `app/[lang]/spain/[city]/CityPageClient.tsx:373` switches non-Barcelona cities back to `bg-background`.
- `app/[lang]/spain/[city]/CityPageClient.tsx:380` uses the same generic `rounded-3xl border bg-card` pattern.
- `app/[lang]/spain/[city]/guides/page.tsx:64-68` follows the same older card shell.

**Visible symptom**

The Spain page and non-Barcelona city pages feel like a generic SaaS dashboard or old directory template, not the current SCM editorial trust brand. The visual language is brighter, more card-heavy, less cinematic, and inconsistent with the Barcelona and editorial pages.

**SCM-specific concern**

The `Cannabis` leaf icon conflicts with SCM’s visual baseline: no leaf iconography or novelty cannabis visuals. The `100% verified` and `24/7` stat pattern also feels like generic marketing and may overstate or confuse verification scope.

**Recommended fix direction**

Rebuild `/spain` and non-Barcelona city pages into the same editorial city-intelligence system as Barcelona:

- dark editorial base
- real Spain/city imagery
- restrained trust copy
- no cannabis leaf icon
- no generic 100%/24/7 stats
- no rounded card hero
- clearer route into Barcelona as the active city layer

---

## 4. Auth Pages Are Visually Underdesigned and Misaligned With SCM Public Brand

**Affected areas**

- `app/[lang]/account/login/page.tsx`
- `app/[lang]/account/register/page.tsx`
- `components/auth/LoginForm.tsx`
- `components/auth/RegisterForm.tsx`

**Evidence**

- `app/[lang]/account/login/page.tsx:28` centers a small form in a `max-w-7xl` container with `min-h-[60vh]`.
- `app/[lang]/account/register/page.tsx:5` repeats the same shell.
- `components/auth/LoginForm.tsx:50` uses `w-full max-w-md mx-auto`.
- `components/auth/LoginForm.tsx:52-56` uses default token styling: `bg-primary/10`, `text-foreground`, `text-muted-foreground`.
- `components/auth/RegisterForm.tsx:122-128` repeats the same default token look.

**Visible symptom**

Login/register pages look like default form screens dropped into the app, not like SCM membership/trust entry points. They are centered, but visually underanchored: no page context, weak background, no relationship to Safety Kit or verification narrative, and less premium finish than the public landing/discovery pages.

**Likely cause**

Auth forms were built with generic design tokens and placed inside a basic centered container. There is no branded auth shell.

**Recommended fix direction**

Create a branded `AuthShell`:

- left or top narrative panel with SCM trust framing
- right/center form surface with restrained glass/dark treatment
- same radius and spacing scale as public surfaces
- clear mobile-first vertical rhythm
- avoid hero-level marketing copy, but give enough context that sign-in feels part of SCM

---

## 5. Club Profile Sticky Sidebar Has Unstable Offset Logic

**Affected area**

- `app/[lang]/clubs/[slug]/ClubProfileContent.tsx`

**Evidence**

- `app/[lang]/clubs/[slug]/ClubProfileContent.tsx:120` hero is `h-[60vh] min-h-[500px] lg:h-[75vh]`.
- `app/[lang]/clubs/[slug]/ClubProfileContent.tsx:151` back button is `absolute left-4 top-24`.
- `app/[lang]/clubs/[slug]/ClubProfileContent.tsx:164` content is pulled up with `-mt-32 lg:-mt-48`.
- `app/[lang]/clubs/[slug]/ClubProfileContent.tsx:305` sidebar uses `sticky top-[72px] md:top-[80px]`.

**Visible symptom**

The profile page likely looks impressive on one viewport but fragile across others. Negative margin overlap, a fixed navbar, a scroll-transforming navbar, and a sticky sidebar all compete. This can make the right sidebar feel too high, clipped, or visually detached from the title card.

**Likely cause**

The layout is tuned by local offsets rather than a shared hero/profile template.

**Recommended fix direction**

Refactor into a profile layout grid with explicit regions:

- media hero
- overlapping title panel
- content column
- sticky dossier column

Use one sticky offset variable tied to the navbar. Remove magic `top-[72px]`, `top-[80px]`, and large negative margins where possible.

---

## 6. Mobile Floating Filter Competes With Cookie Consent and Sticky CTAs

**Affected areas**

- `components/FilterBar.tsx`
- `components/consent/CookieConsentManager.tsx`
- `app/[lang]/editorial/[slug]/ArticleContent.tsx`

**Evidence**

- `components/FilterBar.tsx:626` uses a mobile fixed trigger at `bottom-[calc(1rem+env(safe-area-inset-bottom))]` with `z-40`.
- `components/consent/CookieConsentManager.tsx:120` uses a fixed cookie banner at bottom with `z-[9998]`.
- `app/[lang]/editorial/[slug]/ArticleContent.tsx:59-75` uses a fixed sticky CTA at bottom with `z-50`.

**Visible symptom**

Bottom-fixed UI can stack or hide important actions on mobile. The filter trigger can be hidden by cookie consent. Article sticky CTA can compete with consent. There is no global bottom-safe-area registry.

**Likely cause**

Each component independently decides to be fixed at the bottom.

**Recommended fix direction**

Add a global bottom-layer strategy:

- cookie consent owns the lowest global fixed region when active
- page sticky CTA consumes a CSS variable offset when consent exists
- filter trigger uses the same offset registry
- define z-index tiers for nav, drawers, banners, consent, modals

---

# P1 Findings

## 7. Radius System Is Overused and Inconsistent

**Affected areas**

- Nearly every public surface and UI primitive.

**Evidence**

Search found **278** rounded/radius usages across `app` and `components`, including:

- `rounded-md`
- `rounded-xl`
- `rounded-2xl`
- `rounded-3xl`
- `rounded-[1.5rem]`
- `rounded-[1.75rem]`
- `rounded-[2rem]`
- `rounded-[2.25rem]`
- `rounded-[2.5rem]`
- `rounded-[30px]`

Concrete examples:

- `components/HeroSection.tsx:604` uses `rounded-[2.25rem]`.
- `components/ClubCard.tsx:69` uses `rounded-3xl`.
- `components/FilterBar.tsx:400` uses `rounded-[1.75rem]`.
- `components/layout/NavigationRail.tsx:178` uses `rounded-[30px]`.
- `app/[lang]/clubs/ClubsPageClient.tsx:364` uses `rounded-[2rem] sm:rounded-[3rem]`.

**Visible symptom**

The UI feels soft and expensive in places, but also inconsistent. Repeated large radii make operational pages less dense, while mixed arbitrary radii make surfaces look hand-tuned rather than systematic.

**Recommended fix direction**

Create a radius policy:

- `sm`: inputs, badges, small controls
- `md`: buttons and compact panels
- `lg`: cards and drawers
- `xl`: large editorial media/panels only

Avoid arbitrary radii unless there is a named component reason.

---

## 8. Letter Spacing and Uppercase Microcopy Are Overused

**Affected areas**

- `components/HeroSection.tsx`
- `components/ClubCard.tsx`
- `components/FilterBar.tsx`
- `components/landing/editorial-concierge/**`
- `app/[lang]/clubs/ClubsPageClient.tsx`
- `app/[lang]/editorial/page.tsx`
- `app/[lang]/clubs/[slug]/ClubProfileContent.tsx`

**Evidence**

Search found **252** instances of aggressive tracking or uppercase tracking patterns.

Concrete examples:

- `components/HeroSection.tsx:58-94` uses negative tracking in mobile hero typography presets.
- `components/FilterBar.tsx:409` uses `tracking-[0.28em]`.
- `app/[lang]/clubs/ClubsPageClient.tsx:245` uses `tracking-[0.2em]`.
- `components/landing/editorial-concierge/blocks/FinalMicDrop.tsx:134` uses `tracking-[0.3em]`.

**Visible symptom**

Small labels can become hard to read, especially in German/French and on mobile. Too many elements speak in the same uppercase voice, so the hierarchy flattens.

**Recommended fix direction**

Reserve high tracking for true eyebrow labels only. Normalize operational labels and controls to readable sentence case or modest uppercase. Remove negative letter spacing from responsive hero text unless screenshot-tested across all locales.

---

## 9. Hero Text Contains Locale-Specific Hard-Coded Typography Presets

**Affected area**

- `components/HeroSection.tsx`

**Evidence**

- `components/HeroSection.tsx:48-99` defines per-locale mobile typography presets.
- English uses `whitespace-nowrap` with a breakpoint exception at `max-[347px]` on lines `59` and `61`.
- Several languages use tight negative tracking and custom max widths.

**Visible symptom**

The homepage hero may look carefully tuned for current strings but is fragile. Any translation change can break line balance, centering, or vertical fit.

**Likely cause**

The hero is being manually typeset inside code instead of using a resilient text layout model.

**Recommended fix direction**

Keep a strong hero, but reduce per-locale class branching. Use:

- `text-wrap: balance`
- stable max-width by container, not string
- fewer `whitespace-nowrap` constraints
- browser screenshots for all locales at 360, 390, 768, 1024, 1440 widths

---

## 10. Button Component Defaults Conflict With Long Translated Labels

**Affected area**

- `components/ui/button.tsx`
- All buttons using the primitive.

**Evidence**

- `components/ui/button.tsx:14` sets `whitespace-nowrap`, `truncate`, `min-w-0`, `max-w-full` globally.
- Some consumers override with `!whitespace-normal !overflow-visible !text-clip`, e.g. `components/HeroSection.tsx:629` and `640`.

**Visible symptom**

Buttons can truncate translated text by default. Some pages fight the primitive with `!` overrides, leading to inconsistent wrapping and button heights.

**Recommended fix direction**

Split button text behavior into variants:

- default compact button: no wrap
- responsive/content button: allows wrap with stable min-height
- icon-only button: fixed square

Avoid per-consumer `!whitespace-normal` overrides.

---

## 11. Club Directory Hero Is Too Vertically Heavy

**Affected area**

- `app/[lang]/clubs/ClubsPageClient.tsx`

**Evidence**

- `app/[lang]/clubs/ClubsPageClient.tsx:107-110` sets city-context hero to `min-h-[760px]`, `sm:min-h-[820px]`, `pt-28`, `sm:pt-36`, `pb-24`.
- `app/[lang]/clubs/ClubsPageClient.tsx:178-199` adds two status explainer cards inside the hero.

**Visible symptom**

The directory page may delay the actual club grid too much. The user intent on a directory page is comparison and filtering; the current hero behaves more like a landing page. On laptops, the filters and first cards may sit too far below the fold.

**Recommended fix direction**

For directory/list pages, use a compact editorial header:

- title and one-line context
- trust/status explanation as a collapsible or inline strip below filters
- filters visible earlier
- first cards visible sooner

---

## 12. Filter Bar Layout Is Powerful but Visually Heavy

**Affected area**

- `components/FilterBar.tsx`

**Evidence**

- `components/FilterBar.tsx:400` sticky filter panel uses large radius, heavy shadow, blur, and multi-row layout.
- `components/FilterBar.tsx:438` uses `xl:grid-cols-[1fr_1fr_1fr_auto]`.
- `components/FilterBar.tsx:626` creates a separate mobile fixed drawer trigger.

**Visible symptom**

On desktop, the filter bar can become a visual object that competes with the cards rather than a utility control. On tablet widths, the grid may compress labels and create uneven alignment.

**Recommended fix direction**

Make desktop filter controls quieter:

- reduce shadow and blur
- smaller header row or remove header inside sticky state
- keep filters in one compact row at larger widths
- make active filters a separate wrap row only when needed

---

## 13. Club Cards Mix Editorial and Marketplace Patterns

**Affected area**

- `components/ClubCard.tsx`

**Evidence**

- `components/ClubCard.tsx:69` card is a rounded glass/card surface.
- `components/ClubCard.tsx:88-96` status badges are large, high-contrast, and uppercase.
- `components/ClubCard.tsx:171` CTA label is uppercase with `tracking-[0.2em]`.
- `components/ClubCard.tsx:126` description is italic serif.

**Visible symptom**

Cards are visually rich, but the CTA-heavy structure can read like a marketplace listing. The same card has editorial image treatment, compliance status, rating, tags, stats, and a strong action button. This can make grid scanning heavy and inconsistent across verified/public cards.

**Recommended fix direction**

Introduce two card densities:

- **Directory compact card:** image, name, status, location, one short fact, subtle CTA.
- **Featured verified card:** larger visual card used sparingly.

Keep public listing cards more restrained to avoid implying recommendation.

---

## 14. Article Detail Page Is Card-Heavy for Long-Form Reading

**Affected area**

- `app/[lang]/editorial/[slug]/ArticleContent.tsx`

**Evidence**

- `app/[lang]/editorial/[slug]/ArticleContent.tsx:164` wraps the full article body in `bg-bg-card/70 ... rounded-3xl border ... p-8 lg:p-12`.
- `app/[lang]/editorial/[slug]/ArticleContent.tsx:240` sidebar uses `sticky top-24`.
- `app/[lang]/editorial/[slug]/ArticleContent.tsx:242`, `259`, `283` stack multiple rounded sidebar cards.
- `app/[lang]/editorial/[slug]/ArticleContent.tsx:59-75` adds bottom fixed CTA.

**Visible symptom**

The reading experience can feel enclosed and heavy. The article body is boxed inside a large card, while the sidebar and sticky CTA add more chrome. This may reduce editorial authority and readability.

**Recommended fix direction**

Move toward a premium editorial reading layout:

- article body on plain dark page, not inside a large card
- use subtle dividers and max-width typography
- sidebar can remain carded, but quieter
- sticky CTA should be delayed and offset-aware

---

## 15. Admin and Profile Rails Are Polished but Spatially Risky

**Affected areas**

- `components/layout/NavigationRail.tsx`
- `components/profile/ProfileSidebar.tsx`
- `components/admin/AdminSidebar.tsx`
- `app/[lang]/profile/ProfileLayoutClient.tsx`
- `app/[lang]/admin/AdminShell.tsx`

**Evidence**

- `components/layout/NavigationRail.tsx:435` animates rail width between collapsed and expanded.
- `components/profile/ProfileSidebar.tsx:118-120` uses `top-24 h-[calc(100dvh-6rem)]`, `expandedWidth={292}`, `collapsedWidth={88}`.
- `components/admin/AdminSidebar.tsx:202-204` uses `top-4 lg:top-6 h-[calc(100dvh-3rem)]`, `expandedWidth={304}`, `collapsedWidth={88}`.
- `app/[lang]/profile/ProfileLayoutClient.tsx:11` page starts at `pt-24`.
- `app/[lang]/admin/AdminShell.tsx:28` has a sticky header at `top-4 lg:top-6`.

**Visible symptom**

Rail expansion may shift content and create layout instability. Admin and profile use different top-offset systems, making dashboards feel related but not identical. Long nav labels may truncate inside animated width changes.

**Recommended fix direction**

Choose one dashboard shell model:

- rail width is fixed per breakpoint, or content area accounts for animated rail without reflow shock
- profile and admin share the same rail geometry unless there is a clear product reason
- use a shared dashboard sticky offset

---

## 16. Decorative Glows and Gradient Effects Are Overused

**Affected areas**

- `components/HeroSection.tsx`
- `components/landing/editorial-concierge/**`
- `components/layout/NavigationRail.tsx`
- `app/[lang]/editorial/[slug]/ArticleContent.tsx`
- `app/[lang]/profile/ProfileLayoutClient.tsx`

**Evidence**

Search found **143** gradient/blur/glow patterns across `app` and `components`.

Concrete examples:

- `app/[lang]/editorial/[slug]/ArticleContent.tsx:104-105` uses two large blurred brand circles.
- `app/[lang]/profile/ProfileLayoutClient.tsx:8-10` uses multiple blurred background circles.
- `components/layout/NavigationRail.tsx:93-96` and `126-129` define rail glow/orb decorations.

**Visible symptom**

SCM’s dark editorial look risks becoming visually noisy. Decorative effects also make it harder to see whether alignment, spacing, and typography are actually correct.

**Recommended fix direction**

Reduce background decoration. Let real imagery, typography, and spacing carry the brand. Use glows only for specific state or hero atmosphere.

---

## 17. Content Alignment Alternates Between Centered and Start-Aligned Without Clear Rule

**Affected areas**

- `app/[lang]/clubs/ClubsPageClient.tsx`
- `app/[lang]/editorial/page.tsx`
- `app/[lang]/spain/[city]/CityPageClient.tsx`
- `components/landing/editorial-concierge/**`

**Evidence**

- `app/[lang]/clubs/ClubsPageClient.tsx:135-136` centers the directory hero content.
- `app/[lang]/editorial/page.tsx:173-225` uses left/start hero alignment.
- `app/[lang]/spain/[city]/CityPageClient.tsx:145-210` uses left/start hero alignment.
- `app/[lang]/clubs/ClubsPageClient.tsx:178-199` puts explanatory cards centered under a centered hero.

**Visible symptom**

Pages sometimes center operational content that should be start-aligned for scanning. Other pages are editorial and correctly anchored left. The rule is unclear, so sections feel manually composed.

**Recommended fix direction**

Define alignment rules:

- brand/editorial hero with strong image: start-aligned text on calm side of image
- simple legal/static pages: centered or narrow article column
- directory/search pages: start-aligned header, filters and results aligned to same grid
- modal/forms: centered form only when the task is isolated

---

# P2 Findings

## 18. Navigation Bar Has Tight Desktop Allocation and Truncation Risk

**Affected areas**

- `components/layout/Navbar.tsx`
- `components/layout/MainNavigation.tsx`

**Evidence**

- `components/layout/Navbar.tsx:132-174` uses three flex areas with basis percentages: `24%`, `46%`, `30%`.
- `components/layout/MainNavigation.tsx:59` caps nav links at `max-w-[9.5rem]` and truncates text.
- `components/layout/Navbar.tsx:169` forces Safety Kit CTA `whitespace-nowrap`.

**Visible symptom**

German/French navigation labels can truncate or squeeze. The desktop nav may appear not quite centered because left brand and right actions have unequal real widths despite percentage bases.

**Recommended fix direction**

Use CSS grid for navbar columns:

- left: minmax logo area
- center: max-content nav
- right: actions

Let center nav be actually centered in the viewport, not just within a percentage flex basis.

---

## 19. SectionWrapper Adds Container by Default and Can Accidentally Break Full-Bleed Composition

**Affected area**

- `components/landing/editorial-concierge/layout/SectionWrapper.tsx`

**Evidence**

- `SectionWrapper` defaults `container = true` on line `11`.
- It wraps content in a max-width container on line `27`.
- `ClubsPageClient` uses `SectionWrapper` and then adds its own inner container on line `132`.

**Visible symptom**

Full-bleed sections can accidentally inherit gutters or nested containers. This is especially risky for hero and media-led sections where the frontend skill requires a clear full-bleed visual anchor.

**Recommended fix direction**

Make full-bleed the explicit default for hero/media sections, or split `SectionWrapper` into:

- `SectionBand`
- `SectionContainer`
- `FullBleedHero`

Avoid wrapper components that silently add max-width containers.

---

## 20. Home Editorial Concierge Sections Need a Consistency Pass

**Affected areas**

- `components/landing/editorial-concierge/blocks/*.tsx`
- `components/landing/editorial-concierge/interactive/*.tsx`

**Evidence**

- `components/landing/editorial-concierge/blocks/BeginnersOnramp.tsx:12` uses `py-32 md:py-48`.
- `components/landing/editorial-concierge/blocks/VerificationStandard.tsx:33` uses `py-16 md:py-24` plus `lg:min-h-[80vh]`.
- `components/landing/editorial-concierge/blocks/ConciergeTools.tsx:238` uses `min-h-[100dvh] md:min-h-0`.
- `components/landing/editorial-concierge/blocks/FinalMicDrop.tsx:109` uses a card-like CTA panel.

**Visible symptom**

The homepage after the hero likely alternates between very tall storytelling sections and compact sections. Some sections may feel oversized on mobile or leave too much scroll before practical links appear.

**Recommended fix direction**

Create a homepage section rhythm:

- hero
- immediate trust/value section
- practical route selection
- proof/verification
- newsletter/safety CTA

Normalize section vertical padding and decide which sections deserve viewport-scale height.

---

## 21. Contact Form Uses Default Token Surface Instead of SCM Editorial Surface

**Affected areas**

- `app/[lang]/contact/page.tsx`
- `components/contact/ContactInquiryForm.tsx`

**Evidence**

- `components/contact/ContactInquiryForm.tsx:81` uses `bg-card/95`, `border-border/70`, generic shadow.
- `components/contact/ContactInquiryForm.tsx:119` uses `bg-background` inputs.

**Visible symptom**

The contact page can feel more like an admin/form template than SCM’s public trust layer.

**Recommended fix direction**

Use the same public form surface as the future auth shell:

- dark editorial background
- calm, contained form
- trust-safe copy
- no generic light card look

---

## 22. Cookie Banner Is Functionally Correct but Visually Dominant

**Affected area**

- `components/consent/CookieConsentManager.tsx`

**Evidence**

- `components/consent/CookieConsentManager.tsx:120` uses `z-[9998]`, full bottom fixed layout, `bg-bg-base/95`, large shadow.

**Visible symptom**

The cookie banner may dominate mobile first impressions and collide visually with floating filter/CTA components.

**Recommended fix direction**

Keep legal/compliance behavior, but visually reduce:

- smaller max-width consent panel on desktop
- compact mobile banner with offset registry
- avoid blocking primary bottom actions after choice is made

---

## 23. Static Legal Pages Likely Need Better Reading System

**Affected areas**

- `app/[lang]/privacy/page.tsx`
- `app/[lang]/terms/page.tsx`
- `app/[lang]/cookies/page.tsx`

**Evidence**

- These pages use basic `max-w-4xl` containers with `pt-24 md:pt-32`, e.g. `app/[lang]/privacy/page.tsx:58`, `app/[lang]/terms/page.tsx:58`, `app/[lang]/cookies/page.tsx:58`.

**Visible symptom**

Legal/static pages may be readable but not visually integrated. They likely miss the same typography, section spacing, and trust framing used elsewhere.

**Recommended fix direction**

Create `LegalDocumentShell` with consistent:

- title block
- last updated metadata
- table of contents
- readable prose width
- quiet dark surface

---

## 24. Club Panel Still Uses an Older Light/Green Product Surface

**Affected areas**

- `app/[lang]/club-panel/page.tsx`
- `app/[lang]/club-panel/login/page.tsx`
- `app/[lang]/club-panel/signup/page.tsx`
- `app/[lang]/club-panel/dashboard/layout.tsx`

**Evidence**

- `app/[lang]/club-panel/signup/page.tsx:120` uses a light green gradient background.
- `app/[lang]/club-panel/dashboard/layout.tsx:27` uses `bg-background/80`, border-bottom app shell, and sticky top values unrelated to admin/profile rail system.

**Visible symptom**

Club-panel pages likely look like an older product track. They do not align with current public SCM nor with the newer admin/profile rail system.

**Recommended fix direction**

Decide whether club-panel is:

- a private operational dashboard, in which case it should share the dashboard shell; or
- an onboarding/auth flow, in which case it should share the branded auth shell.

---

# Systemic Design Problems to Fix Before Pixel Polish

## A. No Shared Hero Contract

SCM has several hero types, but they are implemented independently:

- homepage cinematic scroll hero
- editorial landing hero
- Barcelona city hero
- clubs directory hero
- club profile media hero
- generic card hero on `/spain`

Define hero types by use case:

1. `CinematicHomeHero`
2. `EditorialLandingHero`
3. `CityIntelligenceHero`
4. `DirectoryHeader`
5. `ProfileMediaHero`
6. `DocumentHeader`

Each should define:

- alignment rule
- min height
- top spacing relative to navbar
- media behavior
- CTA placement
- mobile layout

## B. No Shared Sticky/Floating Layer Contract

Fixed and sticky elements currently include:

- navbar
- mobile nav overlay
- filter trigger
- filter desktop sticky bar
- cookie consent
- article sticky CTA
- profile/admin rails
- club profile dossier
- article sidebar

Create z-index and offset tokens:

- `--z-nav`
- `--z-sticky`
- `--z-bottom-action`
- `--z-drawer`
- `--z-modal`
- `--z-consent`
- `--sticky-top`
- `--bottom-safe-offset`

## C. Card Use Is Too Broad

SCM should not be a generic card-grid product. Cards are useful for repeated objects, modals, and dashboards. Current use extends cards into:

- heroes
- article body
- trust explainers
- CTA banners
- app shells
- route pages

Use fewer cards. Prefer:

- full-width bands
- image-led sections
- dividers
- plain editorial layouts
- structured lists

## D. Brand Tokens Are Not Enforced

Global tokens exist, but the code mixes:

- `bg-bg-base`
- `bg-background`
- `bg-card`
- `bg-slate-950`
- `text-primary`
- `text-brand`
- green light gradients

This is acceptable only if each route family has a named system. Right now, the split is accidental.

## E. Public and Private UI Need Different Density Rules

Public pages should feel editorial, trust-building, image-led, and restrained.

Private/admin pages should feel utility-first, dense, calm, and operational.

Current public pages sometimes become dashboard-card mosaics; current admin/profile pages sometimes carry too much decorative glow.

---

# Recommended Fix Roadmap

## Phase 1: Layout System Foundation

**Goal:** Stop new UI drift before fixing pages.

1. Define page shell components:
   - `PublicPageShell`
   - `PublicSection`
   - `FullBleedHero`
   - `DirectoryHeader`
   - `DashboardShell`
   - `LegalDocumentShell`

2. Define CSS variables:
   - header height
   - sticky top
   - bottom fixed offset
   - container widths
   - section spacing
   - z-index tiers

3. Define radius and shadow policy.

4. Define alignment rules for public, directory, form, dashboard, and document pages.

## Phase 2: Highest-Impact Public Surfaces

**Goal:** Make the main visitor path feel consistent.

1. `/spain`
2. `/spain/[city]` non-Barcelona branch
3. `/account/login`
4. `/account/register`
5. `/clubs` and `/spain/barcelona/clubs` directory header/filter density
6. `/clubs/[slug]` profile sticky/sidebar geometry

## Phase 3: Editorial Reading and Home Flow

**Goal:** Improve trust and readability.

1. Article detail layout: reduce card enclosure.
2. Homepage concierge section rhythm.
3. Editorial category/card consistency.
4. Safety Kit page and legal document shell alignment.

## Phase 4: Private/Admin Surfaces

**Goal:** Make operational UI calm and consistent.

1. Profile/admin shared dashboard shell.
2. Club-panel dashboard migration.
3. Rail expansion behavior and sticky offsets.
4. Data tables and form density pass.

---

# Browser QA Checklist for the Next Round

Before changing code, run a screenshot pass on:

- `/en`
- `/en/spain`
- `/en/spain/barcelona`
- `/en/spain/barcelona/clubs`
- `/en/clubs/[known-slug]`
- `/en/editorial`
- `/en/editorial/[known-slug]`
- `/en/account/login`
- `/en/account/register`
- `/en/profile`
- `/en/admin`
- `/en/club-panel`

Viewport set:

- 360 x 780
- 390 x 844
- 768 x 1024
- 1024 x 768
- 1366 x 768
- 1440 x 900

Check specifically:

- first viewport composition
- navbar overlap
- centered vs start alignment
- text clipping/truncation
- sticky elements
- bottom fixed collisions
- card rhythm
- section transitions
- translated strings in `es`, `fr`, and `de`

---

# Surgical Priority List

## Fix First

1. `/spain` visual system mismatch and leaf iconography.
2. Auth pages lacking branded shell.
3. Navbar/header offset contract.
4. Directory hero/filter vertical weight.
5. Club profile sticky sidebar offsets.
6. Bottom fixed component collision system.

## Fix Second

1. Article detail card-heavy reading surface.
2. Radius system.
3. Uppercase/tracking overload.
4. Homepage section rhythm.
5. Admin/profile dashboard shell consistency.

## Fix Later

1. Static legal document shell polish.
2. Contact form surface alignment.
3. Minor card hover/animation standardization.
4. Footer spacing and link density pass.

---

# Final Assessment

SCM’s UI problems are real and systemic, but they are fixable without a full redesign. The product already has the right direction in its strongest surfaces: the homepage hero, Barcelona city page, editorial imagery, and verified club profile assets. The work now is to remove old/generic UI patterns, unify layout primitives, and make every page obey the same rules for spacing, sticky offsets, alignment, radii, and public/private density.

The next implementation round should not start by tweaking individual margins. It should start by defining the shared layout contracts, then applying them to the worst route groups in priority order.
