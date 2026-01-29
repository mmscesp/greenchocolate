# Frontend Architecture & Implementation Plan

## 1. Directory Structure (Refined)

```
app/
├── (public)/               # Layout with Navbar/Footer
│   ├── page.tsx            # Landing Page
│   ├── clubs/
│   │   ├── page.tsx        # Directory (Search/Filter)
│   │   └── [slug]/         # Club Profile (Public View)
│   ├── blog/               # SEO Content Hub
│   └── about/              # Static Pages
├── (auth)/                 # Auth Layout (Centered Card)
│   ├── login/
│   └── register/
├── (protected)/            # Layout with Sidebar + Auth Guard
│   ├── dashboard/          # User Dashboard
│   ├── profile/            # User Settings
│   └── my-requests/        # User's Endorsements
└── (admin)/                # Layout with Admin Sidebar
    ├── club-panel/         # Club Owner Dashboard
    └── analytics/          # Data Viz
```

## 2. Technical Stack
*   **Framework:** Next.js 13.5+ (App Router).
*   **State Management:**
    *   `Zustand` for complex client state (e.g., Active Filters, Map State).
    *   `React Context` for global, static state (Theme, Language, Auth Session).
    *   `TanStack Query` (React Query) for data fetching/caching (replacing current `setTimeout` mocks).
*   **Forms:** `React Hook Form` + `Zod` (Strict validation schemas).
*   **Internationalization:** Keep existing `useLanguage` but refactor to support Server Components (passing `lang` prop or using middleware).

## 3. Key Implementation Patterns

### 3.1 The "Container/Presenter" Pattern
*   **Server Component (Container):** Fetches data directly via Prisma.
*   **Client Component (Presenter):** Receives data as props, handles interactivity (Maps, Filters).
*   *Why?* Maximizes SEO (SSR) while allowing rich UI.

### 3.2 The "Map/List" Sync
*   **State:** `useClubStore` (Zustand) holds `filteredClubs`.
*   **Component:** `<ClubMap />` and `<ClubList />` both subscribe to `useClubStore`.
*   **Interaction:** Hovering a card in List highlights the pin in Map.

### 3.3 Programmatic SEO (SSG)
*   **Function:** `generateStaticParams()` in `app/clubs/[slug]/page.tsx` and `app/landing/[neighborhood]/page.tsx`.
*   **Build Time:** Pre-renders top 100 pages.
*   **ISR:** Revalidates every 24h (`revalidate: 86400`).

## 4. Asset Optimization
*   **Images:** Use `next/image` with `Supabase Image Transformations` (Resize/WebP) to avoid client-side heavy lifting.
*   **Fonts:** `next/font` (Google Fonts) pre-loaded.

## 5. Migration Strategy (From Current Codebase)
1.  **Refactor Hooks:** Move logic from `useClubs` (mock) to Server Actions (`actions/getClubs.ts`).
2.  **Consolidate UI:** Move all Shadcn components to `components/ui` (already done, just verify).
3.  **Implement Auth:** Wrap root layout with `SessionProvider`.
