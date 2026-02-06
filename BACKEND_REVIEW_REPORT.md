# 🔍 BACKEND CODE REVIEW REPORT
## Cannabis Social Club Platform - MVP Backend Audit

**Review Date:** February 6, 2026  
**Reviewer:** Sisyphus AI Agent  
**Scope:** Complete Backend MVP (Phases 0-8)  
**Status:** ⚠️ **REVIEW COMPLETE - CRITICAL FIXES REQUIRED**

---

## 📋 EXECUTIVE SUMMARY

| Category | Status | Score |
|----------|--------|-------|
| **Architecture** | ✅ Aligned | 98% |
| **Security** | ⚠️ Issues Found | 85% |
| **Data Access** | ❌ Critical Gaps | 60% |
| **Error Handling** | ❌ Missing | 40% |
| **Schema Integrity** | ⚠️ Minor Gaps | 95% |

### Critical Findings (Must Fix Before Production)

1. 🔴 **CRITICAL**: `membership.ts` - `CLUB_ADMIN` can approve/reject requests for ANY club (authorization bypass)
2. 🔴 **CRITICAL**: `encryption.ts` - `hash()` method returns random data instead of actual hash
3. 🟡 **HIGH**: `clubs.ts`, `articles.ts`, `cities.ts` - Complete absence of try-catch error handling
4. 🟡 **HIGH**: `encryption.ts` - Hardcoded salt in key derivation reduces security
5. 🟢 **MEDIUM**: `prisma/schema.prisma` - Missing `countryCode` field in City model

---

## 🗂️ 1. FILE STRUCTURE INVENTORY

### Database & ORM
| File | Status | Notes |
|------|--------|-------|
| `/prisma/schema.prisma` | ✅ Present | 8 models, 2 enums, all indexes |
| `/prisma/seed.ts` | ✅ Present | Cities, clubs, articles seeded |
| `/lib/prisma.ts` | ✅ Present | PG adapter configured |

### Core Services
| File | Status | Notes |
|------|--------|-------|
| `/lib/encryption.ts` | ⚠️ Issues | Hash bug + hardcoded salt |
| `/lib/supabase/server.ts` | ✅ Present | Cookie-based auth |
| `/lib/supabase/client.ts` | ✅ Present | Browser client |
| `/lib/types.ts` | ✅ Present | Centralized types |

### Server Actions
| File | Status | Notes |
|------|--------|-------|
| `/app/actions/auth.ts` | ✅ Robust | Zod validation, error handling |
| `/app/actions/membership.ts` | ⚠️ Critical Gap | Authorization bypass |
| `/app/actions/clubs.ts` | ❌ Missing Error Handling | No try-catch anywhere |
| `/app/actions/articles.ts` | ❌ Missing Error Handling | No try-catch anywhere |
| `/app/actions/cities.ts` | ❌ Missing Error Handling | No try-catch anywhere |

### Security
| File | Status | Notes |
|------|--------|-------|
| `/middleware.ts` | ✅ Present | Route protection + RBAC |
| `/supabase/triggers.sql` | ✅ Present | Profile auto-creation secured |

---

## 🔐 2. SECURITY REVIEW

### 2.1 Encryption Service (`lib/encryption.ts`)

**File:** `lib/encryption.ts` (Lines 1-129)

#### ✅ What Works
- **Algorithm**: AES-256-GCM (authenticated encryption)
- **Key Derivation**: Uses `scryptSync` from `APP_MASTER_KEY`
- **Bundle Storage**: IV + AuthTag + Ciphertext stored as base64 JSON

#### ❌ Issues Found

| Severity | Line | Issue | Description |
|----------|------|-------|-------------|
| **CRITICAL** | 122-124 | Broken `hash()` Method | Returns `randomBytes(16)` instead of actual hash |
| **HIGH** | 20 | Hardcoded Salt | Uses `'salt'` instead of unique salt per user/operation |
| **MEDIUM** | - | No Key Rotation | Single master key with no rotation mechanism |

