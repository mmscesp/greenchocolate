# Product Requirements Document (PRD)
## Cannabis Social Club Platform (Spain)

**Version:** 1.0 (God Level)
**Status:** Draft
**Target Markets:** Spain (Primary), UK, FR, DE, IT, USA (Secondary)

---

## 1. Executive Summary

### 1.1 The Vision
To build the definitive digital infrastructure for the Cannabis Social Club (CSC) ecosystem in Spain. We are not just a directory; we are a **privacy-first connection engine** that bridges the gap between responsible adult consumers and verified, compliant social clubs.

We operate in the "Grey Area" by strictly adhering to the "Closed Circle" doctrine: **No public sign-ups, no direct sales, no advertising.** Instead, we facilitate "Endorsement Requests" and "Information Discovery."

### 1.2 Core Value Proposition
*   **For Users:** A safe, curated path to finding high-quality clubs without fear of scams or tourist traps.
*   **For Clubs:** A verified stream of pre-vetted potential members and a suite of free reputation management tools.
*   **For the Industry:** Elevating the standard of operation through transparency (where legal) and education.

### 1.3 Strategic Pillars
1.  **Privacy & Sovereignty:** Complete separation of Marketing (Public) and Member (Private) data. Application-Level Encryption for all PII.
2.  **SEO Dominance:** Programmatic content generation based on "Vibe" taxonomy (e.g., "Remote Work Friendly", "Live Jazz") to capture long-tail search traffic.
3.  **Community-First:** Gamified "Passport" system and "Local Guide" tiers to drive high-quality UGC (User Generated Content).

---

## 2. User Personas

### 2.1 The "Local Connoisseur" (Power User)
*   **Profile:** Resident in Barcelona/Madrid, experienced, values quality and atmosphere.
*   **Needs:** Wants to find specific strains/genetics or amenities (e.g., "Volcano Vaporizer", "Pool Table").
*   **Behavior:** Reviews clubs critically, keeps a "collection" of memberships.
*   **Platform Goal:** Convert into a "Local Guide" to drive trusted reviews.

### 2.2 The "Informed Tourist" (Volume Driver)
*   **Profile:** Visiting Spain, wants to consume legally and safely. Afraid of street dealers.
*   **Needs:** Clear instructions on *how* to join, assurance of safety, and proximity to their hotel.
*   **Behavior:** High intent, low retention (one-off use).
*   **Platform Goal:** Capture via "Near Me" SEO and convert to a "Membership Request."

### 2.3 The "Club President" (B2B User)
*   **Profile:** Operates a licensed CSC. Paranoid about police/legal issues.
*   **Needs:** Control over their online image, ability to filter "bad" applicants, and insights into their traffic.
*   **Behavior:** Will only claim a profile if it feels "safe" and offers tangible value (e.g., review management).
*   **Platform Goal:** Onboard as a verified partner to manage their own data.

---

## 3. Functional Requirements

### 3.1 Directory & Discovery (Public)
*   **Smart Search:** Filter by City, Neighborhood (e.g., "El Born"), Amenities (WiFi, PS5), and Vibe Tags.
*   **"Safe" Map:**
    *   **Unregistered Users:** Approximate location circles (randomized ~200m radius).
    *   **Registered Users:** Exact location pins (only after "Endorsement").
*   **Club Profiles:**
    *   Gallery (10 photos max).
    *   "Vibe" Meter (Quiet vs. Party).
    *   Amenities List.
    *   **NO** Menu/Price List (Compliance).

### 3.2 The "Endorsement Loop" (Membership Flow)
*   **Concept:** Replaces "Sign Up" with "Request Invitation/Endorsement."
*   **Flow:**
    1.  User fills out "Pre-Registration" form (Name, Age, Nationality, Smoking Habits).
    2.  System generates a secure, encrypted "Request Card."
    3.  Club Admin receives the request (anonymized initially).
    4.  Club Admin "Invites" the user -> User receives exact address + appointment slot.
