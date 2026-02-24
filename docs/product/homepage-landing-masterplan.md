# SocialClubsMaps Home Page Masterplan (Post-Hero)

Version: 2.0 (refined) | Feb 2026

This is the implementation-ready plan to turn everything after the Hero into a community-first knowledge engine that earns trust, repeat visits, and rankings. We are not building a pass storefront.

Our docs are explicit about constraints: we operate in a legal grey zone and we win by safety, education, privacy, and community values (not by facilitating access).

## North Star

Become the highest-ranked cannabis education + safety + culture destination in Spain, then expand across Europe.

To do that, the homepage must behave like:
- an editorial front page (clear topic router)
- a trust artifact (transparent boundaries + sources + update cadence)
- a habit engine (weekly drop + returning reasons)

## Hard Guardrails (Non-Negotiable)

From `docs/domain/knowledge-vault.md`:
- Community values: "Safety over access", "Privacy over promotion", "Community over commerce".
- Tone guidelines: "Informative, not promotional"; "Serious about safety, not preachy"; "Avoid: Access facilitation language".

From `docs/domain/Content Backlog & Research Playbook (Barcelona Cannabis Visitor Safety + Culture).md`:
- We do not publish step-by-step guidance on how to obtain cannabis, join a club, get referrals, where to buy, or how to evade law enforcement.
- We do publish: legality context, harm reduction, scams, etiquette, safety resources.

These guardrails are not just compliance; they are the brand moat.

## Strategy In One Sentence

Build the most trusted, most current Spain cannabis safety + law + culture knowledge vault first; capture an owned audience (weekly drop + safety kit); then introduce private, opt-in workflows later behind authentication.

## Phase Narrative (Matches Our Vision)

Phase 1 (months 0-5):
- Promise: "Stay highly informed" (law/safety/culture) instead of "buy access".
- Conversions: newsletter + safety kit + quizzes/tools.
- Proof: citations, update cadence, transparency about what we do and do not do.
- Participation: polls, questions, event/culture drops.

Phase 2 (after trust + audience):
- Add verified club inventory and private request flows behind account + TOS.
- Monetization is additive (premium tools/benefits), not pay-to-enter.

## Current Implementation (So We Stay Grounded)

Homepage composition is in `app/[lang]/HomePageContent.tsx`.

Post-hero sections today:
- `components/marketing/TouristMistakes.tsx`
- `components/marketing/FineCalculator.tsx`
- `components/marketing/EligibilityQuiz.tsx`
- `components/marketing/FeaturedArticles.tsx` (content in `data/content/**/*.mdx`)
- `components/marketing/WhyUsSection.tsx`
- inline "Coming Soon: Barcelona" block in `app/[lang]/HomePageContent.tsx`
- `components/ui/faq-accordion.tsx`

Important SEO note: most post-hero copy is currently hardcoded English (no `t(...)` usage), which conflicts with language-segment routing.

## Why It Still Feels "Not Real" (Even With Good Visuals)

Right now the page feels like a stack of marketing widgets, not a living, trusted publication.

Primary gaps:
- No clear editorial router (users do not immediately see the knowledge map).
- Some copy drifts into access facilitation or exaggerated claims (trust killer in this niche).
- No habit loop (no "weekly" moment, no return reason, no "what's new").
- Trust claims are not tied to verifiable evidence (sources, editorial standards, last-verified).

## The New Post-Hero Experience (What You Asked For)

You gave a concrete pattern that works:

"What would you like to learn about?" + topic choices
"First time? Start here"
"What does it feel like to be high?"
"Stay highly informed" + weekly inbox drop
"Learn about strains" + curated content

We will implement this pattern in a way that matches our guardrails and our community-first vision.

## Proposed Post-Hero Flow (Phase 1)

Recommended order after the Hero:

1) Trust Strip + Update Cadence (new)
2) Knowledge Router: "What would you like to learn about?" (new)
3) Reality Check: "Spain is not Amsterdam" (existing, tightened)
4) Start Here: First time + "what does it feel like" (new)
5) Interactive Tools: fines + preparedness (existing, reframed)
6) Featured Guides (existing, corrected for evidence)
7) Stay Highly Informed: weekly drop + curated picks (new)
8) Our Standard: how we verify information (edit existing WhyUs)
9) Barcelona Roadmap: community-first timeline (edit existing)
10) FAQ: safety/law/privacy/scams boundaries (edit existing)
11) Final CTA band: pick your subscription lane (new)