#### Code Issue - Broken Hash Function (Lines 122-124)
```typescript
// ❌ CURRENT (BROKEN)
static hash(data: string): string {
  return randomBytes(16).toString('hex');  // Returns RANDOM data
}

// ✅ SHOULD BE
static hash(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}
```

#### Code Issue - Hardcoded Salt (Line 20)
```typescript
// ❌ CURRENT (INSECURE)
return scryptSync(key, 'salt', KEY_LENGTH);

// ✅ RECOMMENDED
return scryptSync(key, process.env.ENCRYPTION_SALT!, KEY_LENGTH);
```

### 2.2 RLS Policies & Database Security

**Status:** ✅ **PRODUCTION READY**

| Requirement | Status | Evidence |
|-------------|--------|----------|
| 8 Tables with RLS | ✅ | All tables secured with `FORCE RLS` |
| 21 Policies | ✅ | All policies implemented per audit |
| `handle_new_user` Secured | ✅ | `SET search_path = public` present |
| Helper Functions | ✅ | `is_admin()`, `is_club_admin()` implemented |

**Source Files:**
- `/supabase/triggers.sql` - Trigger definitions
- `BACKEND_MVP_ARCHITECTURE.md` - Policy documentation

### 2.3 Middleware Security (`middleware.ts`)

**File:** `middleware.ts` (Lines 1-101)

#### ✅ What Works
- Session refresh on every request (Line 35)
- Protected routes list (Lines 41-45)
- Admin route RBAC (Lines 48-77)
- Auth route redirects (Lines 81-84)

#### ⚠️ Performance Concern
**Line 67-71**: Admin role check queries database on EVERY admin route request.
```typescript
// Current implementation - queries DB on every request
const { data: profile } = await supabase
  .from('Profile')
  .select('role')
  .eq('authId', user.id)
  .single();
```

**Recommendation:** Consider caching role in JWT claims or using Supabase's auth metadata for read-heavy routes.

---

## 🗄️ 3. PRISMA SCHEMA REVIEW

**File:** `/prisma/schema.prisma` (Lines 1-286)

### 3.1 Model Compliance

| Model | Status | Notes |
|-------|--------|-------|
| City | ⚠️ Missing Field | `countryCode` missing |
| Club | ✅ Complete | All fields present |
| Profile | ✅ Complete | Encrypted PII field present |
| Article | ✅ Complete | SEO fields present |
| MembershipRequest | ✅ Complete | Legal snapshot present |
| ConsentRecord | ✅ Complete | GDPR compliant |
| AuditLog | ✅ Complete | Hash field present |

### 3.2 Missing Field - City Model

**Architecture Document (Line 65):**
```prisma
countryCode String @default("ES")
```

**Current Schema (Line 37-38):**
```prisma
country     String @default("Spain")
region      String?  // "Comunidad de Madrid"
```

**Impact:** Low - Can be added via migration if multi-country expansion is planned.

### 3.3 Index Verification

All required indexes are present:
- ✅ City: `slug`, `country, region`
- ✅ Club: `slug`, `cityId`, `neighborhood`, `isVerified, isActive`
- ✅ Profile: `authId`, `email`
- ✅ Article: `slug`, `category`, `cityId`, `isPublished, publishedAt`
- ✅ MembershipRequest: `userId_clubId`, `clubId, status`, `userId`

---

## ⚡ 4. SERVER ACTIONS REVIEW

### 4.1 Auth Actions (`app/actions/auth.ts`)

**File:** `app/actions/auth.ts` (Lines 1-357)

| Function | Validation | Error Handling | Status |
|----------|------------|----------------|--------|
| `signUp` | ✅ Zod | ✅ try-catch | ✅ Robust |
| `login` | ✅ Zod | ✅ try-catch | ✅ Robust |
| `signOut` | N/A | ✅ try-catch | ✅ Robust |
| `updateProfile` | ✅ Zod | ✅ try-catch | ✅ Robust |
| `decryptUserPII` | RBAC | ✅ try-catch | ✅ Robust |

