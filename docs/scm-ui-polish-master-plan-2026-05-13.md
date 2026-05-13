# SCM UI Polish Master Plan

**Date:** 2026-05-13  
**Mode:** Engineering Mode  
**Purpose:** Wave-by-wave UI uplift plan for SCM that preserves working behavior, avoids broad redesign risk, and focuses on polishing layout, alignment, consistency, responsiveness, and brand fidelity.  
**Source audit:** `docs/ui-layout-design-audit-2026-05-13.md`  
**Active skill stack:** `scm` + `frontend-skill`  
**Implementation status:** Plan only. No product code changes were made for this document.

## Non-Negotiable Boundaries

This plan is intentionally conservative. The goal is to refine SCM, not replace it.

1. **Do not touch the homepage as a redesign surface.**
   - Protected:
     - `app/[lang]/page.tsx`
     - `components/HeroSection.tsx`
     - `components/landing/editorial-concierge/**`
   - Allowed only:
     - sizing fixes
     - viewport fit fixes
     - obvious text clipping fixes
     - mobile overflow fixes
     - navbar collision fixes
     - consistency fixes that do not alter the homepage concept, sequence, copy strategy, or art direction

2. **Do not redesign the Barcelona city page.**
   - `app/[lang]/spain/[city]/CityPageClient.tsx` Barcelona branch is a strong direction and should be treated as a reference point.
   - Allowed only:
     - spacing polish
     - responsive safety
     - navbar/sticky offset fixes
     - minor consistency with the broader system
   - Do not flatten it into a generic template.

3. **Skip club-panel work.**
   - Out of scope:
     - `app/[lang]/club-panel/**`
     - `components/club/**`
   - Do not include it in implementation waves except as a future backlog note.

4. **No generic AI-style redesigns.**
   - No generic SaaS card mosaics.
   - No decorative UI just to look “modern.”
   - No cannabis leaf iconography.
   - No fake dashboards, stat strips, or gradient-heavy hero replacements.
   - No public-marketplace feel.

5. **Do not break platform behavior.**
   - Every wave must preserve:
     - locale-first routing
     - auth and role gates
     - server action contracts
     - existing form behavior
     - analytics hooks unless intentionally adjusted
     - legal-safe public positioning

6. **Polish before restructure.**
   - Refactors are allowed only when they reduce UI drift and can be verified.
   - Each wave should leave the platform shippable.

---

# Design North Star

SCM should feel like a serious, editorial-grade trust platform for navigating cannabis social clubs in Spain, not like a generic cannabis directory and not like a SaaS template.

The visual system should use:

- dark editorial depth
- real Spain and Barcelona imagery
- quiet teal trust signals
- restrained saffron accents
- strong but readable serif display moments
- practical, dense layouts for operational screens
- clear distinction between verified profiles and public listings
- calm legal-safe CTAs

The strongest current references are:

- the Barcelona city page direction
- the homepage cinematic direction
- the club profile media assets
- the darker editorial guide surfaces
- the verified/public listing trust taxonomy

The weak points are mostly older surfaces that still feel like generic cards, generic auth, or mixed token systems.

---

# Execution Rules

## Worktree Safety

Before each wave:

1. Run `git status --short`.
2. Identify unrelated dirty files.
3. Do not overwrite user changes.
4. Keep each wave in a small, reviewable patch.
5. Prefer one branch per major polish wave if committing later.

## Code Safety

Every implementation wave must:

1. Start with screenshots before changes.
2. Make scoped edits only.
3. Run targeted lint/type checks where practical.
4. Run visual QA in browser for affected pages.
5. Compare before/after screenshots.
6. Stop if behavior changes unexpectedly.

## Visual QA Viewports

Minimum viewport set for each affected public page:

- `360 x 780`
- `390 x 844`
- `768 x 1024`
- `1024 x 768`
- `1366 x 768`
- `1440 x 900`

Minimum locale set:

- `en`
- `es`
- `fr`
- `de`

Full locale testing can be narrowed for tiny component polish, but any nav, hero, card, form, or button text change needs locale coverage.

