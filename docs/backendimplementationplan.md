🏗️ SURGICAL BACKEND INTEGRATION PLAN
"The Nervous System" - Connecting Frontend to Reality
---
EXECUTIVE SUMMARY
The frontend is "God Level" but it's running on mock data. To make this a real business, we need to wire up the "nervous system"—the backend infrastructure that:
- Tracks real application statuses
- Generates actual Safety Passes
- Sends automated emails at each stage
- Notifies club admins in real-time
- Protects gated content based on verification status
Effort Estimate: 2-3 weeks (surgical, not sloppy)
Priority: HIGH (without this, the "God Level" UI is just a demo)
---
0. DOC-TO-CODE GAP MATRIX (Task 1)

| Area | Plan Claim (Section) | Status | Evidence in Codebase | Gap Note |
|---|---|---|---|---|
| Data model | Add `SafetyPass`, `MembershipApplication`, `ApplicationStageHistory`, `ClubAdminNotification` (`1. THE DATA MODELS`) | MISSING | `prisma/schema.prisma` defines `MembershipRequest`, `Notification`, `AuditLog`; none of the four planned models exist | Major schema gap before pipeline/pass features can be implemented. |
| Data model | Current baseline includes `Profile`, `Club`, `MembershipRequest` (`1. THE DATA MODELS` current state) | MATCH | `prisma/schema.prisma` has `model Profile`, `model Club`, `model MembershipRequest` | Baseline statement is accurate. |
| Data model | Notification model is multi-channel with delivery lifecycle (`1. THE DATA MODELS` Notification) | DRIFT | `prisma/schema.prisma` `model Notification` has `type`, `title`, `message`, `isRead`, `data` but no `channel`, delivery timestamps, or `applicationId` relation | Existing notification shape is simpler than planned workflow. |
| API/action layer | New actions in `app/actions/safety-pass.ts`, `applications.ts`, `notifications.ts`, `gated-content.ts` (`2. SERVER ACTIONS`) | MISSING | `app/actions` currently includes `auth.ts`, `membership.ts`, `clubs.ts`, etc.; planned action files are absent | Planned backend action surface is not implemented yet. |
| API/action layer | Membership pipeline is stage-driven (`submitMembershipApplication`, `advanceApplicationStage`) (`2.B`) | DRIFT | `app/actions/membership.ts` implements `submitMembershipRequest`, `approveClubMembershipRequest`, `rejectClubMembershipRequest` on `MembershipRequest` | Existing flow is request approve/reject, not multi-stage application pipeline. |
| Infra/provider | Hosting stack assumes Netlify + Supabase free-tier baseline (`INFRASTRUCTURE.md`) vs plan cost table (`9. INFRASTRUCTURE COSTS`) | OVER-SCOPED | `INFRASTRUCTURE.md` states Netlify Free Tier + Supabase Free Tier; this doc budgets Supabase Pro + Vercel Pro + Resend (~$55/month) | Current plan exceeds zero-cost Netlify-first objective and introduces provider drift. |
| Security posture | Encrypt sensitive applicant/user data (`8. THE "SURGICAL" APPROACH`) | MATCH | `app/actions/auth.ts` uses `EncryptionService.encrypt`; `app/actions/membership.ts` uses `EncryptionService.encryptPII` for snapshots | Encryption-at-write behavior is present in current server actions. |
| Security posture | Full audit trail for stage transitions (`8. THE "SURGICAL" APPROACH`) | DRIFT | `prisma/schema.prisma` has `AuditLog`; `app/actions/auth.ts` logs auth via `logAuthAuditEvent`, but no `ApplicationStageHistory` model/action usage exists | Audit exists for auth events, not for planned application-stage transitions. |

---
0.1 FREE-TIER OPERATIONAL GUARDRAILS (Task 2)

Zero-cost policy: treat Free tier quotas as a hard budget. Keep Netlify auto-recharge disabled and react before you hit vendor-enforced pauses/limits.

Operational rule: hitting `Warn Threshold` triggers the fallback action within 24 hours; hitting `Hard Stop` triggers immediate degradation (reduce load first; do not upgrade plans to "solve" quota).

