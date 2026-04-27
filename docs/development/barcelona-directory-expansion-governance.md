# Barcelona Directory Expansion Governance

This is the operating contract for scaling SCM public club listings without turning the platform into a public marketplace or a thin-page directory.

## Verification States

- `UNVERIFIED`: public listing built from reviewed public-source data. No SCM on-site verification has been completed.
- `PENDING_REVIEW`: public listing selected for deeper review but not yet verified.
- `SCM_VERIFIED`: SCM has completed the verification workflow and can show the premium profile experience.
- `FEATURED`: verified profile with priority placement.
- `INACTIVE`: removed from public directories and sitemap.

Club 311 is the only verified club at launch. All imported Barcelona batch listings default to `UNVERIFIED`.

## Visual Hierarchy

Unverified listings use SCM-owned editorial neighborhood or district illustrations. Verified and featured listings use real SCM-branded, club-submitted, licensed, or generated assets stored under controlled SCM media storage.

Google Places photo binaries, direct Google image URLs, and Google photo references are not cached, stored, or served in v1.

Fallback order:

1. Verified SCM-branded or controlled club media.
2. Club-submitted media after approval.
3. Neighborhood illustrated cover.
4. District illustrated cover.
5. Barcelona generic editorial cover.

Public alt text must describe the asset as an editorial illustration and must not imply the illustration depicts the real club interior.

## Public Listing Rules

Every unverified listing must include:

- “What SCM knows”
- “What SCM has not verified”
- Verification status
- Safety Kit link
- Barcelona hub link
- Legal Guides link
- Verification Standard link
- Correction/removal CTA
- SCM legal disclaimer

Unverified listings must not use access-heavy calls to action, guaranteed language, instant-entry framing, or transaction language.

## Takedown And Correction

Every unverified club page links to:

`/[lang]/contact?category=listing-correction&club=[slug]`

Operator removal or correction requests are reviewed within 24 hours. Admins can deactivate a listing by setting `verificationStatus = INACTIVE` and `isActive = false`; inactive listings must be removed from public directories and sitemap.

Status reasons:

- `OPERATOR_REQUEST`
- `DATA_ISSUE`
- `DUPLICATE`
- `LEGAL_RISK`
- `QUALITY_HOLD`

## Import Rules

The XLSX import preview is the only approved first step for the Barcelona batch:

```bash
npm run clubs:preview-import
```

The preview rewrites risky source metadata into SCM-safe public copy and holds suspicious or incomplete rows. A real database import should only use rows marked `readyForImport`.

## QA Gates

Run these checks before publishing expanded listings:

```bash
npm run seo:safety-scan
npm run seo:club-spine
npm run lint
npm run test:run
npm run build
```
