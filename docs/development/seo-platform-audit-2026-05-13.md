# SCM Platform SEO Audit

**Date:** 2026-05-13  
**Mode:** Engineering Mode with internal SEO strategy framing  
**Skill stack:** `scm`, `scm-editorial-seo`, `scm-brand-voice`  
**Scope:** Next.js App Router SEO implementation, localized routing, sitemap/robots, indexation policy, structured data, public content architecture, editorial metadata, public/private boundary, and SCM legal-safe positioning.  
**Overall score:** **64 / 100**

## Executive Diagnosis

SCM is not starting from zero. The codebase has a real SEO foundation: localized routes, a shared metadata helper, sitemap and robots routes, JSON-LD utilities, article schema, breadcrumb schema, safe club metadata, and a clear Barcelona-first governance document.

The problem is that the implementation is uneven. Some high-value surfaces are aligned with SCM's trust-first strategy, while other global metadata, city/directory pages, event surfaces, and localization mechanics still behave like an older broad directory product. That creates three risks:

1. **Search engines may index pages that are not strategically ready.**
2. **Google may see duplicated or thin localized content as separate pages without enough differentiation.**
3. **Public snippets can still imply breadth, access, or marketplace behavior that the current product should not promise.**

The SEO state is therefore **structurally promising but not launch-hard**. The platform has the bones of a strong trust-led search engine, but it needs a disciplined indexation and metadata cleanup before scaling content.

## Scorecard

| Area | Score | Diagnosis |
|---|---:|---|
| Technical SEO foundation | 74 | Shared helpers, sitemap, robots, JSON-LD, and localized routes exist. Gaps remain in canonical consistency, root metadata, and noindex policy. |
| Indexation control | 58 | Auth/admin routes are protected, but some public routes are indexable before the content depth or strategic fit justifies it. |
| Metadata quality | 62 | Page-level metadata exists on most key pages, but root fallback copy is stale and some route metadata still over-broadens the product. |
| International SEO | 55 | Locale-first routing is solid, but hreflang assumes equivalent slug/content quality across locales and translations are partly synthetic/fallback-driven. |
| Structured data | 70 | Strong primitives and page-level JSON-LD are present. Some schema types and image URLs need hardening. |
| Editorial SEO | 66 | Core pillar articles exist and match SCM's strategy. Off-strategy event/industry content dilutes topical focus. |
| Internal linking | 67 | There is a documented trust spine and many links to Safety Kit / Verification. Some legacy `/clubs` and `/en/` link assumptions remain. |
| Programmatic directory SEO | 54 | Safe club metadata is thoughtful, but city and listing indexation rules are inconsistently enforced. |
| Legal-safe public positioning | 72 | Recent copy is much safer. Some global metadata and event/directory surfaces still carry old marketplace energy. |
| Measurement / QA | 52 | There are tests for SEO helpers, but no complete crawl, sitemap diff, hreflang validation, or search-surface regression suite. |

## What Is Working

### 1. Locale-first routing is implemented correctly at the architecture level

Relevant files:

- `app/[lang]/layout.tsx`
- `proxy.ts`
- `lib/i18n-config.ts`

The app routes public pages under `/{locale}/...`, validates supported locales, and redirects non-localized requests to a negotiated locale. This is the right foundation for multilingual SEO.

The proxy explicitly excludes SEO discovery assets such as `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/llms-full.txt`, which prevents locale redirects from breaking crawler discovery.

### 2. There is a shared metadata layer

Relevant file:

- `lib/seo.ts`

`buildLocalizedMetadata()` handles canonical URL, language alternates, Open Graph, Twitter cards, and optional noindex in one place. This is much better than scattered hand-built metadata.

The helper also centralizes `metadataBase` behavior via `getBaseUrl()`, with a safe production fallback to `https://www.socialclubsmaps.com`.

### 3. Private and administrative areas are mostly kept out of search

Relevant files:

- `app/[lang]/account/layout.tsx`
- `app/[lang]/profile/layout.tsx`
- `app/[lang]/admin/layout.tsx`
- `app/[lang]/club-panel/layout.tsx`
- `app/robots.ts`

Most account, profile, admin, auth, and club-panel routes use noindex metadata and are also disallowed in robots. That is correct for sensitive and low-value pages.

### 4. Editorial article pages have the right schema shape

Relevant file:

- `app/[lang]/editorial/[slug]/page.tsx`

Article pages include:

