# Cannabis Social Club Platform - Comprehensive Launch Plan

## TL;DR
> **Vision**: A privacy-first, compliance-focused discovery platform for Cannabis Social Clubs (CSCs) in Europe/USA.
> **Core Value**: "Request Invitation" model (no direct join) + "Safe" Map (neighborhood pins only) + Reputation Management.
> **Tech Stack**: Next.js 13 App Router, Supabase (Auth/DB/RLS), Tailwind, Shadcn.
> **Execution**: 5 Phases (Foundation → Auth → Dashboard → Map → SEO).

---

## Context & Vision

### The Problem
- **Legal**: CSCs cannot advertise publicly or allow open membership (especially in Spain/Germany).
- **Privacy**: Members don't want their exact location tracked.
- **Discovery**: Tourists/Locals struggle to find legitimate clubs without "knowing a guy".

### The Solution: "The LinkedIn of Cannabis"
- **Endorsement Loop**: Users request invites; Clubs review profiles/reputation before approving.
- **Vibe Taxonomy**: Search by "Co-working friendly", "Gaming", "Live Music" (SEO gold).
- **Privacy Shield**: Map shows *approximate* location (500m radius) until membership is approved.

### User Personas
1.  **The Local Connoisseur**: Wants a specific vibe (e.g., quiet work spot). Values privacy.
2.  **The Club Owner**: Needs to vet members to stay legal. Wants to reply to reviews to manage reputation.
3.  **The Tourist**: Needs a safe, verified place. Willing to provide ID/details for access.

---

## Work Objectives

### Core Objectives
1.  **Migrate to Real Backend**: Replace JSON mocks with Supabase (Postgres + Auth).
2.  **Implement Privacy Logic**: Server-side address masking.
3.  **Build "Endorsement" Flow**: Request -> Pending -> Approve/Reject.
4.  **Launch Programmatic SEO**: Generated pages for Neighborhoods + Vibes.

### Deliverables
- [ ] **Supabase Project**: Configured with RLS policies.
- [ ] **Auth System**: Login/Signup with Profile creation.
- [ ] **Club Dashboard**: Admin panel to manage requests.
- [ ] **Safe Map**: Component with fuzzed coordinates.
- [ ] **Public Directory**: SEO-optimized list views.

### Definition of Done
- [ ] All mock data removed.
- [ ] User can sign up, request club access, and see "Pending" status.
- [ ] Club Admin can approve request.
- [ ] Approved user sees *exact* address; unapproved sees *neighborhood*.
- [ ] Lighthouse Performance score > 90.

---

## Technical Architecture

### Database Schema (Supabase)

**`profiles`** (Public metadata)
- `id` (uuid, PK)
- `username` (text)
- `avatar_url` (text)
- `reputation_score` (int)
- `role` (enum: 'user', 'club_admin', 'super_admin')

**`clubs`** (The Entities)
- `id` (uuid, PK)
- `name` (text)
- `slug` (text, unique)
- `neighborhood` (text, public)
- `address` (text, PRIVATE - RLS protected)
- `coordinates` (point, PRIVATE - RLS protected)
- `fuzzed_coordinates` (point, PUBLIC)
- `vibe_tags` (text[])

**`membership_requests`** (The Logic)
- `id` (uuid)
- `user_id` (fk)
- `club_id` (fk)
- `status` (enum: 'pending', 'approved', 'rejected')
- `message` (text)
- `residency_proof` (boolean/url) - For Germany compliance
- `sponsor_name` (text) - For Spain compliance

### RLS Policies (Critical)
- **Clubs**: Everyone can select `name`, `neighborhood`, `fuzzed_coordinates`. ONLY `status='approved'` members can select `address`, `coordinates`.
- **Requests**: Users can see their own. Club Admins can see requests for their club.

---

## Verification Strategy

### Automated Verification
- **API/Backend**: `curl` tests to verify RLS policies (ensure address is null for unauthenticated).
- **Frontend**: Playwright tests for the Request Flow (Click Request -> Check Toast -> Check Dashboard).
- **SEO**: Script to crawl `sitemap.xml` and verify meta tags.

