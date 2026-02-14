# SocialClubsMaps - Comprehensive Implementation Plan

**Date:** February 14, 2026  
**Goal:** Fix all codebase issues and make production-ready

---

## EXECUTIVE SUMMARY

This document contains the complete implementation plan to fix:
1. Club directory with filtering - WORKING ✓
2. Mock data still in use - NEEDS FIX
3. Mixed patterns (server actions vs useClubs hook) - NEEDS FIX
4. Club admin relationship via managedClubId not wired - NEEDS FIX

**Critical Path:** Schema → Types → Server Actions → Club Admin → UI/UX → Polish

---

## PHASE 1: DATABASE SCHEMA & TYPES
**Goal:** Add missing models and fix type definitions  
**Priority:** HIGH

### Task 1.1: Add Missing Models to schema.prisma
**File:** `prisma/schema.prisma`
**Status:** PENDING

```prisma
model Review {
  id        String   @id @default(uuid())
  rating    Int
  content   String?
  userId    String
  clubId    String
  isPublic  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      Profile  @relation(fields: [userId], references: [id], onDelete: Cascade)
  club      Club     @relation(fields: [clubId], references: [id], onDelete: Cascade)
  
  @@unique([userId, clubId])
  @@index([clubId, isPublic])
}

model Favorite {
  id        String   @id @default(uuid())
  userId    String
  clubId    String
  createdAt DateTime @default(now())
  
  user      Profile  @relation(fields: [userId], references: [id], onDelete: Cascade)
  club      Club     @relation(fields: [clubId], references: [id], onDelete: Cascade)
  
  @@unique([userId, clubId])
}

model Event {
  id          String    @id @default(uuid())
  slug        String    @unique
  name        String
  description String
  startDate   DateTime
  endDate     DateTime
  location    String
  clubId      String?
  cityId      String?
  isPublished Boolean   @default(false)
  imageUrl    String?
  eventUrl    String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  club        Club?     @relation(fields: [clubId], references: [id], onDelete: SetNull)
  city        City?     @relation(fields: [cityId], references: [id], onDelete: SetNull)
  
  @@index([clubId])
  @@index([cityId])
  @@index([startDate])
}

model Notification {
  id        String    @id @default(uuid())
  userId    String
  type      String
  title     String
  message   String
  isRead    Boolean   @default(false)
  data      Json?
  createdAt DateTime  @default(now())
  
  user      Profile   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId, isRead])
}
```

### Task 1.2: Update lib/types.ts
**File:** `lib/types.ts`
**Status:** PENDING

Add types:
- Review
- Favorite  
- Event
- Notification
- Update Club interface

### Task 1.3: Create Database Migration
**Command:** `npx prisma migrate dev --name add_missing_models`
**Status:** PENDING

### Task 1.4: Add Review/Favorite Actions to clubs.ts
**File:** `app/actions/clubs.ts`
**Status:** PENDING

Add actions:
- getUserFavorites(userId)
- addFavorite(userId, clubId)
- removeFavorite(userId, clubId)
- getClubReviews(clubId)
- addReview(userId, clubId, data)

---

## PHASE 2: DATA LAYER
**Goal:** Fix server actions and unify fetching patterns  
**Priority:** HIGH

### Task 2.1: Refactor useClubs.ts Hook
**File:** `hooks/useClubs.ts`
**Status:** PENDING

Current Problem: Does client-side filtering after fetching all clubs
Fix: Delegate filtering to server action entirely

### Task 2.2: Fix getClubs to Return Rating Data
**File:** `app/actions/clubs.ts`
**Status:** PENDING

Current Problem: Returns rating: null always
Fix: Include review aggregation in query

### Task 2.3: Add Proper Types Alignment
**File:** `app/actions/clubs.ts`
**Status:** PENDING

Add transformToClubCard function

### Task 2.4: Create Unified Club Utilities
**File:** `lib/club-utils.ts` (NEW)
**Status:** PENDING

Create centralized club data utilities:
- clubCardToClub(card)
- isClubComplete(club)
- getClubStatus(club)

---

## PHASE 3: CLUB ADMIN FLOW
**Goal:** Wire managedClubId and remove mock data  
**Priority:** HIGH

### Task 3.1: Update Auth to Handle CLUB_ADMIN
**File:** `app/actions/auth.ts`
**Status:** PENDING

Add action: assignClubAdmin(userId, clubId)

### Task 3.2: Create Club Admin Assignment Action
**File:** `app/actions/clubs.ts`
**Status:** PENDING

Add: getClubForAdmin(authId) - uses managedClubId

### Task 3.3: Replace Mock Data in ClubDashboardClient
**File:** `components/club/ClubDashboardClient.tsx`
**Status:** PENDING

Replace mockClubData with real club prop

### Task 3.4: Update Dashboard Page to Use Real Data
**File:** `app/[lang]/club-panel/dashboard/page.tsx`
**Status:** PENDING

Use getClubForAdmin instead of getClubs

### Task 3.5: Replace Mock in Events Page
**File:** `app/[lang]/club-panel/dashboard/events/page.tsx`
**Status:** PENDING

Use real data instead of mockEvents

### Task 3.6: Replace Mock in Profile Page
**File:** `app/[lang]/club-panel/dashboard/profile/page.tsx`
**Status:** PENDING

Use real data instead of mockClubData

### Task 3.7: Fix getClubByAuthId
**File:** `app/actions/clubs.ts`
**Status:** PENDING

Reuse getClubForAdmin function

---