| Area | Provider | Current Free Limit | Warn Threshold | Hard Stop | Fallback Action |
|---|---|---|---|---|---|
| DB size | Supabase (Postgres) | 500 MB per project | 350 MB (~70%) | 450 MB (~90%) | Stop storing large JSON snapshots; shorten retention (notifications, audit-like logs); move blobs to Storage and keep pointers only; delete abandoned drafts and run periodic cleanup jobs. |
| Storage size | Supabase (Storage) | 1 GB | 700 MB (~70%) | 900 MB (~90%) | Enforce max upload size + image dimensions; compress client-side; auto-expire temporary uploads; keep only required documents; delete unreferenced files on application cancel/reject. |
| Egress / bandwidth | Supabase (DB+Storage+Functions) | 5 GB / month (org-wide) | 3.5 GB (~70%) | 4.5 GB (~90%) | Add aggressive caching (ETag/Cache-Control); paginate/field-select API responses; stop returning base64 blobs; move public media behind Netlify CDN; temporarily disable realtime on high-traffic pages. |
| Realtime peak connections | Supabase (Realtime) | 200 | 140 (~70%) | 180 (~90%) | Unsubscribe on tab blur; require auth before opening sockets; reduce channel fanout; disable Presence/Broadcast except admin; switch user dashboards to polling (30-60s). |
| Realtime messages | Supabase (Realtime) | 2,000,000 / month | 1,400,000 (~70%) | 1,800,000 (~90%) | Batch/coalesce updates; dedupe events; throttle noisy tables; avoid per-keystroke broadcasts; switch to polling for non-critical UI until next cycle. |
| Edge/functions (invocations) | Supabase (Edge Functions) | 500,000 / month (org-wide) | 350,000 (~70%) | 450,000 (~90%) | Cache reads; consolidate endpoints; avoid calling functions on every navigation; disable non-critical scheduled/background jobs; rate-limit expensive endpoints and return 429/503 when throttled. |
| Edge/functions (runtime) | Supabase (Edge Functions) | 150s max duration per request | 120s | 140s | Add hard timeouts + early exits; chunk work (pagination/batching); move long tasks to async (queue table + polling); return partial results with continuation tokens. |
| Monthly credits (all metered usage) | Netlify (Credits-based Free plan) | 300 credits / month total | 150 credits used (~50%) | 255 credits used (~85%) | Freeze production deploy cadence; turn off non-essential functions/edge; serve static cached pages; tighten rate limiting/traffic rules for expensive endpoints until credits reset. |
| Bandwidth (credits) | Netlify | 10 credits / GB (~30 GB if all 300 credits used on bandwidth) | ~15 GB (150 credits) | ~25.5 GB (255 credits) | Enable long-lived caching headers; compress assets/images; remove large downloads; avoid large function responses; gate heavy media behind auth and cache. |
| Web requests (credits) | Netlify | 3 credits / 10k requests (~1,000,000 if all 300 credits used on requests) | ~500,000 requests (150 credits) | ~850,000 requests (255 credits) | Add caching; debounce client polling; reduce API chatter; block obvious bots; return 304/204 where possible to cut compute and bandwidth. |
| Compute (Functions) (credits) | Netlify | 5 credits / GB-hour (~60 GB-hr if all 300 credits used on compute) | ~30 GB-hr (150 credits) | ~51 GB-hr (255 credits) | Reduce memory/time; cache upstream calls; avoid cold-start-heavy bundles; offload heavy work; cap concurrency and reject excess with 429/503. |
| Production deploys (credits) | Netlify | 15 credits / deploy (~20 deploys if all 300 credits used on deploys) | 10 deploys (150 credits) | 17 deploys (255 credits) | Batch releases; deploy only tagged releases; keep PR previews but avoid auto-deploy on every commit to main. |

---
0.2 NOW vs DEFERRED CAPABILITY BOUNDARY (Task 3)

Rule: NOW means required for zero-cost launch and current member journey reliability. DEFERRED means explicitly postponed until measurable trigger is reached.