## Acceptance Standard

A wave passes only when:

- no obvious overlap
- no clipped translated labels
- no broken sticky/fixed layering
- no mobile horizontal scroll
- no public wording that implies access guarantees
- no loss of existing page purpose
- no homepage redesign drift
- no club-panel changes

---

# Protected Surface Map

## Protected, Sizing-Only

### Homepage

Files:

- `app/[lang]/page.tsx`
- `components/HeroSection.tsx`
- `components/landing/editorial-concierge/**`

Allowed examples:

- fix mobile hero text clipping
- fix CTA wrapping
- fix navbar overlap
- fix section overflow
- normalize obviously broken viewport height

Forbidden examples:

- replacing the hero concept
- changing the content sequence
- redesigning concierge blocks
- changing major copy or imagery
- rebuilding the homepage visual language

### Barcelona City Page

File:

- `app/[lang]/spain/[city]/CityPageClient.tsx`

Allowed examples:

- improve responsive spacing
- avoid navbar collision
- tune card/grid alignment
- preserve current hero and city intelligence feel

Forbidden examples:

- replacing the Barcelona page with a generic city template
- removing the current dark map-led identity
- flattening the editorial structure

## Excluded

### Club Panel

Files:

- `app/[lang]/club-panel/**`
- `components/club/**`

No work in this plan.

---

# Wave 0: Baseline Capture and Guardrails

**Goal:** Create a safe visual baseline before touching UI code.

**Scope**

- No design changes.
- No product changes.
- Screenshot and inventory only.

**Pages to capture**

- `/en`
- `/en/spain`
- `/en/spain/barcelona`
- `/en/spain/barcelona/clubs`
- `/en/clubs`
- one verified club profile
- one public listing profile if available
- `/en/editorial`
- one article detail page
- `/en/account/login`
- `/en/account/register`
- `/en/safety-kit`
- `/en/contact`
- `/en/profile`
- `/en/admin`

**Explicit exclusions**

- `/en/club-panel/**`

**Checks**

- header overlap
- first viewport composition
- text clipping
- mobile horizontal overflow
- sticky element collisions
- bottom fixed collisions
- cards feeling too heavy
- translated button fit

**Deliverables**

- screenshot folder
- notes file listing page-level defects
- ranked implementation list for Wave 1

**Pass gate**

No code has changed. The team has before-state screenshots and a clear target list.

---

# Wave 1: Foundation Polish Tokens Without Visual Redesign

**Goal:** Add small shared layout safety primitives that reduce breakage risk across later waves.

This wave is not about making pages look different. It is about giving the UI a safer foundation.

**Primary targets**

- `app/globals.css`
- possibly shared layout constants/helpers if already consistent with local patterns
- no homepage structural edits

**Work items**

1. Add or formalize CSS variables for:
   - site header height
   - sticky top offset
   - bottom fixed offset
   - z-index tiers
   - public container widths
   - dashboard container widths

2. Define a small radius policy:
   - compact controls
   - cards
   - large editorial media
   - modals/drawers

3. Define bottom-fixed layering rules:
   - cookie consent
   - article sticky CTA
   - mobile filter trigger
   - drawers
   - modals

4. Avoid changing visible styling unless a variable must match current values.

**Do not**

- redesign buttons globally yet
- change homepage sections
- change Barcelona page design
- touch club-panel

**Risk**

Low, if variables are added before being consumed.

**QA**

- load homepage
- load Barcelona page
- load clubs directory
- load article detail
- verify no visual change except none or near-none

**Pass gate**

No material visual regression. Variables are available for later waves.

---

# Wave 2: Navbar, Sticky, and Bottom-Layer Stability

**Goal:** Fix the layout issues most likely to make pages feel mispositioned: header offsets, sticky sidebars, and bottom fixed UI.

**Primary targets**

- `components/layout/Navbar.tsx`
- `components/layout/MainNavigation.tsx`
- `components/FilterBar.tsx`
- `components/consent/CookieConsentManager.tsx`
- `app/[lang]/editorial/[slug]/ArticleContent.tsx`
- `app/[lang]/clubs/[slug]/ClubProfileContent.tsx`