## Section Specs (Build + Copy + Compliance)

Each spec includes: purpose, what makes it feel real, CTA, and compliance notes.

### 1) Trust Strip + Update Cadence (New)

Purpose:
- Immediately communicate: "we are not selling access; we are helping you stay safe and informed".

Make it feel real:
- Show a "Last verified" stamp for the whole site (monthly) and for legal pages (date).
- Include 2-3 micro-links to high-trust pages:
  - Laws (Spain basics)
  - Scam red flags
  - Etiquette basics

Copy skeleton:
- Label: "Updated for 2026" (only if true)
- Line: "Education first. Privacy always. We don't broker access."

CTA:
- Primary: "Get the free Visitor Safety Kit" (email)

Compliance:
- Avoid language like "get in" / "invites" / "we connect you".

### 2) Knowledge Router: "What would you like to learn about?" (New)

Purpose:
- The homepage becomes a table of contents. This is how it stops feeling like AI and starts feeling like a destination.

UI pattern:
- A simple question header + a grid of topic cards (8 max).
- Optional search input: "Search the Knowledge Vault".

Topic cards (your requested set, adapted to our taxonomy):
- Laws
- CBD
- Products
- Body
- Plant
- History
- Dictionary
- First time? Start here

Card microcopy (safe, useful, not promotional):
- Laws: "Spain's rules, fines, and what 'private' really means."
- CBD: "Labels, legality context, and common myths in Spain."
- Products: "Edibles, vapes, concentrates: risks, labels, and safer choices."
- Body: "Onset times, anxiety, tolerance, and what effects can feel like."
- Plant: "Cannabinoids, terpenes, and why strains feel different (no cultivation guides)."
- History: "How Spain's club model happened and why it matters."
- Dictionary: "Every term you'll see online, decoded."
- First time: "Start here if you're new. Practical safety-first basics."

CTA behavior:
- Each card links to a hub page with a curated path + the best 3-6 articles.

Compliance:
- The hubs must not become "how to obtain" pages. They are education hubs.

### 3) Reality Check (Edit `components/marketing/TouristMistakes.tsx`)

What works:
- "Spain is not Amsterdam" is genuinely sticky.

Fixes:
- Remove or soften access facilitation phrasing like "you need an invite".
- Replace with neutral, accurate framing: "private associations have their own criteria; many reject visitors".

Make it feel real:
- Add one more card that is purely culture/safety:
  - privacy (no filming)
  - neighborhood respect (noise/loitering)
  - scams (DM pressure)

CTA:
- "Read the etiquette checklist" -> an editorial page.

### 4) Start Here: First Time + "What Does It Feel Like?" (New)

Purpose:
- Give beginners a safe, non-judgmental onramp that builds trust and retention.

Two modules:

1) "First time smoking weed? Start here"
- Curated path (3 links):
  - Legal basics (public vs private)
  - Etiquette basics (privacy)
  - Harm reduction basics (edibles/onset)

2) "What does it feel like to be high? Stay highly informed."
- This is an educational teaser, not a glamorization.
- It links to a harm-reduction style explainer (effects, anxiety, when to stop, when to seek help).

CTA:
- "Get the beginner pack" (email) or "Read the beginner guide".

Compliance:
- No "how to smoke" instructions; keep it effects + safety + consent + context.

### 5) Interactive Tools (Edit the framing)

Existing components:
- `components/marketing/FineCalculator.tsx`
- `components/marketing/EligibilityQuiz.tsx`

Fixes:
- Fine calculator CTA "Download Legal Guide" -> "Read the legal basics" (link to editorial legal hub).
- Rename quiz outputs to avoid pass/commercial vibes:
  - "Verified Safety Pass" -> "Preparedness Summary" or "Preparedness Certificate".
- Remove/avoid promises like "Access Member Directory" during Phase 1.

Make it feel real:
- Add "what this tool is" disclaimer under header:
  - "Educational only. Not legal advice."

### 6) Featured Guides (Edit `app/[lang]/HomePageContent.tsx` copy)

What works:
- This is the most "real" asset already: our MDX content.