*   **Compliance:** technically creates a "sponsorship" trail required by law.

### 3.3 User Accounts & Community
*   **Digital Passport:** Visual log of visited clubs. "Stamps" added after a verified visit (via QR scan at reception - Phase 2).
*   **Review System:**
    *   **Content Filter:** Auto-rejects prohibited terms: "Buy", "Sell", "Price", "Grams", "Deal".
    *   **Sentiment Analysis:** Highlights "Service", "Quality", "Vibe".
    *   **Tiers:** "Novice" -> "Member" -> "Connoisseur" -> "Local Legend" (based on review count/quality).

### 3.4 Club Dashboard (B2B)
*   **Claim Flow:** Verification via official club email or phone verification.
*   **Inbox:** Manage incoming Membership Requests (Accept/Deny/Schedule).
*   **Reputation:** View and Reply to reviews (replies are public).
*   **Analytics:** "Profile Views", "Request Conversion Rate", "Top Nationalities of Applicants."

---

## 4. Technical Architecture

### 4.1 Frontend (The "Head")
*   **Framework:** Next.js 13 (App Router).
*   **Hosting:** Vercel (Global Edge Network).
*   **UI Library:** Shadcn/ui + Tailwind CSS + Lucide Icons.
*   **Maps:** Mapbox GL JS or Leaflet (OpenStreetMap) for cost efficiency + custom styling.

### 4.2 Backend (The "Body")
*   **Platform:** Supabase (BaaS).
*   **Database:** PostgreSQL.
*   **Auth:** Supabase Auth (Email/Password + Social Providers).
*   **ORM:** Prisma (for type-safe database interactions).
*   **Storage:** Supabase Storage (for Club Images/User Avatars).

### 4.3 Security (The "Shield")
*   **Application-Level Encryption (ALE):** Sensitive PII (Name, Phone, Email) encrypted *before* reaching the database using `pgcrypto` or app-side AES.
*   **Row Level Security (RLS):** Strict policies ensuring Users can only read their own data and Clubs can only read requests targeting them.
*   **Data Isolation:** Marketing site (public) is logically separated from the User Dashboard (private).

---

## 5. SEO Strategy (The "Moat")

### 5.1 Programmatic SEO
*   **Structure:** `/{city}/{neighborhood}/{vibe}-cannabis-clubs`
    *   *Example:* `/barcelona/gracia/quiet-working-cannabis-clubs`
*   **Implementation:** Next.js `generateStaticParams` to build thousands of static landing pages based on database permutations.

### 5.2 Content Strategy
*   **Blog:** "Education First" content.
    *   *Topics:* "Legal Limits in Spain", "How to Join a Club Safely", "Cannabis Culture in Catalonia."
*   **Schema.org:**
    *   `LocalBusiness` schema for Clubs (with obfuscated address for non-members).
    *   `FAQPage` schema for "How to Join" articles.

---

## 6. Phased Rollout

### Phase 1: Foundation & SEO (Weeks 1-4)
*   **Goal:** Visibility & Traffic.
*   **Features:** Directory (Read-only), Programmatic SEO Pages, Blog, Static Map.
*   **Data:** Seeded with top 50 clubs in BCN (Manual curation).

### Phase 2: User Logic & Auth (Weeks 5-8)
*   **Goal:** Retention & Data Collection.
*   **Features:** User Signup/Login, "Saved Clubs", "Review" submission (Held for moderation).
*   **Security:** Encryption implementation.

### Phase 3: The "Connection" Layer (Weeks 9-12)
*   **Goal:** Conversion.
*   **Features:** "Request Invitation" Flow, Club Claiming Process, Basic Club Dashboard.

### Phase 4: Monetization Prep (Month 4+)
*   **Goal:** B2B Value.
*   **Features:** Premium Club Tiers (Featured Listing), Advanced Analytics, CRM Integration.
