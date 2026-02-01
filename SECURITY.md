# Security & Privacy Protocol
## Cannabis Social Club Platform

**Version:** 2.0 (Hardened)  
**Classification:** Confidential  
**Review Cycle:** Quarterly

---

## 1. Core Security Principles

### 1.1 Zero-Trust Architecture
- **Verify explicitly:** Authenticate and authorize every access request
- **Use least privilege:** Minimum permissions required for function
- **Assume breach:** Design for containment and recovery

### 1.2 Privacy by Design (GDPR Art. 25)
1. **Proactive not Reactive:** Privacy risks identified before processing
2. **Privacy as Default:** Maximum privacy settings by default
3. **Privacy Embedded:** Not bolted-on, built into architecture
4. **Full Functionality:** No false dichotomy (privacy AND utility)
5. **End-to-End Protection:** Lifecycle data protection
6. **Visibility/Transparency:** Clear privacy practices

---

## 2. Data Classification Framework

### 2.1 Classification Levels

| Level | Sensitivity | Encryption | Access | Examples |
|-------|-------------|------------|--------|----------|
| **Public** | None | None | Anyone | Club name, amenities, public reviews |
| **Internal** | Low | None | Authenticated | User ID, timestamps, club slugs |
| **Private** | High | AES-256-GCM + DEK | Owner only | Email, full name, DOB, phone |
| **Sensitive** | Critical | AES-256-GCM + DEK | Strict RLS | Real club addresses, passport data |
| **Restricted** | Maximum | HSM-backed | Admin only | Encryption keys, audit trails |

### 2.2 Field-Level Classification

```typescript
// Complete data classification
interface DataClassification {
  // PUBLIC - No encryption
  'club.name': 'Public';
  'club.amenities': 'Public';
  'club.neighborhood': 'Public';
  'review.content': 'Public';
  'review.rating': 'Public';
  
  // INTERNAL - No encryption
  'user.id': 'Internal';
  'user.created_at': 'Internal';
  'club.slug': 'Internal';
  
  // PRIVATE - AES-256 encrypted
  'user.email': 'Private';
  'user.full_name': 'Private';
  'user.dob': 'Private';
  'user.phone': 'Private';
  'user.nationality': 'Private'; // Changed from Public - profiling risk
  'user.smoking_habits': 'Private'; // Minimize collection
  
  // SENSITIVE - Encrypted + Strict RLS
  'club.address_real': 'Sensitive';
  'membership.notes': 'Sensitive';
  
  // RESTRICTED - HSM backed
  'encryption.dek': 'Restricted'; // Data encryption keys
  'audit.raw': 'Restricted'; // Pre-hash audit data
}
```

---

## 3. Application-Level Encryption (ALE)

### 3.1 Envelope Encryption Architecture

**Problem with v1:** Single master key in environment variables
**Solution v2:** Per-user Data Encryption Keys (DEKs)

```
┌─────────────────────────────────────────────────────────────┐
│                    KEY HIERARCHY                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  KEK (Key Encryption Key)                                   │
│  ├─ Location: AWS KMS / HashiCorp Vault (HSM)               │
│  ├─ Rotation: Annual                                        │
│  ├─ Access: IAM role only                                   │
│  └─ Purpose: Encrypt DEKs                                   │
│                                                             │
│  DEK (Data Encryption Key) - ONE PER USER                   │
│  ├─ Location: Encrypted in database                         │
│  ├─ Format: AES-256-GCM                                     │
│  ├─ Rotation: On password change                            │
│  └─ Purpose: Encrypt user PII                               │
│                                                             │
│  CIPHERTEXT                                                 │
│  ├─ Location: Database (user_private_data table)            │
│  ├─ Format: version:dek_id:iv:ciphertext:auth_tag          │
│  └─ Decryption: DEK → Plaintext                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Encryption Implementation

```typescript
// lib/encryption.ts
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

interface EncryptedData {
  version: string;
  dekId: string;
  iv: string;
  ciphertext: string;
  authTag: string;
}

export class EncryptionService {
  private kek: Buffer; // Loaded from KMS
  
  constructor(kekFromKMS: string) {
    this.kek = Buffer.from(kekFromKMS, 'hex');
  }
  
