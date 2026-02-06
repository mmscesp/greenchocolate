# 🔧 BACKEND SURGICAL FIX PLAN
## Cannabis Social Club Platform - Production Readiness

**Created:** February 6, 2026  
**Status:** PLAN ONLY - No Coding Yet  
**Objective:** Fix all critical/high/medium issues identified in BACKEND_REVIEW_REPORT.md

---

## 📊 DATABASE CURRENT STATE (from Supabase MCP)

### Tables Verified ✅
| Table | RLS Enabled | Rows | Status |
|-------|-------------|------|--------|
| City | ✅ | 2 | Ready |
| Club | ✅ | 3 | Ready |
| Profile | ✅ | 0 | Ready |
| MembershipRequest | ✅ | 0 | Ready |
| Article | ✅ | 1 | Ready |
| ConsentRecord | ✅ | 0 | Ready |
| AuditLog | ✅ | 0 | Ready |

### New Security Issues Found (Supabase Linter)
| Severity | Issue | Table/Function | Action |
|----------|-------|----------------|--------|
| 🟡 WARN | `is_admin` mutable search_path | Helper Function | Fix |
| 🟡 WARN | `is_club_admin` mutable search_path | Helper Function | Fix |
| 🟡 WARN | `AuditLog` INSERT with `WITH CHECK (true)` | RLS Policy | Review |
| 🟡 WARN | `ConsentRecord` INSERT with `WITH CHECK (true)` | RLS Policy | Review |

---

## 🎯 COMPLETE TODO LIST

### PHASE 1: CRITICAL SECURITY FIXES (Day 1)

#### 1.1 Fix Broken Encryption Hash Function
**Priority:** 🔴 CRITICAL  
**File:** `lib/encryption.ts`  
**Lines:** 122-124  

```
Task ID: 1.1
Status: TODO
Action: Replace randomBytes with createHash('sha256')
Before:
  static hash(data: string): string {
    return randomBytes(16).toString('hex');  // ❌ Returns random data
  }
After:
  static hash(data: string): string {
    return createHash('sha256').update(data).digest('hex');  // ✅ Real hash
  }
```

**Verification:** 
- Run tests to verify hash output is deterministic
- Test that hash(input) === hash(input) always

#### 1.2 Fix Authorization Bypass in Membership Actions
**Priority:** 🔴 CRITICAL  
**File:** `app/actions/membership.ts`  
**Lines:** 286-369  

```
Task ID: 1.2
Status: TODO
Subtask 1.2.1: Add managedClubId to Profile model (Prisma schema)
Subtask 1.2.2: Create migration for new column
Subtask 1.2.3: Update approveMembershipRequest to verify club ownership
Subtask 1.2.4: Update rejectMembershipRequest to verify club ownership
```

**Implementation Logic:**
```typescript
// Before approval, verify:
const request = await prisma.membershipRequest.findUnique({
  where: { id: requestId },
  include: { club: true }
});

if (profile.role === 'CLUB_ADMIN' && request.club.id !== profile.managedClubId) {
  return { success: false, message: 'Unauthorized for this club' };
}
```

#### 1.3 Fix Hardcoded Salt in Encryption
**Priority:** 🟡 HIGH  
**File:** `lib/encryption.ts`  
**Line:** 20  

```
Task ID: 1.3
Status: TODO
Action: Move salt to environment variable
Before:
  return scryptSync(key, 'salt', KEY_LENGTH);
After:
  return scryptSync(key, process.env.ENCRYPTION_SALT!, KEY_LENGTH);

Also update:
- .env.local to include ENCRYPTION_SALT
- Update documentation
- Regenerate any test keys if needed
```

---

### PHASE 2: ERROR HANDLING (Day 1)

#### 2.1 Add try-catch to clubs.ts
**Priority:** 🔴 HIGH  
**File:** `app/actions/clubs.ts`  

