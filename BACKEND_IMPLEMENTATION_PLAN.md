# 🛠️ MASTER BACKEND IMPLEMENTATION PLAN
## Cannabis Social Club Platform - MVP Launch

**Status:** Ready for Execution  
**Goal:** Transform frontend prototype into production-ready full-stack app  
**Strategy:** "City-First" Architecture + SEO Engine + Simplified Security

---

## 🌊 WAVE 1: THE FOUNDATION (Environment & Schema)
**Goal:** A working Next.js 14 environment connected to a live Supabase database with the correct schema.

### 1.1 Dependency & Environment Upgrade
- [ ] **Upgrade Next.js**: Update to latest stable v14 (ensure `app/` router stability).
- [ ] **Install Core Libs**:
  - `prisma`: ORM
  - `@prisma/client`: Database client
  - `@supabase/ssr`: Server-side Auth
  - `zod`: Validation
  - `bcrypt`: Password hashing (if needed for seeding)
- [ ] **Configure `.env`**: Create `.env.local` template with:
  - `DATABASE_URL` (Transaction pooler)
  - `DIRECT_URL` (Migration connection)
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `APP_MASTER_KEY` (AES-256)

### 1.2 Database Initialization
- [ ] **Initialize Prisma**: `npx prisma init`
- [ ] **Apply Master Schema**: Copy the "City-First" schema to `prisma/schema.prisma`.
  - Ensure `City`, `Club`, `Article`, `Profile` models are exact.
- [ ] **Migration 001**: Run `npx prisma migrate dev --name init_mvp` to create tables in Supabase.
- [ ] **Generate Client**: `npx prisma generate`.

### 1.3 Seeding Strategy
- [ ] **Create `prisma/seed.ts`**:
  - **Cities**: Madrid (lat/lng, desc), Barcelona.
  - **Clubs**: Import 8 dummy clubs from JSON, map to new schema.
  - **Articles**: Import 10 dummy articles, link to categories/cities.
  - **Admin User**: Create 1 bootstrap admin profile.
- [ ] **Run Seed**: `npx prisma db seed`.

---

## 🌊 WAVE 2: AUTHENTICATION & SECURITY
**Goal:** Secure user management, session handling, and PII protection.

### 2.1 Supabase Auth Integration
- [ ] **Supabase Client**: Create `lib/supabase/server.ts` and `client.ts` using `@supabase/ssr`.
- [ ] **Middleware**: Create `middleware.ts` to:
  - Refresh auth sessions.
  - Protect `/dashboard`, `/profile`, `/admin`.
  - Redirect unauthenticated users.

### 2.2 User Profile Automation
- [ ] **Database Trigger**: Write SQL function in Supabase Dashboard (or migration) to auto-create a `Profile` row in `public` schema whenever a user signs up in `auth.users`.

### 2.3 Encryption Service (Simplified)
- [ ] **Encryption Utility**: Create `lib/encryption.ts`.
  - Implement `encryptPII(data: object): string`.
  - Implement `decryptPII(encryptedString): object`.
  - Use `aes-256-gcm` with the `APP_MASTER_KEY`.

### 2.4 Auth Server Actions
- [ ] **`app/actions/auth.ts`**:
  - `signUp(formData)`: Auth + Encrypt PII + Update Profile + Record Consent.
  - `login(formData)`: Standard Supabase login.
  - `signOut()`: Clear session.
- [ ] **UI Integration**: Connect `app/club-panel/login` and `signup` pages to these actions.

---

## 🌊 WAVE 3: DATA ENGINE (Clubs & Cities)
**Goal:** Replace mock hooks with real database data, optimized for SEO.

### 3.1 Data Access Layer
- [ ] **`app/actions/clubs.ts`**:
  - `getClubs(filters)`: Fetch from Prisma with filters (city, amenities).
  - `getClubBySlug(slug)`: Fetch single club with City relation.
- [ ] **`app/actions/cities.ts`**:
  - `getCityBySlug(slug)`: Fetch city details + club count.

