# Meta-Prompt: Comprehensive Codebase Audit

**Purpose**: Perform a thorough end-to-end audit of the Cannabis Social Club Platform codebase to identify issues, gaps, logic mismatches, and improvement opportunities.

---

## EXECUTIVE SUMMARY

Review the entire codebase and provide a detailed report covering:
- Backend-Frontend consistency
- Type mismatches and type safety issues
- Missing error handling and edge cases
- Security vulnerabilities
- SEO implementation gaps
- Authentication/Authorization inconsistencies
- Data validation coverage
- Component architecture issues
- Route protection gaps
- Performance concerns
- Code duplication and redundancy
- Missing features vs architecture spec

---

## PHASE 1: BACKEND-FRONTEND CONSISTENCY CHECK

### 1.1 Schema vs Type Audit

**Instructions**:
```
Compare each Prisma model in prisma/schema.prisma with:
1. TypeScript interfaces in lib/types.ts
2. Server Action return types
3. Component prop interfaces
4. Hook return types

For EACH mismatch found:
- Document the model name
- Document the field mismatch
- Document the affected files
- Rate severity (HIGH/MEDIUM/LOW)
- Suggest fix approach
```

**Checklist**:
- [ ] City model fields match frontend types
- [ ] Club model fields match frontend types
- [ ] Profile model fields match frontend types
- [ ] MembershipRequest model fields match frontend types
- [ ] Article model fields match frontend types
- [ ] ConsentRecord model fields match frontend types

### 1.2 Server Action Integration Audit

**Instructions**:
```
For EACH Server Action in app/actions/:
1. Verify it has proper input validation (Zod schemas)
2. Verify it handles auth/user retrieval errors
3. Verify it returns consistent types
4. Verify all callers use the correct signatures
5. Verify revalidatePath calls are appropriate
6. Verify error messages are user-friendly

For EACH component/hook that calls Server Actions:
1. Verify it imports the correct function
2. Verify it handles loading states
3. Verify it handles error states
4. Verify it handles empty/null data gracefully
```

---

## PHASE 2: TYPESCRIPT TYPE SAFETY AUDIT

### 2.1 Strict Mode Violations

**Check for**:
```typescript
// Patterns that bypass TypeScript safety
- any types (excluding explicit safety assertions)
- @ts-ignore comments
- @ts-expect-error without matching error
- Loose type assertions (as any)
- Implicit any parameters
- Missing return types
- Non-null assertions (!) without null checks
```

**Files to audit**:
- [ ] lib/types.ts - Master type definitions
- [ ] app/actions/*.ts - Server Actions return types
- [ ] components/*.tsx - Component prop types
- [ ] hooks/*.ts - Hook return types
- [ ] app/**/*.tsx - Page props and data fetching

### 2.2 Interface Mismatches

**Check for**:
```typescript
// Component expects different structure than Server Action returns
interface ClubCard {
  id: string;
  // ... fields
}

// Server Action returns different field names or types
async function getClubs() {
  return [{ id: number; /* wrong type */ }]; // BUG
}
```

**Instructions**:
```
1. For each Server Action, copy its return type
2. For each component consuming that action, extract expected type
3. Compare field-by-field
4. Document ALL mismatches with line numbers
```

---

## PHASE 3: ERROR HANDLING AUDIT

### 3.1 Server Action Error Handling

**Checklist**:
```typescript
// Verify EACH Server Action has:
[ ] try-catch wrapper
[ ] Specific error logging
[ ] User-friendly error messages
[ ] Proper return type for errors ({ success: false, message: string })
[ ] No empty catch blocks
[ ] No console.error without context
[ ] Error boundaries in UI for thrown errors
```