**Homepage boundary**

Allowed:

- navbar overlap fixes
- hero sizing safeguards if the navbar physically collides with the hero

Forbidden:

- homepage redesign
- changing homepage art direction or section structure

**Work items**

1. Navbar alignment
   - reduce desktop truncation risk
   - make center nav feel actually centered
   - protect Safety Kit CTA from crowding other actions
   - preserve current floating/pill behavior if it is working visually

2. Sticky offset cleanup
   - replace hard-coded sticky offsets with shared sticky variables where safe
   - align article sidebar, filter bar, profile/sidebar/dossier behavior

3. Bottom fixed collision cleanup
   - make cookie banner, mobile filter trigger, and article sticky CTA respect a shared bottom offset
   - avoid stacking controls on mobile

4. Z-index sanity
   - ensure modals/drawers still sit above sticky CTAs
   - ensure mobile nav remains above page content

**Do not**

- change page content
- change club-panel
- redesign the navigation concept

**QA pages**

- `/en`
- `/en/editorial/[slug]`
- `/en/spain/barcelona/clubs`
- `/en/clubs/[slug]`
- `/en/account/login`

**Pass gate**

No nav overlap, no bottom fixed collision, no mobile menu regression, no desktop nav truncation in major locales.

---

# Wave 3: Spain Hub Uplift

**Goal:** Make `/spain` feel like SCM, not a generic SaaS/city-card page.

**Primary target**

- `app/[lang]/spain/SpainPageClient.tsx`

**Design direction**

Use Barcelona as the inspiration, but do not copy it blindly. `/spain` should be the national orientation surface: Spain-wide legal and safety context, with Barcelona clearly presented as the active city layer.

**Current issues to fix**

- generic `bg-background` and `bg-card` feel
- carded hero
- generic stats like `100%` and `24/7`
- cannabis leaf iconography
- older rounded card/SaaS pattern

**Work items**

1. Replace generic card hero with a dark editorial national header.
   - real Spain/city image if already available
   - no card shell around hero
   - start-aligned content
   - clear route to Barcelona and Safety Kit

2. Remove cannabis leaf visual language.
   - replace with map, shield, compass, document, or verification icons

3. Replace weak stats with trust-safe facts.
   - avoid `100% verified`
   - avoid `24/7`
   - use counts only where true and context-safe

4. Make city cards quieter and more editorial.
   - less generic rounded-card feel
   - better image or divider-led layout
   - stronger visual distinction for active Barcelona vs coming-soon cities

5. Preserve locale routing and current data behavior.

**Do not**

- make `/spain` a loud marketing page
- imply all cities have verified active directories
- add generic cannabis visuals

**QA pages**

- `/en/spain`
- `/es/spain`
- `/fr/spain`
- `/de/spain`

**Pass gate**

The page feels visually related to Barcelona and SCM’s editorial system while remaining a national orientation page.

---

# Wave 4: Non-Barcelona City and City Guides Polish

**Goal:** Bring non-Barcelona city pages and guide-list pages into the same brand family without overbuilding unavailable city layers.

**Primary targets**

- non-Barcelona branch inside `app/[lang]/spain/[city]/CityPageClient.tsx`
- `app/[lang]/spain/[city]/guides/page.tsx`

**Barcelona boundary**

Do not redesign the Barcelona branch. Only shared safety fixes should touch it.

**Work items**

1. Non-Barcelona city pages
   - replace generic light/card surfaces
   - use a dark quiet city-intelligence shell
   - make coming-soon status clear and restrained
   - avoid implying verified city coverage where it does not exist

2. City guide list pages
   - align with editorial guide visual language
   - remove generic card hero feel
   - use better spacing and hierarchy
   - keep content discoverable

3. Barcelona branch safety check
   - verify any shared changes do not degrade the Barcelona page

**Do not**

- create fake richness for cities without content
- clone Barcelona exactly
- touch club-panel

**QA pages**

