# System Architecture (Enterprise Grade)

## 1. High-Level Architecture Diagram
*   **Edge Layer (Vercel):** Global CDN, DDoS Protection, Geo-Fencing (Middleware).
*   **Compute Layer (Serverless):** Next.js App Router (Node.js 18.x Runtime).
*   **Data Layer (Supabase):** PostgreSQL Cluster + PgBouncer (Pooling).
*   **Asset Layer (Supabase Storage):** CDN-cached images (WebP/AVIF).

## 2. Data Flow & Encryption Pipeline
The "Golden Rule": **Supabase never sees plaintext PII.**

### 2.1 The "Crypto-Shredder" Pipeline
1.  **Ingest:** User submits form (HTTPS) -> Next.js Server Action.
2.  **Sanitize:** Server Action validates Zod Schema.
3.  **Encrypt:**
    *   Load `AES-256-GCM` Key from Vercel Env (`DATA_ENCRYPTION_KEY`).
    *   `encrypt(PII)` -> `iv + ciphertext + auth_tag`.
4.  **Persist:** Prisma writes ciphertext to `user_private_data` table.
5.  **Read:** Prisma fetches ciphertext -> Decrypt in memory -> Return JSON to Client Component.

### 2.2 Connection Pooling Strategy
*   **Problem:** Serverless functions exhaust Postgres connections (max_connections=100).
*   **Solution:** Use Supabase Transaction Pooler (Port 6543).
    *   `DATABASE_URL`: `postgres://user:pass@db.supabase.co:6543/postgres?pgbouncer=true`
    *   `DIRECT_URL`: `postgres://user:pass@db.supabase.co:5432/postgres` (For Migrations only).

## 3. Caching & Performance Strategy
*   **Directory Listings (`/clubs`):**
    *   **Strategy:** `stale-while-revalidate`.
    *   **TTL:** Cache for 60 seconds (s-maxage=60).
    *   **Tagging:** `revalidateTag('clubs-directory')` on Admin update.
*   **Club Details (`/clubs/[slug]`):**
    *   **Strategy:** Static Site Generation (SSG).
    *   **Revalidation:** On-demand (ISR) when club updates profile.
*   **Images:**
    *   **Loader:** Custom Supabase Image Loader.
    *   **Optimization:** Request `width=800&format=webp&quality=80`.

## 4. Observability & Monitoring
*   **Logs:** Vercel Runtime Logs (Error level only).
*   **Audit:** `audit_logs` table in Postgres (Immutable triggers).
*   **Health:** `/api/health` endpoint checking DB connectivity (Used by Uptime Robot).
*   **Analytics:** Vercel Analytics (Web Vitals) + Custom Dashboard Events.

## 5. Security Headers (Hardening)
Implement in `next.config.js` (once `output: export` is removed):
*   `Content-Security-Policy`: Default-src 'self'; Img-src 'self' supabase.co;
*   `X-Frame-Options`: DENY.
*   `X-Content-Type-Options`: nosniff.
*   `Referrer-Policy`: strict-origin-when-cross-origin.
