# System Architecture (Production-Ready)
## Cannabis Social Club Platform

**Version:** 2.0  
**Status:** Hardened & Compliant  
**Focus:** Privacy, Robustness, Speed

---

## 1. High-Level Architecture

### 1.1 System Overview
```
┌─────────────────────────────────────────────────────────────┐
│                     EDGE LAYER (Vercel)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Global CDN   │  │ DDoS Protect │  │ Geo-Fencing  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                  COMPUTE LAYER (Serverless)                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │          Next.js App Router (Node.js 20.x)          │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │    │
│  │  │ Server Comps │  │ Edge Funcs   │  │ API Routes │ │    │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER (Supabase)                    │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐   │
│  │ PostgreSQL 15  │  │ PgBouncer      │  │ RLS Policies │   │
│  │ (EU Region)    │  │ (Port 6543)    │  │ (Strict)     │   │
│  └────────────────┘  └────────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    ASSET LAYER (Supabase)                   │
│  ┌────────────────┐  ┌────────────────┐                     │
│  │ Image Storage  │  │ CDN Caching    │                     │
│  │ (WebP/AVIF)    │  │ (Global Edge)  │                     │
│  └────────────────┘  └────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Regional Compliance
**Critical:** All EU user data must remain in EU jurisdiction.

| Component | Provider | Region | SCCs |
|-----------|----------|--------|------|
| Edge/Compute | Vercel | EU (Frankfurt) | ✓ Standard Contractual Clauses |
| Database | Supabase | EU (Frankfurt) | ✓ EU-only (no cross-border) |
| Storage | Supabase | EU (Frankfurt) | ✓ EU-only |
| Backups | Self-hosted | Switzerland | ✓ Adequacy decision |

**Fallback Strategy:** If primary EU region fails, traffic routes to EU-west (Dublin). Never route to US regions for EU users.

---

## 2. Data Sovereignty & Retention

### 2.1 GDPR Compliance Framework

#### Data Retention Policy (GDPR Art. 5)
| Data Type | Retention Period | Justification | Automated Deletion |
|-----------|-----------------|---------------|-------------------|
| User PII (encrypted) | 2 years after last activity | Legal obligation (Spanish CSC law) | ✓ Quarterly job |
| Membership Requests | 1 year after resolution | Dispute resolution | ✓ Monthly job |
| Audit Logs | 1 year | Compliance & security | ✓ Annual archive |
| Session Data | 30 days | Operational necessity | ✓ Daily cleanup |
| Backups | 30 days | Disaster recovery | ✓ Automatic rotation |
| Analytics (anonymized) | 26 months | Google Analytics standard | ✓ GA auto-delete |

**Right to Erasure (Art. 17):**
- User initiates deletion → Immediate soft delete (mark as deleted)
- 7-day grace period (recovery option)
- Permanent deletion after grace period + crypto-shredding
- Backups purged within 30 days

### 2.2 Legal Basis for Processing (GDPR Art. 6)
| Processing Activity | Legal Basis | Documentation |
|---------------------|-------------|---------------|
| User registration | Consent (Art. 6(1)(a)) | Checkbox + timestamp |
| Membership requests | Contract (Art. 6(1)(b)) | Club membership agreement |
| Age verification | Legal obligation (Art. 6(1)(c)) | Spanish CSC law compliance |
| Analytics | Legitimate interest (Art. 6(1)(f)) | Privacy policy disclosure |
| Marketing emails | Consent (Art. 6(1)(a)) | Double opt-in |

### 2.3 Consent Management
```typescript
// Consent record structure
interface ConsentRecord {
  userId: string;
  purpose: 'registration' | 'marketing' | 'analytics';
  granted: boolean;
  timestamp: Date;
  ipAddress: string; // Hashed
  userAgent: string; // Truncated
  version: string;   // Policy version
  withdrawnAt?: Date;
}
```

**Requirements:**
- Granular consent (separate for each purpose)
- Easy withdrawal (one-click in profile)
- Withdrawal timestamp recorded
- No degradation of service on withdrawal (except features requiring that data)

### 2.4 Cross-Border Data Transfer (GDPR Art. 44-49)
**Current Architecture:** EU-only infrastructure (no US data centers)

If future expansion requires US regions:
1. Implement Standard Contractual Clauses (SCCs)
2. Conduct Transfer Impact Assessment (TIA)
3. Add supplemental measures (encryption at rest + in transit)
4. User notification of jurisdiction change

---

## 3. Data Flow & Encryption

### 3.1 Enhanced "Crypto-Shredder" Pipeline

**Previous Design:** Single master key in environment variables ❌

**New Design:** Envelope Encryption with Per-User Keys

```
┌────────────────────────────────────────────────────────────┐
│                    ENCRYPTION FLOW                         │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  1. USER REGISTRATION                                      │
│     ├─ Generate unique DEK (Data Encryption Key) per user  │
│     ├─ DEK = 256-bit random AES key                        │
│     └─ Store DEK encrypted with KEK (Key Encryption Key)   │
│                                                            │
│  2. DATA ENCRYPTION                                        │
│     ├─ User submits PII                                    │
│     ├─ Load user's encrypted DEK                           │
│     ├─ Decrypt DEK using KEK (from HSM)                    │
│     ├─ Encrypt PII using DEK (AES-256-GCM)                 │
│     ├─ Format: version:dek_id:iv:ciphertext:auth_tag       │
│     └─ Store ciphertext in DB                              │
│                                                            │
│  3. DATA DECRYPTION                                        │
│     ├─ Fetch ciphertext from DB                            │
│     ├─ Load user's encrypted DEK                           │
│     ├─ Decrypt DEK using KEK                               │
│     ├─ Decrypt PII using DEK                               │
│     └─ Return plaintext to client                          │
│                                                            │
│  4. CRYPTO-SHREDDING (Right to Erasure)                    │
│     ├─ User requests deletion                              │
│     ├─ Delete encrypted DEK from DB                        │
│     ├─ Ciphertext remains but is unrecoverable             │
│     └─ Without DEK, data is permanently lost               │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Key Management:**
- **KEK (Key Encryption Key):** Stored in AWS KMS / HashiCorp Vault (HSM-backed)
- **DEK (Data Encryption Key):** One per user, encrypted with KEK, stored in DB
- **Rotation:** KEK rotated annually, DEKs rotated on user password change