### Manual Verification (User)
- Club Owner dashboard usability (accepting requests).

---

## Task Dependency Graph

| Task | Depends On | Reason |
|------|------------|--------|
| **1.1 Supabase Init** | None | Foundation for all data |
| **1.2 Schema Setup** | 1.1 | Defines data structure |
| **1.3 Type Gen** | 1.2 | TypeScript needs types to compile |
| **2.1 Auth UI** | 1.1 | Users need to log in to request |
| **2.2 Profile Page** | 2.1 | Users need identity |
| **3.1 Club Page (Real)** | 1.3 | Needs real data to render |
| **3.2 Map Privacy** | 3.1 | Needs real coordinates to fuzz |
| **4.1 Request Logic** | 2.1, 3.1 | Connects Users to Clubs |
| **4.2 Admin Dashboard** | 4.1 | Needs requests to manage |

---

## Parallel Execution Graph

**Wave 1: Foundation (Backend & Types)**
├── Task 1.1: Supabase Setup & Env Vars
└── Task 1.2: Database Migration & Seed Data

**Wave 2: Core Features (Frontend Parallelism)**
├── Task 2.1: Auth Implementation (Login/Signup) (Depends: 1.1)
├── Task 3.1: Public Directory & Club Pages (Depends: 1.3)
└── Task 5.1: SEO Config (Sitemap/Metadata) (Independent)

**Wave 3: Logic & Interaction**
├── Task 4.1: Membership Request API (Depends: 2.1, 3.1)
├── Task 3.2: Privacy Map Implementation (Depends: 3.1)
├── Task 2.2: User Profile Management (Depends: 2.1)
└── Task 4.3: Content Moderation System (Depends: 2.1)

**Wave 4: Admin & Polish**
└── Task 4.2: Club Admin Dashboard (Depends: 4.1)

---

## Tasks

### Phase 1: Foundation (Data Layer)

#### Task 1.1: Supabase Initialization
**Description**: Set up the Supabase client, environment variables, and verify connection.
**Delegation**:
- Category: `typescript-programmer`
- Skills: [`typescript-programmer`]
**Steps**:
1. Install `@supabase/supabase-js` `@supabase/ssr`.
2. Create `lib/supabase/client.ts` and `server.ts`.
3. Add `.env.local` variables (placeholders).
**Verification**: `bun run dev` -> console logs Supabase client init success.

#### Task 1.2: Database Schema & Migration
**Description**: Apply the detailed SQL schema for profiles, clubs, and requests.
**Delegation**:
- Category: `ultrabrain`
- Skills: [`typescript-programmer`] (for migration scripts)
**Steps**:
1. Create `supabase/migrations/0000_init.sql`.
2. Define tables: `profiles`, `clubs`, `membership_requests`.
3. **CRITICAL**: Define RLS policies.
   - `clubs`: Public read for non-sensitive fields.
   - `profiles`: Public read, update own.
4. Run migration (simulated or real if creds provided).
**Verification**: Check table existence in Supabase dashboard (or mock verification).

### Phase 2: Authentication & Identity

#### Task 2.1: Auth Integration
**Description**: Connect the existing Login/Signup UI to Supabase Auth.
**Delegation**:
- Category: `typescript-programmer`
- Skills: [`typescript-programmer`, `frontend-ui-ux`]
**Steps**:
1. Update `app/club-panel/login/page.tsx` to use `supabase.auth.signInWithPassword`.
2. Update `app/club-panel/signup/page.tsx` to use `supabase.auth.signUp`.
3. Create `middleware.ts` to protect `/dashboard` routes.
**Verification**: Playwright: User fills login form -> redirected to dashboard.

#### Task 2.2: Profile Management
**Description**: Allow users to edit their profile (Avatar, Bio) to improve "Endorsement" chances.
**Delegation**:
- Category: `frontend-ui-ux`
- Skills: [`frontend-ui-ux`, `typescript-programmer`]
**Steps**:
1. Build `app/profile/settings/page.tsx` form.
2. Connect to `profiles` table.
3. Handle avatar upload (Supabase Storage).
**Verification**: Update bio -> Refresh -> Bio persists.

