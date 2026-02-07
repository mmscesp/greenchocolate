# 🧬 DATA & TYPE CONSISTENCY FIX PLAN

This plan addresses the **CRITICAL** data flow issues and **HIGH** priority type safety gaps.

## 🚨 CRITICAL FIXES

### 1. Wire Up Authentication Forms
**Location**: `app/club-panel/login/page.tsx`, `app/club-panel/signup/page.tsx`

**Current State**:
Uses `setTimeout` to simulate API calls. No data is sent to Supabase or Prisma.

**Fix**:
1.  Import `login` and `signUp` actions from `app/actions/auth.ts`.
2.  Convert client components to use `useFormState` (or `useActionState` in React 19) for server action integration.
3.  Remove simulation code.

### 2. Standardize `Club` Interface
**Location**: `lib/types.ts` vs `prisma/schema.prisma`

**Current State**:
Major discrepancies (e.g., `socialMedia` type, `address` vs `addressDisplay`).

**Fix**:
1.  Update `lib/types.ts` to match Prisma's reality (or create a DTO transformation layer).
    *   Change `socialMedia` to `Json` or `Record<string, string>`.
    *   Make `phoneNumber` optional.
2.  Create a shared **Mapper Function**:
    ```typescript
    export function mapClubToCard(club: Club): ClubCard { ... }
    ```
    Use this in all server actions to ensure consistent return types.

---

## 🛡️ TYPE SAFETY FIXES

### 3. Eliminate `any` in Actions
**Location**: `app/actions/clubs.ts`

**Fix**:
Replace `any` with proper interfaces:
```typescript
interface ClubCoordinates {
  lat: number;
  lng: number;
}
// In Prisma query
const result = await prisma.$queryRaw<{ item: string }[]>`...`;
```

### 4. Add Missing Zod Validation
**Location**: `app/actions/*.ts`

**Fix**:
Add Zod schemas for missing inputs:
*   `decryptUserPII(userId)` -> `z.string().uuid()`
*   `getClubStats(clubId)` -> `z.string().uuid()`
*   `cancelMembershipRequest(requestId)` -> `z.string().uuid()`

---

## 📅 EXECUTION ORDER

1.  **Auth Wiring**: Fix Critical #1 immediately. The app cannot function without it.
2.  **Type Alignment**: Update `lib/types.ts` to reflect the database schema.
3.  **Validation**: Add missing Zod checks to server actions.
