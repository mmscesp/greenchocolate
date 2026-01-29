# Security & Privacy Protocol

## 1. Core Principles
1.  **Data Sovereignty:** Physical and logical separation of Public and Private data.
2.  **Zero-Knowledge (Where Possible):** We do not store what we do not need.
3.  **Encryption by Default:** All PII is encrypted at the Application Layer.
4.  **Plausible Deniability:** The platform facilitates *connections*, not *sales*.

## 2. Data Classification

| Data Type | Examples | Sensitivity | Storage | Encryption |
| :--- | :--- | :--- | :--- | :--- |
| **Public** | Club Name, Amenities, Reviews (Text) | Low | `clubs`, `reviews` | None |
| **Internal** | User ID, Club Slug, Timestamps | Medium | FKs, Metadata | None |
| **Private** | Email, DOB, Phone, Real Name | **CRITICAL** | `user_private_data` | **AES-256 (App Layer)** |
| **Restricted** | Real Address, Phone Number (Club) | High | `clubs` | RLS Protected |

## 3. Application-Level Encryption (ALE) Implementation

### 3.1 The "Black Box" Approach
The Database (Supabase) **never** sees the plaintext PII.
*   **Write Flow:**
    `Client Form` -> `Next.js API (HTTPS)` -> `Encrypt(Data, Key)` -> `Prisma` -> `DB`
*   **Read Flow:**
    `DB` -> `Prisma` -> `Decrypt(Data, Key)` -> `Next.js API` -> `Client UI (HTTPS)`

### 3.2 Key Management
*   **Master Key:** 32-byte random hex string.
*   **Storage:** `process.env.ENCRYPTION_KEY` (Set in Vercel/Supabase Dashboard).
*   **Rotation:** Support key rotation by prefixing ciphertext with key version (e.g., `v1:ciphertext`).

## 4. Endorsement System ("The Burn")
To prevent mapping the "Social Graph" of cannabis users:
*   **Invites:** Stored as `Hash(Token)`.
*   **Linkage:** Once an invite is accepted, the direct link between `Inviter_ID` and `Invitee_ID` is **hard deleted**.
*   **Audit:** We keep a count (`inviter.referral_count++`) but destroy the specific edge in the graph.

## 5. Compliance Measures (GDPR & Spanish Law)
*   **Right to be Forgotten:** "Crypto-Shredding". Deleting a user's account also rotates/deletes their specific encryption salt (if implemented), making recovery impossible.
*   **Age Verification:** We store `Encrypted(DOB)`. The system decrypts -> checks `age >= 18` -> returns Boolean. We never expose DOB to the frontend after registration.
*   **Content Filtering:** Middleware intercepts all Review submissions. Regex matches for "buy", "sell", "€", "price" -> Block request + Warning.