### Phase 3: Discovery & Privacy

#### Task 3.1: Public Directory (Real Data)
**Description**: refactor `useClubs` hook to fetch from Supabase instead of JSON.
**Delegation**:
- Category: `typescript-programmer`
- Skills: [`typescript-programmer`]
**Steps**:
1. Rewrite `hooks/useClubs.ts`.
2. Implement server-side fetching in `app/clubs/page.tsx` (move logic to server components).
3. Ensure types match `database.types.ts`.
**Verification**: Page loads with data from DB (or seeded data).

#### Task 3.2: Safe Map Implementation
**Description**: Implement the "Fuzzed Location" logic.
**Delegation**:
- Category: `ultrabrain`
- Skills: [`typescript-programmer`]
**Steps**:
1. Backend: Create Postgres function `fuzz_coordinates(lat, lng, radius_meters)`.
2. Frontend: Update `InteractiveHeroMap.tsx` to accept coordinates.
3. Logic: If `user.membership.status !== 'active'`, show fuzzed. Else, show real.
**Verification**: Inspect network request -> Ensure exact coords NOT sent for anon user.

### Phase 4: The Connection Layer

#### Task 4.1: Request Flow API
**Description**: The core business logic. "Request Invitation" button.
**Delegation**:
- Category: `typescript-programmer`
- Skills: [`typescript-programmer`]
**Steps**:
1. Create Server Action `requestMembership(clubId)`.
2. Insert into `membership_requests`.
3. Handle "Already requested" state (UI disable).
**Verification**: Click "Request" -> Database row created with status 'pending'.

#### Task 4.2: Club Admin Dashboard
**Description**: Admin view to Accept/Reject requests.
**Delegation**:
- Category: `frontend-ui-ux`
- Skills: [`frontend-ui-ux`, `typescript-programmer`]
**Steps**:
1. Create `app/club-panel/dashboard/requests/page.tsx`.
2. List `pending` requests (include Residency/Sponsor info).
3. Add "Approve" / "Reject" buttons (Server Actions).
**Verification**: Admin clicks "Approve" -> User status changes in DB.

#### Task 4.3: Content Moderation System
**Description**: Implement Regex filtering for reviews to block commercial terms.
**Delegation**:
- Category: `typescript-programmer`
- Skills: [`typescript-programmer`]
**Steps**:
1. Create `lib/moderation.ts`.
2. Implement regex: `/\b(price|cost|euro|€|gram|gr|deal|sale|buy|sell|menu)\b/gi`.
3. Add Zod validation to Review submission form to reject these terms.
**Verification**: Try to submit review "Great price for 5 grams" -> Error "Transactional language not allowed".

### Phase 5: SEO & Polish

#### Task 5.1: Programmatic SEO
**Description**: Generate sitemaps and metadata for every club and neighborhood.
**Delegation**:
- Category: `writing`
- Skills: [`typescript-programmer`]
**Steps**:
1. Create `app/sitemap.ts`.
2. Implement `generateMetadata` in `app/clubs/[slug]/page.tsx`.
3. Create taxonomy pages `app/neighborhood/[slug]/page.tsx`.
**Verification**: `curl HEAD` -> Check title/description tags.

---

## Commit Strategy
- **Prefixes**: `feat:` (new feature), `fix:` (bug fix), `refactor:` (code change), `chore:` (setup).
- **Scope**: `feat(auth):`, `feat(map):`.
- **Atomic**: One task = One PR/Commit.

## Success Criteria
1.  **Privacy**: Exact coordinates NEVER leak to unauthorized users.
2.  **Compliance**: No "Buy Now" buttons; only "Request Access".
3.  **Performance**: Map loads in < 1s.
4.  **SEO**: "Cannabis Club Gràcia" ranks for neighborhood pages.