### 3.2 Frontend Integration
- [ ] **City Pages (`app/clubs/[city]/page.tsx`)**:
  - Implement `generateMetadata` for dynamic SEO titles.
  - Use `getCityBySlug` to render city description.
  - Grid view of clubs in that city.
- [ ] **Club Pages (`app/clubs/[slug]/page.tsx`)**:
  - Update `generateStaticParams` to fetch from DB.
  - Replace JSON data with `getClubBySlug`.
  - Add JSON-LD schema (LocalBusiness).

---

## 🌊 WAVE 4: THE CONTENT ENGINE (Blog & SEO)
**Goal:** Launch the article system to drive traffic.

### 4.1 Article Architecture
- [ ] **`app/actions/articles.ts`**:
  - `getArticles(category, city)`: Filterable list.
  - `getArticleBySlug(slug)`: Detailed view.
- [ ] **Entity Linking**: Ensure articles can link to a related `Club` or `City`.

### 4.2 Blog Pages
- [ ] **Listing (`app/blog/page.tsx`)**: Connect to `getArticles`.
- [ ] **Detail (`app/blog/[slug]/page.tsx`)**:
  - `generateMetadata`: Title, desc, OG image.
  - **Schema.org**: Implement `BlogPosting` JSON-LD with "mentions" (linking to Club entity).
  - Markdown renderer (simple) for content.

---

## 🌊 WAVE 5: MEMBERSHIP & USER VALUE
**Goal:** The core business utility - users applying to clubs.

### 5.1 Membership Actions
- [ ] **`app/actions/membership.ts`**:
  - `submitRequest(clubId)`: Create request + Encrypt legal snapshot.
  - `getUserRequests()`: Fetch status for user dashboard.
  - `cancelRequest(id)`: Allow user cancellation.

### 5.2 Dashboard UI
- [ ] **User Dashboard (`app/dashboard`)**:
  - Show list of active requests.
  - Show status badges (Pending, Approved).

### 5.3 Admin Actions (Basic)
- [ ] **`app/actions/admin.ts`**:
  - `getPendingRequests()`: For club owners.
  - `approveRequest(id)`, `rejectRequest(id)`.

---

## 🌊 WAVE 6: POLISH & LAUNCH
**Goal:** Final verification and production build.

### 6.1 SEO Verification
- [ ] **Sitemap**: Create `app/sitemap.ts` to generate dynamic XML for all cities, clubs, and articles.
- [ ] **Robots**: Create `app/robots.ts`.
- [ ] **Canonical Tags**: Verify all pages have self-referencing canonicals.

### 6.2 Performance Tuning
- [ ] **ISR Configuration**: Ensure `revalidate` segments are set (e.g., 3600s for clubs).
- [ ] **Image Optimization**: Verify `next/image` usage with Supabase storage domains.

### 6.3 Final Test
- [ ] **End-to-End Flow**:
  1. User lands on Madrid city page.
  2. Reads article about "Top Clubs".
  3. Clicks specific club.
  4. Signs up (PII encrypted).
  5. Requests membership.
  6. Admin approves.
  7. User sees "Approved".

---

## 🛠️ FILE TARGETS

| File Path | Purpose |
|-----------|---------|
| `prisma/schema.prisma` | The Source of Truth |
| `lib/supabase/server.ts` | Auth Client |
| `app/actions/*.ts` | The Backend Logic |
| `middleware.ts` | Security Gatekeeper |
| `app/clubs/[city]/page.tsx` | SEO Landing Page |
| `app/sitemap.ts` | Crawler Map |

---

## 📝 EXECUTION RULES

1. **No Mock Data Left Behind**: By Wave 3, `hooks/useClubs.ts` should be deleted or completely rewritten to use Server Actions.
2. **Type Safety**: All actions must return typed responses (e.g., `Promise<ActionState<Club>>`).
3. **Error Handling**: Use `try/catch` in Server Actions and return standard error objects.
4. **Mobile First**: Verify layouts on mobile after real data integration.