Fixes:
- Remove claims you cannot defend (e.g., "written by locals and legal experts") unless you have a visible editorial policy + named reviewers.
- Add visible cues:
  - category chips
  - "last updated" / "last verified" (if implemented)
  - "sources" link (for legal/safety posts)

CTA:
- "Start with the essentials" (a curated set, not a generic browse link).

### 7) Stay Highly Informed (New)

Purpose:
- Build habit + email growth with a clear editorial promise.

Homepage copy pattern (your requested shape):
- Header: "Stay highly informed."
- Sub: "Get weekly cannabis news for Spain in your inbox." (meaning: law/safety/culture updates, not product promotion)

What the weekly drop contains (make it explicit):
- legal / enforcement updates (sourced)
- scam patterns spotted
- harm reduction reminder
- one culture/history highlight
- one strain/label myth-buster (educational, not promotional)

Two CTAs:
- "Get the latest cannabis news" (newsletter)
- "Get curated content" (same signup, plus topic preferences)

Segmentation (simple, high impact):
- let users pick 2-3 interests on signup: Laws, Safety, Culture, CBD, Products.

### 8) Our Standard (Edit `components/marketing/WhyUsSection.tsx`)

Problem:
- Current copy reads like SaaS feature marketing and includes claims like "Real-time".

Rewrite to match the knowledge vault:
- Emphasize editorial standards, sources, and transparency.
- Replace producty names:
  - "Regulatory Wiki" -> "Safety and Legal Reference"
  - "Confidence UI" -> "Verification Signals" (explain what signals are and their limits)
  - "Verified Access" -> "Private Workflows (Phase 2)" (defer access language)

Make it feel real:
- Plain-language list: "What we check" and "What we cannot guarantee".

### 9) Barcelona Roadmap (Edit inline section)

Goal:
- Keep anticipation, remove storefront energy.

Fixes:
- Focus on community milestones:
  - publish X guides
  - launch weekly drop
  - open verified directory behind account later
- Add explicit trust line:
  - "Free knowledge stays free. Premium later is additive."

CTA:
- "Join the community list" (email)

### 10) FAQ (Edit `components/ui/faq-accordion.tsx`)

Immediate bug:
- There is corrupted non-ASCII text in the first answer ("private...only" contains foreign characters). Fix it.

Content rewrite rules:
- Keep it high trust: law context, privacy, scams, safety.
- Avoid: referral/invite workflows, membership fees, procurement-adjacent details.

Recommended FAQ set:
- What is a CSC (high level)
- Is cannabis legal in Spain (plain language, not legal advice)
- Public vs private risk (fines range is OK when sourced)
- Why privacy matters (no photos, no tagging)
- Common scams (DMs, street promoters)
- What we do / what we do not do

### 11) Final CTA Band (New)

Purpose:
- End with one simple decision, not a menu of sales actions.

Options (2 max):
- "Get the Visitor Safety Kit" (email)
- "Get the weekly drop" (email)

Add a short boundary line:
- "Education first. We don't sell cannabis or arrange purchases."

## SEO Plan (How We Actually Rank #1)

We do not win by being louder. We win by being more useful, more current, and more trustworthy in a sensitive category.

Evidence-based principles:
- Helpful, people-first content (Google Search Central): https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Avoid doorway pages and thin location templates (Google spam policies): https://developers.google.com/search/docs/essentials/spam-policies
- Mobile-first indexing (parity matters): https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing
- Core Web Vitals targets (performance is a ranking input): https://developers.google.com/search/docs/appearance/core-web-vitals

### The Content Map (Hubs -> Clusters -> Tools)

Your requested hubs are correct because they match real user curiosity:
- Laws
- CBD
- Products
- Body
- Plant
- History
- Dictionary
- First time

How we keep this aligned with our guardrails:
- Each hub is framed as education + safety, not access.
- Each hub links to our existing pillars (legal, etiquette, harm reduction, culture).

### Spain-first Language Strategy

To rank in Spain:
- Spanish content must exist and be strong.
- English content still matters for tourists, but Spanish should not be an afterthought.

Practical approach:
- Start by making core hubs bilingual (ES + EN).
- Translate expansion pages after the hub pages establish authority.

### Dictionary / Glossary (High-Leverage SEO)

