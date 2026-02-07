# 📋 CODEBASE AUDIT REPORT

## Executive Summary
This audit evaluated the Cannabis Social Club Platform codebase against the 13-phase meta-prompt.
- **Total Issues Found**: 14
- **Critical Issues (Blockers)**: 4 (Security & Safety)
- **High Priority Issues**: 5 (Architecture & Type Safety)
- **Medium Priority Issues**: 3 (Performance & SEO)
- **Low Priority Issues**: 2 (Maintainability)

**Overall Health**: The codebase has a solid foundation with good separation of concerns and modern Next.js patterns. However, **critical security gaps** in the server actions and **type safety bypasses** in the data layer must be addressed immediately before any production deployment.

---

### 🔴 CRITICAL ISSUES (Must Fix Before Production)

| ID | Category | Location | Issue | Severity | Fix |
|----|----------|----------|-------|----------|-----|
| CRIT-001 | Security | `app/actions/clubs.ts` | **Unauthenticated Access**: `updateClub` allows ANY user to update ANY club's data. No auth check. | **CRITICAL** | Add `getCurrentUser` + role check + ownership verification. |
| CRIT-002 | Security | `app/actions/clubs.ts` | **Data Leak**: `getClubMembershipRequests` (clubId version) has no auth check. Exposes PII. | **CRITICAL** | Add strict auth & ownership check. |
| CRIT-003 | Security | `app/actions/membership.ts` | **IDOR Vulnerability**: `getClubMembershipRequests`, `approve...`, `reject...` accept `clubSlug` without verifying if the caller manages that club. | **CRITICAL** | Enforce `profile.managedClubId === targetClub.id`. |
| CRIT-004 | Testing | Project Root | **Zero Test Coverage**: No unit or E2E tests exist. No test config. | **CRITICAL** | Install Vitest + Playwright. Add critical flow tests. |
| CRIT-005 | Data Flow | `app/club-panel/signup` & `login` | **Disconnected Auth Forms**: Signup/Login pages use `setTimeout` simulation instead of real Server Actions. **Auth is non-functional.** | **CRITICAL** | Wire up forms to `signUp` and `login` actions in `app/actions/auth.ts`. |

---

### 🟠 HIGH PRIORITY ISSUES

| ID | Category | Location | Issue | Severity | Fix |
|----|----------|----------|-------|----------|-----|
| HIGH-001 | Type Safety | `app/actions/clubs.ts` | **Unsafe Type Casting**: `openingHours as Record<string, string>` bypasses runtime validation for JSON fields. | HIGH | Use Zod schemas to parse/validate Prisma JSON fields before returning. |
| HIGH-002 | Architecture | `app/actions/*.ts` | **Silent Failures**: Fetch actions return `[]` or `null` on error without exposing error reason to UI. | HIGH | Return standardized `ActionState` or throw errors caught by `error.tsx`. |
| HIGH-003 | SEO | `app/layout.tsx` | **Hardcoded Language**: `<html lang="es">` is hardcoded, ignoring multi-language support. | HIGH | Make `lang` attribute dynamic based on `useLanguage` or route locale. |
| HIGH-004 | Frontend | `app/clubs/ClubsPageClient.tsx` | **Client Component Overuse**: Large page wrapper is `"use client"`, effectively de-optimizing the page. | HIGH | Extract interactive parts (filters) to client components; keep list server-side. |
| HIGH-005 | Security | `app/actions/membership.ts` | **PII in Response**: `getUserMembershipRequests` returns full user object including fields not needed for display. | HIGH | Select only necessary fields in Prisma query (`select: { id: true, displayName: true... }`). |

---

### 🟡 MEDIUM PRIORITY ISSUES

| ID | Category | Location | Issue | Severity | Fix |
|----|----------|----------|-------|----------|-----|
| MED-001 | SEO | `app/page.tsx` | **Missing JSON-LD**: Home page lacks Organization/WebSite structured data. | MEDIUM | Add `JsonLd` component to home page. |
| MED-002 | i18n | `components/ClubCard.tsx` | **Hardcoded Strings**: "Verificado", "Desde", etc. are hardcoded. | MEDIUM | Replace with `t()` translation keys. |
| MED-003 | Architecture | `lib/types.ts` | **Type Discrepancy**: Frontend expects `socialMedia` object, Prisma provides `Json`. | MEDIUM | Align types or add transformation layer. |

---

### 🟢 LOW PRIORITY ISSUES / IMPROVEMENTS

| ID | Category | Location | Issue | Severity | Suggestion |
|----|----------|----------|-------|----------|------------|
| LOW-001 | Documentation | `components/*` | **Missing JSDoc**: Most UI components lack prop documentation. | LOW | Add JSDoc for complex props. |
| LOW-002 | Performance | `app/club-panel/...` | **Unoptimized Images**: Using `<img>` instead of `next/image` in admin panel. | LOW | Replace with `next/image` for automatic optimization. |

---

### ✅ ALREADY CORRECT

| Category | Location | Notes |
|----------|----------|-------|
| Security | `middleware.ts` | Route protection logic is sound and covers admin paths. |
| Environment | `lib/encryption.ts` | Master keys are handled securely via env vars. |
| Metadata | `app/blog/[slug]` | Dynamic metadata generation is correctly implemented. |
| Database | `prisma/schema.prisma` | Schema is well-structured with proper indexes. |

---

## 🏗️ RECOMMENDED ACTION PLAN

### Phase 1: Surgical Security Fixes (Immediate)
1.  **Secure `clubs.ts`**: Add `getCurrentUser` and role checks to `updateClub` and `getClubMembershipRequests`.
2.  **Fix IDOR in `membership.ts`**: Ensure `clubSlug` param is validated against the user's `managedClubId`.
3.  **Sanitize Data**: Ensure `getClubMembershipRequests` selects only necessary user fields (ID, name, avatar).

### Phase 2: Safety & Stability
1.  **Add Error Boundaries**: Create `app/error.tsx` and `app/not-found.tsx`.
2.  **Type Hardening**: Replace `as ...` casts with Zod parsing for Prisma JSON fields (`openingHours`, `socialMedia`).
3.  **Setup Testing**: Initialize Vitest and write one smoke test for the Auth flow.

### Phase 3: Frontend & SEO Refinement
1.  **Fix i18n**: Replace hardcoded "es" in `layout.tsx` and UI strings.
2.  **Optimize Components**: Refactor `ClubsPageClient` to move data fetching to Server Components.
3.  **Add JSON-LD**: Implement structured data on Home and Listing pages.