- `/en/spain/madrid`
- `/en/spain/valencia`
- `/en/spain/tenerife`
- `/en/spain/barcelona`
- `/en/spain/barcelona/guides`

**Pass gate**

Non-Barcelona city pages feel intentionally quieter, not unfinished; Barcelona still looks like the premium active city page.

---

# Wave 5: Auth Entry Polish

**Goal:** Make login/register feel like SCM membership/trust entry points, not default forms.

**Primary targets**

- `app/[lang]/account/login/page.tsx`
- `app/[lang]/account/register/page.tsx`
- `components/auth/LoginForm.tsx`
- `components/auth/RegisterForm.tsx`

**Design direction**

Create a restrained branded auth shell. This should not be a landing page. It should be a focused form experience with enough SCM context to feel intentional.

**Work items**

1. Auth shell
   - dark editorial background
   - form column with calm surface
   - short trust context panel or header
   - mobile-first vertical rhythm

2. Form polish
   - consistent input heights
   - better spacing between OAuth, divider, fields, and submit
   - error states readable and not jumpy
   - password rules easier to scan

3. Copy safety
   - avoid “instant access”
   - avoid “unlock” style framing
   - use sign-in/register language as account access, not club access guarantee

4. Preserve behavior
   - OAuth redirect
   - email/password actions
   - redirect query handling
   - password policy
   - consent checkbox
   - success state

**Do not**

- change auth server actions
- change validation logic
- make the page conversion-hype heavy

**QA pages**

- `/en/account/login`
- `/en/account/register`
- same pages in `es`, `fr`, `de`
- failed login state
- register password validation state
- register success email-confirmation state

**Pass gate**

Forms look integrated with SCM and behave identically.

---

# Wave 6: Directory and Filter Polish

**Goal:** Make club discovery more usable and less visually heavy while preserving trust-safe positioning.

**Primary targets**

- `app/[lang]/clubs/ClubsPageClient.tsx`
- `components/FilterBar.tsx`
- `components/ClubCard.tsx`

**Design direction**

Directory pages are operational: users are comparing, filtering, and understanding profile status. They need utility and trust, not a giant landing-page preamble.

**Work items**

1. Directory header
   - reduce excessive vertical height
   - move filters and first results higher
   - keep trust explanation visible but lighter
   - make header start-aligned if it improves scanning

2. Filter bar
   - reduce heavy glass/shadow treatment
   - make desktop controls more compact
   - preserve mobile drawer behavior
   - ensure active filters wrap cleanly

3. Club cards
   - reduce marketplace feel
   - make verified/public status easier to scan
   - reduce overbearing CTA styling if needed
   - preserve legal-safe public listing distinction
   - keep real images strong

4. Empty/loading states
   - align skeleton heights with card layout
   - avoid giant empty-state cards unless needed

**Do not**

- remove verification/public listing taxonomy
- imply public listings are recommendations
- change data fetching behavior
- change membership flow behavior

**QA pages**

- `/en/clubs`
- `/en/spain/barcelona/clubs`
- filter open/close states
- active filters
- no results
- loading state if reproducible
- mobile drawer with cookie banner present

**Pass gate**

Users see useful controls and profiles earlier, cards scan better, and trust labels remain clear.

---

# Wave 7: Club Profile Geometry Polish

**Goal:** Keep the premium club profile look, but make layout offsets, sticky behavior, and content rhythm safer.

**Primary targets**

- `app/[lang]/clubs/[slug]/ClubProfileContent.tsx`
- `components/ui/carousel-circular-image-gallery.tsx`
- `components/clubs/ClubVideoTour.tsx`
- `components/clubs/MembershipApplicationModal.tsx` only if visual collisions appear

**Design direction**

Keep the cinematic club profile feeling. This wave is about geometry and hierarchy, not a visual reset.

**Work items**

1. Hero/content overlap
   - make negative margin behavior less fragile
   - ensure title card is not too high or too low across viewports
   - protect back button from navbar collision

2. Sticky dossier
   - use shared sticky top offset
   - prevent clipping on shorter laptop screens
   - ensure right rail does not feel detached