Build a dictionary that owns definitions for:
- legal terms (administrative fine, decriminalized, private association)
- product terms (edibles, concentrates, vape carts)
- cannabinoid terms (CBD, THC, THCA, HHC, THC-O, THCP)
- strain/label terms (sativa/indica/hybrid, terpenes)
- safety terms (onset, tolerance, panic attack)

Each term page should include:
- definition in plain language
- why it matters (safety/legal)
- common misconceptions
- internal links to 3 related guides
- sources where relevant

### Strains And Effects (Educational, Not Retail)

"Learn about strains" is a huge interest vector, but it must be handled in a harm-reduction / education voice.

Rules:
- Explain how labels work (and their limits).
- Focus on effects variability, anxiety risk, onset time, and safer decision-making.
- Avoid "go buy X" vibes or menu-style recommendations.

High-ranking, guardrail-safe starter pages:
- "Sativa vs indica: what the labels mean (and what they don't)"
- "Terpenes explained: aroma, effects, and common myths"
- "Why the same strain can feel different for different people"
- "High-THC vs balanced THC:CBD: what to know for anxiety risk"

### "Start Here" Onramp (Conversion + Retention)

Create a single page that converts:
- "First time? Start here" with 3-5 curated reads
- clear disclaimers
- newsletter signup

### Tools As Link Magnets

Keep (and refine) tools that earn backlinks:
- fines estimator (with citations)
- safety checklists (downloadable)
- emergency resources page

### 90-Day Content Roadmap (Rankings + Trust, Not Spam)

The goal is topical authority: a small number of extremely good hubs, supported by clusters, linked tightly.

Weeks 1-2 (fix foundation + ship hubs):
- Publish hub pages for: Laws, First time, Products, Body, CBD, Dictionary, History, Plant.
- Each hub must have: TL;DR, misconceptions, safety checklist, and a newsletter CTA.
- Add visible "last verified" and citation patterns for legal/safety claims.

Weeks 3-6 (own the safety/legal queries):
- Expand Laws cluster (Spain + Catalonia basics, public vs private, driving risk, controlled cannabinoids updates).
- Expand Scams cluster (DM scams, street promoters, fake storefront claims).
- Expand Body cluster (effects, anxiety, sleep, mixing with alcohol, when to seek help).

Weeks 7-12 (scale breadth without losing trust):
- Build Dictionary to 50-150 terms (start with what appears in your articles and tools).
- Build Products cluster (edibles, vapes, concentrates, labeling, counterfeit risk) as harm reduction.
- Build Strains/terpenes cluster (education pages listed above).

Always:
- No doorway templates.
- No unsourced medical claims.
- No access facilitation language.

### Avoid These SEO Traps

- Publishing posts like "how to get weed in X" (high traffic, high risk, wrong brand)
- Thin templated city pages with swapped names (doorway risk)
- Unverifiable claims ("verified by lawyers" without visible policy)

## Engineering Deliverables (So Strategy Ships)

### Homepage implementation
- Add new Topic Router section (cards + links).
- Add Stay Highly Informed newsletter block.
- Add Start Here curated path block.
- Rewrite Reality Check, Tools CTAs, WhyUs, Roadmap, FAQ to match guardrails.

### Content operations
- Add "last verified" / "last updated" metadata pattern for legal/safety posts.
- Add a visible Editorial Standards page that matches `docs/domain/knowledge-vault.md` tone/quality rules.

### i18n
- Move post-hero copy into dictionaries (at least ES + EN).
- Ensure metadata and on-page content match language (SEO parity).

### Technical SEO
- Sitemap coverage for hubs + dictionary + editorial.
- Consistent canonical + hreflang strategy.
- Core Web Vitals budget (LCP/INP/CLS).

## Metrics (Phase 1)

Primary:
- newsletter conversion rate (weekly drop)
- safety kit conversion rate
- return visits within 14 days

Secondary:
- clicks from Topic Router to hub pages
- scroll depth past router
- tool completion rates
- featured article click-through

## Immediate Cleanup Notes (High ROI)

These are small changes that reduce "AI slop" perception fast:
- Fix corrupted FAQ text in `components/ui/faq-accordion.tsx`.
- Remove access facilitation phrasing from `components/marketing/TouristMistakes.tsx`.
- Remove exaggerated claims in homepage headers unless backed by visible policy.
