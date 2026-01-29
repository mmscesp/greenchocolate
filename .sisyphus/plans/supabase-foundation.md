# Plan: Phase 1 Foundation - Initialize Supabase & Define Schema

## Context
The project requires transitioning from JSON mocks to a real Supabase backend. We need to set up the infrastructure (clients, schema, migration) without connecting to a live database yet. This involves defining the data model in Prisma, creating the SQL migration manually (including RLS policies), and configuring the Supabase clients for Next.js.

## Task Dependency Graph

| Task | Depends On | Reason |
|------|------------|--------|
| Task 1 (Install Deps) | None | Required for all other tasks |
| Task 2 (Supabase Clients) | Task 1 | Needs `@supabase/ssr` package |
| Task 3 (Prisma Schema) | Task 1 | Needs `prisma` CLI and types |
| Task 4 (Migration SQL) | Task 3 | Needs to match the defined Schema |

## Parallel Execution Graph

Wave 1 (Start Immediately):
├── Task 1: Install Dependencies
└── Task 3: Define Prisma Schema (Can start drafting schema while deps install)

Wave 2 (After Wave 1):
├── Task 2: Create Supabase Clients (Depends on Task 1)
└── Task 4: Create Migration SQL (Depends on Task 3)

Critical Path: Task 1 → Task 3 → Task 4

## Tasks

### Task 1: Install Dependencies
**Description**: Install the required Supabase and Prisma packages.
**Delegation Recommendation**:
- Category: `quick` - Simple command execution.
- Skills: [`git-master`] - For committing changes.
**Skills Evaluation**:
- INCLUDED `git-master`: Standard for any change.
- OMITTED `typescript-programmer`: Not writing code, just installing.
**Depends On**: None
**Acceptance Criteria**:
- [ ] `package.json` contains: `@supabase/supabase-js`, `@supabase/ssr`, `prisma`, `@prisma/client`.
- [ ] `npm install` runs successfully.

### Task 2: Initialize Supabase Clients
**Description**: Create the Supabase client utilities for Browser and Server environments.
**Delegation Recommendation**:
- Category: `unspecified-low` - Boilerplate code but needs accuracy.
- Skills: [`typescript-programmer`] - Writing TS files.
**Skills Evaluation**:
- INCLUDED `typescript-programmer`: Essential for type-safe client creation.
**Depends On**: Task 1
**References**:
- Supabase SSR Docs: Standard patterns for Next.js App Router.
**Acceptance Criteria**:
- [ ] `lib/supabase/client.ts` created (Browser client).
- [ ] `lib/supabase/server.ts` created (Server Actions client).
- [ ] Uses `process.env.NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Task 3: Define Prisma Schema
**Description**: Create `prisma/schema.prisma` reflecting the `BACKEND_ARCH.md`.
**Delegation Recommendation**:
- Category: `ultrabrain` - Schema design requires precision.
- Skills: [`typescript-programmer`] - Prisma is typed.
**Skills Evaluation**:
- INCLUDED `typescript-programmer`: For Prisma schema syntax and relation types.
**Depends On**: Task 1
**References**:
- `BACKEND_ARCH.md`: Section 2.1 (Core Tables).
- `SECURITY.md`: Encryption columns.
**Acceptance Criteria**:
- [ ] `prisma/schema.prisma` created.
- [ ] Enums defined: `Role`, `Tier`, `MembershipStatus`.
- [ ] Tables defined: `Profile`, `Club`, `MembershipRequest`, `Review`, `UserPrivateData`.
- [ ] `UserPrivateData` contains `enc_full_name`, `enc_dob`, `enc_phone`.
- [ ] `Club` table includes `ownerId` (UUID) relation to `Profile` or direct UUID.
- [ ] Relations correctly mapped (e.g., Profile 1:1 UserPrivateData).

### Task 4: Create Initial Migration SQL
**Description**: Manually create the SQL file for the initial migration, including RLS policies.
**Delegation Recommendation**:
- Category: `ultrabrain` - Complex SQL writing with RLS logic.
- Skills: [`typescript-programmer`] - (Proxy for SQL/Backend logic).
**Skills Evaluation**:
- INCLUDED `typescript-programmer`: General backend competence.
**Depends On**: Task 3
**References**:
- `BACKEND_ARCH.md`: Section 2.2 (RLS Policies).
**Acceptance Criteria**:
- [ ] File created: `prisma/migrations/0_init/migration.sql`.
- [ ] Includes `CREATE EXTENSION IF NOT EXISTS "postgis";`.
- [ ] Includes `CREATE TABLE` statements for all tables.
- [ ] Includes `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` for all tables.
- [ ] Includes `CREATE POLICY` statements matching `BACKEND_ARCH.md`.
    - Profile: Public Read, Update own.
    - UserPrivateData: Select/Update own ONLY.
    - Club: Public read.
    - MembershipRequest: Insert own, Select own or club owner.

## Commit Strategy
- After Task 1: `chore(deps): install supabase and prisma`
- After Task 2: `feat(supabase): add client and server utilities`
- After Task 3: `feat(db): define prisma schema`
- After Task 4: `feat(db): add initial migration with RLS`

## Success Criteria
- [ ] All specified files exist.
- [ ] Schema matches Architecture document.
- [ ] RLS policies are present in the SQL file.
- [ ] No database connection is attempted (dry run only).
