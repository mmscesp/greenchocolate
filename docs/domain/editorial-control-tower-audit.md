# Editorial Control Tower Audit

Last updated: 2026-03-04
Owner: Growth + Editorial + Product
Scope audited: `app/[lang]/editorial` and all connected content sources

## 1) Executive Snapshot

- Live editorial route system is implemented and functional (`/editorial`, 4 category pages, dynamic article pages).
- Live published editorial content count is **14 articles** from `data/content/**/*.mdx`.
- Launch-critical content from your launch docs is mostly covered: **8/8 required launch articles exist**.
- Strategic master backlog coverage from `CompleteBlogDB.md` is **8/21 complete** (13 still missing).
- Content-link integrity has blind spots: at least **3 dead links** currently referenced from published content.

## 2) What Was Inspected (Source of Truth)

### Route and rendering layer

- `app/[lang]/editorial/page.tsx`
- `app/[lang]/editorial/legal/page.tsx`
- `app/[lang]/editorial/etiquette/page.tsx`
- `app/[lang]/editorial/safety/page.tsx`
- `app/[lang]/editorial/culture/page.tsx`
- `app/[lang]/editorial/[slug]/page.tsx`
- `app/[lang]/editorial/[slug]/ArticleContent.tsx`
- `app/[lang]/editorial/_components/CategoryArticlePage.tsx`

### Content pipeline and data model

- `app/actions/articles.ts`
- `lib/blog-content.ts`
- `lib/blog-publish.ts`
- `data/content/**/*.mdx` (14 files)

### Business/strategy references

- `docs/domain/scm_blueprint.md`
- `docs/domain/What Must Exist At Launch — Zero Dead Links.md`
- `docs/domain/CompleteBlogDB.md`
- `docs/domain/Content Backlog & Research Playbook (Barcelona Cannabis Visitor Safety + Culture).md`
- `docs/domain/knowledge-vault.md`

## 3) Editorial Architecture Map

```mermaid
flowchart TD
  A[/[lang]/editorial/] --> B[/[lang]/editorial/legal/]
  A --> C[/[lang]/editorial/etiquette/]
  A --> D[/[lang]/editorial/safety/]
  A --> E[/[lang]/editorial/culture/]
  A --> F[/[lang]/editorial/[slug]/]

  G[app/actions/articles.ts] --> H[lib/blog-content.ts]
  H --> I[data/content/legal/*.mdx]
  H --> J[data/content/etiquette/*.mdx]
  H --> K[data/content/harm-reduction/*.mdx]
  H --> L[data/content/culture/*.mdx]

  F --> M[Related articles logic]
  F --> N[JSON-LD metadata]
```

### Connected surfaces outside `/editorial` (important for supervision)

- Legacy redirects:
  - `app/[lang]/learn/page.tsx` -> redirects to `/${lang}/editorial`
  - `app/[lang]/learn/[slug]/page.tsx` -> redirects to `/${lang}/editorial/${slug}`
- SEO exposure files:
  - `app/[lang]/sitemap.ts` and `app/sitemap.ts` include editorial URLs
  - `app/[lang]/robots.ts` and `app/robots.ts` explicitly allow editorial crawl paths
- Shared source reuse in city guides:
  - `app/[lang]/spain/[city]/guides/page.tsx` and `app/[lang]/spain/[city]/guides/[slug]/page.tsx` are fed by the same article action layer (`app/actions/articles.ts`)
- Home/internal linking amplifiers:
  - `components/home/EditorialFeedSection.tsx`
  - `components/landing/editorial-concierge/blocks/FeaturedVault.tsx`
  - `components/landing/editorial-concierge/blocks/KnowledgeRouter.tsx`

## 4) Current Live Editorial Inventory (14 Published)

Note: `lib/blog-content.ts` defaults `isPublished` to `true` when not present, so all 14 files are currently considered published.

### Culture (6)

| Slug | Title | Read Time | Featured |
|---|---|---:|---:|
| `what-are-cannabis-social-clubs-spain` | What Cannabis Social Clubs in Spain Actually Are | 12 | 1 |
| `barcelona-vs-amsterdam-cannabis` | Barcelona vs. Amsterdam | 10 | 3 |
| `spannabis-bilbao-2026` | Spannabis Bilbao 2026 | 6 | 0 |
| `icbc-berlin-2026` | ICBC Berlin 2026 | 5 | 0 |
| `cannabis-europa-london-2026` | Cannabis Europa London 2026 | 5 | 0 |
| `cannabis-social-club-history-spain` | How Cannabis Social Clubs Started in Spain | 7 | 0 |

### Legal (3)

| Slug | Title | Read Time | Featured |
|---|---|---:|---:|
| `spain-cannabis-laws-tourists` | Spain's Cannabis Laws | 10 | 0 |
| `is-weed-legal` | Is Weed Legal in Barcelona in 2026? | 8 | 1 |
| `scams-red-flags` | Barcelona Cannabis Scams | auto | 0 |

### Etiquette (2)

| Slug | Title | Read Time | Featured |
|---|---|---:|---:|
| `first-time-barcelona-cannabis-club` | Your First Time in a Barcelona Cannabis Club | 15 | 4 |
| `5-mistakes-tourists-make` | 5 Mistakes Tourists Make | 6 | 2 |

### Harm Reduction (3)

| Slug | Title | Read Time | Featured |
|---|---|---:|---:|
| `safety-kit-visitors-spain` | The Safety Kit | 8 | 2 |
| `edibles-safety-guide` | Edibles Safety Guide | 5 | 3 |
| `emergency-resources` | Emergency Resources | auto | 0 |

## 5) Coverage vs Launch and Strategic Backlog