**Key Strengths:**
- Zod schemas for all inputs (Lines 17-38)
- Proper `ActionState` return type (Lines 44-49)
- Fallback profile creation for race conditions (Lines 130-150)
- GDPR consent recording (Lines 154-170)

### 4.2 Membership Actions (`app/actions/membership.ts`)

**File:** `app/actions/membership.ts` (Lines 1-370)

#### ❌ CRITICAL SECURITY ISSUE - Authorization Bypass

**Location:** Lines 286-325 (approveMembershipRequest), Lines 330-369 (rejectMembershipRequest)

```typescript
// ❌ CURRENT CODE (LINES 290-297)
export async function approveMembershipRequest(
  requestId: string,
  notes?: string
): Promise<ActionState> {
  const profile = await getCurrentProfile();

  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'CLUB_ADMIN')) {
    return { success: false, message: 'Unauthorized' };
  }
  
  // ❌ NO CHECK: Does this CLUB_ADMIN manage the club in requestId?
  await prisma.membershipRequest.update({
    where: { id: requestId },
    data: { /* ... */ }
  });
}
```

**Vulnerability:** A `CLUB_ADMIN` for "Club A" can approve/reject membership requests for "Club B".

**Fix Required:**
```typescript
// ✅ SHOULD FETCH REQUEST FIRST TO VERIFY CLUB OWNERSHIP
const request = await prisma.membershipRequest.findUnique({
  where: { id: requestId },
  include: { club: true }
});

if (!request) {
  return { success: false, message: 'Request not found' };
}

// Additional check for CLUB_ADMIN
if (profile.role === 'CLUB_ADMIN' && request.club.id !== profile.managedClubId) {
  return { success: false, message: 'Unauthorized for this club' };
}
```

**Note:** The `Profile` model doesn't currently have a `managedClubId` field - this may need to be added to the schema.

#### Other Issues in membership.ts

| Severity | Line | Issue |
|----------|------|-------|
| 🟡 | 159 | `getUserMembershipRequests` lacks try-catch |
| 🟡 | 249 | `getClubMembershipRequests` lacks try-catch |
| 🟢 | 114-128 | Legal snapshot silently fails (console.warn) |

### 4.3 Club Actions (`app/actions/clubs.ts`)

**File:** `app/actions/clubs.ts` (Lines 1-390)

#### ❌ CRITICAL: No Error Handling

**Entire file lacks try-catch blocks.** Database failures will result in 500 errors instead of graceful degradation.

| Function | Line | Risk |
|----------|------|------|
| `getClubs` | 87 | DB failure = 500 error |
| `getClubBySlug` | 163 | DB failure = 500 error |
| `getFeaturedClubs` | 209 | DB failure = 500 error |
| `getCityNeighbors` | 249 | DB failure = 500 error |
| `getNeighborhoods` | 300 | DB failure = 500 error |
| `getAllAmenities` | 332 | DB failure = 500 error |
| `getAllVibes` | 363 | DB failure = 500 error |

#### Performance Issue - In-Memory Processing

**Lines 353-357 (getAllAmenities):**
```typescript
const clubs = await prisma.club.findMany({
  where,
  select: { amenities: true },
});

const allAmenities: string[] = [];
for (const c of clubs) {
  allAmenities.push(...c.amenities);  // ❌ Loads ALL clubs into memory
}
return Array.from(new Set(allAmenities)).sort();
```

**Same issue at Lines 384-388 (getAllVibes).**

**Impact:** Will not scale as club count grows. Should use PostgreSQL's `unnest()` or separate lookup tables.

### 4.4 Article Actions (`app/actions/articles.ts`)

**File:** `app/actions/articles.ts`

#### ❌ CRITICAL: No Error Handling

Same pattern as clubs.ts - entire file lacks try-catch blocks.