  // Generate new DEK for a user
  generateDEK(): { dek: Buffer; encryptedDek: string } {
    const dek = randomBytes(KEY_LENGTH);
    const iv = randomBytes(IV_LENGTH);
    
    const cipher = createCipheriv(ALGORITHM, this.kek, iv);
    const encryptedDek = Buffer.concat([
      cipher.update(dek),
      cipher.final()
    ]);
    const authTag = cipher.getAuthTag();
    
    return {
      dek,
      encryptedDek: `v2:${iv.toString('hex')}:${encryptedDek.toString('hex')}:${authTag.toString('hex')}`
    };
  }
  
  // Decrypt DEK using KEK
  decryptDEK(encryptedDek: string): Buffer {
    const [version, ivHex, ciphertextHex, authTagHex] = encryptedDek.split(':');
    
    if (version !== 'v2') throw new Error('Unsupported DEK version');
    
    const decipher = createDecipheriv(
      ALGORITHM,
      this.kek,
      Buffer.from(ivHex, 'hex')
    );
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    
    return Buffer.concat([
      decipher.update(Buffer.from(ciphertextHex, 'hex')),
      decipher.final()
    ]);
  }
  
  // Encrypt PII with user's DEK
  encrypt(plaintext: string, dek: Buffer): EncryptedData {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, dek, iv);
    