### 3.2 Database Connection Strategy

**Connection Pooling (PgBouncer):**
```
# Transaction mode for Serverless
database_url="postgresql://user:pass@db.supabase.co:6543/postgres?pgbouncer=true&connection_limit=10"

# Session mode for Migrations (direct connection)
direct_url="postgresql://user:pass@db.supabase.co:5432/postgres"
```

**Optimization:**
- Connection limit: 10 per function instance
- Pool size: 20 connections max
- Idle timeout: 60 seconds
- Statement timeout: 30 seconds

---

## 4. Caching Strategy

### 4.1 Caching Hierarchy

| Layer | Technology | TTL | Invalidation |
|-------|-----------|-----|--------------|
| **Browser** | `Cache-Control` | Variable | Versioned URLs |
| **CDN** | Vercel Edge | 60s (dynamic), 1yr (static) | Tag-based |
| **Application** | React Query | 5min (stale), 30min (gc) | Mutation-based |
| **Database** | PostgreSQL | N/A | Query cache |

### 4.2 Route-Specific Caching

```typescript
// Public directory - stale-while-revalidate
export const revalidate = 60; // 60 seconds

// Club detail pages - ISR with on-demand
export const revalidate = 86400; // 24 hours
export const dynamicParams = true;

// Membership requests - NEVER CACHE
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Admin dashboard - private, no cache
export const dynamic = 'force-dynamic';
```

### 4.3 Cache Invalidation

```typescript
// On club update
import { revalidateTag } from 'next/cache';

async function updateClub(clubId: string) {
  // Update database
  await prisma.club.update({...});
  
  // Invalidate caches
  revalidateTag('clubs-directory');
  revalidateTag(`club-${clubId}`);
  revalidatePath(`/clubs/${clubSlug}`);
}
```

---

## 5. Observability & Monitoring

### 5.1 Health Checks

**Shallow Health Check:**
```typescript
// /api/health
export async function GET() {
  return Response.json({ status: 'ok', timestamp: Date.now() });
}
```

**Deep Health Check:**
```typescript
// /api/health/deep
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    storage: await checkStorage(),
    encryption: await checkEncryptionKey(),
    edgeConfig: await checkEdgeConfig(),
  };
  
  const healthy = Object.values(checks).every(c => c.status === 'ok');
  
  return Response.json(
    { status: healthy ? 'ok' : 'degraded', checks },
    { status: healthy ? 200 : 503 }
  );
}
```

### 5.2 Monitoring Stack

| Component | Tool | Purpose |
|-----------|------|---------|
| Logs | Vercel Runtime + Axiom | Centralized log aggregation |
| Metrics | Vercel Analytics | Web Vitals, performance |
| Errors | Sentry | Error tracking & alerting |
| Uptime | UptimeRobot | External health checks |
| Alerts | PagerDuty | On-call notifications |

### 5.3 Audit Logging (Immutable)

```sql
-- Audit table with append-only trigger
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  changed_by UUID NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now(),
  change_hash TEXT NOT NULL -- SHA256 of change data
);

-- Prevent updates/deletes
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_immutable
  BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();
```

