# 🚀 PRODUCTION-READY BACKEND ARCHITECTURE
## Cannabis Social Club Platform MVP

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Status:** Ready for Implementation

---

## Executive Summary

**Stack:** Next.js 14 + Supabase (PostgreSQL/Auth/Storage) + Prisma ORM  
**Region:** EU-only (Frankfurt) - GDPR compliant  
**Security:** Application-layer envelope encryption for all PII  
**Launch Strategy:** Start with 1 club, SEO-optimized, user pre-registration enabled

### Key Design Decisions

1. **Supabase (Frankfurt Region)**: GDPR-compliant, managed backend with Auth, PostgreSQL, and Storage
2. **Prisma ORM**: Type-safe database access with migration support
3. **Envelope Encryption**: Per-user Data Encryption Keys (DEK) for true crypto-shredding
4. **Next.js Server Actions**: Secure API layer with no exposed endpoints
5. **Static Site Generation**: SEO-optimized club pages with ISR revalidation

---

## 1. Current State Analysis

### Existing Frontend
- **Framework:** Next.js 13.5.1 with App Router
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** React Context for i18n, local state for UI
- **Data:** Mock JSON files with simulated API delays

### Data Models (Current)
```typescript
// lib/types.ts - Current mock data structure
interface Club {
  id: string;
  name: string;
  slug: string;
  isVerified: boolean;
  neighborhood: string;
  images: string[];
  description: string;
  amenities: string[];
  vibeTags: string[];
  openingHours: Record<string, string>;
  allowsPreRegistration: boolean;
  coordinates: { lat: number; lng: number };
  address: string;
  contactEmail: string;
  phoneNumber: string;
  website?: string;
  socialMedia?: { instagram?: string; facebook?: string };
  rating?: number;
  reviewCount?: number;
  priceRange: '$' | '$$' | '$$$';
  capacity: number;
  foundedYear: number;
}

interface MembershipRequest {
  id: string;
  clubId: string;
  userName: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  age: number;
  experience: string;
}
```

### Missing Backend Infrastructure
- ❌ Authentication system (login/signup pages are UI-only)
- ❌ Database persistence
- ❌ User profile storage
- ❌ Membership request workflow
- ❌ Admin panel functionality
- ❌ File upload handling
- ❌ API layer

---

## 2. DATABASE SCHEMA (Prisma)

### Full Schema Definition

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum UserRole {
  USER
  ADMIN
  CLUB_ADMIN
}

enum RequestStatus {
  PENDING
  APPROVED
  REJECTED
  SCHEDULED
}

// ==========================================
// CORE TABLES
// ==========================================

model Club {
  id                    String   @id @default(uuid())
  slug                  String   @unique
  name                  String
  description           String   @db.Text
  shortDescription      String?  // For SEO/meta
  
  // Location (Public approximate)
  neighborhood          String
  city                  String   @default("Madrid")
  addressDisplay        String   // Approximate address shown to public
  coordinates           Json     // { lat: number, lng: number }
  
  // Contact
  contactEmail          String
  phoneNumber           String?
  website               String?
  socialMedia           Json?    // { instagram, facebook }
  
  // Business Details
  isVerified            Boolean  @default(true) // MVP: only verified clubs
  isActive              Boolean  @default(true)
  allowsPreRegistration Boolean  @default(true)
  openingHours          Json
  amenities             String[]
  vibeTags              String[]
  priceRange            String   // $, $$, $$$
  capacity              Int
  foundedYear           Int
  
  // Media
  images                String[] // Supabase Storage URLs
  logoUrl               String?
  coverImageUrl         String?
  
  // SEO
  metaTitle             String?
  metaDescription       String?
  
  // Relations
  membershipRequests    MembershipRequest[]
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  @@index([slug])
  @@index([neighborhood])
  @@index([city])
  @@index([isVerified, isActive])
}