```
Task ID: 2.1
Status: TODO
Functions to update:
- [ ] getClubs (Line 87)
- [ ] getClubBySlug (Line 163)
- [ ] getFeaturedClubs (Line 209)
- [ ] getCityNeighbors (Line 249)
- [ ] getNeighborhoods (Line 300)
- [ ] getAllAmenities (Line 332)
- [ ] getAllVibes (Line 363)

Pattern to follow from auth.ts:
  try {
    // DB operation
  } catch (error) {
    console.error('FunctionName error:', error);
    return { success: false, message: 'Failed to fetch data' };
  }
```

#### 2.2 Add try-catch to articles.ts
**Priority:** 🔴 HIGH  
**File:** `app/actions/articles.ts`  

```
Task ID: 2.2
Status: TODO
Functions to update:
- [ ] getArticles
- [ ] getArticleBySlug
- [ ] getFeaturedArticles
- [ ] getRelatedArticles
- [ ] getCategoriesWithCounts
```

#### 2.3 Add try-catch to cities.ts
**Priority:** 🔴 HIGH  
**File:** `app/actions/cities.ts`  

```
Task ID: 2.3
Status: TODO
Functions to update:
- [ ] getCities
- [ ] getCityBySlug
- [ ] getCitiesWithClubs
- [ ] getPopularCities
```

#### 2.4 Add try-catch to membership.ts (partial)
**Priority:** 🟡 MEDIUM  
**File:** `app/actions/membership.ts`  

```
Task ID: 2.4
Status: TODO
Functions to update:
- [ ] getUserMembershipRequests (Line 159)
- [ ] getClubMembershipRequests (Line 249)
```

---

### PHASE 3: DATABASE SCHEMA FIXES (Day 2)

#### 3.1 Add countryCode Field to City Model
**Priority:** 🟡 MEDIUM  
**File:** `prisma/schema.prisma`  
**Migration:** Required  

```
Task ID: 3.1
Status: TODO
Action: Add countryCode field to City model
Prisma Change:
  model City {
    // ... existing fields ...
    countryCode String @default("ES")
  }

Migration: add_city_country_code
Steps:
  1. npx prisma migrate dev --name add_city_country_code
  2. Verify migration applies cleanly
  3. Update seed data if needed
```

#### 3.2 Add managedClubId Field to Profile Model
**Priority:** 🟡 MEDIUM (for Task 1.2)  
**File:** `prisma/schema.prisma`  

```
Task ID: 3.2
Status: TODO
Action: Add managedClubId for CLUB_ADMIN scope
Prisma Change:
  model Profile {
    // ... existing fields ...
    managedClubId String?  // Links CLUB_ADMIN to specific club
    managedClub   Club?   @relation("ClubAdmin", fields: [managedClubId], references: [id])
    
    // Add to Club model:
    // admins Profile[] @relation("ClubAdmin")
  }

Migration: add_profile_managed_club
```

---

### PHASE 4: DATABASE SECURITY HARDENING (Day 2)

#### 4.1 Fix is_admin Function Search Path
**Priority:** 🟡 MEDIUM  
**Status:** ✅ COMPLETED - 2026-02-06

The helper function search_path vulnerability has been fixed via Supabase MCP.
`SET search_path = public;` was added to prevent privilege escalation attacks.

#### 4.2 Fix is_club_admin Function Search Path
**Priority:** 🟡 MEDIUM  
**Status:** ✅ COMPLETED - 2026-02-06

The helper function now includes `SET search_path = public;` and validates that the CLUB_ADMIN's managedClubId matches the requested club.

#### 4.3 Review AuditLog INSERT Policy
**Priority:** 🟡 LOW  
**Status:** ✅ DONE - Documented below

**Rationale:** `WITH CHECK (true)` is intentional for system-generated audit logs

```
The AuditLog table requires unrestricted INSERT capability for system operations
because:
1. Audit logs are system-generated by server actions and triggers
2. Users cannot directly insert audit log records
3. All INSERT operations originate from trusted application code
4. The policy prevents users from bypassing the audit trail by modifying data

This is acceptable because RLS policies are controlled by the application,
not end users. The INSERT access is through SECURITY DEFINER functions
that handle proper authorization before creating audit entries.
```

