# Editorial Implementation Master Plan

Last updated: 2026-03-04
Owner: Editorial + SEO + Product + Compliance
Primary reference: `docs/domain/editorial-control-tower-audit.md`

## Objective

Execute the editorial system end-to-end with zero dead links, complete trust/legal coverage, a live Safety Kit lead magnet (PDF), and a clean scale path for city SEO pillars.

## Ground Rules (non-negotiable)

1. Zero dead links on all live editorial pages.
2. Compliance-first tone (education/safety, no facilitation language).
3. Every article has: clear intent, CTA, and internal links.
4. Weekly publish cadence must be sustainable (not hero sprints).

---

## Phase 0 - Stabilize Trust Layer (Week 1)

Goal: Remove immediate trust leaks and make current system reliable.

### Step 0.1 - Fix all dead links (surgical decisions)

- `public-vs-private-cannabis-spain` does not exist as a live slug.
  - Action: reroute link target to existing `spain-cannabis-laws-tourists`.
- `cannabis-fine-spain-what-to-do` does not exist as a live slug.
  - Action: reroute link target to existing `emergency-resources`.
- `/[lang]/about/verification-standard` does not exist as a route.
  - Action: create new page route `app/[lang]/about/verification-standard/page.tsx` (recommended), or temporarily retarget to `/[lang]/about`.

- Update links in:
  - `data/content/harm-reduction/safety-kit-visitors-spain.mdx` (2 link replacements)
  - `data/content/culture/what-are-cannabis-social-clubs-spain.mdx` (verification-standard link)

Acceptance criteria:

- 0 broken internal editorial links.
- All three previously broken targets resolve successfully.

### Step 0.2 - Normalize frontmatter reliability

- Add explicit `category` and `isPublished` to files relying on parser defaults.
- Ensure consistent key usage (`publishedAt` preferred over mixed `date`).

Acceptance criteria:

- Every `data/content/**/*.mdx` has consistent minimum frontmatter schema.

### Step 0.3 - Decide orphan file governance

- Decide whether to delete or reuse `app/[lang]/editorial/EditorialPageClient.tsx`.
- Document the decision in this file (or code comment in docs only).

Acceptance criteria:

- No ambiguous duplicate editorial hub implementation.

---

## Phase 1 - Ship Safety Kit Offer Properly (Week 1-2)

Goal: Turn Safety Kit from concept into conversion asset.

### Step 1.1 - Publish Safety Kit PDF v1

- Create downloadable PDF aligned to `safety-kit-visitors-spain` article.
- Include core modules:
  - Legal line (public vs private)
  - Scam red flags
  - First-visit etiquette
  - Emergency response and numbers
- Add "Last verified" date and disclaimer.

Acceptance criteria:

- PDF is downloadable from live CTA locations.
- PDF content matches website claims and links back to platform pages.

### Step 1.2 - Wire capture and distribution flow

- Entry points:
  - Safety Kit article CTA
  - Safety page CTA
  - Safety-kit landing page CTA
- Email flow:
  - Instant delivery email
  - Follow-up sequence (legal basics -> directory trust -> city prep)

Acceptance criteria:

- User receives PDF after signup in < 5 minutes.
- Event tracking exists for `view -> submit -> delivery -> open`.

### Step 1.3 - Add conversion instrumentation

- Track funnel events:
  - CTA click
  - Form submit
  - PDF delivered
  - Follow-up click to editorial/clubs

Acceptance criteria:

- Weekly dashboard shows Safety Kit conversion funnel.

---

## Phase 2 - Complete Trust + Legal Cluster (Weeks 2-4)

Goal: Finish the highest-business-impact missing content block.

Publish in this order:

1. Article 6: verification standard (`/about/verification-standard`)
2. Article 16: public vs private legal line
3. Article 17: what to do if fined
4. Article 14: scam red flags (canonicalize slug strategy)
5. Article 15: etiquette unwritten rules
6. Article 18: privacy in clubs

For each article, apply this checklist:

1. Search intent and target keyword defined
2. Answer box + checklist blocks included
3. Compliance review passed
4. Internal links (pillar + siblings + CTA)
5. Metadata complete (title, description, readTime, tags)
6. Final editorial QA and publish

Acceptance criteria:

- All 6 trust/legal articles published and internally linked.
- Safety Kit article has no unresolved references.

---

## Phase 3 - Build City SEO Pillars (Weeks 4-8)

Goal: Expand from core trust hub to scalable city demand capture.

### Step 3.1 - Publish priority city pillars

Order:

1. Article 7: Barcelona complete guide
2. Article 8: Madrid guide
3. Article 9: Valencia guide
4. Article 10: Tenerife guide
5. Article 19: Barcelona neighborhoods guide

### Step 3.2 - Enforce city page template

Each city article must include:

- Scene snapshot
- Access reality and expectations
- Scam/risk section
- Neighborhood notes
- Directory CTA and Safety Kit CTA

Acceptance criteria:

- 4 city pillars + BCN neighborhood page live.
- City pages interlink to legal/safety/etiquette pillars.

---

## Phase 4 - Complete Strategic Backbone (Weeks 8-10)

Goal: Reach 100% of strategic 21-article baseline.

Publish:

1. Article 20: membership model deep-dive
2. Article 21: cannabis culture in Spain

Then run a full inventory reconciliation:

- Confirm `21/21` strategic list coverage
- Confirm all launch links still valid
- Confirm no orphaned content

Acceptance criteria:

- Strategic article coverage reaches 21/21.
- Zero critical content gaps in control tower audit.

---

## Phase 5 - Taxonomy, Linking, and Governance Hardening (Weeks 10-12)

Goal: Make the system operationally clean for scale.

### Step 5.1 - Taxonomy cleanup

- Decide if event guides remain in `Culture` or move to `Events` taxonomy.
- Standardize categories and tags across all 21 articles.

### Step 5.2 - Internal link network pass

- Ensure every article links to:
  - 1 pillar
  - 2-4 siblings
  - Safety Kit or trust CTA
- Remove broken/legacy references.

### Step 5.3 - Governance cadence

- Weekly: dead-link scan + performance review
- Monthly: refresh top 5 pages
- Quarterly: full editorial audit refresh

Acceptance criteria:

- No taxonomy conflicts.
- Internal-link coverage complete and consistent.
- Review cadence documented and owned.

---

## Execution Board (Practical Tracking)

Use this simple status board every week:

| Workstream | Current | Target | Owner | Deadline |
|---|---:|---:|---|---|
| Dead links | 3 | 0 | Product + Content Ops | Week 1 |
| Safety Kit PDF | 0 | 1 live | Editorial + Growth | Week 2 |
| Trust/legal missing set | 0/6 | 6/6 | Editorial + Compliance | Week 4 |
| City pillars | 0/5 | 5/5 | SEO + Editorial | Week 8 |
| Strategic baseline | 8/21 | 21/21 | Editorial Lead | Week 10 |
| Governance cadence | ad hoc | weekly/monthly/quarterly | Ops Lead | Week 12 |

---

## Definition of Done

This initiative is complete when all are true:

1. 0 dead links across live editorial pages.
2. Safety Kit PDF is live and distributed through tracked conversion flow.
3. Trust/legal cluster fully published and linked.
4. City pillar set live and integrated.
5. Strategic content baseline reaches 21/21.
6. Governance cadence is active and documented.