### A) Launch-critical article coverage (from Zero Dead Links doc)

Required at launch: 1, 2, 3, 4, 5, 11, 12, 13

Status: **8/8 present**

- Present as live slugs:
  - `what-are-cannabis-social-clubs-spain` (1)
  - `safety-kit-visitors-spain` (2)
  - `barcelona-vs-amsterdam-cannabis` (3)
  - `first-time-barcelona-cannabis-club` (4)
  - `spain-cannabis-laws-tourists` (5)
  - `spannabis-bilbao-2026` (11)
  - `icbc-berlin-2026` (12)
  - `cannabis-europa-london-2026` (13)

### B) Full strategic backlog coverage (from CompleteBlogDB)

- Total strategic target: 21
- Current live: 8 exact matches
- Missing from master plan: **13**

Missing IDs from `CompleteBlogDB.md`: 6, 7, 8, 9, 10, 14, 15, 16, 17, 18, 19, 20, 21

## 6) Dead Links and Integrity Risks (No Blind Spots)

### Binary verdict matrix (reroute vs recreate)

| Broken target | Exists now? | Equivalent exists? | Surgical decision |
|---|---|---|---|
| `/en/editorial/public-vs-private-cannabis-spain` | No | Yes (`/en/editorial/spain-cannabis-laws-tourists`) | Reroute to existing slug |
| `/en/editorial/cannabis-fine-spain-what-to-do` | No | Yes (`/en/editorial/emergency-resources`) | Reroute to existing slug |
| `/en/about/verification-standard` | No | Weak (`/en/about` generic only) | Create dedicated page route |

### Dead links found inside live editorial MDX

1. `data/content/harm-reduction/safety-kit-visitors-spain.mdx` links to:
   - `/en/editorial/public-vs-private-cannabis-spain` (missing)
   - `/en/editorial/cannabis-fine-spain-what-to-do` (missing)
2. `data/content/culture/what-are-cannabis-social-clubs-spain.mdx` links to:
   - `/en/about/verification-standard` (route missing; only `/[lang]/about/page.tsx` exists)

### Structural consistency risks

- Event guides are categorized as `Culture` instead of a dedicated `Events` taxonomy in editorial content.
- Two legal/safety pieces rely on parser defaults (missing explicit `category` and/or `isPublished` frontmatter), which is fragile if parser defaults change.
- `ArticleContent.tsx` sidebar CTA uses `/${language}/safety` (safety hub), while other flows use `/editorial/*`; this split is valid but should be explicitly governed in your content system.
- `app/[lang]/editorial/EditorialPageClient.tsx` appears to be orphaned (alternate hub implementation not used by current server route), which can confuse future content/UX governance.

## 7) Funnel and Topic Coverage View

```mermaid
flowchart LR
  TOFU[TOFU: Awareness]
  MOFU[MOFU: Education + Trust]
  BOFU[BOFU: Directory Intent]

  TOFU --> C1[Culture history + city comparisons]
  TOFU --> C2[Events content]

  MOFU --> M1[Safety Kit]
  MOFU --> M2[Legal guides]
  MOFU --> M3[Etiquette guides]

  BOFU --> B1[First-time visitor article]
  BOFU --> B2[/clubs directory CTA]

  G1[Gap: Verification methodology page] -.missing.-> MOFU
  G2[Gap: Public vs Private legal explainer] -.missing.-> MOFU
  G3[Gap: Fine process explainer] -.missing.-> MOFU
  G4[Gap: City pillar pages BCN/Madrid/Valencia/Tenerife] -.missing.-> TOFU
```

## 8) Priority Gap Register (Business + SEO)

### P0 - Fix immediately (trust + UX integrity)

1. Publish/fix missing linked pages:
   - `public-vs-private-cannabis-spain`
   - `cannabis-fine-spain-what-to-do`
2. Resolve verification methodology route mismatch:
   - Create `/[lang]/about/verification-standard` or update link target.

### P1 - Complete trust moat cluster (high conversion support)

1. Article 6 (verification standard)
2. Article 14 (scam red flags canonical slug)
3. Article 15 (etiquette rules)
4. Article 16 (public vs private)
5. Article 17 (fine response guide)
6. Article 18 (privacy in clubs)

### P2 - Build city SEO pillars (scale engine)

1. Article 7 (Barcelona pillar)
2. Article 8 (Madrid pillar)
3. Article 9 (Valencia pillar)
4. Article 10 (Tenerife pillar)
5. Article 19 (Barcelona neighborhoods)

### P3 - Complete strategic authority layer

1. Article 20 (membership model deep-dive)
2. Article 21 (culture in Spain)

## 9) Recommended Management Dashboard (for ongoing supervision)

Use this weekly table structure in your operating review:

| Metric | Current | Target | Owner | Notes |
|---|---:|---:|---|---|
| Live editorial articles | 14 | 21+ | Editorial Lead | Based on strategic backlog |
| Launch-critical links resolved | 8/8 | 8/8 | Product | Keep at 100% |
| Dead editorial links | 3 | 0 | Content Ops | Fix first |
| City pillar pages live | 0/4 | 4/4 | SEO Lead | BCN, Madrid, Valencia, Tenerife |
| Trust/legal cluster completion | Partial | Full | Compliance + Editorial | 6,14,15,16,17,18 |

## 10) Final Readout

- Your editorial foundation is real and already meaningful: routing is in place, key launch pieces are published, and category architecture is working.
- The biggest immediate issue is not volume, it is **content integrity gaps** (dead links + missing trust/legal companion pages).
- Once P0 and P1 are done, your platform will align much tighter with the compliance-first, trust-led growth strategy from your domain blueprint.