    const ciphertext = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final()
    ]);
    
    return {
      version: 'v1',
      dekId: 'user_dek_id', // Reference to which DEK
      iv: iv.toString('hex'),
      ciphertext: ciphertext.toString('hex'),
      authTag: cipher.getAuthTag().toString('hex')
    };
  }
  
  // Decrypt PII with user's DEK
  decrypt(encrypted: EncryptedData, dek: Buffer): string {
    const decipher = createDecipheriv(
      ALGORITHM,
      dek,
      Buffer.from(encrypted.iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'));
    
    return Buffer.concat([
      decipher.update(Buffer.from(encrypted.ciphertext, 'hex')),
      decipher.final()
    ]).toString('utf8');
  }
}
```

### 3.3 Crypto-Shredding (Right to Erasure)

**Implementation:**
```typescript
// When user requests deletion
async function deleteUserPermanently(userId: string) {
  // 1. Soft delete (grace period)
  await prisma.user.update({
    where: { id: userId },
    data: { 
      deletedAt: new Date(),
      deletionScheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
  });
  
  // 2. After grace period (scheduled job)
  // This runs via cron job daily
  const usersToPurge = await prisma.user.findMany({
    where: {
      deletionScheduledAt: { lte: new Date() }
    }
  });
  
  for (const user of usersToPurge) {
    // 3. Delete DEK (renders all ciphertext unrecoverable)
    await prisma.userEncryptionKey.delete({
      where: { userId: user.id }
    });
    
    // 4. Delete user record
    await prisma.user.delete({ where: { id: user.id } });
    
    // 5. Log deletion (hashed ID only, no PII)
    await auditLog.record({
      action: 'USER_PURGED',
      userIdHash: hashUserId(user.id),
      timestamp: new Date()
    });
  }
}
```

**Verification:**
- Encrypted data remains in DB (ciphertext only)
- Without DEK, decryption is mathematically impossible
- Even with database access, PII is unrecoverable

---

## 4. Authentication & Authorization

### 4.1 Multi-Factor Authentication (MFA)

**Requirement:** MFA mandatory for Club Admin and Super Admin roles

```typescript
// MFA enrollment flow
interface MFASetup {
  // TOTP (Time-based One-Time Password)
  secret: string; // Base32 encoded
  qrCode: string; // otpauth:// URI
  backupCodes: string[]; // 10 single-use codes
}

// Login flow with MFA
async function loginWithMFA(email: string, password: string, totpCode?: string) {
  // 1. Verify credentials
  const user = await verifyCredentials(email, password);
  if (!user) throw new Error('Invalid credentials');
  
  // 2. Check if MFA required
  if (user.role === 'club_admin' || user.role === 'super_admin') {
    if (!totpCode) {
      return { status: 'MFA_REQUIRED', method: 'totp' };
    }
    
    // 3. Verify TOTP
    const valid = verifyTOTP(user.mfaSecret, totpCode);
    if (!valid) throw new Error('Invalid MFA code');
  }
  
  // 4. Create session
  return createSession(user);
}
```

**MFA Methods (Priority):**
1. **TOTP** (Google Authenticator, Authy) - Primary
2. **SMS** - Fallback (with rate limiting)
3. **Backup Codes** - Emergency access

### 4.2 Session Security

```typescript
// Session configuration
interface SessionConfig {
  maxAge: 24 * 60 * 60; // 24 hours
  secure: true; // HTTPS only
  sameSite: 'strict';
  httpOnly: true; // No JavaScript access
}

// Session invalidation events
const INVALIDATION_EVENTS = [
  'PASSWORD_CHANGED',
  'MFA_ENABLED',
  'SUSPICIOUS_ACTIVITY',
  'USER_REQUESTED_LOGOUT',
  'ADMIN_FORCE_LOGOUT'
];

// On invalidation event
async function invalidateAllSessions(userId: string, exceptCurrent?: string) {
  await prisma.session.deleteMany({
    where: {
      userId,
      id: exceptCurrent ? { not: exceptCurrent } : undefined
    }
  });
  
  // Also blacklist refresh tokens
  await redis.del(`refresh_tokens:${userId}`);
}
```

### 4.3 Row Level Security (RLS) Policies

```sql
-- Users can only access their own private data
CREATE POLICY user_private_data_isolation ON user_private_data
  FOR ALL
  USING (auth.uid() = user_id);

-- Club owners can see requests for their club
CREATE POLICY membership_requests_club_access ON membership_requests
  FOR SELECT
  USING (
    auth.uid() = user_id 
    OR 
    auth.uid() IN (
      SELECT owner_id FROM clubs WHERE id = club_id
    )
  );

-- Real address only visible to approved members
CREATE POLICY clubs_address_real_protection ON clubs
  FOR SELECT
  USING (
    address_real IS NULL 
    OR 
    auth.uid() IN (
      SELECT user_id FROM membership_requests 
      WHERE club_id = id AND status = 'approved'
    )
    OR
    auth.uid() IN (
      SELECT owner_id FROM clubs WHERE id = clubs.id
    )
  );

-- Audit logs: append-only, no modification
CREATE POLICY audit_logs_read_only ON audit_logs
  FOR SELECT
  USING (auth.role() = 'service_role');
```

---

## 5. The "Burn" System (Social Graph Protection)

### 5.1 Problem: Social Graph Reconstruction
Law enforcement or attackers could map relationships between cannabis users via membership data.

### 5.2 Solution: Cryptographic Unlinkability

```typescript
// Invite system with zero-knowledge properties
interface BlindInvite {
  id: string; // UUID
  inviteHash: string; // SHA256(token) - used for validation
  lineageHash: string; // Hash of inviter's lineage - prevents loops
  createdAt: Date;
  // NO inviter_id field - direct link destroyed
}

// Invite generation
function createInvite(inviterId: string): { token: string; invite: BlindInvite } {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  
  // Get inviter's lineage (for fraud detection, not identity)
  const inviterLineage = getLineageHash(inviterId);
  
  // Add current inviter to lineage
  const newLineage = crypto.createHash('sha256')
    .update(inviterLineage + inviterId)
    .digest('hex');
  
  const invite: BlindInvite = {
    id: crypto.randomUUID(),
    inviteHash: tokenHash,
    lineageHash: newLineage,
    createdAt: new Date()
  };
  
  // Store invite (no inviter reference)
  await prisma.invite.create({ data: invite });
  
  // Increment invite count (statistical only)
  await prisma.userStats.update({
    where: { userId: inviterId },
    data: { inviteCount: { increment: 1 } }
  });
  
  return { token, invite };
}

// Invite redemption
async function redeemInvite(token: string, newUserId: string) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  
  const invite = await prisma.invite.findUnique({
    where: { inviteHash: tokenHash }
  });
  
  if (!invite) throw new Error('Invalid invite');
  if (invite.redeemedAt) throw new Error('Invite already used');
  
  // Check for circular invites (lineage contains newUser)
  const newUserLineage = getLineageHash(newUserId);
  if (invite.lineageHash.includes(newUserLineage)) {
    throw new Error('Circular invite detected');
  }
  
  // Mark as redeemed (still no direct link)
  await prisma.invite.update({
    where: { id: invite.id },
    data: { redeemedAt: new Date(), redeemedBy: hashUserId(newUserId) }
  });
  
  // CRITICAL: Delete the invite record after 24 hours
  setTimeout(async () => {
    await prisma.invite.delete({ where: { id: invite.id } });
  }, 24 * 60 * 60 * 1000);
}
```

### 5.3 Properties
- **Unlinkability:** Cannot determine who invited whom
- **Fraud Detection:** Lineage hashes detect circular invites (prevent abuse)
- **Temporary:** Invite records auto-delete after redemption
- **Plausible Deniability:** Even platform operator cannot reconstruct graph

---

## 6. Input Validation & Content Filtering

### 6.1 Strict Input Validation

```typescript
// Zod schemas for all inputs
import { z } from 'zod';

const userRegistrationSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(12).max(128), // Enforce strong passwords
  fullName: z.string().min(2).max(100).regex(/^[a-zA-Z\s'-]+$/),
  dob: z.date().refine(date => {
    const age = calculateAge(date);
    return age >= 18;
  }, { message: 'Must be 18+' }),
  nationality: z.string().length(2), // ISO country code only
});

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  content: z.string().max(1000).transform(sanitizeInput)
});
```

### 6.2 Content Filtering (Anti-Abuse)

**Problem:** Users might try to facilitate sales ("buy", "sell", "€", "grams")

**Solution v2:** NLP-based semantic analysis (not just regex)

```typescript
// Multi-layer content filtering
class ContentFilter {
  // Layer 1: Blocklist (exact matches)
  private blocklist = new Set(['buy', 'sell', 'price', '€', '$', 'grams', 'dealer']);
  
