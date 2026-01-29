# Master Work Plan (Phased Implementation)

## Phase 1: Foundation & Data Layer (Weeks 1-2)
**Goal:** Build the secure "Vault" (Database) and the "Face" (Public Directory).

*   [ ] **Task 1.1: Project Hygiene**
    *   Clean up `app/` folder (Remove unused templates).
    *   Install `prisma`, `@prisma/client`, `supabase-js`.
    *   Configure `tsconfig` for strict paths.
*   [ ] **Task 1.2: Database & Schema**
    *   Initialize Supabase Project.
    *   Define Prisma Schema (`schema.prisma`) matching `BACKEND_ARCH.md`.
    *   Run Migrations.
    *   Seed DB with `data/dummy-clubs.json` (Migrate from JSON to Postgres).
*   [ ] **Task 1.3: Core Directory (Public)**
    *   Implement `actions/getClubs.ts` (Prisma).
    *   Refactor `ClubCard` and `ClubGrid` to use real data.
    *   Implement Filter Logic (Server-side filtering via URL params).
*   [ ] **Task 1.4: SEO Engine**
    *   Implement `generateStaticParams` for Club Detail pages.
    *   Create `sitemap.ts` and `robots.ts`.

## Phase 2: Auth & Security (Weeks 3-4)
**Goal:** Secure the platform and enable User Accounts.

*   [ ] **Task 2.1: Supabase Auth**
    *   Setup Google & Email Auth.
    *   Create Auth Middleware (Protect `/dashboard` routes).
*   [ ] **Task 2.2: Encryption Middleware**
    *   Create `lib/encryption.ts` (AES-256 logic).
    *   Implement Registration Flow (Encrypt PII before saving).
*   [ ] **Task 2.3: User Dashboard**
    *   Create `app/(protected)/dashboard`.
    *   Display User Profile (Decrypt on load).

## Phase 3: The Connection Engine (Weeks 5-6)
**Goal:** Connect Users to Clubs.

*   [ ] **Task 3.1: Membership Request Flow**
    *   Create `MembershipWizard` component (Stepper).
    *   Implement `actions/submitRequest.ts`.
*   [ ] **Task 3.2: Club Admin Panel**
    *   Create `app/(admin)/club-panel`.
    *   Implement "Kanban Board" for Requests (Pending -> Approved).
*   [ ] **Task 3.3: Map Logic**
    *   Implement "Approximate Circle" logic for public map.
    *   Implement "Exact Pin" logic for approved members.

## Phase 4: Polish & Launch (Week 7)
*   [ ] **Task 4.1: I18n Refactor**
    *   Ensure all Server Components respect `lang` param.
*   [ ] **Task 4.2: Performance**
    *   Optimize Images.
    *   Audit Bundle Size.
*   [ ] **Task 4.3: Final Security Audit**
    *   Pen-test RLS policies.
    *   Verify Encryption flows.