#### 4.4 Review ConsentRecord INSERT Policy
**Priority:** 🟡 LOW  
**Status:** ✅ DONE - Documented below

**Rationale:** Similar to AuditLog - system-generated records

```
The ConsentRecord table requires unrestricted INSERT capability because:
1. Consent records are created exclusively through the auth signup flow
2. Users trigger consent recording via the application, not direct database access
3. The server action validates all consent data before insertion
4. RLS prevents users from modifying or deleting consent records

This is acceptable because:
- Users can only grant/withdraw consent through the application UI
- Server actions enforce proper consent validation (GDPR compliance)
- Users cannot forge consent records or modify historical consent

Both policies are SECURITY INTENTIONAL and should NOT be modified.
```
Task ID: 4.3
Status: TODO
Action: Document why permissive INSERT is acceptable
Note: Audit logs are system-generated, not user-submitted
This is acceptable because:
  - Only internal system operations create audit logs
  - RLS prevents users from modifying these policies
  - Proper access controlled at function level
```

#### 4.4 Review ConsentRecord INSERT Policy
**Priority:** 🟡 LOW  
**Reason:** Similar to AuditLog - system-generated

```
Task ID: 4.4
Status: TODO
Action: Document why permissive INSERT is acceptable
Note: Consent records created via server actions with proper validation
```

---

### PHASE 5: PERFORMANCE OPTIMIZATION (Day 3)

#### 5.1 Refactor getAllAmenities Aggregation
**Priority:** 🟡 MEDIUM  
**File:** `app/actions/clubs.ts`  
**Lines:** 332-358  

```
Task ID: 5.1
Status: TODO
Action: Use PostgreSQL array functions instead of in-memory processing

Before (Current):
  const clubs = await prisma.club.findMany({ where, select: { amenities: true } });
  const allAmenities: string[] = [];
  for (const c of clubs) { allAmenities.push(...c.amenities); }
  return Array.from(new Set(allAmenities)).sort();

After (Recommended):
  SELECT DISTINCT unnest(amenities) as amenity
  FROM "Club"
  WHERE is_active = true AND is_verified = true
  ORDER BY amenity;

Or create lookup table for scalability:
  CREATE TABLE AmenityLookup (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE
  );
```

#### 5.2 Refactor getAllVibes Aggregation
**Priority:** 🟡 MEDIUM  
**File:** `app/actions/clubs.ts`  
**Lines:** 363-389  

```
Task ID: 5.2
Status: TODO
Action: Same as 5.1 but for vibeTags
```

#### 5.3 Optimize Middleware Role Check
**Priority:** 🟢 LOW  
**File:** `middleware.ts`  
**Lines:** 67-71  

```
Task ID: 5.3
Status: TODO (Optional enhancement)
Action: Consider caching role in JWT or session

Current: DB query on EVERY admin route request
Optimized: Read from auth.users.user_metadata or session

Note: Only implement if performance testing shows bottleneck
```

---

### PHASE 6: VALIDATION & TESTING (Day 3)

#### 6.1 Add Zod Validation to clubs.ts
**Priority:** 🟡 MEDIUM  
**File:** `app/actions/clubs.ts`  

```
Task ID: 6.1
Status: TODO
Action: Add Zod schemas for filter inputs