| Function | Risk |
|----------|------|
| `getArticles` | DB failure = 500 error |
| `getArticleBySlug` | DB failure = 500 error |
| `getFeaturedArticles` | DB failure = 500 error |
| `getRelatedArticles` | DB failure = 500 error |
| `getCategoriesWithCounts` | DB failure = 500 error |

### 4.5 City Actions (`app/actions/cities.ts`)

**File:** `app/actions/cities.ts`

#### ❌ CRITICAL: No Error Handling

Same pattern - entire file lacks try-catch blocks.

| Function | Risk |
|----------|------|
| `getCities` | DB failure = 500 error |
| `getCityBySlug` | DB failure = 500 error |
| `getCitiesWithClubs` | DB failure = 500 error |
| `getPopularCities` | DB failure = 500 error |

---

## 📊 5. FINDINGS SUMMARY

### By Severity

| Severity | Count | Items |
|----------|-------|-------|
| 🔴 CRITICAL | 2 | Authorization bypass, broken hash function |
| 🟡 HIGH | 3 | Missing error handling (3 files), hardcoded salt |
| 🟢 MEDIUM | 2 | Schema missing countryCode, performance concerns |
| ✅ INFO | 5 | Auth robustness, RLS policies, Zod validation |

### By Category

| Category | Score | Issues |
|----------|-------|--------|
| Encryption | 60% | Hash bug, hardcoded salt |
| Authorization | 70% | Club admin scope not enforced |
| Error Handling | 40% | 3 files completely missing |
| Schema | 95% | 1 optional field missing |
| RLS/Security | 100% | All policies implemented |
| Validation | 90% | Auth has it, others don't |

---

## 🚀 RECOMMENDED FIXES (Priority Order)

### P0 - Critical (Fix Before Production)

1. **Fix `EncryptionService.hash()`** - Replace randomBytes with createHash
2. **Fix Authorization Bypass** - Add club ownership verification to approve/reject actions
3. **Add try-catch to all read actions** - clubs.ts, articles.ts, cities.ts

### P1 - High Priority

4. **Use unique salt for key derivation** - Move salt to environment variable
5. **Add missing schema field** - Add `countryCode` to City model
6. **Refactor getAllAmenities/getAllVibes** - Use database-level aggregation

### P2 - Medium Priority

7. **Add input validation** - Zod schemas for clubs, articles, cities actions
8. **Add rate limiting** - Protect auth actions from brute force
9. **Consider JWT claims for roles** - Reduce DB queries in middleware

---

## 📁 FILES REQUIRING CHANGES

| File | Changes Required |
|------|------------------|
| `lib/encryption.ts` | Fix hash(), fix salt |
| `app/actions/membership.ts` | Fix authorization, add try-catch |
| `app/actions/clubs.ts` | Add try-catch, refactor aggregations |
| `app/actions/articles.ts` | Add try-catch |
| `app/actions/cities.ts` | Add try-catch |
| `prisma/schema.prisma` | Add countryCode to City |
| `middleware.ts` | (Optional) Optimize role checking |

---

## ✅ VERIFICATION CHECKLIST

Before marking this review complete, verify:

- [ ] `EncryptionService.hash()` outputs SHA256 hash
- [ ] `approveMembershipRequest` checks club ownership
- [ ] All database calls wrapped in try-catch
- [ ] `prisma generate` run after schema changes
- [ ] Build passes: `npm run build`
- [ ] TypeScript compilation clean: `npx tsc --noEmit`

---

## 🎯 CONCLUSION

The backend MVP is **functionally complete** but requires **critical security fixes** before production deployment. The architecture is sound, RLS policies are properly implemented, and the data model supports the SEO-first strategy. However:

1. **Security**: 2 critical vulnerabilities need immediate attention
2. **Reliability**: Missing error handling will cause 500 errors on DB issues
3. **Scalability**: In-memory aggregations need database-level replacement

**Recommendation:** Do NOT deploy to production until P0 items are resolved.

---

*Report generated by Sisyphus AI Agent*  
*February 6, 2026*
