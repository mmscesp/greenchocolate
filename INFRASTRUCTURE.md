# Infrastructure & DevOps (Netlify Free Tier Edition)

## 1. Hosting Environment
*   **Frontend:** Netlify (Free Tier).
    *   **Features:** Automated builds from Git, Global CDN, Instant Rollbacks.
    *   **Constraints:** 100GB Bandwidth/month, 300 build minutes/month.
*   **Backend:** Supabase (Free Tier).
    *   **Database:** 500MB Database space.
    *   **Auth:** 50,000 MAUs.
    *   **Storage:** 1GB File storage.
*   **Domain:** DNS managed by Netlify (for automatic SSL).

## 2. CI/CD Pipeline (Netlify Build)
Triggers on `push` to `main`:
1.  **Install:** `npm install`.
2.  **Lint & Build:** `npm run build`.
    *   *Note:* Netlify automatically detects Next.js and installs the `@netlify/plugin-nextjs` for ISR/SSR support.
3.  **Deploy:** Atomic deployment to global edge network.

## 3. Infrastructure as Code (IaC)
*   **Database:** Prisma Schema (`schema.prisma`) is the source of truth.
*   **Migrations:** Run manually or via GitHub Action (separate from Netlify build to avoid timeout/connection limits during build).
    *   *Command:* `npx prisma migrate deploy`
*   **Environment Variables:**
    *   Managed in Netlify Site Settings -> Environment Variables.
    *   Synced locally via `.env`.

## 4. Disaster Recovery (DR)
*   **Strategy:**
    *   **Database:** Supabase automated daily backups (included in Free Tier? *Check specific tier limits, manual dump script recommended for redundancy*).
    *   **Code:** GitHub Repository is the backup.
    *   **Assets:** Local backup of critical assets recommended as Supabase Free Tier has hard limits.

## 5. Edge Security (Netlify Edge Functions)
*   **Geo-Fencing:** Use Netlify Edge Functions (`netlify/edge-functions/geo-block.ts`) to inspect `context.geo.country`.
    *   *Logic:* If country code is in Block List -> Return 403.
*   **Headers:** Configure `_headers` file or `netlify.toml` for security headers (CSP, X-Frame-Options) since `next.config.js` headers might be overridden or handled differently in Netlify's Next.js runtime.

## 6. Cost Management (Zero Budget)
*   **Monitoring:** Set up Netlify usage alerts (email) when approaching 75% of bandwidth limit.
*   **Optimization:** Aggressive caching headers (`Cache-Control: public, max-age=31536000, immutable`) for all static assets to minimize CDN costs.