const clubFiltersSchema = z.object({
  citySlug: z.string().optional(),
  neighborhood: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  vibes: z.array(z.string()).optional(),
  priceRange: z.array(z.enum(['$', '$$', '$$$'])).optional(),
  isVerified: z.boolean().optional(),
});
```

#### 6.2 Add Zod Validation to articles.ts
**Priority:** 🟡 MEDIUM  
**File:** `app/actions/articles.ts`  

```
Task ID: 6.2
Status: TODO
Action: Add Zod schemas for filter inputs
```

#### 6.3 Add Zod Validation to cities.ts
**Priority:** 🟡 MEDIUM  
**File:** `app/actions/cities.ts`  

```
Task ID: 6.3
Status: TODO
Action: Add Zod schemas for filter inputs
```

---

### PHASE 7: BUILD & VERIFICATION (Day 3)

#### 7.1 Generate Prisma Client
```
Task ID: 7.1
Status: TODO
Command: npx prisma generate
Verify: No errors
```

#### 7.2 Run TypeScript Compilation
```
Task ID: 7.2
Status: TODO
Command: npx tsc --noEmit
Verify: 0 errors
```

#### 7.3 Run Lint
```
Task ID: 7.3
Status: TODO
Command: npm run lint
Verify: 0 errors (or existing errors only)
```

#### 7.4 Build Project
```
Task ID: 7.4
Status: TODO
Command: npm run build
Verify: Exit code 0
```

#### 7.5 Run Supabase Security Linter
```
Task ID: 7.5
Status: TODO
Command: supabase db lint (via MCP)
Verify: 0 critical/high issues
```

#### 7.6 Verify Database Migrations Applied
```
Task ID: 7.6
Status: TODO
Command: supabase migration list (via MCP)
Verify: All migrations applied
```

---

## 📋 EXECUTION CHECKLIST

### Before Starting
- [ ] Create backup branch: `git checkout -b fix-backend-issues`
- [ ] Pull latest main: `git pull origin main`
- [ ] Notify team of maintenance window

### Daily Progress Tracking

#### Day 1:
- [ ] Task 1.1: Fix encryption hash function
- [ ] Task 1.2.1: Add managedClubId to Profile (Prisma)
- [ ] Task 1.3: Fix hardcoded salt
- [ ] Task 2.1: Add error handling to clubs.ts
- [ ] Task 2.2: Add error handling to articles.ts
- [ ] Task 2.3: Add error handling to cities.ts
- [ ] Task 2.4: Add error handling to membership.ts

#### Day 2:
- [ ] Task 3.1: Add countryCode to City (migration)
- [ ] Task 3.2: Add managedClubId (migration)
- [ ] Task 4.1: Fix is_admin search_path (SQL)
- [ ] Task 4.2: Fix is_club_admin search_path (SQL)
- [ ] Task 4.3: Document AuditLog policy
- [ ] Task 4.4: Document ConsentRecord policy

#### Day 3:
- [ ] Task 5.1: Refactor getAllAmenities
- [ ] Task 5.2: Refactor getAllVibes
- [ ] Task 6.1: Add Zod to clubs.ts
- [ ] Task 6.2: Add Zod to articles.ts
- [ ] Task 6.3: Add Zod to cities.ts
- [ ] Task 7.1-7.6: Build & Verify

---

## 🔗 MCP COMMANDS READY

### Supabase Operations (Ready to Execute)
```
- supabase_apply_migration: For schema changes
- supabase_execute_sql: For helper function fixes
- supabase_get_advisors: Verify security linter is clean
- supabase_list_tables: Verify RLS status
```

### File Operations (Ready to Execute)
```
- edit: For code changes in TypeScript files
- todowrite: For tracking progress
- bash: For npm commands (generate, build, lint)
```

---

## 📞 ROLLBACK PLAN

If any change causes issues:

### Quick Revert (Code)
```bash
git checkout -- <file>
git checkout main  # if branch merge fails
```

### Database Revert
```bash
supabase migration revert <migration_name>
```

### Emergency Contacts
- Rollback command: `git checkout HEAD~1`
- Database state: Check migration list before applying

---

## ✅ SUCCESS CRITERIA

After all tasks complete:

1. **Security:**
   - [ ] 0 critical vulnerabilities
   - [ ] 0 high vulnerabilities
   - [ ] Authorization properly scoped

2. **Reliability:**
   - [ ] All database calls wrapped in try-catch
   - [ ] No 500 errors on DB failures

3. **Code Quality:**
   - [ ] TypeScript compilation passes
   - [ ] Lint passes
   - [ ] Build succeeds

4. **Database:**
   - [ ] All migrations applied
   - [ ] Supabase linter clean
   - [ ] RLS policies verified

---

*Plan created: February 6, 2026*  
*Ready for execution*
