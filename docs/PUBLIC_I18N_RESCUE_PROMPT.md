# Public I18n Rescue Prompt (Full Platform, User-Facing First)

Use this prompt as-is in a new coding session.

---

## Role and Mission

You are a Senior Staff i18n rescue engineer working on a Next.js App Router platform.

Your mission is to finish multilingual support for **all public user-facing pages and shared public components** before touching admin/internal areas.

Current supported locales are strictly:

- `es`
- `en`
- `fr`
- `de`

Do not re-add any other locale.

---

## Non-Negotiable Priorities

1. **Public pages first, end-to-end.**
2. **Shared public components second** (navbar/footer/auth/trust/landing blocks).
3. **Protected user pages third** (`/account`, `/profile`, auth flows).
4. **Admin is out of scope** unless a shared dependency blocks public i18n.

If forced to choose, always prioritize what anonymous and normal logged-in users see before admin routes.

---

## Hard Constraints

- Do not use `any`, `@ts-ignore`, or `@ts-expect-error`.
- Do not do broad refactors unrelated to translation.
- Do not change behavior/business logic unless required for i18n correctness.
- Do not commit unless explicitly requested.
- Keep locale set to `es`, `en`, `fr`, `de` only.

---

## Existing i18n Contract (Must Respect)

- Translation hook: `useLanguage()` from `hooks/useLanguage.tsx`
- Translation function: `t('namespace.key')`
- Dictionaries in `dictionaries/`:
  - `dictionaries/en.json`
  - `dictionaries/es.json`
  - `dictionaries/fr.json`
  - `dictionaries/de.json`
- Dictionary loading/config:
  - `lib/dictionary.ts`
  - `lib/i18n-config.ts`
  - `lib/i18n.ts`
  - `types/i18n.ts`

Key naming format:

- `{section}.{subsection}.{element}`
- Examples: `home.hero.title`, `events.card.view_details`, `auth.login.submit`

---

## Required Execution Protocol

1. Run an exhaustive scan for hardcoded UI strings in scoped public files.
2. Convert hardcoded user-facing text to `t('...')`.
3. Add missing keys in **all four dictionaries** (`en/es/fr/de`).
4. Ensure interpolation uses placeholders like `{{count}}`, `{{name}}`.
5. Verify language switching works on public routes in runtime.
6. Run lint + build and fix issues surgically.

Validation commands:

```bash
npm run lint
npm run build
```

Also run dictionary key-parity check (script or node one-liner) to ensure 0 missing keys for `es/fr/de` versus `en`.

---

## Complete Routing Structure (Source of Truth)

### Root/System

- `app/layout.tsx`
- `app/error.tsx`
- `app/not-found.tsx`
- `app/robots.ts`
- `app/sitemap.ts`

### Localized App Shell

- `app/[lang]/layout.tsx`
- `app/[lang]/error.tsx`
- `app/[lang]/not-found.tsx`
- `app/[lang]/robots.ts`
- `app/[lang]/sitemap.ts`

### Public User-Facing Pages (Primary Target)

- `app/[lang]/page.tsx`
- `app/[lang]/about/page.tsx`
- `app/[lang]/clubs/page.tsx`
- `app/[lang]/clubs/ClubsPageWrapper.tsx`
- `app/[lang]/clubs/ClubsPageClient.tsx`
- `app/[lang]/clubs/[slug]/page.tsx`
- `app/[lang]/clubs/[slug]/ClubProfileContent.tsx`
- `app/[lang]/cookies/page.tsx`
- `app/[lang]/editorial/page.tsx`
- `app/[lang]/editorial/EditorialPageClient.tsx`
- `app/[lang]/editorial/culture/page.tsx`
- `app/[lang]/editorial/etiquette/page.tsx`
- `app/[lang]/editorial/legal/page.tsx`
- `app/[lang]/editorial/[slug]/page.tsx`
- `app/[lang]/editorial/[slug]/ArticleContent.tsx`
- `app/[lang]/events/page.tsx`
- `app/[lang]/events/EventsPageClient.tsx`
- `app/[lang]/events/[slug]/page.tsx`
- `app/[lang]/learn/page.tsx`
- `app/[lang]/learn/GuideFilters.tsx`
- `app/[lang]/learn/[slug]/page.tsx`
- `app/[lang]/mission/page.tsx`
- `app/[lang]/privacy/page.tsx`
- `app/[lang]/safety/page.tsx`
- `app/[lang]/safety-kit/page.tsx`
- `app/[lang]/spain/page.tsx`
- `app/[lang]/spain/SpainPageClient.tsx`
- `app/[lang]/spain/[city]/page.tsx`
- `app/[lang]/spain/[city]/CityPageClient.tsx`
- `app/[lang]/spain/[city]/clubs/page.tsx`
- `app/[lang]/spain/[city]/clubs/[slug]/page.tsx`
- `app/[lang]/spain/[city]/guides/page.tsx`
- `app/[lang]/spain/[city]/guides/[slug]/page.tsx`
- `app/[lang]/terms/page.tsx`
- `app/[lang]/tools/page.tsx`