| Capability | Scope | Why | Trigger to Move from DEFERRED to NOW |
|---|---|---|---|
| Core membership request submit/approve/reject | NOW | Already implemented around `MembershipRequest`; directly powers current product flows. | N/A |
| Auth, profile sync, and encrypted sensitive snapshots | NOW | Security baseline already exists and must remain non-negotiable. | N/A |
| In-app notification basics (`Notification`) | NOW | Needed for dashboard state and member communication without paid channels. | N/A |
| Multi-stage application pipeline (`MembershipApplication`, `ApplicationStageHistory`) | DEFERRED | Adds heavy schema and workflow complexity beyond current baseline. | Activate when active applications > 500/month or support tickets from status ambiguity > 30/month. |
| Safety Pass full issuance/renewal system | DEFERRED | Valuable but not critical for first zero-cost operational phase. | Activate when clubs require pass verification for entry in at least 3 live partnerships. |
| Multi-channel outbound messaging (SMS/push) | DEFERRED | Increases cost/ops burden and needs robust queueing + deliverability controls. | Activate when in-app + email no longer meets SLA (delivery/read goals missed for 2 consecutive months). |
| Full outbound webhook platform for clubs | DEFERRED | Requires signing, retries, observability, and partner support overhead. | Activate when 5+ clubs request machine-to-machine integration and commit to endpoint ownership. |
| Realtime fan-out across non-critical UI surfaces | DEFERRED | Realtime quota pressure on free tier is high; polling is cheaper for non-critical views. | Activate when monthly realtime message volume remains < 35% for 3 months after launch and user latency complaints persist. |

Boundary enforcement:
- No DEFERRED item enters implementation scope without its trigger being met and documented.
- If budget pressure appears, prioritize reliability of NOW flows over feature expansion.

---
0.3 DEPLOYMENT TARGET POLICY (Task 4)

Netlify is the only deployment target in NOW scope.

Netlify-first rules:
- Runtime policy: Next.js App Router + server actions must be validated on Netlify runtime behavior before production rollout.
- Environment policy: keep runtime and build env variables explicit (`NEXT_PUBLIC_APP_URL`, `DATABASE_URL`, `DIRECT_URL`, `APP_MASTER_KEY`, `ENCRYPTION_SALT`).
- Cost policy: stay on Netlify Free; no paid upgrade assumptions for launch.
- Compatibility policy: if a feature behaves differently on Netlify, choose the Netlify-safe implementation path rather than introducing provider-specific branching.

Out of scope for NOW:
- Any Vercel-specific deployment assumptions.
- Any architecture that requires Vercel Pro features.

---
0.4 TEST STRATEGY + SMOKE GATE (Task 5)

Testing mode for this execution cycle: `tests-after`.

Policy:
- Implement first in small slices, then add/adjust tests immediately after each slice.
- No task is considered complete without at least one automated verification artifact.
- Prefer targeted tests tied to changed backend surface (server action/route/policy section), not broad test churn.

Minimum smoke gate (required for each backend implementation change):
1. One automated test covering the changed action/route happy path.
2. One automated test covering a key failure path (validation, auth, or quota fallback).
3. One contract check on returned shape/status (or documented response contract for planning tasks).

Non-UI verification baseline (fast checks):
- `npm test` for existing backend smoke tests.
- Targeted grep/read checks for policy and guardrail sections in this plan doc.
- Command outputs stored as evidence before marking a task done.

Fail conditions:
- Missing smoke tests for changed backend behavior.
- Using optional wording to skip verification.
- Declaring completion without evidence.

