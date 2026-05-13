# SCM SEO 100/100 Definition

## What 100/100 Means

SCM earns 100/100 when every public URL is intentionally indexable or intentionally noindexed, every canonical signal points to one preferred URL, every localized page has real equivalent content or is noindexed, every schema block describes visible page content, and every high-intent page preserves SCM's legal-safe trust positioning.

## Non-Negotiable Gates

- No redirect URLs in sitemap.
- No noindex URLs in sitemap.
- No private/account/admin/profile routes in sitemap.
- No public page relies on robots.txt as the only index-removal mechanism.
- Every indexable page has canonical metadata.
- Every indexable localized page has correct `<html lang>`.
- Hreflang alternates only point to real equivalent content.
- Every legal/safety/access guide has visible disclaimer and review date.
- Every verified profile has visible status and Last Checked context.
- Every public listing is `noindex, follow` and framed as a research starting point.
- Events and off-strategy industry pages are noindex by default.
- JSON-LD image URLs are absolute.
- Structured data does not describe hidden, misleading, transactional, or cannabis-sales content.
- Main navigation and footer point to canonical trust-spine URLs.

## Canonical Trust Spine

- `/en/safety-kit`
- `/en/spain/barcelona`
- `/en/spain/barcelona/clubs`
- `/en/verification`
- `/en/editorial/legal`
- `/en/editorial`

The same structure should exist under `/es`, `/fr`, and `/de` only where real localized content exists.

## Public-Safe SEO Positioning

SocialClubsMaps is the independent, legally grounded, verification-first guide to cannabis social clubs in Spain for people who want to do this right, not fast.

## Verification Command

Run:

```bash
npm run seo:verify
```

Required result:

```text
lint passes
tests pass
build passes
SEO AUDIT PASS
```