3. Gallery
   - ensure carousel arrows do not overflow awkwardly
   - verify image framing on mobile
   - preserve real club imagery

4. CTA hierarchy
   - keep request/membership language legal-safe
   - ensure disabled state is clear
   - avoid public access guarantee tone

5. Modal visual QA
   - check mobile bottom sheet behavior
   - check keyboard/focus-visible states

**Do not**

- change application flow logic
- change WhatsApp/Instagram behavior unless separately requested
- add public marketplace language

**QA pages**

- verified club profile
- public/unverified club profile if separate route content exists
- profile on 1366 x 768 and mobile
- membership modal open/close

**Pass gate**

The profile still feels premium, but no longer depends on brittle viewport-specific magic.

---

# Wave 8: Editorial Index and Article Reading Polish

**Goal:** Make editorial pages feel like a premium legal/city intelligence publication, not a stack of cards.

**Primary targets**

- `app/[lang]/editorial/page.tsx`
- `app/[lang]/editorial/_components/CategoryArticlePage.tsx`
- `app/[lang]/editorial/[slug]/ArticleContent.tsx`
- `components/article/ArticleContentRenderer.tsx`

**Design direction**

Editorial surfaces should be readable, trustworthy, and image-led. Use cards for article previews, not for enclosing every reading surface.

**Work items**

1. Editorial index
   - preserve strong image-led hero
   - tighten category and featured grids
   - reduce repeated heavy borders/cards
   - keep topic scanning strong

2. Article detail
   - reduce full-article card enclosure
   - improve prose max-width and line height
   - make compliance summary and disclaimer feel authoritative but not bulky
   - tune sidebar density
   - make sticky CTA bottom-offset aware

3. Article renderer
   - check headings, lists, tables, callouts
   - ensure long links and tables do not overflow mobile

4. Related articles
   - align cards with editorial index style
   - avoid hover-only affordance as sole cue

**Do not**

- change article content model
- weaken legal disclaimers
- add clickbait/listicle styling

**QA pages**

- `/en/editorial`
- one legal article
- one safety article
- one culture article
- one article with table/list content if available
- mobile sticky CTA with consent banner active

**Pass gate**

Long-form content reads cleaner, trust elements remain visible, and the page feels more like SCM editorial intelligence.

---

# Wave 9: Safety Kit, Verification, Mission, Contact, and Legal Page Polish

**Goal:** Bring supporting public trust pages into the same family without over-designing them.

**Primary targets**

- `app/[lang]/safety-kit/page.tsx`
- `app/[lang]/safety/page.tsx`
- `app/[lang]/verification/page.tsx`
- `app/[lang]/mission/page.tsx`
- `app/[lang]/contact/page.tsx`
- `components/contact/ContactInquiryForm.tsx`
- `app/[lang]/privacy/page.tsx`
- `app/[lang]/terms/page.tsx`
- `app/[lang]/cookies/page.tsx`

**Design direction**

These pages are trust infrastructure. They should feel serious, readable, and integrated, not flashy.

**Work items**

1. Safety Kit
   - preserve conversion function
   - improve spacing and mobile clarity
   - ensure CTA remains legal-safe and not access-like

2. Verification and mission
   - keep trust taxonomy clear
   - reduce excessive carding where it weakens authority
   - strengthen section alignment and rhythm

3. Contact
   - align form surface with public SCM style
   - make purpose/options easier to scan
   - avoid generic form template look

4. Legal pages
   - introduce a simple legal document shell
   - consistent title block
   - last-updated placement
   - readable prose column
   - optional table of contents if content length justifies it

**Do not**

- change legal meaning
- reduce required disclaimers
- add marketing polish that makes legal pages feel unserious

**QA pages**

- `/en/safety-kit`
- `/en/verification`
- `/en/mission`
- `/en/contact`
- `/en/privacy`
- `/en/terms`
- `/en/cookies`

**Pass gate**

Trust pages feel coherent with SCM, legally careful, and easier to read.

---

# Wave 10: Profile and Admin Surface Polish

**Goal:** Make private/admin surfaces calmer, denser, and more consistent without changing operations.