  // Layer 2: Pattern matching (leetspeak, separators)
  private patterns = [
    /b[-_.]*u[-_.]*y/i,
    /s[-_.]*e[-_.]*l[-_.]*l/i,
    /p[-_.]*r[-_.]*i[-_.]*c[-_.]*e/i,
    /\d+\s*(g|gr|gram|grams)/i,
  ];
  
  // Layer 3: NLP sentiment (external service)
  async analyzeWithNLP(text: string): Promise<{
    isCommercial: boolean;
    confidence: number;
    reason?: string;
  }> {
    // Call to privacy-preserving NLP API
    // Only sends text, no user metadata
    const response = await fetch('https://nlp-filter.internal/analyze', {
      method: 'POST',
      body: JSON.stringify({ text }),
      headers: { 'X-No-Log': 'true' } // Request no logging
    });
    
    return response.json();
  }
  
  async filterReview(content: string): Promise<{
    allowed: boolean;
    reason?: string;
    action: 'allow' | 'block' | 'moderate';
  }> {
    // Check blocklist
    const words = content.toLowerCase().split(/\s+/);
    if (words.some(w => this.blocklist.has(w))) {
      return { allowed: false, reason: 'Contains prohibited terms', action: 'block' };
    }
    
    // Check patterns
    if (this.patterns.some(p => p.test(content))) {
      return { allowed: false, reason: 'Pattern match detected', action: 'block' };
    }
    
    // NLP analysis for edge cases
    const nlpResult = await this.analyzeWithNLP(content);
    if (nlpResult.isCommercial && nlpResult.confidence > 0.8) {
      return { allowed: false, reason: 'Commercial intent detected', action: 'block' };
    }
    if (nlpResult.isCommercial && nlpResult.confidence > 0.5) {
      return { allowed: true, reason: 'Requires moderation', action: 'moderate' };
    }
    
    return { allowed: true, action: 'allow' };
  }
}
```

### 6.3 Image Security

```typescript
// Image upload pipeline
interface ImageUpload {
  // 1. Virus scan
  scanForMalware: (buffer: Buffer) => Promise<boolean>;
  
  // 2. Metadata stripping
  stripEXIF: (buffer: Buffer) => Promise<Buffer>;
  
  // 3. Content moderation
  checkForInappropriateContent: (buffer: Buffer) => Promise<{
    safe: boolean;
    categories?: string[];
  }>;
  
  // 4. Optimization
  convertToWebP: (buffer: Buffer) => Promise<Buffer>;
  resizeIfNeeded: (buffer: Buffer, maxDim: number) => Promise<Buffer>;
}

// EXIF stripping implementation
import * as exifr from 'exifr';

