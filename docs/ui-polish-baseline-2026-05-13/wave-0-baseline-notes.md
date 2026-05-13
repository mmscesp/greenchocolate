# Wave 0 Baseline Notes

**Date:** 2026-05-13  
**Branch:** `codex/scm-ui-polish-waves`  
**Mode:** Engineering Mode  
**Scope:** Baseline visual capture before UI implementation changes.  
**Homepage rule:** Protected. Only sizing, clipping, overflow, or collision fixes are allowed later.  
**Barcelona rule:** Preserve current design direction.  
**Club-panel rule:** Excluded.

## Browser Method

The in-app browser plugin connected successfully, but local navigation to `http://localhost:3000/en` and `http://127.0.0.1:3000/en` was blocked with `ERR_BLOCKED_BY_CLIENT`.

Fallback used:

- local Next dev server on `http://localhost:3000`
- Playwright CLI screenshots through `npx playwright screenshot`
- screenshots stored under `output/playwright/ui-polish-baseline-2026-05-13/`

This satisfies Wave 0 as a baseline capture round. Future visual QA can continue with Playwright unless the in-app browser localhost block is resolved.

## Captured Screenshots

Desktop viewport: `1366 x 768`

- `output/playwright/ui-polish-baseline-2026-05-13/desktop-home.png`
- `output/playwright/ui-polish-baseline-2026-05-13/desktop-spain.png`
- `output/playwright/ui-polish-baseline-2026-05-13/desktop-barcelona.png`
- `output/playwright/ui-polish-baseline-2026-05-13/desktop-barcelona-clubs.png`
- `output/playwright/ui-polish-baseline-2026-05-13/desktop-club-profile.png`
- `output/playwright/ui-polish-baseline-2026-05-13/desktop-editorial.png`
- `output/playwright/ui-polish-baseline-2026-05-13/desktop-article.png`
- `output/playwright/ui-polish-baseline-2026-05-13/desktop-login.png`
- `output/playwright/ui-polish-baseline-2026-05-13/desktop-register.png`

Mobile viewport: `390 x 844`

- `output/playwright/ui-polish-baseline-2026-05-13/mobile-spain.png`
- `output/playwright/ui-polish-baseline-2026-05-13/mobile-barcelona.png`
- `output/playwright/ui-polish-baseline-2026-05-13/mobile-barcelona-clubs.png`
- `output/playwright/ui-polish-baseline-2026-05-13/mobile-club-profile.png`
- `output/playwright/ui-polish-baseline-2026-05-13/mobile-editorial.png`
- `output/playwright/ui-polish-baseline-2026-05-13/mobile-article.png`
- `output/playwright/ui-polish-baseline-2026-05-13/mobile-login.png`
- `output/playwright/ui-polish-baseline-2026-05-13/mobile-register.png`

## Baseline Observations

### Spain Hub

The `/en/spain` page confirms the audit finding: it feels like a generic carded surface rather than SCM's stronger city-intelligence system. The desktop first viewport uses a large rounded card, a country-hub badge, and generic stats (`100%`, `24/7`). Mobile is heavily affected by the cookie banner, which covers the stats row and makes the first viewport feel cramped.

Implementation target:

- Wave 3 should strongly uplift this page.
- Remove generic stats and any cannabis-leaf style direction.
- Make the page darker, more editorial, and more clearly related to Barcelona without copying Barcelona exactly.

### Barcelona City Page

The `/en/spain/barcelona` page is visually strong. It has a clear map-led composition, start-aligned content, strong title hierarchy, and a good relationship between image, copy, and CTAs.

Implementation target:

- Preserve this design direction.
- Only fix spacing, offset, and responsive safety if needed.

### Barcelona Clubs Directory

The directory page has a strong visual identity, but the first viewport is very tall and centered. On desktop, the actual directory content is pushed below the first viewport. On mobile, the first profile card starts behind the cookie banner, and the fixed bottom banner strongly interferes with the first interaction.

Implementation target:

- Wave 6 should reduce vertical weight and move utility earlier.
- Wave 2 should solve bottom-layer collision behavior before directory polish.

### Club Profile

The club profile baseline shows fragile geometry on mobile. The top hero area is mostly blank/dark before the title card appears, and the cookie banner covers the lower portion of the title card. The back button label also renders as `Backto Clubs`, showing a spacing issue in the compact button/link composition.

Implementation target:

- Wave 7 should preserve the premium profile direction but fix hero/title-card offsets and sticky geometry.
- Also fix the back button spacing as a small polish item.

### Article Detail

The article detail page has a serious first-viewport problem. On both desktop and mobile, the headline is too large for the visible area and is cut off by the viewport and cookie banner. This is a high-confidence sizing/viewport issue, not a content strategy issue.

Implementation target:

- Wave 2 should address bottom fixed collision.
- Wave 8 should reduce article hero typography/spacing pressure and improve reading layout.

### Auth Pages

Login/register are functional and visually cleaner than expected, but still feel like isolated generic forms rather than a deliberate SCM trust/account entry. The cookie banner covers important lower form content on mobile.

Implementation target:

- Wave 5 should create a branded auth shell and improve form rhythm.
- Wave 2 should solve mobile bottom collision first.

## Immediate Wave Priorities Confirmed

1. Wave 1: add non-visual foundation variables.
2. Wave 2: fix navbar/sticky/bottom-layer collision.
3. Wave 3: uplift Spain hub.
4. Wave 5: branded auth shell.
5. Wave 6: directory/filter density.
6. Wave 7: club profile geometry.
7. Wave 8: article reading/hero sizing.

## Wave 0 QA Status

**Status:** PASS with fallback.  
**Reason:** Baseline screenshots were captured through Playwright CLI after the in-app browser blocked localhost. No product code was changed in Wave 0.