---
1. THE DATA MODELS (Prisma Schema Updates)
Current State
We have basic Profile, Club, MembershipRequest models.
Required Additions
// 1. SAFETY PASS SYSTEM
model SafetyPass {
  id                String   @id @default(uuid())
  userId            String   @unique
  user              Profile  @relation(fields: [userId], references: [id])
  passNumber        String   @unique // SMC-2026-XXXXXX
  tier              PassTier @default(STANDARD)
  status            PassStatus @default(ACTIVE)
  issuedAt          DateTime @default(now())
  expiresAt         DateTime
  verificationData  Json?    // Encrypted snapshot of eligibility answers
  
  @@index([passNumber])
  @@index([status])
}
enum PassTier {
  STANDARD
  PREMIUM
  ELITE
}
enum PassStatus {
  ACTIVE
  EXPIRED
  REVOKED
  SUSPENDED
}
// 2. APPLICATION TRACKING (Detailed Pipeline)
model MembershipApplication {
  id                    String            @id @default(uuid())
  userId                String
  user                  Profile           @relation(fields: [userId], references: [id])
  targetClubId          String?
  targetClub            Club?             @relation(fields: [targetClubId], references: [id])
  
  // Pipeline Stages
  status                ApplicationStatus @default(DRAFT)
  currentStage          ApplicationStage  @default(INTAKE)
  stageHistory          ApplicationStageHistory[]
  
  // Timing
  submittedAt           DateTime?
  estimatedCompletion   DateTime?
  completedAt           DateTime?
  
  // Documents
  idDocumentUrl         String?
  proofOfAgeUrl         String?
  selfieUrl             String?
  
  // Eligibility Data (from quiz)
  eligibilityAnswers    Json?
  eligibilityScore      Int?
  
  // Admin Review
  reviewedBy            String?
  reviewNotes           String?
  rejectionReason       String?
  
  // Relations
  notifications         Notification[]
  
  @@index([userId])
  @@index([status])
  @@index([targetClubId])
  @@index([currentStage])
}
enum ApplicationStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  DOCUMENTS_REQUESTED
  BACKGROUND_CHECK
  APPROVED
  REJECTED
  EXPIRED
}
enum ApplicationStage {
  INTAKE
  DOCUMENT_VERIFICATION
  BACKGROUND_CHECK
  COMPLIANCE_REVIEW
  FINAL_APPROVAL
  COMPLETED
}
// Stage transition logging (for audit trail)
model ApplicationStageHistory {
  id            String            @id @default(uuid())
  applicationId String
  application   MembershipApplication @relation(fields: [applicationId], references: [id])
  
  fromStage     ApplicationStage
  toStage       ApplicationStage
  transitionedAt DateTime @default(now())
  transitionedBy String?  // Admin ID or "SYSTEM"
  notes         String?
}
// 3. NOTIFICATION SYSTEM (Multi-channel)
model Notification {
  id              String            @id @default(uuid())
  userId          String
  user            Profile           @relation(fields: [userId], references: [id])
  
  type            NotificationType
  channel         NotificationChannel
  status          NotificationStatus @default(PENDING)
  
  title           String
  content         String
  metadata        Json?             // URLs, pass numbers, etc.
  
  applicationId   String?
  application     MembershipApplication? @relation(fields: [applicationId], references: [id])
  
  sentAt          DateTime?
  deliveredAt     DateTime?
  readAt          DateTime?
  
  createdAt       DateTime @default(now())
  
  @@index([userId])
  @@index([status])
  @@index([applicationId])
}
enum NotificationType {
  APPLICATION_SUBMITTED
  STAGE_CHANGE
  DOCUMENTS_REQUIRED
  APPROVAL_GRANTED
  REJECTION_ISSUED
  PASS_EXPIRING
  PASS_RENEWAL
  CLUB_MESSAGE
  SYSTEM_ALERT
}
enum NotificationChannel {
  EMAIL
  SMS
  PUSH
  IN_APP
}
enum NotificationStatus {
  PENDING
  QUEUED
  SENT
  DELIVERED
  FAILED
  READ
}
// 4. CLUB ADMIN NOTIFICATIONS
model ClubAdminNotification {
  id              String   @id @default(uuid())
  clubId          String
  club            Club     @relation(fields: [clubId], references: [id])
  
  type            String   // NEW_APPLICATION, MEMBER_APPROVED, etc.
  applicationId   String?
  
  message         String
  metadata        Json?
  
  isRead          Boolean  @default(false)
  readAt          DateTime?
  
  createdAt       DateTime @default(now())
  
  @@index([clubId])
  @@index([isRead])
}
---
2. SERVER ACTIONS (API LAYER)
A. Safety Pass Management
// app/actions/safety-pass.ts
/**
 * Generate a new Safety Pass after eligibility quiz completion
 * - Creates unique pass number (SMC-2026-XXXXXX)
 * - Stores encrypted eligibility answers
 * - Triggers email notification
 * - Returns pass data for frontend display
 */
export async function generateSafetyPass(data: {
  userId: string;
  email: string;
  eligibilityAnswers: Record<string, boolean>;
  tier?: 'STANDARD' | 'PREMIUM' | 'ELITE';
}): Promise<{
  success: boolean;
  pass?: SafetyPass;
  error?: string;
}>;
/**
 * Validate a Safety Pass (for club entry verification)
 * - Checks expiration
 * - Verifies status (not revoked/suspended)
 * - Logs validation attempt
 */
export async function validateSafetyPass(passNumber: string): Promise<{
  valid: boolean;
  pass?: SafetyPass;
  message: string;
}>;
/**
 * Renew an expiring Safety Pass
 * - Extends expiration date
 * - Requires re-verification of eligibility
 * - Sends renewal confirmation email
 */