**Primary targets**

- `app/[lang]/profile/**`
- `components/profile/**`
- `app/[lang]/admin/**`
- `components/admin/**`
- `components/layout/NavigationRail.tsx`

**Explicit exclusion**

- no `app/[lang]/club-panel/**`

**Design direction**

These are operational surfaces. They should not feel like marketing pages. Use restrained layout, clear data hierarchy, and predictable controls.

**Work items**

1. Shared dashboard geometry
   - align profile and admin rail spacing where practical
   - reduce rail expansion layout shock
   - protect sticky offsets

2. Admin dashboard
   - improve table/card density
   - reduce decorative glow where it competes with data
   - ensure status/action buttons align

3. Profile pages
   - make overview/favorites/settings pages share a rhythm
   - reduce oversized empty states
   - improve mobile navigation behavior if needed

4. Forms and tables
   - consistent labels
   - consistent input heights
   - clear destructive/primary actions
   - avoid hidden horizontal overflow

**Do not**

- change permissions
- change server actions
- change admin workflows
- touch club-panel

**QA pages**

- `/en/profile`
- `/en/profile/settings`
- `/en/profile/requests`
- `/en/admin`
- `/en/admin/users`
- `/en/admin/clubs`
- `/en/admin/content/articles`
- `/en/admin/settings`

**Pass gate**

Operational pages feel more consistent and usable, with no workflow regression.

---

# Wave 11: Cross-Locale Typography and Button Fit Pass

**Goal:** Remove clipping and awkward line breaks across SCM’s supported languages.

**Primary targets**

- `components/ui/button.tsx`
- `components/layout/Navbar.tsx`
- `components/layout/MainNavigation.tsx`
- `components/ClubCard.tsx`
- `components/FilterBar.tsx`
- public page hero/header components touched in earlier waves

**Work items**

1. Button behavior
   - identify where buttons must wrap
   - identify where buttons must stay compact
   - add explicit variants/classes instead of ad hoc overrides

2. Navigation labels
   - test `es`, `fr`, `de`
   - reduce truncation
   - protect center alignment

3. Eyebrow labels
   - reduce extreme tracking where unreadable
   - avoid breaking compact panels

4. Cards and filters
   - long neighborhood/amenity/vibe labels
   - active filter tokens
   - mobile drawer labels

**Do not**

- rewrite translations except where a label is clearly broken and approved
- global-change button behavior without page QA

**QA**

Full locale screenshot pass on affected pages.

**Pass gate**

No critical labels clip in `en`, `es`, `fr`, or `de`.

---

# Wave 12: Final Visual Regression and Polish Lock

**Goal:** Verify the whole platform feels coherent and remains functional.

**Scope**

- Cross-page visual QA.
- No new design initiatives.
- Small fixes only.

**Pages**

- homepage: sizing/overflow only
- Barcelona page: preservation check
- Spain hub
- non-Barcelona city
- clubs directory
- club profile
- editorial index
- article detail
- Safety Kit
- verification
- mission
- contact
- legal pages
- account login/register
- profile
- admin

**Excluded**

- club-panel

**Checks**

- homepage untouched except approved sizing fixes
- Barcelona page still looks like the liked design direction
- no cannabis leaf iconography
- no generic SaaS hero/card surfaces where public editorial design is needed
- no public access guarantees
- no layout collisions
- no mobile horizontal scroll
- no broken auth/profile/admin workflows

**Pass gate**

The UI uplift can be treated as complete only after browser QA and targeted functional checks pass.

---

# Page-by-Page Intent Map

## Homepage

**Intent:** Preserve.  
**Allowed work:** sizing and responsive safety only.  
**Design posture:** do not touch concept.

## Barcelona City Page

**Intent:** Preserve and lightly polish.  
**Allowed work:** spacing, sticky offset, responsive safety.  
**Design posture:** current design direction is a reference.

## Spain Hub

**Intent:** Uplift strongly.  
**Design posture:** national editorial orientation surface, not card dashboard.

## Non-Barcelona City Pages