- canonical URLs
- language alternates
- Open Graph article metadata
- Twitter cards
- `Article` JSON-LD
- `BreadcrumbList` JSON-LD

That is the right baseline for SCM's guide/content engine.

### 5. Club profile SEO is intentionally safer than generic directory SEO

Relevant files:

- `app/[lang]/clubs/[slug]/page.tsx`
- `lib/public-club-safety.ts`

The club profile implementation has an important safety distinction: unverified club profiles are `noindex, follow`, while verified profiles can be indexed. Structured data is intentionally lighter for public listings and avoids exposing risky fields such as price range for public listings.

This is aligned with SCM's public-safe positioning: **Verified Profile vs Public Listing must not blur.**

### 6. Sitemap generation is dynamic and includes the main public spine

Relevant file:

- `app/sitemap.ts`

The sitemap includes localized static routes, Barcelona city routes, verified/featured club profile routes, editorial article routes, and future events. It also deduplicates URLs.

The strongest part is the filter that only includes clubs where:

- `verificationStatus === 'FEATURED'`
- `verificationStatus === 'SCM_VERIFIED'`
- or `isVerified`

That is the correct direction.

## Critical Findings

### P0: Root metadata still describes the old broad directory product

Relevant file:

- `app/layout.tsx`

The root metadata still says SCM lets users "Discover and connect with verified cannabis social clubs in Spain" and mentions browsing directories in Barcelona, Madrid, Valencia, and more.

This conflicts with the newer page-level homepage metadata in `app/[lang]/page.tsx`, which correctly frames SCM as independent, legally grounded, Barcelona-first guidance.

Why this matters:

- Root metadata can leak into fallback pages, previews, crawlers, and metadata inheritance cases.
- The phrasing sounds like a scaled national marketplace rather than a trust-first guide.
- It can create a mismatch between search expectations and actual current inventory.

Recommended fix:

Rewrite root default title, description, Open Graph title/description, Twitter description, keywords, and classification around:

- independent guide
- Spain cannabis social club education
- Barcelona-first safety and verification
- no promise of direct connection, access, or broad national inventory

Suggested direction:

> SocialClubsMaps is an independent, legally grounded guide to cannabis social clubs in Spain, starting with Barcelona safety, verification standards, and visitor education.

### P0: `/spain` is indexable while still promising broad national coverage

Relevant file:

- `app/[lang]/spain/page.tsx`

The Spain page metadata mentions Barcelona, Madrid, Valencia, Sevilla, and Malaga. The English description is safer, but the Spanish/French/German versions still read like a broad city directory with updated information.

Why this matters:

- The governance contract says Barcelona is the active city hub.
- Future city pages should remain `noindex, follow` until they have real content depth.
- A broad Spain hub can rank for national queries before the site has enough city-level depth to satisfy intent.

Recommended fix:

Keep `/spain` indexable only if it is reframed as a **Spain legal/process overview with Barcelona as the live city layer**, not a multi-city club directory. Otherwise temporarily noindex it until the page has enough unique national content.

### P0: City club index routes are indexable for non-Barcelona cities

Relevant file:

- `app/[lang]/spain/[city]/clubs/page.tsx`

The city detail page correctly noindexes non-Barcelona city pages in `app/[lang]/spain/[city]/page.tsx`. But the nested city clubs route does not apply the same rule.

This means a URL like:

- `/en/spain/madrid/clubs`
- `/en/spain/valencia/clubs`

can generate localized metadata and indexable collection schema if `getCityBySlug(city)` returns a city. That violates the documented city indexing rule.

Why this matters:

- Thin city directory pages are one of the fastest ways to dilute trust and trigger low-quality programmatic SEO signals.
- It conflicts with `docs/development/public-seo-governance.md`.

Recommended fix:

Apply the same active-city gate to all nested city routes:

- `/spain/[city]/clubs`
- `/spain/[city]/guides`
- future nested city pages

For non-Barcelona cities, return `buildNoIndexFollowMetadata()` and keep content clearly "coming soon" or route to the Spain hub.

### P0: Language alternates assume every locale has equivalent translated content

Relevant files:

- `lib/seo.ts`
- `app/[lang]/editorial/[slug]/page.tsx`
- `lib/blog-content.ts`
- `lib/article-translations.ts`

`buildLanguageAlternates(path)` creates hreflang URLs for every locale using the same path. That is technically clean only if every localized route has equivalent content quality.