## PHASE 4: UI/UX FIXES
**Priority:** MEDIUM

### Task 4.1: Fix FilterBar i18n
**File:** `components/FilterBar.tsx`
**Status:** PENDING

Replace hardcoded strings:
- "Filtros Avanzados" → t('filters.advanced')
- "clubs encontrados" → t('filters.results_count')
- "Limpiar filtros" → t('filters.clear')
- "Barrio" → t('filters.neighborhood')
- "Servicios y Amenidades" → t('filters.amenities')
- "Ambiente y Estilo" → t('filters.vibes')

### Task 4.2: Remove Type Casting
**File:** `app/[lang]/clubs/ClubsPageClient.tsx`
**Status:** PENDING

Line 133: Remove `as unknown as Club` casting

### Task 4.3: Add Translation Keys
**Files:** `dictionaries/*.json`
**Status:** PENDING

Add keys:
```json
{
  "filters": {
    "advanced": "Filtros Avanzados",
    "results_count": "{{count}} clubs encontrados",
    "clear": "Limpiar filtros",
    "neighborhood": "Barrio",
    "amenities": "Servicios y Amenidades",
    "vibes": "Ambiente y Estilo",
    "verified_only": "Solo clubs verificados",
    "price_range": "Rango de precios",
    "min_rating": "Valoración mínima",
    "active": "Filtros activos"
  },
  "club_dashboard": {
    "no_club": "No club assigned to your account",
    "pending_requests": "Solicitudes pendientes",
    "total_members": "Total de miembros",
    "capacity": "Capacidad",
    "founded": "Fundado",
    "verified": "Verificado"
  }
}
```

### Task 4.4: Fix ClubCard Rating Handling
**File:** `components/ClubCard.tsx`
**Status:** ALREADY CORRECT ✓

Rating handling already correct - no change needed.

---

## PHASE 5: POLISH & VERIFICATION
**Priority:** MEDIUM

### Task 5.1: Delete Mock Data File
**File:** `lib/mock-admin-data.ts`
**Status:** PENDING

Delete after verifying no imports remain

### Task 5.2: Run Diagnostics
**Command:** `npm run lint`
**Status:** PENDING

### Task 5.3: Test Club Listing
- [ ] Club listing loads and displays
- [ ] All filters work

### Task 5.4: Test Club Admin Dashboard
- [ ] Shows correct club
- [ ] No mock data visible

### Task 5.5: Verify TypeScript
**Command:** `npx tsc --noEmit`
**Status:** PENDING

---

## DEPENDENCY GRAPH

```
PHASE 1 (Foundation)
├── 1.1 Add schema models ──────► 1.2 Update types
├── 1.2 Update types ───────────► 1.3 Create migration
├── 1.3 Migration ───────────────► 1.4 Add actions

PHASE 2 (Data Layer)
├── 2.1 Refactor useClubs ─────► 2.3 Type alignment
├── 2.2 Fix rating data ────────► 2.3 Type alignment
├── 2.3 Type alignment ─────────► 2.4 Utilities

PHASE 3 (Club Admin)
├── 3.1 Update auth ───────────► 3.2 Assignment action
├── 3.2 Assignment action ───────► 3.3 Dashboard component
├── 3.3 Dashboard component ────► 3.4 Dashboard page
├── 3.4 Dashboard page ─────────► 3.5 Events page
├── 3.5 Events page ────────────► 3.6 Profile page
├── 3.6 Profile page ───────────► 3.7 Fix getClubByAuthId

PHASE 4 (UI/UX)
├── 4.1 Fix i18n ───────────────► 4.3 Add translation keys
├── 4.2 Fix type casting ───────► 4.3 Add translation keys

PHASE 5 (Polish)
└── All previous ────────────────► 5.1-5.5 Verify & Cleanup
```

---

## ESTIMATED TIMELINE

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1 | 4 tasks | 2-3 hours |
| Phase 2 | 4 tasks | 2 hours |
| Phase 3 | 7 tasks | 3-4 hours |
| Phase 4 | 4 tasks | 1-2 hours |
| Phase 5 | 5 tasks | 1 hour |
| **TOTAL** | **27 tasks** | **9-12 hours** |

---

## FILES TO MODIFY

### New Files
- `lib/club-utils.ts` - Club utilities
- `dictionaries/*.json` - Translation keys

### Modified Files
- `prisma/schema.prisma` - Add models
- `lib/types.ts` - Add types
- `app/actions/clubs.ts` - Add actions, fix rating
- `app/actions/auth.ts` - Add assignClubAdmin
- `hooks/useClubs.ts` - Refactor
- `components/club/ClubDashboardClient.tsx` - Use real data
- `app/[lang]/club-panel/dashboard/page.tsx` - Use getClubForAdmin
- `app/[lang]/club-panel/dashboard/events/page.tsx` - Use real data
- `app/[lang]/club-panel/dashboard/profile/page.tsx` - Use real data
- `components/FilterBar.tsx` - i18n
- `app/[lang]/clubs/ClubsPageClient.tsx` - Remove type casting

### Deleted Files
- `lib/mock-admin-data.ts` - After verification

---

## SUCCESS CRITERIA

1. ✅ No mock data in production code
2. ✅ All clubs fetched via server actions consistently
3. ✅ Club admin dashboard shows correct club via managedClubId
4. ✅ All filters work (neighborhood, amenities, vibes, price, rating, verified)
5. ✅ No TypeScript errors
6. ✅ No lint errors
7. ✅ All UI text uses i18n

---

**Last Updated:** February 14, 2026
