# Backend & Database Architecture

## 1. Overview
*   **Architecture:** Backend-as-a-Service (BaaS) + Serverless Functions.
*   **Platform:** Supabase (PostgreSQL).
*   **ORM:** Prisma (Client-side usage in Next.js API routes).

## 2. Database Schema (PostgreSQL)

### 2.1 Core Tables

**`profiles` (Public Metadata)**
*   `id`: UUID (FK to auth.users)
*   `username`: String (Unique)
*   `avatar_url`: String
*   `role`: Enum ('user', 'club_admin', 'super_admin')
*   `tier`: Enum ('novice', 'connoisseur', 'legend')
*   `created_at`: Timestamp

**`user_private_data` (Encrypted PII - Strict RLS)**
*   `user_id`: UUID (FK to profiles)
*   `enc_full_name`: String (AES Encrypted)
*   `enc_dob`: String (AES Encrypted - for age verification)
*   `enc_phone`: String (AES Encrypted)
*   `nationality`: String (Public - for stats)

**`clubs` (Directory Data)**
*   `id`: UUID
*   `slug`: String (Unique, Indexed)
*   `name`: String
*   `description`: Text
*   `neighborhood`: String
*   `city`: String
*   `address_display`: String (Approximate, e.g., "Carrer de Joaquín Costa, Raval")
*   `address_real`: String (Hidden, available only to approved members)
*   `location`: Geography (PostGIS Point)
*   `images`: String[] (Array of URLs)
*   `amenities`: String[] (Tags)
*   `vibes`: String[] (Tags)
*   `is_verified`: Boolean

**`membership_requests` (The Connection)**
*   `id`: UUID
*   `user_id`: UUID
*   `club_id`: UUID
*   `status`: Enum ('pending', 'approved', 'rejected', 'scheduled')
*   `message`: Text (User's note)
*   `appointment_date`: Timestamp
*   `encrypted_data_snapshot`: JSON (Snapshot of user data at time of request)

**`reviews` (UGC)**
*   `id`: UUID
*   `user_id`: UUID
*   `club_id`: UUID
*   `rating_atmosphere`: Int (1-5)
*   `rating_service`: Int (1-5)
*   `rating_product`: Int (1-5)
*   `content`: Text
*   `is_verified_visit`: Boolean (True if user has "Stamp")

### 2.2 Security Policies (RLS)

*   **`profiles`**: Public Read. Update only by `auth.uid()`.
*   **`user_private_data`**: SELECT/UPDATE only by `auth.uid()`. NO ONE else.
*   **`clubs`**: Public Read (except `address_real`). `address_real` visible only if `membership_requests.status = 'approved'`.
*   **`membership_requests`**:
    *   INSERT by `auth.uid()`.
    *   SELECT by `auth.uid()` OR `club_owner_id`.

## 3. Integration Patterns

### 3.1 Prisma + Supabase
*   **Connection:** Use the **Transaction Pooler** (Port 6543) for Next.js Serverless functions.
*   **Direct Connection:** Use the **Session Pooler** (Port 5432) for Migrations (`prisma migrate`).

### 3.2 Data Encryption (Application Level)
*   **Process:**
    1.  User submits form.
    2.  Next.js Server Action receives data.
    3.  Server Action encrypts `name` -> `enc_name` using `AES-256-GCM` with a key stored in `process.env.DATA_ENCRYPTION_KEY`.
    4.  Prisma writes `enc_name` to DB.
*   **Retrieval:**
    1.  Prisma fetches `enc_name`.
    2.  Server Action decrypts it on-the-fly for display to the User (never sent to client encrypted).

### 3.3 Audit Logging
*   **Mechanism:** Postgres Triggers.
*   **Table:** `audit_logs` (id, table_name, record_id, operation, changed_by, timestamp).
*   **Trigger:** On every UPDATE/DELETE on sensitive tables, write a row to `audit_logs`.