The current article system does not meet that standard consistently:

- English MDX files are the canonical content source.
- Non-English translations are stored in `lib/article-translations.ts`.
- If a translation is missing, `localizeArticle()` keeps English title/content and only localizes internal links.
- Therefore `/es/editorial/{slug}`, `/fr/editorial/{slug}`, or `/de/editorial/{slug}` can be indexable pages with English content.

Why this matters:

- This creates duplicate content across languages.
- Hreflang can become misleading if a page is not actually localized.
- It weakens quality perception for non-English users.

Recommended fix:

Introduce a translation completeness flag. For article pages:

- If the locale has a real translation, index it and include it in hreflang.
- If the locale falls back to English, return `noindex, follow` or canonicalize to English.
- Build alternates per page from actual translation availability, not from all locales blindly.

### P0: `/clubs` is a redirect but still generates indexable metadata

Relevant file:

- `app/[lang]/clubs/page.tsx`

The route generates full metadata and then redirects to `/{lang}/spain/barcelona/clubs`.

Why this matters:

- Search engines usually treat the redirect target as canonical, but metadata on redirecting routes is wasted and can confuse internal assumptions.
- Internal links and schema still reference `/clubs` in several places.
- The sitemap does not include `/clubs`, but global navigation and JSON-LD site navigation do include it.

Recommended fix:

Pick one canonical directory route:

- Either keep `/clubs` as the canonical directory and render the Barcelona directory there.
- Or make `/spain/barcelona/clubs` canonical everywhere and remove `/clubs` from structured navigation and priority sitelinks.

Given SCM's current strategy, the better public route is probably:

- canonical: `/{lang}/spain/barcelona/clubs`
- `/clubs`: permanent redirect only

Then update structured data and internal links accordingly.

## High Findings

### P1: Event pages dilute SCM topical authority

Relevant files:

- `app/[lang]/events/page.tsx`
- `app/[lang]/events/[slug]/page.tsx`
- event-oriented MDX files under `data/content/culture/`

Events are currently included in the sitemap when not expired, and event detail pages are indexable.

The problem is not technical. The problem is topical fit. Several event/industry articles are about cannabis conferences and policy/capital signals rather than SCM's core search moat:

- visitor safety
- Barcelona club reality
- private association education
- scam prevention
- verification standards

Why this matters:

- SCM should not look like a cannabis industry media site.
- Event pages can pull search engines toward a broader cannabis-events topical graph.
- This may dilute authority for high-value visitor/legal/trust queries.

Recommended fix:

Make `/events` and event detail pages `noindex, follow` unless an event page is directly tied to SCM's Barcelona trust mission. Keep them accessible as editorial support, but do not let them compete with the trust-anchor cluster.

### P1: `buildLanguageAlternates()` has no canonical-only mode

Relevant file:

- `lib/seo.ts`

The helper is useful, but too blunt. Every localized page receives a complete hreflang set, even when:

- content is not truly translated
- the page is city-specific and only Barcelona is live
- a route redirects
- a page is noindexed

Recommended fix:

Add a second helper:

- `buildAvailableLanguageAlternates(path, availableLocales)`

Then use it for articles, city pages, club pages, and any route where locale availability differs from routing availability.

### P1: Sitemap lacks hreflang alternates

Relevant file:

- `app/sitemap.ts`

Next.js sitemap entries can include `alternates.languages`. The current sitemap lists localized URLs independently but does not connect them as alternates.

Why this matters:

- Page metadata has hreflang, so this is not fatal.
- But sitemap-level alternates improve discoverability and provide a second consistency signal.

Recommended fix:

Add `alternates.languages` for static localized routes and for dynamic pages where translations are complete.

### P1: Article `dateModified` equals `publishedAt`

Relevant file:

- `app/[lang]/editorial/[slug]/page.tsx`

Article JSON-LD sets:

- `datePublished: article.publishedAt`
- `dateModified: article.publishedAt`

There is no `updatedAt`, `lastReviewed`, or `lastVerified` propagation from MDX frontmatter, even though several MDX files include `lastVerified`.

Why this matters:

- SCM's strategy depends on recency, trust, and "last checked" clarity.
- Legal and safety guides need stronger freshness signals.
- Search snippets and schema should not imply old legal content was never reviewed.

Recommended fix:

Extend article records to include:

- `lastVerified`
- `lastReviewed`
- `updatedAt` or `modifiedAt`