**Intent:** Uplift quietly.  
**Design posture:** intentional coming-soon/city-intelligence surfaces, not fake active directories.

## Club Directory

**Intent:** Improve utility and scanning.  
**Design posture:** trust-first comparison surface.

## Club Profile

**Intent:** Keep premium, fix geometry.  
**Design posture:** cinematic profile with reliable sticky/content behavior.

## Editorial

**Intent:** Improve reading quality and reduce chrome.  
**Design posture:** serious editorial/legal intelligence.

## Auth

**Intent:** Integrate with brand.  
**Design posture:** focused account entry, not landing page, not generic form.

## Safety / Verification / Mission

**Intent:** Make trust pages coherent.  
**Design posture:** calm authority.

## Contact

**Intent:** Reduce generic form feel.  
**Design posture:** founder/operator contact, clean and credible.

## Legal

**Intent:** Improve readability.  
**Design posture:** plain, official, integrated.

## Profile / Admin

**Intent:** Operational polish.  
**Design posture:** dense, calm, useful.

## Club Panel

**Intent:** Excluded.  
**Design posture:** future separate plan only.

---

# Implementation Principles

## Preserve What Works

Do not “normalize” strong pages into bland consistency. The goal is coherence, not sameness.

Barcelona can be more cinematic than legal pages. Admin can be denser than public pages. Club profiles can be richer than directory cards. The system should feel related through spacing, typography, color, and layout discipline, not identical templates.

## Make Utility Surfaces Useful First

For directories, admin, profile, filters, forms, and tables:

- controls should be near the work
- data should scan quickly
- text should not be decorative
- cards should exist only when they frame a real object or action

## Make Editorial Surfaces Trustworthy First

For articles, city guides, verification, mission, and safety:

- strong images only where they add meaning
- fewer boxed panels
- readable prose
- clear trust taxonomy
- disclaimers visible but not visually panicked

## Avoid False Precision and False Promises

Do not use visuals or stats that imply:

- all clubs are verified
- acceptance is guaranteed
- SCM sells access
- speed matters more than safety
- public listings are recommendations

## Fix Layout Before Decoration

Every page should first pass:

- alignment
- spacing
- responsive fit
- text readability
- sticky/fixed behavior

Only then should motion, shadows, or hover polish be adjusted.

---

# Rollback Strategy

Every wave should be independently revertible.

Recommended patch discipline:

1. Wave branch or isolated commit.
2. No mixed unrelated changes.
3. Screenshots before and after.
4. Test notes in the PR or implementation report.
5. If a wave causes broad regression, revert the wave rather than patching around it blindly.

---

# Final Ship Gate

Before calling the UI polish complete:

1. Homepage verified unchanged except approved sizing fixes.
2. Barcelona page verified preserved.
3. Club-panel untouched.
4. Public pages visually coherent.
5. Auth pages no longer feel generic.
6. Directory pages are easier to scan.
7. Club profiles still feel premium and are less fragile.
8. Editorial articles read better.
9. Profile/admin pages remain operational.
10. All supported locales checked for obvious clipping.
11. No legal-safe positioning regressions.
12. No functional regressions in auth, filtering, profile, admin, forms, or modals.

---

# Recommended Starting Order

If implementation starts tomorrow, use this order:

1. Wave 0: baseline screenshots.
2. Wave 1: non-visual foundation variables.
3. Wave 2: navbar/sticky/bottom-layer stability.
4. Wave 3: Spain hub uplift.
5. Wave 5: auth entry polish.
6. Wave 6: directory/filter polish.
7. Wave 7: club profile geometry.
8. Wave 8: editorial reading polish.
9. Wave 9: trust/legal/supporting public pages.
10. Wave 10: profile/admin polish.
11. Wave 11: locale typography/button fit.
12. Wave 12: final regression pass.

Wave 4 can be done after Wave 3 or grouped with it if the same city-page primitives are touched, but Barcelona must remain protected.

---

# QA Status

**Current status:** HOLD for implementation.  
**Reason:** This is a planning document only. The next step is Wave 0 baseline screenshot capture before any UI code changes.

