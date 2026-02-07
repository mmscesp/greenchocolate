# 🎨 FRONTEND & SEO FIX PLAN

This plan addresses the **High/Medium** priority frontend and SEO issues.

## 🚀 HIGH PRIORITY

### 1. Fix Hardcoded Language & i18n
**Location**: `app/layout.tsx`, `components/HeroSection.tsx`, `components/ClubCard.tsx`

**Tasks**:
- [ ] Remove hardcoded `<html lang="es">` in `app/layout.tsx`.
- [ ] Implement dynamic lang attribute (e.g., from `useLanguage` or route param).
- [ ] Replace "Scroll", "Verificado", "Desde", "Explorar Club" with `t('key')`.

### 2. Client Component Optimization
**Location**: `app/clubs/ClubsPageClient.tsx`

**Tasks**:
- [ ] Refactor `ClubsPageClient` to NOT wrap the entire page content.
- [ ] Move the Club Grid to a Server Component if possible, or at least keep the data fetching server-side (which it currently is in the wrapper).
- [ ] Ensure `ClubsPageWrapper` passes data down efficiently.

---

## ⚡ MEDIUM PRIORITY

### 3. Add Missing JSON-LD
**Location**: `app/page.tsx`

**Tasks**:
- [ ] Import `JsonLd` component.
- [ ] Add `Organization` schema for the platform itself.
- [ ] Add `WebSite` schema for search box integration.

### 4. Image Optimization
**Location**: `app/club-panel/**/*.tsx`

**Tasks**:
- [ ] Find all `<img>` tags in the dashboard.
- [ ] Replace with `<Image />` from `next/image`.
- [ ] Configure `remotePatterns` in `next.config.js` if needed for external images.

---

## 🧪 TESTING

1.  **Lint Check**: Run `npm run lint` to catch any new issues.
2.  **Build Check**: Run `npm run build` to verify type safety and static generation.
3.  **Manual Verification**:
    - Toggle language to English -> verify all strings change.
    - Inspect source on Home -> verify JSON-LD is present.
    - Inspect source on Home -> verify `lang` attribute is correct.