Then use the best available value for `dateModified` and render a visible review note on legal/safety articles.

### P1: Root `<html lang>` is always default locale

Relevant file:

- `app/layout.tsx`

The root layout renders:

```tsx
<html lang={i18n.defaultLocale}>
```

Because the locale is handled inside `app/[lang]/layout.tsx`, the actual `<html lang>` remains `es` for English, French, and German pages.

Why this matters:

- This is a direct international SEO and accessibility defect.
- Search engines and assistive technologies receive the wrong document language.

Recommended fix:

Move locale-aware `html lang` handling to a route group or restructure layouts so the `[lang]` segment controls the `<html>` tag. If that is too invasive, validate whether Next's current layout architecture can pass params to the root; if not, consider middleware-set headers plus a client-side updater only as a fallback, not the ideal SEO solution.

### P1: Some image URLs in JSON-LD are relative

Relevant files:

- `app/[lang]/editorial/[slug]/page.tsx`
- `app/[lang]/events/[slug]/page.tsx`

Article JSON-LD uses `image: articleImage`, where `articleImage` can be a relative path from `getArticleCardImage()`. Event JSON-LD uses `image: event.imageUrl || toAbsoluteUrl(...)`, where `event.imageUrl` may also be relative.

Why this matters:

- Schema.org image URLs should be absolute.
- Relative image paths can produce weaker or invalid rich-result parsing.

Recommended fix:

Wrap schema image URLs with `toAbsoluteUrl()` when they are internal paths, or use `toAbsoluteHttpUrl()` for external media.

### P1: Programmatic city guide routes are partly noindex, but guide index route is not gated

Relevant files:

- `app/[lang]/spain/[city]/guides/page.tsx`
- `app/[lang]/spain/[city]/guides/[slug]/page.tsx`

The guide detail route is noindexed. The city guides index route uses localized metadata and does not appear to apply active-city indexation gates.

Why this matters:

- It can create thin city guide index pages for cities that are not ready.
- It repeats the same problem as city club index pages.

Recommended fix:

Apply the same Barcelona-only index gate to guides index routes until each city has real guide inventory and unique legal/safety context.

## Medium Findings

### P2: Metadata keyword arrays include legacy cannabis-tourism terms

Relevant files:

- `app/layout.tsx`
- `app/[lang]/spain/page.tsx`
- `app/[lang]/clubs/page.tsx`
- `app/[lang]/spain/[city]/page.tsx`

Keywords include terms such as:

- `cannabis tourism Spain`
- `Madrid marijuana clubs`
- `marijuana clubs`
- broad national directory phrases

Meta keywords are low value for modern Google ranking, but they are still a useful internal smell: some phrase choices reflect the older marketplace/tourism posture.

Recommended fix:

Remove or rewrite keywords to match SCM's public-safe language:

- cannabis social clubs Spain
- Barcelona cannabis social club guide
- Spain cannabis social club legal guide
- verified cannabis social club profiles
- SCM verification standard
- visitor safety guide Spain

### P2: Some localized article internal links still point to English labels or English routes in source translations

Relevant files:

- `lib/article-translations.ts`
- `lib/blog-content.ts`

`localizeInternalLinks()` rewrites `/en/` route prefixes to the active locale, which helps. But the visible link text often remains English, such as "The Safety Kit", "the directory", or English article names inside Spanish/French/German content.

Why this matters:

- This weakens non-English page quality.
- It can make translations feel partially machine-assembled.

Recommended fix:

Add a translation QA pass for visible link labels in all non-English articles. Do not rely on path localization alone.

### P2: Editorial category pages are indexable but depend on content mix quality

Relevant files:

- `app/[lang]/editorial/legal/page.tsx`
- `app/[lang]/editorial/etiquette/page.tsx`
- `app/[lang]/editorial/culture/page.tsx`
- `app/[lang]/editorial/safety/page.tsx`
- `app/[lang]/editorial/_components/CategoryArticlePage.tsx`

Category pages have metadata and JSON-LD, which is good. The risk is that the category inventory mixes core trust pages with weaker/off-strategy content, especially in Culture.

Recommended fix:

Keep Legal, Safety, and Etiquette indexable. Review Culture after removing or noindexing event/conference content.

### P2: `llms.txt` and markdown routes are promising but need governance

Relevant files:

- `app/llms.txt/route.ts`
- `app/llms-full.txt/route.ts`
- `app/[lang]/editorial/markdown-index/route.ts`
- `app/[lang]/editorial/[slug]/markdown/route.ts`

These routes are useful for AI crawler discoverability and content accessibility. The risk is that they expose the same localization completeness problem as article pages.

Recommended fix:

Only include localized markdown indexes for locales with real translated content, or label fallback content clearly.

### P2: Structured navigation points to `/clubs`

Relevant file:

- `lib/seo.ts`

`buildSiteNavigationJsonLd()` includes:

```ts
{ name: 'Directory', path: `/${locale}/clubs` }
```

But `/clubs` redirects to `/spain/barcelona/clubs`.

Recommended fix:

Point structured navigation to the canonical route once the canonical directory decision is made.

### P2: Open Graph image uses SVG logo as default

Relevant file:

- `lib/seo.ts`

Default OG image:

```ts
const DEFAULT_OG_IMAGE_PATH = '/images/SCM_Logo_SVG.svg';
```

Why this matters:

- Social cards and search previews usually perform better with a raster image built for preview dimensions.
- Some platforms handle SVG less predictably.

Recommended fix:

Create a branded 1200x630 raster OG image for:

- default site
- Safety Kit
- Barcelona city hub
- editorial legal cluster
- verification standard

## Route-Level Indexation Matrix

| Route family | Current state | Recommended state |
|---|---|---|
| `/{lang}` | Indexable | Keep indexable after root metadata cleanup. |
| `/{lang}/safety-kit` | Indexable | Keep. This is a primary conversion/trust page. |
| `/{lang}/verification` | Indexable | Keep. This is a trust anchor. |
| `/{lang}/mission` | Indexable | Keep if copy remains independent/public-safe. |
| `/{lang}/editorial` | Indexable | Keep. |
| `/{lang}/editorial/legal` | Indexable | Keep. |
| `/{lang}/editorial/safety` | Indexable | Keep after content QA. |
| `/{lang}/editorial/culture` | Indexable | Keep only after removing/noindexing off-strategy event content. |
| `/{lang}/editorial/{slug}` | Indexable | Keep only when localized content is real; otherwise noindex fallback locales. |
| `/{lang}/spain` | Indexable | Reframe as national guide or temporarily noindex. |
| `/{lang}/spain/barcelona` | Indexable | Keep. |
| `/{lang}/spain/{non-barcelona}` | Noindex | Correct. Keep. |
| `/{lang}/spain/{city}/clubs` | Indexable | Gate non-Barcelona as noindex. |
| `/{lang}/spain/{city}/guides` | Indexable | Gate non-Barcelona as noindex. |
| `/{lang}/clubs` | Redirect | Remove from canonical structured nav or render canonical content there. |
| `/{lang}/clubs/{slug}` verified | Indexable | Keep if verified profile has enough unique content and Last Checked context. |
| `/{lang}/clubs/{slug}` public listing | Noindex, follow | Correct. Keep. |
| `/{lang}/events` | Indexable | Recommend noindex unless events become a strategic editorial cluster. |
| `/{lang}/events/{slug}` | Indexable | Recommend noindex for most event pages. |
| auth/account/profile/admin/club-panel | Noindex/disallowed | Correct. Keep. |

## Content Architecture Assessment

### Strongest SEO assets today

These are the pages most aligned with SCM's moat:

- `what-are-cannabis-social-clubs-spain`
- `spain-cannabis-laws-tourists`
- `is-weed-legal`
- `barcelona-vs-amsterdam-cannabis`
- `first-time-barcelona-cannabis-club`
- `safety-kit-visitors-spain`
- `scams-red-flags`
- `/safety-kit`
- `/verification`
- `/spain/barcelona`

These pages answer high-intent user anxiety with legal context and practical safety. They should receive the strongest internal links.

### Weakest SEO assets today

The weaker assets are not necessarily bad content, but they do not serve the primary SCM search mission:

- cannabis conference articles
- generic event pages
- broad national city-directory promises
- non-Barcelona city route families
- fallback translated article pages

These should be demoted, noindexed, or held until the site has enough topical authority in the core trust cluster.

## Internal Linking Diagnosis

The documented public trust spine is correct:

- `/en/safety-kit`
- `/en/clubs` or better canonical replacement `/en/spain/barcelona/clubs`
- `/en/spain/barcelona`
- `/en/editorial/legal`
- `/en/verification`
- `/en/editorial`