export async function renewSafetyPass(passId: string): Promise<{
  success: boolean;
  newExpiryDate?: Date;
  error?: string;
}>;
B. Application Pipeline Management
// app/actions/applications.ts
/**
 * Submit new membership application
 * - Creates application record
 * - Enters INTAKE stage
 * - Queues initial notification emails
 * - Triggers club admin alert
 */
export async function submitMembershipApplication(data: {
  userId: string;
  targetClubId?: string;
  eligibilityAnswers: Record<string, any>;
  documents?: {
    idDocument?: File;
    proofOfAge?: File;
    selfie?: File;
  };
}): Promise<{
  success: boolean;
  applicationId?: string;
  estimatedCompletion?: Date;
  error?: string;
}>;
/**
 * Get application status for user dashboard
 * - Returns current stage, progress percentage
 * - Fetches stage history for timeline
 * - Calculates estimated completion based on current stage
 */
export async function getApplicationStatus(userId: string): Promise<{
  application: MembershipApplication | null;
  stageHistory: ApplicationStageHistory[];
  progressPercentage: number;
  nextSteps?: string[];
}>;
/**
 * Admin: Advance application to next stage
 * - Logs stage transition
 * - Sends notification to user
 * - Updates estimated completion date
 * - Triggers webhooks if configured
 */
export async function advanceApplicationStage(
  applicationId: string,
  toStage: ApplicationStage,
  notes?: string,
  adminId?: string
): Promise<{
  success: boolean;
  newStage?: ApplicationStage;
  error?: string;
}>;
/**
 * Admin: Request additional documents
 * - Sets status to DOCUMENTS_REQUESTED
 * - Sends email with upload instructions
 * - Creates task in admin dashboard
 */
export async function requestAdditionalDocuments(
  applicationId: string,
  documentTypes: ('ID' | 'PROOF_OF_AGE' | 'SELFIE' | 'PROOF_OF_ADDRESS')[],
  instructions: string,
  adminId: string
): Promise<{ success: boolean; error?: string }>;
C. Notification System
// app/actions/notifications.ts
/**
 * Queue notification for delivery
 * - Supports multi-channel (email, SMS, push, in-app)
 * - Handles templating with user data
 * - Sets up retry logic for failures
 */
export async function queueNotification(data: {
  userId: string;
  type: NotificationType;
  channels: NotificationChannel[];
  title: string;
  content: string;
  metadata?: Record<string, any>;
  applicationId?: string;
}): Promise<{
  success: boolean;
  notificationId?: string;
  error?: string;
}>;
/**
 * Mark notifications as read
 * - Updates readAt timestamp
 * - Triggers real-time UI update
 */
export async function markNotificationsAsRead(notificationIds: string[]): Promise<void>;
/**
 * Get unread notification count (for navbar badge)
 */
export async function getUnreadNotificationCount(userId: string): Promise<number>;
D. Gated Content Authorization
// app/actions/gated-content.ts
/**
 * Check if user has access to gated content
 * - Verifies Safety Pass status
 * - Checks application approval status
 * - Returns access level (NONE, BASIC, FULL)
 */
export async function checkContentAccess(userId: string, contentType: 'CLUB_DETAILS' | 'CONTACT_INFO' | 'MEMBER_DIRECTORY'): Promise<{
  hasAccess: boolean;
  accessLevel: 'NONE' | 'BASIC' | 'FULL';
  requiredAction?: 'VERIFY_EMAIL' | 'COMPLETE_QUIZ' | 'SUBMIT_APPLICATION' | 'WAIT_APPROVAL';
  message: string;
}>;
/**
 * Get visible club details based on user access level
 * - Returns full details for verified members
 * - Returns limited info for non-members
 * - Blurs sensitive data for unauthorized users
 */