model Profile {
  id            String   @id @default(uuid())
  
  // Supabase Auth Link
  authId        String   @unique // Links to auth.users(id)
  email         String   @unique
  
  // Role & Tier
  role          UserRole @default(USER)
  tier          String   @default("novice") // novice, member, connoisseur, legend
  
  // Encryption
  encryptedDEK  String   // Per-user Data Encryption Key (encrypted by Master Key)
  
  // Encrypted PII Fields (AES-256-GCM)
  fullNameEnc   String?
  phoneEnc      String?
  birthDateEnc  String?  // For age verification (18+)
  nationalityEnc String?
  
  // Public/Non-sensitive
  avatarUrl     String?
  bio           String?  @db.Text
  location      String?  // City/Country only
  
  // Preferences (for recommendations)
  preferences   Json?    // { vibes: [], neighborhoods: [] }
  
  // Stats
  stats         Json     @default("{\"favoriteClubs\":0,\"reviews\":0,\"rating\":0,\"visits\":0}")
  
  // Flags
  isVerified    Boolean  @default(false)
  isPremium     Boolean  @default(false)
  hasCompletedOnboarding Boolean @default(false)
  
  // Relations
  membershipRequests MembershipRequest[]
  
  // Consent (GDPR)
  consents      ConsentRecord[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([authId])
  @@index([email])
}

model MembershipRequest {
  id          String        @id @default(uuid())
  status      RequestStatus @default(PENDING)
  message     String?       @db.Text
  
  // Appointment (for approved requests)
  appointmentDate DateTime?
  appointmentNotes String?
  
  // Encrypted snapshot of user data at request time (for legal compliance)
  encryptedDataSnapshot Json?
  
  // Relations
  userId      String
  user        Profile       @relation(fields: [userId], references: [id])
  clubId      String
  club        Club          @relation(fields: [clubId], references: [id])
  
  // Admin actions
  reviewedBy  String?       // Admin who reviewed
  reviewedAt  DateTime?
  rejectionReason String?
  
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@unique([userId, clubId]) // Prevent duplicate requests
  @@index([clubId, status])
  @@index([userId])
}

model ConsentRecord {
  id          String   @id @default(uuid())
  userId      String
  user        Profile  @relation(fields: [userId], references: [id])
  
  purpose     String   // 'registration', 'marketing', 'analytics'
  granted     Boolean
  version     String   // Policy version at time of consent
  
  metadata    Json     // { ipHash, userAgent, timestamp }
  
  withdrawnAt DateTime?
  
  createdAt   DateTime @default(now())
  
  @@index([userId, purpose])
}

// Audit Logs (Immutable)
model AuditLog {
  id          String   @id @default(uuid())
  tableName   String
  recordId    String
  operation   String   // INSERT, UPDATE, DELETE
  changedBy   String   // User ID
  changeData  Json     // What changed
  changeHash  String   // SHA256 for integrity
  
  createdAt   DateTime @default(now())
  
  @@index([tableName, recordId])
  @@index([createdAt])
}

// Articles for SEO/Blog
model Article {
  id          String   @id @default(uuid())
  slug        String   @unique
  title       String
  excerpt     String   @db.Text
  content     String   @db.Text
  category    String
  heroImage   String?
  
  // SEO
  metaTitle   String?
  metaDescription String?
  
  // Publishing
  publishedAt DateTime?
  isPublished Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([slug])
  @@index([isPublished, publishedAt])
}
```

### Schema Explanation

#### Club Table
- Stores all publicly visible club information
- Supports SEO with metaTitle/metaDescription
- Images stored as Supabase Storage URLs
- Coordinates stored as JSON for flexibility

#### Profile Table
- Links to Supabase Auth via authId
- Contains encryptedDEK (encrypted per-user key)
- All PII fields encrypted (fullNameEnc, phoneEnc, etc.)
- Public fields: avatarUrl, bio, location, stats
- Consent records tracked separately

#### MembershipRequest Table
- Core business entity connecting users to clubs
- Status workflow: PENDING → APPROVED/REJECTED/SCHEDULED
- Encrypted snapshot preserves user data state at request time (legal compliance)
- Unique constraint prevents duplicate requests

#### ConsentRecord Table
- GDPR compliance: granular consent tracking
- Supports withdrawal with withdrawnAt timestamp
- Metadata includes hashed IP and user agent

#### AuditLog Table
- Immutable record of all data changes
- SHA256 hash ensures integrity
- Cannot be modified (enforced by trigger)

---

## 3. ENCRYPTION STRATEGY (GDPR Compliant)

### Envelope Encryption Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    ENCRYPTION FLOW                         │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  1. USER REGISTRATION                                      │
│     ├─ Generate unique DEK (256-bit random AES key)        │
│     ├─ DEK = random 32-byte key                            │
│     └─ Encrypt DEK with KEK (Master Key)                   │
│                                                            │
│  2. DATA ENCRYPTION                                        │
│     ├─ User submits PII                                    │
│     ├─ Load user's encrypted DEK from DB                   │
│     ├─ Decrypt DEK using KEK (from env var)                │
│     ├─ Encrypt PII using DEK (AES-256-GCM)                 │
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
│     └─ Without DEK, encrypted data is unrecoverable        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Key Hierarchy

1. **Master Key (KEK - Key Encryption Key)**
   - 32-byte random key stored in Vercel environment variables
   - Never exposed to client or stored in database
   - Used only to encrypt/decrypt user DEKs
   - Rotation: Annual (requires re-encryption of all DEKs)

2. **Data Encryption Key (DEK)**
   - Unique 32-byte key generated per user
   - Encrypted with KEK before storage
   - Stored in Profile.encryptedDEK
   - Rotation: On user password change

3. **Encrypted Data**
   - User PII encrypted with user's DEK
   - Format: `iv:authTag:ciphertext`
   - Algorithm: AES-256-GCM

### Implementation Code

```typescript
// lib/encryption.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';

// Master Key from environment (stored in Vercel, never in DB)
const MASTER_KEY = Buffer.from(process.env.APP_MASTER_KEY!, 'hex');

export class EncryptionService {
  /**
   * Generate a new Data Encryption Key (DEK) for a user
   */
  static generateDEK(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Encrypt user's DEK with Master Key
   */
  static encryptDEK(dek: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv(ALGORITHM, MASTER_KEY, iv);
    
    let encrypted = cipher.update(dek, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    // Format: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  /**
   * Decrypt user's DEK with Master Key
   */
  static decryptDEK(encryptedDEK: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedDEK.split(':');
    
    const decipher = createDecipheriv(
      ALGORITHM,
      MASTER_KEY,
      Buffer.from(ivHex, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Encrypt PII field with user's DEK
   */
  static encryptField(data: string, dek: string): string {
    const iv = randomBytes(16);
    const key = Buffer.from(dek, 'hex');
    const cipher = createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  /**
   * Decrypt PII field with user's DEK
   */
  static decryptField(encryptedData: string, dek: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
    
    const key = Buffer.from(dek, 'hex');
    const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, 'hex'));
    
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

### Security Benefits

1. **Even if database is breached**: Attacker gets encrypted data + encrypted DEKs, but cannot decrypt without Master Key
2. **Even if Master Key is leaked**: Attacker must also get database access to decrypt DEKs
3. **Right to erasure**: Deleting encryptedDEK makes all user PII unrecoverable (crypto-shredding)
4. **Key rotation**: Can rotate Master Key annually without re-encrypting all user data

---

## 4. SUPABASE AUTH INTEGRATION

### Auth Flow Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     AUTH FLOW                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  1. USER REGISTRATION                                      │
│     ├─ User submits form (email, password, PII)            │
│     ├─ Server Action validates with Zod                    │
│     ├─ supabase.auth.signUp() creates auth user            │
│     ├─ Trigger auto-creates Profile row                    │
│     ├─ Server generates DEK and encrypts PII               │
│     ├─ Profile updated with encrypted data                 │
│     └─ User redirected to dashboard                        │
│                                                            │
│  2. USER LOGIN                                             │
│     ├─ User submits credentials                            │
│     ├─ supabase.auth.signInWithPassword()                  │
│     ├─ Session cookie set automatically                    │
│     └─ User redirected to dashboard                        │
│                                                            │
│  3. SESSION MANAGEMENT                                     │
│     ├─ Middleware checks session on protected routes       │
│     ├─ createClient() refreshes token if needed            │
│     ├─ RLS policies enforce access control                 │
│     └─ Session expires after inactivity                    │
│                                                            │
│  4. LOGOUT                                                 │
│     ├─ supabase.auth.signOut()                             │
│     ├─ Cookies cleared                                     │
│     └─ User redirected to home                             │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Database Trigger for Profile Creation

```sql
-- Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."Profile" (
    id,
    "authId",
    email,
    "encryptedDEK",
    role
  )
  VALUES (
    gen_random_uuid(),
    NEW.id,
    NEW.email,
    '', -- Will be set by application after signup
    'USER'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Supabase Client Configuration

```typescript
// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

// lib/supabase/client.ts (for Client Components if needed)
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Middleware for Session Management

```typescript
// middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser();
  
  // Route protection logic
  const { pathname } = request.nextUrl;
  
  // Protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/my-requests'];
  const adminRoutes = ['/admin', '/club-panel/dashboard'];
  
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdmin = adminRoutes.some(route => pathname.startsWith(route));
  
  if (isProtected || isAdmin) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (isAdmin) {
      // Check admin role from database
      const { data: profile } = await supabase
        .from('Profile')
        .select('role')
        .eq('authId', user.id)
        .single();
        
      if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'CLUB_ADMIN')) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
```

---

## 5. SERVER ACTIONS (API Layer)

### Why Server Actions?

- **Security**: Code executes only on server, never exposed to client
- **Type Safety**: Full TypeScript support with automatic validation
- **Caching**: Built-in revalidation with `revalidatePath()`
- **Progressive Enhancement**: Works without JavaScript
- **No API Routes Needed**: Direct function calls from components

### Authentication Actions

```typescript
// app/actions/auth.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EncryptionService } from '@/lib/encryption';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  nationality: z.string().optional(),
  consent: z.boolean().refine(val => val === true, {
    message: "You must accept the terms",
  }),
});

export async function signUp(formData: FormData) {
  const supabase = createClient();
  
  // Extract and validate data
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    fullName: formData.get('fullName') as string,
    phone: formData.get('phone') as string,
    birthDate: formData.get('birthDate') as string,
    nationality: formData.get('nationality') as string,
    consent: formData.get('consent') === 'on',
  };
  
  const validated = signUpSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }
  
  // 1. Create auth user in Supabase
  const { data: { user }, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });
  
  if (error || !user) {
    return { error: error?.message || 'Signup failed' };
  }
  
  // 2. Generate encryption keys
  const dek = EncryptionService.generateDEK();
  const encryptedDEK = EncryptionService.encryptDEK(dek);
  
  // 3. Encrypt PII fields
  const fullNameEnc = data.fullName 
    ? EncryptionService.encryptField(data.fullName, dek) 
    : null;
  const phoneEnc = data.phone 
    ? EncryptionService.encryptField(data.phone, dek) 
    : null;
  const birthDateEnc = data.birthDate 
    ? EncryptionService.encryptField(data.birthDate, dek) 
    : null;
  const nationalityEnc = data.nationality 
    ? EncryptionService.encryptField(data.nationality, dek) 
    : null;
  
  // 4. Update profile with encrypted data
  await prisma.profile.update({
    where: { authId: user.id },
    data: {
      encryptedDEK,
      fullNameEnc,
      phoneEnc,
      birthDateEnc,
      nationalityEnc,
      hasCompletedOnboarding: true,
    },
  });
  
  // 5. Record consent for GDPR compliance
  await prisma.consentRecord.create({
    data: {
      userId: user.id,
      purpose: 'registration',
      granted: true,
      version: '1.0',
      metadata: {
        timestamp: new Date().toISOString(),
      },
    },
  });
  
  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function login(formData: FormData) {
  const supabase = createClient();
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }
  
  // Get current profile for DEK
  const profile = await prisma.profile.findUnique({
    where: { authId: user.id },
  });
  
  if (!profile) {
    return { error: 'Profile not found' };
  }
  
  // Decrypt DEK
  const dek = EncryptionService.decryptDEK(profile.encryptedDEK);
  
  // Get form data
  const fullName = formData.get('fullName') as string;
  const phone = formData.get('phone') as string;
  const bio = formData.get('bio') as string;
  const location = formData.get('location') as string;
  
  // Encrypt updated fields
  const updates: any = {
    bio,
    location,
  };
  
  if (fullName) {
    updates.fullNameEnc = EncryptionService.encryptField(fullName, dek);
  }
  if (phone) {
    updates.phoneEnc = EncryptionService.encryptField(phone, dek);
  }
  
  await prisma.profile.update({
    where: { authId: user.id },
    data: updates,
  });
  
  revalidatePath('/profile');
  return { success: true };
}
```

### Club & Discovery Actions

```typescript
// app/actions/clubs.ts
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Cache duration for club data (SEO optimization)
export const revalidate = 3600; // 1 hour

export async function getClubs(filters?: {
  neighborhood?: string;
  amenities?: string[];
  vibes?: string[];
  isVerified?: boolean;
  priceRange?: string[];
}) {
  const where: any = {
    isActive: true,
    isVerified: true,
  };
  
  if (filters?.neighborhood) {
    where.neighborhood = filters.neighborhood;
  }
  
  if (filters?.amenities && filters.amenities.length > 0) {
    where.amenities = {
      hasEvery: filters.amenities,
    };
  }
  
  if (filters?.vibes && filters.vibes.length > 0) {
    where.vibeTags = {
      hasEvery: filters.vibes,
    };
  }
  
  if (filters?.priceRange && filters.priceRange.length > 0) {
    where.priceRange = {
      in: filters.priceRange,
    };
  }
  
  const clubs = await prisma.club.findMany({
    where,
    orderBy: { name: 'asc' },
  });
  
  return clubs;
}

export async function getClubBySlug(slug: string) {
  const club = await prisma.club.findUnique({
    where: { 
      slug,
      isActive: true 
    },
  });
  
  return club;
}

export async function getNeighborhoods() {
  const neighborhoods = await prisma.club.groupBy({
    by: ['neighborhood'],
    where: {
      isActive: true,
      isVerified: true,
    },
    _count: {
      id: true,
    },
  });
  
  return neighborhoods.map(n => ({
    name: n.neighborhood,
    count: n._count.id,
  }));
}

export async function getAllAmenities() {
  const clubs = await prisma.club.findMany({
    where: {
      isActive: true,
      isVerified: true,
    },
    select: {
      amenities: true,
    },
  });
  
  // Flatten and deduplicate
  const allAmenities = clubs.flatMap(c => c.amenities);
  return [...new Set(allAmenities)];
}

export async function getAllVibes() {
  const clubs = await prisma.club.findMany({
    where: {
      isActive: true,
      isVerified: true,
    },
    select: {
      vibeTags: true,
    },
  });
  
  const allVibes = clubs.flatMap(c => c.vibeTags);
  return [...new Set(allVibes)];
}
```

### Membership Request Actions

```typescript
// app/actions/membership.ts
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { EncryptionService } from '@/lib/encryption';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const requestSchema = z.object({
  clubId: z.string().uuid(),
  message: z.string().max(500).optional(),
});

export async function submitMembershipRequest(
  clubId: string,
  message: string
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  // Validate input
  const validated = requestSchema.safeParse({ clubId, message });
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }
  
  // Get user's profile
  const profile = await prisma.profile.findUnique({
    where: { authId: user.id },
  });
  
  if (!profile) {
    throw new Error('Profile not found');
  }
  
  // Check for existing request
  const existing = await prisma.membershipRequest.findUnique({
    where: {
      userId_clubId: {
        userId: profile.id,
        clubId,
      },
    },
  });
  
  if (existing) {
    return { error: 'You have already submitted a request to this club' };
  }
  
  // Decrypt user data for legal snapshot
  const dek = EncryptionService.decryptDEK(profile.encryptedDEK);
  const userSnapshot = {
    fullName: profile.fullNameEnc 
      ? EncryptionService.decryptField(profile.fullNameEnc, dek) 
      : null,
    email: profile.email,
    phone: profile.phoneEnc 
      ? EncryptionService.decryptField(profile.phoneEnc, dek) 
      : null,
    birthDate: profile.birthDateEnc 
      ? EncryptionService.decryptField(profile.birthDateEnc, dek) 
      : null,
    nationality: profile.nationalityEnc 
      ? EncryptionService.decryptField(profile.nationalityEnc, dek) 
      : null,
    timestamp: new Date().toISOString(),
  };
  
  // Encrypt snapshot with separate key
  const snapshotKey = process.env.SNAPSHOT_KEY!;
  const encryptedSnapshot = EncryptionService.encryptField(
    JSON.stringify(userSnapshot),
    snapshotKey
  );
  
  // Create request
  const request = await prisma.membershipRequest.create({
    data: {
      clubId,
      userId: profile.id,
      message,
      encryptedDataSnapshot: { data: encryptedSnapshot },
    },
    include: {
      club: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });
  
  revalidatePath('/my-requests');
  return { success: true, request };
}

export async function getUserRequests() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  const profile = await prisma.profile.findUnique({
    where: { authId: user.id },
    include: {
      membershipRequests: {
        include: {
          club: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
              neighborhood: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  
  return profile?.membershipRequests || [];
}

export async function cancelRequest(requestId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  const profile = await prisma.profile.findUnique({
    where: { authId: user.id },
  });
  
  if (!profile) {
    throw new Error('Profile not found');
  }
  
  // Verify ownership and pending status
  const request = await prisma.membershipRequest.findFirst({
    where: {
      id: requestId,
      userId: profile.id,
      status: 'PENDING',
    },
  });
  
  if (!request) {
    return { error: 'Request not found or cannot be cancelled' };
  }
  
  await prisma.membershipRequest.delete({
    where: { id: requestId },
  });
  
  revalidatePath('/my-requests');
  return { success: true };
}
```

### Admin Actions

```typescript
// app/actions/admin.ts
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Admin authentication helper
async function verifyAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  const profile = await prisma.profile.findUnique({
    where: { authId: user.id },
  });
  
  if (!profile || profile.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required');
  }
  
  return profile;
}

export async function getAllRequests() {
  await verifyAdmin();
  
  const requests = await prisma.membershipRequest.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullNameEnc: true,
          encryptedDEK: true,
        },
      },
      club: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  
  return requests;
}

export async function getClubRequests(clubId: string) {
  await verifyAdmin();
  
  const requests = await prisma.membershipRequest.findMany({
    where: { clubId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullNameEnc: true,
          encryptedDEK: true,
        },
      },
    },
    orderBy: [
      { status: 'asc' }, // PENDING first
      { createdAt: 'desc' },
    ],
  });
  
  return requests;
}

export async function approveRequest(requestId: string, notes?: string) {
  const admin = await verifyAdmin();
  
  await prisma.membershipRequest.update({
    where: { id: requestId },
    data: {
      status: 'APPROVED',
      reviewedBy: admin.id,
      reviewedAt: new Date(),
      appointmentNotes: notes,
    },
  });
  
  revalidatePath('/admin/requests');
  revalidatePath('/club-panel/dashboard');
  return { success: true };
}

export async function rejectRequest(requestId: string, reason: string) {
  const admin = await verifyAdmin();
  
  await prisma.membershipRequest.update({
    where: { id: requestId },
    data: {
      status: 'REJECTED',
      reviewedBy: admin.id,
      reviewedAt: new Date(),
      rejectionReason: reason,
    },
  });
  
  revalidatePath('/admin/requests');
  revalidatePath('/club-panel/dashboard');
  return { success: true };
}

export async function scheduleRequest(
  requestId: string, 
  appointmentDate: Date, 
  notes?: string
) {
  const admin = await verifyAdmin();
  
  await prisma.membershipRequest.update({
    where: { id: requestId },
    data: {
      status: 'SCHEDULED',
      appointmentDate,
      appointmentNotes: notes,
      reviewedBy: admin.id,
      reviewedAt: new Date(),
    },
  });
  
  revalidatePath('/admin/requests');
  revalidatePath('/club-panel/dashboard');
  return { success: true };
}

// Club Management
const clubSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  neighborhood: z.string(),
  addressDisplay: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  contactEmail: z.string().email(),
  phoneNumber: z.string().optional(),
  website: z.string().url().optional(),
  amenities: z.array(z.string()),
  vibeTags: z.array(z.string()),
  priceRange: z.enum(['$', '$$', '$$$']),
  capacity: z.number().int().positive(),
  foundedYear: z.number().int(),
  openingHours: z.record(z.string()),
});

export async function createClub(data: z.infer<typeof clubSchema>) {
  await verifyAdmin();
  
  const validated = clubSchema.parse(data);
  
  const club = await prisma.club.create({
    data: {
      ...validated,
      isVerified: true,
      isActive: true,
      allowsPreRegistration: true,
    },
  });
  
  revalidatePath('/clubs');
  revalidatePath(`/clubs/${club.slug}`);
  return { success: true, club };
}

export async function updateClub(
  clubId: string, 
  data: Partial<z.infer<typeof clubSchema>>
) {
  await verifyAdmin();
  
  const club = await prisma.club.update({
    where: { id: clubId },
    data,
  });
  
  revalidatePath('/clubs');
  revalidatePath(`/clubs/${club.slug}`);
  return { success: true, club };
}

export async function deleteClub(clubId: string) {
  await verifyAdmin();
  
  // Soft delete
  await prisma.club.update({
    where: { id: clubId },
    data: { isActive: false },
  });
  
  revalidatePath('/clubs');
  return { success: true };
}
```

---

## 6. ROW LEVEL SECURITY (RLS) POLICIES

### Enable RLS on All Tables

```sql
-- Enable RLS
ALTER TABLE public."Club" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."MembershipRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ConsentRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Article" ENABLE ROW LEVEL SECURITY;

-- AuditLog: Only service role can access
CREATE POLICY "Audit logs restricted" ON public."AuditLog"
  FOR ALL USING (false);
```

### Club Policies

```sql
-- Public can read verified active clubs
CREATE POLICY "Public can view verified clubs" ON public."Club"
  FOR SELECT USING (is_verified = true AND is_active = true);

-- Only admins can create/modify clubs
CREATE POLICY "Only admins can create clubs" ON public."Club"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."Profile" 
      WHERE auth_id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Only admins can update clubs" ON public."Club"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public."Profile" 
      WHERE auth_id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Only admins can delete clubs" ON public."Club"
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public."Profile" 
      WHERE auth_id = auth.uid() AND role = 'ADMIN'
    )
  );
```

### Profile Policies

```sql
-- Users can view own profile
CREATE POLICY "Users can view own profile" ON public."Profile"
  FOR SELECT USING (auth_id = auth.uid());

-- Users can update own profile
CREATE POLICY "Users can update own profile" ON public."Profile"
  FOR UPDATE USING (auth_id = auth.uid());

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public."Profile"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public."Profile" AS p
      WHERE p.auth_id = auth.uid() AND p.role = 'ADMIN'
    )
  );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON public."Profile"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public."Profile" AS p
      WHERE p.auth_id = auth.uid() AND p.role = 'ADMIN'
    )
  );
```

### MembershipRequest Policies

```sql
-- Users can view own requests
CREATE POLICY "Users can view own requests" ON public."MembershipRequest"
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM public."Profile" WHERE auth_id = auth.uid()
    )
  );

-- Users can create requests
CREATE POLICY "Users can create requests" ON public."MembershipRequest"
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM public."Profile" WHERE auth_id = auth.uid()
    )
  );

-- Users can cancel (delete) pending requests
CREATE POLICY "Users can cancel pending requests" ON public."MembershipRequest"
  FOR DELETE USING (
    user_id IN (
      SELECT id FROM public."Profile" WHERE auth_id = auth.uid()
    ) AND status = 'PENDING'
  );

-- Admins can view all requests
CREATE POLICY "Admins can view all requests" ON public."MembershipRequest"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public."Profile" 
      WHERE auth_id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Admins can update all requests
CREATE POLICY "Admins can update requests" ON public."MembershipRequest"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public."Profile" 
      WHERE auth_id = auth.uid() AND role = 'ADMIN'
    )
  );
```

### Article Policies

```sql
-- Public can read published articles
CREATE POLICY "Public can read published articles" ON public."Article"
  FOR SELECT USING (is_published = true);

-- Admins can manage articles
CREATE POLICY "Admins can manage articles" ON public."Article"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public."Profile" 
      WHERE auth_id = auth.uid() AND role = 'ADMIN'
    )
  );
```

### ConsentRecord Policies

```sql
-- Users can view own consent records
CREATE POLICY "Users can view own consents" ON public."ConsentRecord"
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM public."Profile" WHERE auth_id = auth.uid()
    )
  );

-- Users can create consent records
CREATE POLICY "Users can create consents" ON public."ConsentRecord"
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM public."Profile" WHERE auth_id = auth.uid()
    )
  );

-- Users can update (withdraw) own consents
CREATE POLICY "Users can update own consents" ON public."ConsentRecord"
  FOR UPDATE USING (
    user_id IN (
      SELECT id FROM public."Profile" WHERE auth_id = auth.uid()
    )
  );
```

---

## 7. FILE STORAGE ARCHITECTURE

### Supabase Storage Buckets

```typescript
// lib/storage.ts
import { createClient } from '@/lib/supabase/server';

export type UploadResult = {
  url: string;
  path: string;
};

export class StorageService {
  /**
   * Upload club image
   */
  static async uploadClubImage(
    clubSlug: string,
    file: File
  ): Promise<UploadResult> {
    const supabase = createClient();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `clubs/${clubSlug}/${fileName}`;
    
    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    
    const { data, error } = await supabase.storage
      .from('public-assets')
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('public-assets')
      .getPublicUrl(filePath);
    
    return { url: publicUrl, path: filePath };
  }

  /**
   * Upload user avatar
   */
  static async uploadAvatar(
    userId: string,
    file: File
  ): Promise<UploadResult> {
    const supabase = createClient();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar.${fileExt}`;
    const filePath = `avatars/${userId}/${fileName}`;
    
    const arrayBuffer = await file.arrayBuffer();
    
    const { data, error } = await supabase.storage
      .from('user-assets')
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true, // Allow replacing existing avatar
      });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('user-assets')
      .getPublicUrl(filePath);
    
    return { url: publicUrl, path: filePath };
  }

  /**
   * Delete file from storage
   */
  static async deleteFile(bucket: string, path: string): Promise<void> {
    const supabase = createClient();
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) throw error;
  }
}
```

### Storage Bucket Configuration

```sql
-- Create buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('public-assets', 'public-assets', true),
  ('user-assets', 'user-assets', true);

-- Policies for public-assets (Club images)
CREATE POLICY "Public can read club images" ON storage.objects
  FOR SELECT USING (bucket_id = 'public-assets');

CREATE POLICY "Admins can upload club images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'public-assets' AND
    EXISTS (
      SELECT 1 FROM public."Profile" 
      WHERE auth_id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can delete club images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'public-assets' AND
    EXISTS (
      SELECT 1 FROM public."Profile" 
      WHERE auth_id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Policies for user-assets (Avatars)
CREATE POLICY "Public can read avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-assets');

CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-assets' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user-assets' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-assets' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

### Image Optimization

```typescript
// lib/image-optimization.ts
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): string {
  // Supabase Storage supports image transformations
  // Add transform params to URL
  const transformParams = new URLSearchParams();
  
  if (options.width) transformParams.set('width', options.width.toString());
  if (options.height) transformParams.set('height', options.height.toString());
  if (options.quality) transformParams.set('quality', options.quality.toString());
  if (options.format) transformParams.set('format', options.format);
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${transformParams.toString()}`;
}

// Usage in components
// <Image 
//   src={getOptimizedImageUrl(club.images[0], { width: 800, format: 'webp' })}
//   alt={club.name}
// />
```

---

## 8. ENVIRONMENT CONFIGURATION

### Required Environment Variables

```bash
# ============================================================================
# DATABASE (Supabase - Frankfurt Region)
# ============================================================================

# Transaction pooler for serverless functions (port 6543)
# Use this for all runtime database connections
DATABASE_URL="postgres://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection for Prisma migrations (port 5432)
# Only used during migrations, not in production runtime
DIRECT_URL="postgres://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# ============================================================================
# SUPABASE
# ============================================================================

# Project URL
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"

# Anon key (safe for client-side)
NEXT_PUBLIC_SUPABASE_ANON_KEY="[anon-key]"

# Service role key (server-side only!)
SUPABASE_SERVICE_ROLE_KEY="[service-role-key]"

# ============================================================================
# SECURITY (CRITICAL - Keep Secret!)
# ============================================================================

# Master encryption key for DEK encryption
# Generate: openssl rand -hex 32
APP_MASTER_KEY="[64-character-hex-string]"

# Snapshot encryption key for membership request snapshots
# Use different key from APP_MASTER_KEY for defense in depth
SNAPSHOT_KEY="[64-character-hex-string]"

# ============================================================================
# APPLICATION
# ============================================================================

NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_NAME="SocialClubsMaps"

# ============================================================================
# OPTIONAL: Monitoring & Analytics (GDPR Compliant)
# ============================================================================

# Sentry for error tracking (EU region)
# SENTRY_DSN=""

# Plausible or Fathom for privacy-focused analytics
# NEXT_PUBLIC_ANALYTICS_URL=""
```

### Environment Variable Setup Guide

1. **Supabase Project Setup**:
   ```bash
   # Create project in Frankfurt (eu-central-1)
   # Go to: https://supabase.com/dashboard
   # Create New Project → Select Frankfurt region
   
   # Get connection strings:
   # Settings → Database → Connection Pooling (for DATABASE_URL)
   # Settings → Database → URI (for DIRECT_URL)
   ```

2. **Generate Encryption Keys**:
   ```bash
   # Generate two separate 32-byte keys
   openssl rand -hex 32  # APP_MASTER_KEY
   openssl rand -hex 32  # SNAPSHOT_KEY
   ```

3. **Vercel Environment Variables**:
   ```bash
   # Add to Vercel project settings
   vercel env add DATABASE_URL
   vercel env add DIRECT_URL
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   vercel env add APP_MASTER_KEY
   vercel env add SNAPSHOT_KEY
   ```

4. **Local Development**:
   ```bash
   # Copy to .env.local
   cp .env.example .env.local
   
   # Fill in values
   # Never commit .env.local to git!
   ```

---

9. FRONTEND INTEGRATION

### Replacing Mock Hooks

```typescript
// hooks/useClubs.ts - Updated with real data
'use client';

import { useEffect, useState, useCallback } from 'react';
import { getClubs, getClubBySlug } from '@/app/actions/clubs';
import { Club } from '@/lib/types';

export function useClubs(filters?: {
  neighborhood?: string;
  amenities?: string[];
  vibes?: string[];
}) {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let cancelled = false;
    
    async function loadClubs() {
      try {
        setLoading(true);
        const data = await getClubs(filters);
        if (!cancelled) {
          setClubs(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load clubs');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    
    loadClubs();
    
    return () => { cancelled = true; };
  }, [
    filters?.neighborhood,
    filters?.amenities?.join(','),
    filters?.vibes?.join(',')
  ]);
  
  return { clubs, loading, error };
}

export function useClub(slug: string) {
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let cancelled = false;
    
    async function loadClub() {
      try {
        setLoading(true);
        const data = await getClubBySlug(slug);
        if (!cancelled) {
          setClub(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load club');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    
    loadClub();
    
    return () => { cancelled = true; };
  }, [slug]);
  
  return { club, loading, error };
}
```

### Profile Page (Server Component with Decryption)

```typescript
// app/profile/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { EncryptionService } from '@/lib/encryption';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  // Fetch profile with Prisma
  const profile = await prisma.profile.findUnique({
    where: { authId: user.id },
    include: {
      membershipRequests: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          club: {
            select: {
              name: true,
              slug: true,
              images: true,
            },
          },
        },
      },
    },
  });
  
  if (!profile) {
    redirect('/login');
  }
  
  // Decrypt PII for display
  const dek = EncryptionService.decryptDEK(profile.encryptedDEK);
  
  const decryptedProfile = {
    id: profile.id,
    email: profile.email,
    role: profile.role,
    tier: profile.tier,
    // Decrypted fields
    fullName: profile.fullNameEnc 
      ? EncryptionService.decryptField(profile.fullNameEnc, dek) 
      : null,
    phone: profile.phoneEnc 
      ? EncryptionService.decryptField(profile.phoneEnc, dek) 
      : null,
    birthDate: profile.birthDateEnc 
      ? EncryptionService.decryptField(profile.birthDateEnc, dek) 
      : null,
    nationality: profile.nationalityEnc 
      ? EncryptionService.decryptField(profile.nationalityEnc, dek) 
      : null,
    // Non-encrypted fields
    avatarUrl: profile.avatarUrl,
    bio: profile.bio,
    location: profile.location,
    preferences: profile.preferences,
    stats: profile.stats,
    isVerified: profile.isVerified,
    isPremium: profile.isPremium,
    memberSince: profile.createdAt,
    // Recent requests
    recentRequests: profile.membershipRequests,
  };
  
  return <ProfileClient profile={decryptedProfile} />;
}
```

### Client Component for Interactivity

```typescript
// app/profile/ProfileClient.tsx
'use client';

import { useState } from 'react';
import { updateProfile } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ProfileClientProps {
  profile: {
    id: string;
    email: string;
    fullName: string | null;
    phone: string | null;
    bio: string | null;
    location: string | null;
    // ... other fields
  };
}

export default function ProfileClient({ profile }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: profile.fullName || '',
    phone: profile.phone || '',
    bio: profile.bio || '',
    location: profile.location || '',
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const form = new FormData();
    form.append('fullName', formData.fullName);
    form.append('phone', formData.phone);
    form.append('bio', formData.bio);
    form.append('location', formData.location);
    
    const result = await updateProfile(form);
    
    setIsSaving(false);
    
    if (result.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      setIsEditing(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <div className="space-y-4">
          <div>
            <label>Full Name</label>
            <Input
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          {/* Other fields... */}
        </div>
        
        {isEditing ? (
          <div className="flex gap-2 mt-6">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        ) : (
          <Button 
            type="button"
            onClick={() => setIsEditing(true)}
            className="mt-6"
          >
            Edit Profile
          </Button>
        )}
      </form>
    </div>
  );
}
```

### Club Detail Page (Static Generation)

```typescript
// app/clubs/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getClubBySlug, getClubs } from '@/app/actions/clubs';
import ClubProfileContent from './ClubProfileContent';
import { Metadata } from 'next';

// Generate static params for all clubs at build time
export async function generateStaticParams() {
  const clubs = await getClubs();
  
  return clubs.map((club) => ({
    slug: club.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const club = await getClubBySlug(params.slug);
  
  if (!club) {
    return {
      title: 'Club Not Found',
    };
  }
  
  return {
    title: `${club.name} | Cannabis Social Club in ${club.neighborhood}`,
    description: club.shortDescription || club.description.slice(0, 160),
    openGraph: {
      title: club.name,
      description: club.shortDescription || club.description.slice(0, 160),
      images: club.images.slice(0, 1),
      type: 'article',
    },
  };
}

export default async function ClubPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const club = await getClubBySlug(params.slug);

  if (!club) {
    notFound();
  }

  return <ClubProfileContent club={club} />;
}
```

---

## 10. IMPLEMENTATION ROADMAP

### Phase 1: Infrastructure Setup (Day 1)

- [ ] 1. Create Supabase project in **Frankfurt (eu-central-1)** region
- [ ] 2. Install dependencies:
  ```bash
  npm install @supabase/ssr @prisma/client zod
  npm install -D prisma
  ```
- [ ] 3. Initialize Prisma:
  ```bash
  npx prisma init
  ```
- [ ] 4. Copy schema from this document to `prisma/schema.prisma`
- [ ] 5. Set up environment variables in `.env.local`
- [ ] 6. Run initial migration:
  ```bash
  npx prisma db push
  ```

### Phase 2: Auth System (Day 1-2)

- [ ] 1. Create auth trigger in Supabase SQL Editor
- [ ] 2. Implement encryption service (`lib/encryption.ts`)
- [ ] 3. Set up Supabase server client (`lib/supabase/server.ts`)
- [ ] 4. Create Next.js middleware (`middleware.ts`)
- [ ] 5. Implement auth server actions (`app/actions/auth.ts`)
- [ ] 6. Build login page (`app/login/page.tsx`)
- [ ] 7. Build signup page (`app/signup/page.tsx`)

### Phase 3: Database Seeding (Day 2)

- [ ] 1. Create seed script (`prisma/seed.ts`):
  ```typescript
  // Seed initial club for MVP
  const seedClub = {
    slug: 'green-harmony-madrid',
    name: 'Green Harmony Madrid',
    description: 'Un espacio acogedor en el corazón de Malasaña...',
    neighborhood: 'Malasaña',
    city: 'Madrid',
    addressDisplay: 'Calle del Espíritu Santo, Malasaña',
    coordinates: { lat: 40.4245, lng: -3.7038 },
    contactEmail: 'info@yourclub.com',
    phoneNumber: '+34 91 123 4567',
    website: 'https://yourclub.com',
    isVerified: true,
    isActive: true,
    allowsPreRegistration: true,
    amenities: ['WiFi', 'Chill Out', 'Juegos de Mesa', 'Música en Vivo'],
    vibeTags: ['Relajado', 'Social', 'Creativo'],
    priceRange: '$$',
    capacity: 85,
    foundedYear: 2019,
    openingHours: {
      monday: '16:00 - 00:00',
      tuesday: '16:00 - 00:00',
      wednesday: '16:00 - 00:00',
      thursday: '16:00 - 02:00',
      friday: '16:00 - 02:00',
      saturday: '14:00 - 02:00',
      sunday: '14:00 - 00:00',
    },
    images: [
      'https://images.pexels.com/photos/4113892/pexels-photo-4113892.jpeg',
      'https://images.pexels.com/photos/7492875/pexels-photo-7492875.jpeg',
    ],
  };
  ```
- [ ] 2. Run seed:
  ```bash
  npx prisma db seed
  ```
- [ ] 3. Create admin user via Supabase Auth
- [ ] 4. Set admin role in database

### Phase 4: Club Discovery (Day 2-3)

- [ ] 1. Update `app/clubs/page.tsx` to use real data
- [ ] 2. Implement filtering with server actions
- [ ] 3. Update `ClubCard` component
- [ ] 4. Implement club detail page with SSG
- [ ] 5. Add image optimization
- [ ] 6. Set up revalidation on club updates

### Phase 5: User Features (Day 3-4)

- [ ] 1. Update profile page with decryption
- [ ] 2. Implement profile editing
- [ ] 3. Create membership request form
- [ ] 4. Build user dashboard (`app/dashboard/page.tsx`)
- [ ] 5. Create "My Requests" page (`app/my-requests/page.tsx`)
- [ ] 6. Implement request cancellation

### Phase 6: Admin Panel (Day 4-5)

- [ ] 1. Create admin layout with sidebar
- [ ] 2. Build request management interface
- [ ] 3. Implement approve/reject actions
- [ ] 4. Create club editor form
- [ ] 5. Add club image upload
- [ ] 6. Implement analytics view

### Phase 7: SEO & Performance (Day 5)

- [ ] 1. Generate sitemap.xml:
  ```typescript
  // app/sitemap.ts
  import { getClubs } from '@/app/actions/clubs';
  
  export default async function sitemap() {
    const clubs = await getClubs();
    
    return [
      {
        url: 'https://yourdomain.com',
        lastModified: new Date(),
      },
      {
        url: 'https://yourdomain.com/clubs',
        lastModified: new Date(),
      },
      ...clubs.map((club) => ({
        url: `https://yourdomain.com/clubs/${club.slug}`,
        lastModified: club.updatedAt,
      })),
    ];
  }
  ```
- [ ] 2. Create robots.txt:
  ```typescript
  // app/robots.ts
  export default function robots() {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/profile/'],
      },
      sitemap: 'https://yourdomain.com/sitemap.xml',
    };
  }
  ```
- [ ] 3. Add structured data (JSON-LD) for clubs
- [ ] 4. Configure caching headers in next.config.js
- [ ] 5. Set up ISR revalidation

### Phase 8: Testing & Deployment (Day 5-6)

- [ ] 1. Test authentication flow
- [ ] 2. Test encryption/decryption
- [ ] 3. Test membership request workflow
- [ ] 4. Test admin panel functionality
- [ ] 5. Run Lighthouse audit
- [ ] 6. Deploy to Vercel (Frankfurt region)
- [ ] 7. Configure custom domain
- [ ] 8. Set up SSL certificate

---

## 11. GDPR COMPLIANCE IMPLEMENTATION

### Data Retention Policies

```typescript
// app/actions/admin.ts

export async function runDataRetentionCleanup() {
  const admin = await verifyAdmin();
  
  // 1. Soft delete users inactive for 2 years
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  
  await prisma.profile.updateMany({
    where: {
      updatedAt: { lt: twoYearsAgo },
      role: 'USER',
    },
    data: {
      // Clear encrypted fields (crypto-shredding)
      encryptedDEK: '',
      fullNameEnc: null,
      phoneEnc: null,
      birthDateEnc: null,
      nationalityEnc: null,
      bio: null,
      isActive: false,
    },
  });
  
  // 2. Delete old audit logs (keep 1 year)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  // Note: Audit logs should be archived before deletion
  // await prisma.auditLog.deleteMany({
  //   where: { createdAt: { lt: oneYearAgo } },
  // });
  
  // 3. Anonymize old membership requests (keep 1 year after resolution)
  const oneYearAgoRequests = new Date();
  oneYearAgoRequests.setFullYear(oneYearAgoRequests.getFullYear() - 1);
  
  await prisma.membershipRequest.updateMany({
    where: {
      status: { in: ['APPROVED', 'REJECTED'] },
      reviewedAt: { lt: oneYearAgoRequests },
    },
    data: {
      message: '[REDACTED]',
      encryptedDataSnapshot: null,
    },
  });
}
```

### Right to Erasure (Crypto-Shredding)

```typescript
// app/actions/user.ts

export async function deleteAccount() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }
  
  // 1. Delete DEK (renders all PII unrecoverable)
  await prisma.profile.update({
    where: { authId: user.id },
    data: {
      encryptedDEK: '',
      fullNameEnc: null,
      phoneEnc: null,
      birthDateEnc: null,
      nationalityEnc: null,
      bio: '[DELETED]',
      avatarUrl: null,
      isActive: false,
    },
  });
  
  // 2. Cancel pending requests
  await prisma.membershipRequest.deleteMany({
    where: {
      userId: user.id,
      status: 'PENDING',
    },
  });
  
  // 3. Anonymize approved/rejected requests
  await prisma.membershipRequest.updateMany({
    where: {
      userId: user.id,
      status: { in: ['APPROVED', 'REJECTED'] },
    },
    data: {
      encryptedDataSnapshot: null,
    },
  });
  
  // 4. Delete auth user (triggers cascade)
  await supabase.auth.admin.deleteUser(user.id);
  
  redirect('/');
}
```

### Consent Management

```typescript
// app/actions/consent.ts

export async function recordConsent(
  purpose: 'registration' | 'marketing' | 'analytics',
  granted: boolean
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }
  
  const profile = await prisma.profile.findUnique({
    where: { authId: user.id },
  });
  
  if (!profile) {
    throw new Error('Profile not found');
  }
  
  await prisma.consentRecord.create({
    data: {
      userId: profile.id,
      purpose,
      granted,
      version: '1.0', // Track policy version
      metadata: {
        timestamp: new Date().toISOString(),
        // In production: hash IP, truncate user agent
      },
    },
  });
}

export async function withdrawConsent(purpose: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }
  
  const profile = await prisma.profile.findUnique({
    where: { authId: user.id },
  });
  
  if (!profile) {
    throw new Error('Profile not found');
  }
  
  // Update existing consent record
  await prisma.consentRecord.updateMany({
    where: {
      userId: profile.id,
      purpose,
      withdrawnAt: null,
    },
    data: {
      granted: false,
      withdrawnAt: new Date(),
    },
  });
}
```

---

## 12. MVP LAUNCH CHECKLIST

### Pre-Launch Requirements

- [ ] **Legal**:
  - [ ] Privacy Policy page created
  - [ ] Terms of Service page created
  - [ ] Cookie consent banner implemented
  - [ ] Age verification (18+) on signup
  - [ ] Contact information displayed

- [ ] **Security**:
  - [ ] All environment variables set
  - [ ] Master encryption keys generated and stored
  - [ ] RLS policies tested and verified
  - [ ] Admin access restricted
  - [ ] No secrets in client-side code
  - [ ] HTTPS enforced

- [ ] **SEO**:
  - [ ] Meta tags on all pages
  - [ ] Sitemap generated
  - [ ] robots.txt configured
  - [ ] Structured data (JSON-LD) for club
  - [ ] OG tags for social sharing
  - [ ] Canonical URLs set

- [ ] **Performance**:
  - [ ] Images optimized (WebP format)
  - [ ] Lazy loading implemented
  - [ ] Core Web Vitals passing
  - [ ] Static generation working
  - [ ] Caching configured

- [ ] **Functionality**:
  - [ ] User signup working
  - [ ] User login working
  - [ ] Profile editing working
  - [ ] Club discovery working
  - [ ] Membership request submission working
  - [ ] Admin request approval working
  - [ ] Email notifications configured (optional)

- [ ] **Monitoring**:
  - [ ] Error tracking set up (Sentry)
  - [ ] Analytics configured (GDPR-compliant)
  - [ ] Health check endpoint working
  - [ ] Database backups confirmed

### Post-Launch Tasks

- [ ] Submit sitemap to Google Search Console
- [ ] Create social media profiles
- [ ] Set up email forwarding for club contact
- [ ] Monitor for user feedback
- [ ] Track membership request conversion rate
- [ ] Plan content marketing strategy
- [ ] Prepare for second club launch

---

## 13. COST ESTIMATES

### Supabase Free Tier (Sufficient for MVP)

| Resource | Limit | Usage Estimate |
|----------|-------|----------------|
| Database | 500 MB | ~50 MB (text data) |
| Auth | 50,000 MAU | < 1,000 (initial) |
| Storage | 1 GB | ~500 MB (images) |
| Bandwidth | 2 GB/month | < 1 GB (initial) |
| **Cost** | **$0/month** | |

### Vercel Hobby (Free Tier)

| Resource | Limit | Usage Estimate |
|----------|-------|----------------|
| Bandwidth | 100 GB/month | < 10 GB |
| Build Minutes | 6,000/month | < 100 |
| **Cost** | **$0/month** | |

### Paid Upgrades (When Needed)

- **Supabase Pro**: $25/month (when > 500MB database)
- **Vercel Pro**: $20/month (when > 100GB bandwidth)
- **Estimated Monthly Cost at Scale**: $45-100/month

---

## 14. RISK MITIGATION

### Platform Risk (Supabase/Vercel)

**Risk**: Service suspension due to cannabis-related content

**Mitigation**:
1. Use neutral branding ("Social Clubs")
2. Avoid direct product mentions
3. Implement content moderation
4. Regular database backups to S3
5. Containerize for quick migration if needed

### Data Breach Response

**Detection**:
- Unusual database access patterns
- Failed decryption spikes
- Admin access alerts

**Response Plan**:
1. Revoke compromised credentials (Hour 0)
2. Isolate affected systems (Hour 1)
3. Assess data types affected (Hour 2)
4. Notify DPA within 72 hours if required
5. User notification if high risk

### Key Compromise

**Scenario**: Master encryption key leaked

**Response**:
1. Generate new Master Key immediately
2. Re-encrypt all DEKs with new key
3. Force password reset for all users
4. Audit access logs
5. Document incident

---

## 15. NEXT STEPS

### Immediate Actions

1. **Set up Supabase project** (30 minutes):
   - Go to https://supabase.com
   - Create project in Frankfurt region
   - Save connection strings

2. **Configure environment** (15 minutes):
   - Generate encryption keys
   - Set up .env.local
   - Install dependencies

3. **Run initial migration** (10 minutes):
   ```bash
   npx prisma db push
   ```

4. **Test auth flow** (30 minutes):
   - Create test user
   - Verify encryption works
   - Check RLS policies

### Success Metrics

- [ ] User can sign up with encrypted data
- [ ] User can view club directory
- [ ] User can submit membership request
- [ ] Admin can approve/reject requests
- [ ] All pages load < 3 seconds
- [ ] Lighthouse score > 90

---

## Summary

This architecture provides:

✅ **Production-Ready Security**: Envelope encryption, RLS policies, secure auth  
✅ **GDPR Compliance**: EU-only, data retention, right to erasure, consent tracking  
✅ **SEO Optimized**: Static generation, structured data, fast loading  
✅ **Cost Effective**: Free tier sufficient for MVP launch  
✅ **Scalable Foundation**: Ready for 100+ clubs when you expand  
✅ **MVP Focused**: Single club launch, pre-registration workflow  

**Estimated Time to Launch**: 5-7 days with this plan

**Next Action**: Start with Phase 1 - create Supabase project in Frankfurt region.