However, the implementation still has a canonical-route tension:

- `/clubs` exists as a redirect.
- structured navigation points to `/clubs`.
- article content and translations often point to `/clubs`.
- the sitemap does not list `/clubs`.
- Barcelona clubs live at `/spain/barcelona/clubs`.

Recommended decision:

Make `/spain/barcelona/clubs` the canonical public directory route for now. Update internal links, JSON-LD navigation, guide CTAs, and translation strings to point there. Keep `/clubs` as a simple permanent redirect.

## Structured Data Assessment

### Strong

- `Organization` and `WebSite` JSON-LD at root.
- `SiteNavigationElement` exists.
- `Article` schema exists on article pages.
- `BreadcrumbList` exists on articles, categories, city pages, verification.
- `CollectionPage` and `ItemList` exist on hubs.
- Club schema is deliberately safer for public listings.

### Needs work

- Make schema images absolute.
- Avoid structured navigation to redirecting routes.
- Add `dateModified` from real review/update fields.
- Consider `FAQPage` schema only where FAQs are visible and stable.
- Ensure `ItemList` for club lists does not imply unverified listings are recommended.

## International SEO Assessment

The routing foundation is good, but international SEO is the most fragile part of the current platform.

Main issues:

1. `<html lang>` is always `es`.
2. Hreflang is generated for all locales regardless of translation completeness.
3. Fallback article content can produce English pages under Spanish/French/German URLs.
4. Some visible internal link labels remain English in localized articles.
5. The default locale is Spanish, but English appears to be the strongest editorial source. This is not wrong, but it needs an explicit canonical and translation policy.

Recommended policy:

- English can be the editorial source language.
- Spanish can remain the default locale for UX/market reasons.
- But every indexable non-English article must have a real localized body, title, meta title, meta description, and visible link labels.
- Fallback translations should be noindexed.

## Technical SEO Backlog

### Phase 1: Fix Indexation and Canonical Defects

1. Rewrite root metadata in `app/layout.tsx`.
2. Fix `<html lang>` so it matches the active locale.
3. Gate non-Barcelona nested city routes as `noindex, follow`.
4. Decide canonical directory route and update structured navigation.
5. Noindex `/events` and event detail pages unless strategically retained.
6. Make JSON-LD image URLs absolute.

### Phase 2: Fix Hreflang and Translation Quality

1. Add translation completeness tracking.
2. Only include hreflang alternates for available translations.
3. Noindex fallback localized articles.
4. Localize visible link labels inside translated article bodies.
5. Add sitemap-level alternates for truly equivalent localized pages.

### Phase 3: Strengthen Trust Signals

1. Add `lastVerified`, `lastReviewed`, or `updatedAt` to article records.
2. Render visible "Last reviewed" notes on legal and safety guides.
3. Use review date for `dateModified` in JSON-LD.
4. Add Last Checked / what SCM checked context to indexable verified club profiles.
5. Ensure every substantial guide has Safety Kit, Verification, and related guide links.

### Phase 4: Content Pruning and Cluster Focus

1. Keep core legal/safety/etiquette/culture pillars indexable.
2. Noindex or demote event/conference content.
3. Reframe `/spain` around national legal/process education.
4. Build Barcelona deep-dive pages around:
   - tourism pressure
   - scams and red flags
   - private association model
   - locals vs tourists nuance
   - public fines and discretion
   - verification standard

## Recommended SEO North Star

SCM should not try to rank as the biggest cannabis club directory in Spain yet.

The stronger, safer SEO position is:

> The most precise public guide for understanding cannabis social clubs in Spain, starting with Barcelona: legal context, visitor safety, scam prevention, verified profile signals, and private association reality.

This gives SCM a cleaner search moat than broad "best clubs" competition.

## Final Verdict

**Score: 64 / 100**

The SEO platform is **promising but unfinished**.

The good news: the architecture already contains many of the right primitives. This is not a rebuild.

The serious issue: indexation policy and international SEO are not disciplined enough yet. SCM should fix root metadata, city route gating, event noindexing, hreflang completeness, and active-locale `<html lang>` before publishing more programmatic pages or scaling multi-city SEO.

**QA status:** REVISE  
**Primary risk:** Google indexes a mixed signal site: part trust-led Barcelona guide, part broad cannabis directory, part event media site, part duplicated localized fallback content.  
**Best next move:** Do a technical SEO cleanup patch before adding more content.