export async function getClubDetailsWithAccess(
  clubId: string,
  userId?: string
): Promise<{
  club: Club;
  accessLevel: 'NONE' | 'BASIC' | 'FULL';
  visibleFields: string[];
}>;
---
3. EMAIL AUTOMATION (Event-Driven)
Email Service Integration (Resend/ SendGrid)
// lib/email/service.ts
interface EmailTemplate {
  id: string;
  subject: string;
  html: (data: any) => string;
  text: (data: any) => string;
}
// TEMPLATES TO CREATE:
const templates = {
  // 1. Quiz Completion → Safety Pass Generated
  SAFETY_PASS_GENERATED: {
    subject: 'Your Verified Safety Pass is Ready',
    trigger: 'safetyPass.created',
    delay: '0 minutes',
  },
  
  // 2. Application Submitted → Acknowledgment
  APPLICATION_RECEIVED: {
    subject: 'Application Received: Next Steps',
    trigger: 'application.submitted',
    delay: '0 minutes',
  },
  
  // 3. Stage Changes
  STAGE_DOCUMENT_VERIFICATION: {
    subject: 'We\'re Reviewing Your Documents',
    trigger: 'application.stageChanged to DOCUMENT_VERIFICATION',
    delay: '0 minutes',
  },
  
  STAGE_BACKGROUND_CHECK: {
    subject: 'Background Verification in Progress',
    trigger: 'application.stageChanged to BACKGROUND_CHECK',
    delay: '0 minutes',
  },
  
  // 4. Approval/Rejection
  APPLICATION_APPROVED: {
    subject: 'Welcome: Your Membership is Approved',
    trigger: 'application.statusChanged to APPROVED',
    delay: '0 minutes',
  },
  
  APPLICATION_REJECTED: {
    subject: 'Application Update Required',
    trigger: 'application.statusChanged to REJECTED',
    delay: '0 minutes',
  },
  
  // 5. Documents Requested
  DOCUMENTS_REQUIRED: {
    subject: 'Action Required: Additional Documents Needed',
    trigger: 'application.statusChanged to DOCUMENTS_REQUESTED',
    delay: '0 minutes',
  },
  
  // 6. Pass Expiring (30 days before)
  PASS_EXPIRING_SOON: {
    subject: 'Your Safety Pass Expires in 30 Days',
    trigger: 'safetyPass.expiresAt - 30 days',
    delay: 'scheduled',
  },
  
  // 7. Drip Campaign (for incomplete applications)
  APPLICATION_ABANDONED_24H: {
    subject: 'Complete Your Application',
    trigger: 'application.status = DRAFT for 24 hours',
    delay: '24 hours after draft created',
  },
  
  APPLICATION_ABANDONED_7D: {
    subject: 'Your Application Expires Soon',
    trigger: 'application.status = DRAFT for 7 days',
    delay: '7 days after draft created',
  },
};
---
4. REAL-TIME NOTIFICATIONS (Supabase Realtime)
WebSocket Events
// hooks/useRealtimeNotifications.ts
/**
 * Subscribe to real-time updates for:
 * 1. Application status changes
 * 2. New club admin notifications
 * 3. Safety pass updates
 * 4. Document approval/rejection
 */
// Events to broadcast:
type RealtimeEvent =
  | { type: 'APPLICATION_STAGE_CHANGED'; applicationId: string; newStage: string; }
  | { type: 'APPLICATION_APPROVED'; applicationId: string; clubId?: string; }
  | { type: 'DOCUMENT_APPROVED'; applicationId: string; documentType: string; }
  | { type: 'SAFETY_PASS_GENERATED'; passId: string; passNumber: string; }
  | { type: 'NEW_CLUB_NOTIFICATION'; clubId: string; message: string; }
  | { type: 'MEMBERSHIP_EXPIRING'; daysRemaining: number; };
// Frontend receives these and:
// - Updates ApplicationStatusTracker UI immediately
// - Shows toast notifications
// - Updates notification badge count
// - Refreshes passport data
---
5. WEBHOOK SYSTEM (Club Admin Integration)
Outbound Webhooks
// Allow clubs to receive real-time notifications
interface WebhookPayload {
  event: 'application.submitted' | 'application.approved' | 'member.joined';
  timestamp: string;
  data: {
    applicationId: string;
    userId: string;
    clubId: string;
    userDetails: {
      email: string;
      passNumber: string;
      verifiedAt: string;
    };
  };
}
// Clubs can configure webhooks in their dashboard
// When event occurs:
// 1. Fetch club's webhook URL from database
// 2. Sign payload with HMAC secret
// 3. POST to webhook URL
// 4. Retry on failure (exponential backoff)
// 5. Log delivery attempts
---
6. IMPLEMENTATION ROADMAP
Week 1: Foundation
- [ ] Update Prisma schema with new models
- [ ] Run database migrations
- [ ] Implement Safety Pass generation logic
- [ ] Create basic email templates (free-tier compatible; paid providers remain deferred)
Week 2: Pipeline & Notifications
- [ ] Build application stage management system
- [ ] Implement stage transition logging
- [ ] Create notification queue system
- [ ] Wire up email automation triggers
- [ ] Set up Supabase Realtime subscriptions
Week 3: Access Control & Polish
- [ ] Implement gated content authorization
- [ ] Build webhook system for club admins
- [ ] Create admin dashboard for application review
- [ ] Add retry logic for failed notifications
- [ ] Testing & edge case handling
---
7. CRITICAL INTEGRATION POINTS
A. Eligibility Quiz → Safety Pass
User completes quiz
    ↓