async function stripEXIF(buffer: Buffer): Promise<Buffer> {
  // Remove all EXIF data (GPS, camera info, timestamps)
  const cleaned = await exifr.buffer(buffer, {
    reviveValues: false,
    skip: ['all'] // Remove all tags
  });
  
  return cleaned;
}
```

---

## 7. Breach Response Protocol

### 7.1 Incident Classification

| Severity | Criteria | Response Time | Notification |
|----------|----------|---------------|--------------|
| **Critical** | Key compromise, mass data access | 1 hour | Immediate DPA + users |
| **High** | Unauthorized admin access, RLS bypass | 4 hours | DPA within 72h |
| **Medium** | Individual account breach | 24 hours | User notification |
| **Low** | Attempted intrusion (blocked) | 72 hours | Internal only |

### 7.2 Response Playbook

**Hour 0-1: Detection & Assessment**
```bash
# Automated alerts trigger on:
- Failed decryption attempts > 10/min
- Unusual database access patterns
- Privilege escalation attempts
- Mass download detection
```

Actions:
1. Page on-call security engineer
2. Preserve forensic logs (immutable storage)
3. Initial scope assessment (affected users, data types)

**Hour 1-4: Containment**
- Isolate affected systems (maintenance mode)
- Revoke compromised credentials
- Enable additional MFA requirements
- Block suspicious IP ranges

**Hour 4-72: Notification (if required)**
- File breach report with DPA (if high risk)
- Notify affected users via email + in-app
- Document breach details (Art. 33 requirements):
  - Nature of breach
  - Categories of data
  - Approximate number of users
  - Likely consequences
  - Measures taken

**Post-Incident:**
- Root cause analysis
- Security controls enhancement
- Update breach response procedures

---

## 8. Compliance Checklist

### 8.1 GDPR Requirements

| Article | Requirement | Implementation | Status |
|---------|-------------|----------------|--------|
| Art. 5 | Principles | Data minimization, purpose limitation | ✓ |
| Art. 6 | Lawfulness | Consent management system | ✓ |
| Art. 17 | Right to erasure | Crypto-shredding with DEK deletion | ✓ |
| Art. 25 | Privacy by design | Encryption by default | ✓ |
| Art. 28 | Processors | Sub-processor list, SCCs | ✓ |
| Art. 30 | Records (ROPA) | Processing activities documented | ✓ |
| Art. 32 | Security | ALE, MFA, RLS | ✓ |
| Art. 33 | Breach notification | 72h response protocol | ✓ |
| Art. 35 | DPIA | Privacy impact assessment completed | ✓ |

### 8.2 Spanish CSC Law Compliance

- [x] Age verification (18+) with encrypted DOB
- [x] Closed circle doctrine (endorsement system)
- [x] Non-profit operation (no direct sales facilitation)
- [x] Member registration tracking (encrypted)
- [x] Law enforcement cooperation procedures (legal only)

---

## 9. Security Checklist (Pre-Launch)

### 9.1 Code Security
- [ ] Dependency audit (`npm audit` + Snyk)
- [ ] Secrets scanning (GitLeaks)
- [ ] Static analysis (SonarQube/CodeQL)
- [ ] SAST/DAST completed

### 9.2 Infrastructure
- [ ] Security headers configured
- [ ] WAF rules active
- [ ] DDoS protection enabled
- [ ] TLS 1.3 only (no 1.0, 1.1)
- [ ] DNSSEC enabled

### 9.3 Access Control
- [ ] MFA enabled for all admin accounts
- [ ] RLS policies tested
- [ ] Principle of least privilege verified
- [ ] Service account keys rotated

### 9.4 Data Protection
- [ ] Encryption at rest (AES-256)
- [ ] Encryption in transit (TLS 1.3)
- [ ] Key rotation procedures tested
- [ ] Backup encryption verified
- [ ] Data retention jobs scheduled

### 9.5 Monitoring
- [ ] Audit logging enabled
- [ ] SIEM integration active
- [ ] Alert thresholds configured
- [ ] Runbooks documented

---

## 10. Record of Processing Activities (ROPA)

| Activity | Purpose | Data Subjects | Categories | Recipients | Retention | Legal Basis |
|----------|---------|---------------|------------|------------|-----------|-------------|
| User registration | Account creation | Users | Email, name, DOB, nationality | Internal | 2 years | Consent |
| Membership requests | Club membership | Users | Encrypted PII snapshot | Club admins | 1 year | Contract |
| Reviews | Community feedback | Users | Review text, ratings | Public | Duration of listing | Consent |
| Analytics | Platform improvement | Users | Anonymized usage | Internal | 26 months | Legitimate interest |
| Audit logs | Security monitoring | All | Actions, timestamps | Security team | 1 year | Legal obligation |

---

*Document Version: 2.0*  
*Classification: Confidential*  
*Last Updated: 2026-02-01*  
*Next Review: 2026-05-01*
