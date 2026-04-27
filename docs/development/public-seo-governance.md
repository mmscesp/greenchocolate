# SCM Public SEO Governance Contract

This contract governs public-facing SEO, sitelinks, and internal-link architecture for SocialClubsMaps.

## Priority Sitelink Targets

Use these pages as the public trust/navigation spine:

- `/en/safety-kit`
- `/en/clubs`
- `/en/spain/barcelona`
- `/en/editorial/legal`
- `/en/verification`
- `/en/editorial`

Every locale should preserve the same path structure under `/es`, `/en`, `/fr`, and `/de`.

## Public Guide Rules

- Every new public guide must link to one trust page, one conversion page, and one related guide.
- Every guide must belong to exactly one visible category route.
- Every city guide must link up to its city hub.
- Every city hub must link down to clubs, guides, Safety Kit, and Verification.
- No public page should use guaranteed access, instant entry, buy language, pass-marketplace language, or anything implying SCM operates clubs.

## City Page Indexing Rules

- Barcelona is the active city hub.
- Future city pages stay `noindex, follow` until they have real content depth.
- A city is indexable only after it has unique city copy, legal or safety context, internal links, and either real club profiles or substantial city guides.

## Structured Data Rules

- Public hubs should use `CollectionPage`, `BreadcrumbList`, and `ItemList` where applicable.
- Articles must use `Article` and `BreadcrumbList`.
- Category breadcrumbs must point to real category routes, not query-string filters.
- Verification and trust pages should use `WebPage` plus `BreadcrumbList`.

## Navigation Rules

- Main navigation should prioritize Barcelona, Verified Clubs, Guides, Verification, and Safety Kit.
- Footer should always include a Start Here block linking to the priority sitelink targets.
- Low-priority or seasonal surfaces such as Events should not outrank Safety Kit, Verification, or Barcelona in global navigation.