Frontend sends answers to /api/safety-pass/generate
    ↓
Backend:
  1. Validates all answers = true
  2. Generates unique pass number
  3. Creates SafetyPass record
  4. Queues "SAFETY_PASS_GENERATED" email
  5. Returns pass data to frontend
    ↓
Frontend displays MemberPassport component
B. Application Submission → Stage Tracking
User submits application
    ↓
Backend:
  1. Creates MembershipApplication (status: SUBMITTED, stage: INTAKE)
  2. Calculates estimated completion (INTAKE + 2 days, etc.)
  ↓ Parallel:
  ├── Queue "APPLICATION_RECEIVED" email
  ├── Create ClubAdminNotification
  └── Broadcast realtime event
    ↓
User sees ApplicationStatusTracker with progress bar
C. Admin Approval → User Notification
Admin advances stage to "FINAL_APPROVAL"
    ↓
Backend:
  1. Logs stage transition
  2. Updates application.status = APPROVED
  3. Queues "APPLICATION_APPROVED" email
  4. Broadcasts realtime event
  5. Triggers club webhook (if configured)
    ↓
User receives:
  ├── Email: "Welcome: Your Membership is Approved"
  ├── Push notification (if enabled)
  └── UI updates in real-time (confetti animation?)
---
8. THE "SURGICAL" APPROACH
What Makes This Surgical (Not Sloppy)
1. Audit Trail: Every stage change is logged with timestamp, admin ID, and notes (compliance requirement)
2. Idempotency: Email notifications can be retried without sending duplicates
3. Graceful Degradation: If Realtime fails, polling fallback keeps UI updated
4. Rate Limiting: Application submissions throttled per user (prevent spam)
5. Encryption: Eligibility answers stored encrypted (PII protection)
6. Testing: Each server action has unit tests (Vitest)
Anti-Patterns We're Avoiding
❌ DON'T: Store pass generation logic in frontend (security risk)
✅ DO: All pass generation server-side with crypto-secure random
❌ DON'T: Send emails synchronously (blocks response)
✅ DO: Queue emails for async processing
❌ DON'T: Update UI optimistically without confirmation
✅ DO: Wait for Realtime event or polling confirmation
❌ DON'T: Hardcode stage timing estimates
✅ DO: Calculate dynamically based on current queue depth
---
9. INFRASTRUCTURE COSTS
| Service | Purpose | Est. Monthly Cost |
|---------|---------|------------------|
| Supabase (Free) | Database + Auth + Realtime + Edge | $0 |
| Netlify (Free) | Hosting + Functions (credit budget) | $0 |
| Email channel (NOW) | In-app + product messaging only | $0 |
| Email provider (DEFERRED) | Transactional provider after monetization triggers | $0 in NOW scope |
| Total (NOW scope) | | $0/month |
---
10. SUCCESS METRICS TO TRACK
// analytics/events.ts
// Track these events for optimization:
type BackendEvents = {
  'safety_pass.generated': { timeToGenerate: number; }
  'application.submitted': { funnelSource: 'quiz' | 'popup' | 'sticky'; }
  'application.stage_changed': { from: string; to: string; duration: number; }
  'email.delivered': { template: string; timeToDeliver: number; }
  'email.opened': { template: string; }
  'club.webhook.delivered': { clubId: string; latency: number; }
  'gated_content.access_denied': { reason: string; contentType: string; }
  'quiz.completed': { timeSpent: number; score: number; }
};
---
This backend plan transforms your "God Level" frontend from a demo into a revenue-generating machine. 
Each component serves a specific business purpose:
- Safety Pass → Creates user investment/retention
- Stage Tracking → Reduces support tickets ("where's my app?")
- Email Automation → Converts leads while you sleep
- Webhooks → Enables club partnerships (B2B revenue)