### Auth + User-Protected (Secondary, still user-facing)

- `app/[lang]/account/login/page.tsx`
- `app/[lang]/account/register/page.tsx`
- `app/[lang]/forgot-password/page.tsx`
- `app/[lang]/reset-password/page.tsx`
- `app/[lang]/resend-confirmation/page.tsx`
- `app/[lang]/auth/callback/page.tsx`
- `app/[lang]/account/page.tsx`
- `app/[lang]/account/requests/page.tsx`
- `app/[lang]/account/verification/page.tsx`
- `app/[lang]/profile/page.tsx`
- `app/[lang]/profile/layout.tsx`
- `app/[lang]/profile/UserProfilePageContent.tsx`
- `app/[lang]/profile/bookings/page.tsx`
- `app/[lang]/profile/favorites/page.tsx`
- `app/[lang]/profile/notifications/page.tsx`
- `app/[lang]/profile/requests/page.tsx`
- `app/[lang]/profile/reviews/page.tsx`
- `app/[lang]/profile/settings/page.tsx`

### Out of Scope for This Rescue (Do Not Prioritize)

- `app/[lang]/admin/**`
- `app/[lang]/club-panel/**`
- `app/api/**`

Only touch these if a shared dependency blocks user-facing translation correctness.

---

## Complete Components Structure (Translation-Relevant)

### Shared Global Components (Must Be Correct)

- `components/layout/Navbar.tsx`
- `components/layout/MainNavigation.tsx`
- `components/layout/ConditionalFooter.tsx`
- `components/Footer.tsx`
- `components/LanguageSelector.tsx`
- `components/UserProfileDropdown.tsx`
- `components/LegalDisclaimer.tsx`
- `components/trust/LegalDisclaimerModal.tsx`
- `components/trust/TrustBadge.tsx`
- `components/VerificationBadge.tsx`

### Public Content Components (High-Risk for Hardcoded Copy)

- `components/HeroSection.tsx`
- `components/FilterBar.tsx`
- `components/ClubCard.tsx`
- `components/home/CitySelectorSection.tsx`
- `components/home/EditorialFeedSection.tsx`
- `components/home/RealityCheckSection.tsx`
- `components/clubs/ClubContactSection.tsx`
- `components/clubs/GatedContent.tsx`
- `components/city/SafetyStickyAlert.tsx`
- `components/landing/editorial-concierge/EditorialConciergeFlow.tsx`
- `components/landing/editorial-concierge/blocks/*.tsx`
- `components/landing/editorial-concierge/interactive/*.tsx`
- `components/landing/editorial-concierge/layout/*.tsx`
- `components/landing/editorial-concierge/typography/*.tsx`

### Auth/User Components (User-Facing)

- `components/auth/AuthProvider.tsx`
- `components/auth/LoginForm.tsx`
- `components/auth/RegisterForm.tsx`
- `components/profile/ApplicationStatusTracker.tsx`
- `components/profile/MemberPassport.tsx`
- `components/profile/ProfileSidebar.tsx`

### Hooks and i18n Backbone

- `hooks/useLanguage.tsx`
- `hooks/useClubs.ts`
- `hooks/use-toast.ts`

### Admin/Club Panel Components (Not Primary in This Prompt)

- `components/admin/*.tsx`
- `components/club/*.tsx`