**Action to verify**:
- [ ] submitMembershipRequest
- [ ] getCurrentUserProfile
- [ ] updateUserProfile
- [ ] getClubs
- [ ] getClubBySlug
- [ ] approveClubMembershipRequest
- [ ] rejectClubMembershipRequest
- [ ] Any other app/actions/*.ts

### 3.2 Client-Side Error Boundaries

**Check**:
```typescript
// Verify error.tsx exists for:
[ ] Root layout error.tsx
[ ] /clubs route error.tsx
[ ] /blog route error.tsx
[ ] /dashboard routes error.tsx
[ ] /club-panel routes error.tsx

// Verify error.tsx files:
[ ] Export default function
[ ] Handle errors gracefully
[ ] Provide recovery options
[ ] Log errors appropriately
```

---

## PHASE 4: SECURITY AUDIT

### 4.1 Authentication Flow

**Checklist**:
```typescript
// Middleware (middleware.ts)
[ ] All protected routes are covered
[ ] Public routes don't accidentally expose auth state
[ ] Redirects go to appropriate login pages
[ ] Session refresh is handled
[ ] Token expiration is handled

// Supabase Integration
[ ] Server client created correctly (lib/supabase/server.ts)
[ ] Browser client created correctly (lib/supabase/client.ts)
[ ] Cookies are handled securely
[ ] No auth tokens in URLs
[ ] Session validation before sensitive operations
```

### 4.2 Authorization Checks

**Checklist**:
```typescript
// For EACH data-modifying Server Action:
[ ] Verify user is authenticated
[ ] Verify user has required role (if applicable)
[ ] Verify user owns resource (for updates/deletes)
[ ] Verify club admin can only modify their club
[ ] Verify no IDOR vulnerabilities

// Specific checks:
[ ] Profile can only be updated by owner
[ ] Membership requests can only be cancelled by requester
[ ] Club membership requests can only be approved by club admin
[ ] Admin routes check for ADMIN role
```

### 4.3 Data Exposure

**Checklist**:
```typescript
// Verify sensitive data is NOT exposed:
[ ] No PII in client-side props
[ ] No encryptedData exposed to client
[ ] No internal IDs leaked unnecessarily
[ ] Audit logs not accessible to regular users
[ ] Consent records only accessible to owner
```

---

## PHASE 5: SEO IMPLEMENTATION AUDIT

### 5.1 Metadata Coverage

**Checklist**:
```typescript
// Verify EACH public page has:
[ ] Dynamic generateMetadata() function
[ ] Proper title (unique, descriptive)
[ ] Proper meta description (150-160 chars)
[ ] OpenGraph tags (og:title, og:description, og:image)
[ ] Twitter cards (twitter:card)
[ ] Canonical URL
[ ] Robots directives if needed
[ ] JSON-LD structured data

// Pages to verify:
[ ] Home page (/)
[ ] Clubs list (/clubs)
[ ] Club detail pages (/clubs/[slug])
[ ] Blog list (/blog)
[ ] Article detail pages (/blog/[slug])
[ ] City-specific pages (if /clubs/[city] exists)
[ ] User dashboard (/dashboard/*)
[ ] Club panel (/club-panel/*)
```

### 5.2 JSON-LD Validation

**Checklist**:
```typescript
// Verify JSON-LD:
[ ] Valid JSON syntax (no trailing commas)
[ ] Uses application/ld+json script type
[ ] Correct schema.org types (LocalBusiness, BlogPosting, BreadcrumbList)
[ ] No hardcoded placeholder URLs
[ ] Images have proper dimensions in OG tags
[ ] Entity linking is correct
```

### 5.3 Performance & SEO

**Checklist**:
```typescript
// Verify:
[ ] generateStaticParams() for static pages
[ ] Incremental Static Regeneration (revalidate constants)
[ ] Dynamic routes marked dynamic if needed
[ ] Images have alt text
[ ] Proper heading hierarchy (h1, h2, h3...)
[ ] Semantic HTML tags (article, section, nav, etc.)
```

---

## PHASE 6: COMPONENT ARCHITECTURE AUDIT

### 6.1 Client vs Server Component Boundaries

**Checklist**:
```typescript
// Verify:
[ ] 'use client' only on components that need client features
[ ] Data fetching done in Server Components where possible
[ ] No Server Components importing Client Components unnecessarily
[ ] Client Components receive serialized props (no functions, no classes)
[ ] Event handlers properly defined in client scope
```

### 6.2 Prop Drilling Analysis

**Checklist**:
```typescript
// For deeply nested props:
[ ] Check if Context API should be used instead
[ ] Check if composition (children) would be better
[ ] Document prop chains > 3 levels deep
[ ] Identify refactoring opportunities
```

### 6.3 Component Reusability

**Checklist**:
```typescript
// Check for:
[ ] Duplicate UI patterns that should be shared components
[ ] Inconsistent prop naming conventions
[ ] Mixed styling approaches (inline vs CSS vs Tailwind)
[ ] Hardcoded strings that should use translation
[ ] Magic numbers that should be constants
```

---

## PHASE 7: DATA FLOW AUDIT

### 7.1 Fetch-Cache-Update Patterns

**Checklist**:
```typescript
// Verify:
[ ] Server Actions use proper caching strategy
[ ] revalidatePath called after mutations
[ ] Optimistic updates where appropriate
[ ] Loading states for all async operations
[ ] No waterfall data fetching (use Promise.all)
```

### 7.2 Form Handling

**Checklist**:
```typescript
// For EACH form:
[ ] Zod validation schema exists
[ ] Server Action handles validation errors gracefully
[ ] Form resets after successful submission
[ ] Loading state disables submit button
[ ] Error messages displayed near fields
[ ] Success feedback provided to user
```

### 7.3 Pagination & Filtering

**Checklist**:
```typescript
// For paginated/filtered views:
[ ] URL params reflect current filters
[ ] Back button preserves filter state
[ ] Empty states handled gracefully
[ ] Loading skeleton or spinner shown
[ ] Debounced search inputs
```

---

## PHASE 8: ROUTING & NAVIGATION AUDIT

### 8.1 Route Protection Matrix

**Create a table**:
| Route | Auth Required | Role Required | Public Access | Status |
|-------|---------------|--------------|--------------|--------|
| / | ❌/✅ | - | ✅ | CHECK |
| /clubs | ❌/✅ | - | ✅ | CHECK |
| /clubs/[slug] | ❌/✅ | - | ✅ | CHECK |
| /blog | ❌/✅ | - | ✅ | CHECK |
| /blog/[slug] | ❌/✅ | - | ✅ | CHECK |
| /dashboard | ❌/✅ | USER | ❌ | CHECK |
| /dashboard/requests | ❌/✅ | USER | ❌ | CHECK |
| /profile | ❌/✅ | USER | ❌ | CHECK |
| /club-panel/dashboard | ❌/✅ | CLUB_ADMIN | ❌ | CHECK |
| /club-panel/dashboard/profile | ❌/✅ | CLUB_ADMIN | ❌ | CHECK |
| /club-panel/dashboard/requests | ❌/✅ | CLUB_ADMIN | ❌ | CHECK |
| /admin | ❌/✅ | ADMIN | ❌ | CHECK |

### 8.2 Navigation Consistency

**Checklist**:
```typescript
// Verify:
[ ] Navbar shows correct links based on auth state
[ ] Redirects go to appropriate pages
[ ] 404 pages exist and are helpful
[ ] 403 for unauthorized access
[ ] Loading states during navigation
```

---

## PHASE 9: INTERNATIONALIZATION AUDIT

### 9.1 Translation Coverage

**Checklist**:
```typescript
// Verify:
[ ] All user-facing strings use translation (t() hook)
[ ] Translation files exist for all languages (en, es, ca, etc.)
[ ] No missing keys in translation files
[ ] Date/number formatting uses locale
[ ] Currency formatting for prices
```

### 9.2 Language Detection

**Checklist**:
```typescript
// Verify:
[ ] Language selector exists and works
[ ] Language preference persists
[ ] URL reflects language (/en/, /es/)
[ ] Server renders correct language
[ ] Fallback language works
```

---

## PHASE 10: PERFORMANCE AUDIT

### 10.1 Bundle Analysis

**Checklist**:
```typescript
// Verify:
[ ] No large unused dependencies
[ ] Dynamic imports for large components
[ ] Tree-shaking works (check .next/server)
[ ] Images optimized (next/image)
[ ] Fonts optimized (next/font)
```

### 10.2 Database Query Efficiency

**Checklist**:
```typescript
// Verify:
[ ] No N+1 queries (use include/eager loading)
[ ] Pagination with limit/offset or cursor
[ ] Appropriate indexes on filtered fields
[ ] No select * queries (only select needed fields)
[ ] Connection pooling configured correctly
```

---

## PHASE 11: CODE QUALITY AUDIT

### 11.1 Import Organization

**Checklist**:
```typescript
// Verify imports ordered correctly:
[ ] React imports first
[ ] Next.js imports second
[ ] External libraries third
[ ] @/lib imports fourth
[ ] @/components imports fifth
[ ] @/hooks imports sixth
[ ] Relative imports last
```

### 11.2 Naming Conventions

**Checklist**:
```typescript
// Verify:
[ ] Components: PascalCase
[ ] Hooks: camelCase with 'use' prefix
[ ] Variables: camelCase
[ ] Constants: SCREAMING_SNAKE_CASE
[ ] Types/Interfaces: PascalCase
[ ] Files: match exported name
```

### 11.3 Documentation

**Checklist**:
```typescript
// Verify:
[ ] Complex functions have JSDoc
[ ] Public APIs documented
[ ] README exists and is updated
[ ] AGENTS.md followed (if exists)
[ ] No commented-out code (except temporary debugging)
```

---

## PHASE 12: TESTING READINESS

### 12.1 Test Infrastructure

**Checklist**:
```typescript
// Verify:
[ ] Vitest configured (if using)
[ ] Test files exist for critical paths
[ ] Integration tests for API routes
[ ] E2E tests for critical user flows
[ ] Test coverage baseline established
```

### 12.2 Test Coverage by Feature

**Document coverage for**:
- [ ] User registration flow
- [ ] Login/logout flow
- [ ] Club listing and filtering
- [ ] Club detail page
- [ ] Membership request submission
- [ ] Membership request approval (admin)
- [ ] Article listing
- [ ] Article reading
- [ ] User profile editing
- [ ] Club admin profile editing

---

## PHASE 13: ENVIRONMENT & CONFIGURATION

### 13.1 Environment Variables

**Checklist**:
```typescript
// Verify:
[ ] All required env vars documented
[ ] NEXT_PUBLIC_ prefix for client vars
[ ] No secrets in NEXT_PUBLIC_* vars
[ ] .env.example exists with required vars
[ ] .env.local not committed
[ ] Build process uses correct env
```

### 13.2 Configuration Files

**Checklist**:
```typescript
// Verify:
[ ] tsconfig.json has strict mode
[ ] next.config.js optimized
[ ] tailwind.config.js complete
[ ] eslint config reasonable
[ ] prettier config aligned with lint
[ ] .gitignore excludes build artifacts
```

---

## OUTPUT FORMAT

Provide your report in this structure:

## 📋 CODEBASE AUDIT REPORT

### Executive Summary
- Total issues found
- Critical issues (blockers)
- High priority issues
- Medium priority issues
- Low priority issues

---

### 🔴 CRITICAL ISSUES (Must Fix Before Production)

| ID | Category | Location | Issue | Severity | Fix |
|----|----------|----------|-------|----------|------|
| CRIT-001 | Security | file.ts | Description | CRITICAL | Fix approach |

---

### 🟠 HIGH PRIORITY ISSUES

| ID | Category | Location | Issue | Severity | Fix |
|----|----------|----------|-------|----------|------|
| HIGH-001 | Type Safety | file.ts | Description | HIGH | Fix approach |

---

### 🟡 MEDIUM PRIORITY ISSUES

| ID | Category | Location | Issue | Severity | Fix |
|----|----------|----------|-------|----------|------|
| MED-001 | Performance | file.ts | Description | MEDIUM | Fix approach |

---

### 🟢 LOW PRIORITY ISSUES / IMPROVEMENTS

| ID | Category | Location | Issue | Severity | Suggestion |
|----|----------|----------|-------|----------|------------|
| LOW-001 | Code Quality | file.ts | Description | LOW | Suggestion |

---

### ✅ ALREADY CORRECT

| Category | Location | Notes |
|----------|----------|--------|
| Type Safety | lib/types.ts | Well-typed |

---

## RECOMMENDED ACTION PLAN

### Immediate (Before Next Commit)
1. Fix all CRITICAL issues
2. Fix all HIGH priority security issues
3. Fix all type safety blockers

### Short Term (This Sprint)
1. Fix remaining HIGH priority issues
2. Fix MEDIUM priority issues
3. Add missing error boundaries
4. Complete SEO metadata

### Medium Term (Next Phase)
1. Fix LOW priority issues
2. Improve test coverage
3. Performance optimizations
4. Code refactoring

---

## APPENDIX: FILES AUDITED

| Category | Files Count | Notes |
|----------|-------------|-------|
| Prisma Schema | 1 | prisma/schema.prisma |
| Server Actions | ~10 | app/actions/*.ts |
| Components | ~50 | components/**/*.tsx |
| Pages | ~30 | app/**/*.tsx |
| Hooks | ~10 | hooks/*.ts |
| Utils | ~10 | lib/*.ts |

---

## VERIFICATION CHECKLIST (For Auditor)

- [ ] All files in scope were examined
- [ ] All Server Actions were traced from definition to usage
- [ ] All types were cross-referenced
- [ ] All routes were tested for auth requirements
- [ ] All JSON-LD was validated (syntax check)
- [ ] All imports were verified
- [ ] All error paths were traced
- [ ] Build was attempted and issues documented

---

**End of Meta-Prompt**

---

## Usage

To use this meta-prompt:

```bash
# Run with Sisyphus
delegate_task(
  subagent_type="plan",
  prompt="Use the attached META-PROMPT to audit the codebase. Execute ALL 13 phases systematically. Return the complete audit report in the specified format."
)
```

Or for a more focused review:

```bash
delegate_task(
  subagent_type="oracle",
  prompt="Focus on Phase 4 (Security Audit) and Phase 5 (SEO Audit) of the attached meta-prompt. Provide detailed findings."
)
```