**Streaming:** Audit logs streamed to external immutable store (Axiom) within 5 minutes.

---

## 6. Resilience & Fault Tolerance

### 6.1 Circuit Breaker Pattern

```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime?: number;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private failureThreshold = 5,
    private timeout = 60000 // 60s
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - (this.lastFailureTime || 0) > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}
```

**Usage:** Wrap external API calls (Supabase, payment gateways)

### 6.2 Rate Limiting

```typescript
// Middleware rate limiting
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 req per 10s
  analytics: true,
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success, limit, remaining } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }
  
  return NextResponse.next();
}
```

**Limits:**
- General API: 100 req/min per IP
- Auth endpoints: 10 req/min per IP
- Membership requests: 5 req/hour per user
- Club creation: 3 req/day per user

### 6.3 Disaster Recovery

**RTO (Recovery Time Objective):** 4 hours  
**RPO (Recovery Point Objective):** 1 hour (max data loss)

**Backup Strategy:**
1. **Supabase Automated:** Daily snapshots (point-in-time recovery)
2. **Self-hosted:** Hourly `pg_dump` to Switzerland S3
3. **Cross-region:** Read replica in EU-west (Dublin)

**Restoration Procedure:**
```bash
# Emergency DB restoration
1. Identify backup file (timestamp)
2. Create new Supabase project
3. psql -h new-db.supabase.co -U postgres -d postgres < backup.sql
4. Update DATABASE_URL in Vercel
5. Verify with health checks
```

---

## 7. Security Headers

### 7.1 Next.js Configuration

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' https://*.supabase.co https://*.mapbox.com data:",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co https://*.mapbox.com",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
    ].join('; '),
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

module.exports = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};
```

### 7.2 Additional Hardening

- **DNSSEC:** Enabled on domain
- **DDoS Protection:** Cloudflare (if migrating from Vercel)
- **WAF Rules:** Block common attack patterns (SQLi, XSS)
- **Geo-blocking:** Block high-risk countries (optional)

---

## 8. Breach Response Protocol (GDPR Art. 33)

### 8.1 Detection & Assessment (Hour 0-1)
- Automated alert triggers (unusual access patterns, failed decryption spikes)
- Incident response team paged
- Initial impact assessment (data types affected, user count)

### 8.2 Containment (Hour 1-4)
- Isolate affected systems
- Revoke compromised credentials
- Enable maintenance mode if needed
- Preserve forensic evidence

### 8.3 Notification (Hour 4-72)
**If high risk to user rights:**
- Notify DPA within 72 hours (formal breach report)
- Notify affected users (email + dashboard notification)
- Document breach details (Art. 33(3) requirements)

### 8.4 Recovery & Review (Post-incident)
- Restore from clean backups
- Implement additional controls
- Post-incident review (lessons learned)
- Update security documentation

---

## 9. Performance Optimization

### 9.1 Database Indexing Strategy

```sql
-- Essential indexes for performance
CREATE INDEX idx_clubs_neighborhood ON clubs(neighborhood);
CREATE INDEX idx_clubs_city ON clubs(city);
CREATE INDEX idx_clubs_verified ON clubs(is_verified) WHERE is_verified = true;
CREATE INDEX idx_clubs_location ON clubs USING GIST(location); -- PostGIS
CREATE INDEX idx_membership_status ON membership_requests(status);
CREATE INDEX idx_membership_user ON membership_requests(user_id);
CREATE INDEX idx_reviews_club ON reviews(club_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
```

### 9.2 Query Optimization Rules
- Always SELECT specific columns (never `SELECT *`)
- Use connection pooling (PgBouncer)
- Implement pagination (cursor-based for large datasets)
- Avoid N+1 queries (use Prisma's `include`)

### 9.3 Bundle Optimization
```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic';

const ClubMap = dynamic(() => import('@/components/ClubMap'), {
  loading: () => <MapSkeleton />,
  ssr: false, // Map requires window object
});
```

---

## 10. Sub-Processor List (GDPR Art. 28)

| Processor | Purpose | Location | SCCs |
|-----------|---------|----------|------|
| Vercel | Hosting/Edge | EU | ✓ |
| Supabase | Database/Storage | EU | ✓ |
| AWS KMS | Key Management | EU | ✓ |
| Axiom | Logging | EU | ✓ |
| Sentry | Error Tracking | EU | ✓ |
| Mapbox | Maps | US | ✓ SCCs |
| Upstash | Rate Limiting | EU | ✓ |

**Updates:** Users notified of new sub-processors via email + privacy policy update.

---

*Document Version: 2.0*  
*Last Updated: 2026-02-01*  
*Review Cycle: Quarterly (or on architecture change)*