---

## Codebase Structure Map (for Scope Clarity)

```text
app/
  [lang]/
    about/
    account/
      login/
      register/
      requests/
      verification/
    admin/
      (portal)/
        analytics/
        audit-logs/
        clubs/
          [id]/
          verification/
        content/
          articles/
          events/
        requests/
        settings/
        users/
          [id]/
      login/
    auth/
      callback/
    club-panel/
      dashboard/
        analytics/
        events/
        profile/
        requests/
      login/
      signup/
    clubs/
      [slug]/
    cookies/
    editorial/
      [slug]/
      culture/
      etiquette/
      legal/
    events/
      [slug]/
    forgot-password/
    learn/
      [slug]/
    mission/
    privacy/
    profile/
      bookings/
      favorites/
      notifications/
      requests/
      reviews/
      settings/
    resend-confirmation/
    reset-password/
    safety/
    safety-kit/
    spain/
      [city]/
        clubs/
          [slug]/
        guides/
          [slug]/
    terms/
    tools/
  actions/
  api/
    admin/blog/publish/
    auth/audit/
    locale/
    profile/me/

components/
  admin/
  article/
  auth/
  city/
  club/
  clubs/
  home/
  landing/editorial-concierge/
    blocks/
    interactive/
    layout/
    typography/
  layout/
  profile/
  trust/
  typography/
  ui/
  (root shared components: ClubCard, FilterBar, Footer, HeroSection, LanguageSelector, UserProfileDropdown, etc.)

hooks/
  useLanguage.tsx
  useClubs.ts
  use-toast.ts

lib/
  dictionary.ts
  i18n-config.ts
  i18n.ts
  (utilities/services)

dictionaries/
  en.json
  es.json
  fr.json
  de.json

types/
  i18n.ts
```

---

## Explicit Bug Focus to Fix First

You must resolve these real user-reported failures first:

1. `/account` stays in English regardless of selected language.
2. `/admin` currently only accepts or behaves with Spanish context.
3. Language switch appears ineffective on major public pages.

Before broad sweep, verify locale propagation in:

- `app/[lang]/layout.tsx`
- `components/LanguageUpdater.tsx`
- `hooks/useLanguage.tsx`
- navigation locale links in `components/layout/Navbar.tsx` and `components/layout/MainNavigation.tsx`

---

## Mandatory Public Translation Sweep

For each file in Public + Auth/User scope:

1. Replace hardcoded visible strings (`headings`, `buttons`, `labels`, `tabs`, `empty states`, `toasts`, `status text`, `CTA`, `helper text`, `legal text`) with `t('...')`.
2. Replace hardcoded placeholders/titles/aria labels with translated keys.
3. Keep technical tokens (CSS classes, IDs, enum keys) unchanged.
4. Add missing dictionary keys for `en/es/fr/de`.
5. Keep copy quality equivalent across locales.

---

## QA and Acceptance Criteria

Work is complete only when all are true:

- Public route language switch visually changes user-facing text for `es`, `en`, `fr`, `de`.
- No hardcoded user-facing strings remain in scoped files (except intentional brand/legal constants approved explicitly).
- Dictionary parity check reports zero missing keys in `es/fr/de` against `en`.
- `npm run lint` passes.
- `npm run build` passes.
- Final report includes:
  - files changed,
  - key namespaces added,
  - verification outputs,
  - known leftovers (if any).

---

## Required Final Report Format

At the end, return:

1. **What was fixed first** (the three explicit bugs above).
2. **Public routes completed** (checklist).
3. **Shared components completed** (checklist).
4. **Dictionary stats** (keys added per locale + parity result).
5. **Verification evidence** (`lint`, `build`, runtime locale checks).
6. **Any remaining blockers** (must be concrete and minimal).

---

## Start Command

Start immediately with:

1. Locale propagation diagnosis (`layout` + `useLanguage` + nav links),
2. then Tier 1 public pages (`/`, `/clubs`, `/clubs/[slug]`, `/editorial`, `/events`, `/spain`, `/safety`, `/mission`, `/about`),
3. then Tier 2 auth/profile/account pages,
4. then verification.

Do not stop at partial coverage.
