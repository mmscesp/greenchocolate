'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { EncryptionService } from '@/lib/encryption';
import { prisma } from '@/lib/prisma';
import { logAdminAuditEvent } from '@/lib/security/admin-audit';
import { logAuthAuditEvent } from '@/lib/security/auth-audit';
import { isAuthRateLimited } from '@/lib/security/auth-rate-limit';
import { getSafeAdminReturnPath } from '@/lib/security/admin-portal';
import {
  buildApplicantPayload,
  buildLeadToken,
  buildRequestMeta,
  classifyDecision,
  getChallengeStatus,
  getLeadExpiry,
  getMembershipSecurityConfig,
  getMembershipSecurityContext,
  getWindowStart,
  hashEmail,
  hashPayload,
  isTurnstileEnabled,
  membershipApplicationInputSchema,
  readLeadToken,
  resolveDecision,
  verifyTurnstileToken,
  type ChallengeStatus,
  type LeadDecision,
  type MembershipApplicationInput,
  type RiskLevel,
} from '@/lib/security/membership-application';
import {
  mapRequestStatus,
  normalizeApplicationStage,
  type ApplicationStage,
  type ApplicationStatus,
} from '@/lib/application-utils';
import { resolveLocale } from '@/lib/auth-urls';
import { isLocale, type Locale } from '@/lib/i18n-config';
import {
  sendMembershipApprovalEmail,
  sendMembershipRejectionEmail,
  sendMembershipSubmissionEmail,
} from '@/lib/email/membership';
import { getSessionProfile } from '@/lib/session-profile';

const TRANSACTION_MAX_RETRIES = 3;
const ADMIN_BOOTSTRAP_RATE_LIMIT_WINDOW_MINUTES = 15;
const ADMIN_BOOTSTRAP_RATE_LIMIT_MAX_ATTEMPTS = 5;

type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SCHEDULED';

type CurrentProfile = {
  id: string;
  authId: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: 'USER' | 'ADMIN' | 'CLUB_ADMIN';
  managedClubId: string | null;
};

export interface ApplicationStageHistoryItem {
  id: string;
  stage: ApplicationStage;
  changedAt: Date;
  changedBy: string;
  notes?: string;
}

export interface MembershipRequestCard {
  id: string;
  status: RequestStatus;
  currentStage: ApplicationStage;
  message: string | null;
  createdAt: string;
  reviewedAt: string | null;
  appointmentNotes: string | null;
  rejectionReason: string | null;
  clubId: string;
  clubName: string;
  clubSlug: string;
  clubImage: string | null;
  clubNeighborhood: string;
}

export type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export interface ClubApplicationItem {
  id: string;
  status: RequestStatus;
  createdAt: string;
  message: string | null;
  club: {
    id: string;
    name: string;
    slug: string;
  };
  user: {
    id: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
}

export interface AdminMembershipQueueItem extends Omit<ClubApplicationItem, 'user'> {
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
  user: {
    id: string;
    displayName: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

export interface AdminMembershipRequestDetail {
  id: string;
  status: RequestStatus;
  currentStage: ApplicationStage;
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
  message: string | null;
  eligibilityAnswers: Record<string, unknown>;
  riskSignals: Record<string, unknown>;
  appointmentNotes: string | null;
  club: {
    id: string;
    name: string;
    slug: string;
    contactEmail: string;
    neighborhood: string;
  };
  user: {
    id: string;
    displayName: string | null;
    email: string;
    avatarUrl: string | null;
  };
  stageHistory: ApplicationStageHistoryItem[];
  notes: {
    id: string;
    body: string;
    createdAt: string;
    authorName: string;
  }[];
}

export interface AdminMembershipQueueResult {
  items: AdminMembershipQueueItem[];
  counts: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  clubs: {
    id: string;
    name: string;
  }[];
}

const submitSchema = membershipApplicationInputSchema;

const finalizeLeadSchema = z
  .object({
    pendingLeadToken: z.string().trim().min(1),
  })
  .strict();

const approveSchema = z.object({
  requestId: z.string().uuid(),
  note: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .or(z.literal(''))
    .transform((value) => {
      if (typeof value !== 'string') {
        return undefined;
      }

      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    }),
});

const rejectSchema = z.object({
  requestId: z.string().uuid(),
  reason: z.string().trim().min(1).max(1000),
});

const noteSchema = z.object({
  requestId: z.string().uuid(),
  body: z.string().min(1).max(2000),
  returnPath: z.string().optional(),
});

const bootstrapSchema = z.object({
  email: z.string().email('Invalid admin email'),
  secret: z.string().min(1, 'Bootstrap secret is required'),
});

async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const profile = await getSessionProfile({ ensure: true });

  if (!profile) return null;

  return {
    ...profile,
    managedClubId: (profile as unknown as Record<string, string | null>).managedClubId ?? null,
  };
}

async function requireAdminProfile() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return profile;
}

function isPrismaKnownError(error: unknown, code: string): boolean {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return false;
  }

  const prismaCode = (error as { code?: unknown }).code;
  return typeof prismaCode === 'string' && prismaCode === code;
}

async function runSerializableTransactionWithRetry<T>(
  callback: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  let retries = 0;

  while (retries < TRANSACTION_MAX_RETRIES) {
    try {
      return await prisma.$transaction(callback, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      if (isPrismaKnownError(error, 'P2034')) {
        retries += 1;
        continue;
      }

      throw error;
    }
  }

  throw new Error('Transaction failed after retries');
}

function estimateCompletion(status: ApplicationStatus, submittedAt: Date): Date | undefined {
  const estimate = new Date(submittedAt);

  if (status === 'UNDER_REVIEW' || status === 'SUBMITTED') {
    estimate.setDate(estimate.getDate() + 10);
    return estimate;
  }

  return undefined;
}

function getApplicationStatusFromRequest(
  status: RequestStatus,
  currentStage?: string | null
): ApplicationStatus {
  return mapRequestStatus(status, currentStage);
}

async function attemptMembershipEmail(task: () => Promise<{ success: boolean; skipped?: boolean; error?: string }>) {
  try {
    return await task();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error',
    };
  }
}

async function getMembershipRequestForDecision(requestId: string) {
  return prisma.membershipRequest.findUnique({
    where: { id: requestId },
    include: {
      user: {
        select: {
          id: true,
          role: true,
          email: true,
          displayName: true,
        },
      },
      club: {
        select: {
          id: true,
          name: true,
          slug: true,
          contactEmail: true,
          neighborhood: true,
        },
      },
    },
  });
}

function getJsonRecord(value: Prisma.JsonValue | null | undefined): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

function resolveMembershipRequestLocale(
  ...metadataSources: Array<Prisma.JsonValue | null | undefined>
): Locale {
  for (const source of metadataSources) {
    const locale = getJsonRecord(source)['locale'];

    if (typeof locale === 'string' && isLocale(locale)) {
      return locale;
    }
  }

  return 'en';
}

function getDecisionError(status: RequestStatus): string {
  if (status === 'APPROVED') {
    return 'Application has already been approved.';
  }

  if (status === 'REJECTED') {
    return 'Application has already been rejected.';
  }

  return 'Only pending applications can be decided.';
}

class MembershipDecisionConflictError extends Error {
  constructor() {
    super('Membership request decision conflict');
    this.name = 'MembershipDecisionConflictError';
  }
}

function isMembershipDecisionConflictError(error: unknown): error is MembershipDecisionConflictError {
  return error instanceof MembershipDecisionConflictError;
}

async function createStageHistory(
  tx: Prisma.TransactionClient,
  requestId: string,
  fromStage: ApplicationStage | null,
  toStage: ApplicationStage,
  changedBy: string,
  notes?: string
) {
  await tx.applicationStageHistory.create({
    data: {
      applicationId: requestId,
      fromStage,
      toStage,
      changedBy,
      notes,
    },
  });
}

async function logMembershipDecisionEmailEvent(input: {
  actorAuthId: string;
  requestId: string;
  emailType: 'APPROVAL' | 'REJECTION';
  result: {
    success: boolean;
    skipped?: boolean;
    error?: string;
    locale?: string;
    templateId?: number;
    fallbackUsed?: boolean;
    messageId?: string;
    requestsUrl?: string;
  };
}) {
  await logAdminAuditEvent({
    tableName: 'MembershipRequest',
    operation: input.result.success
      ? `MEMBERSHIP_${input.emailType}_EMAIL_SENT`
      : input.result.skipped
        ? `MEMBERSHIP_${input.emailType}_EMAIL_SKIPPED`
        : `MEMBERSHIP_${input.emailType}_EMAIL_FAILED`,
    changedBy: input.actorAuthId,
    recordId: input.requestId,
    changeData: {
      provider: 'BREVO',
      locale: input.result.locale ?? null,
      templateId: input.result.templateId ?? null,
      fallbackUsed: input.result.fallbackUsed ?? false,
      messageId: input.result.messageId ?? null,
      requestsUrl: input.result.requestsUrl ?? null,
      error: input.result.success ? null : input.result.error || 'Unknown email error',
    },
  });
}

async function logMembershipSecurityEvent(input: {
  recordId: string;
  operation: string;
  changedBy: string;
  changeData: Record<string, unknown>;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        tableName: 'MembershipApplicationSecurity',
        operation: input.operation,
        changedBy: input.changedBy,
        recordId: input.recordId,
        changeData: input.changeData as Prisma.InputJsonValue,
        changeHash: EncryptionService.hash(JSON.stringify({
          recordId: input.recordId,
          operation: input.operation,
          changedBy: input.changedBy,
          changeData: input.changeData,
        })),
      },
    });
  } catch (error) {
    console.error('Failed to write membership security audit log:', error);
  }
}

async function getAvailableClub(targetClubId: string) {
  return prisma.club.findUnique({
    where: { id: targetClubId },
    select: {
      id: true,
      name: true,
      isActive: true,
      isVerified: true,
      allowsPreRegistration: true,
    },
  });
}

function getMembershipPayloadFields(payload: Record<string, unknown>): Record<string, unknown> {
  return {
    firstName: payload.firstName ?? null,
    lastName: payload.lastName ?? null,
    email: payload.email ?? null,
    city: payload.city ?? null,
    country: payload.country ?? null,
    countryCode: payload.countryCode ?? null,
    experience: payload.experience ?? null,
    phone: payload.phone ?? null,
    ageConfirmed: payload.ageConfirmed ?? null,
    termsConfirmed: payload.termsConfirmed ?? null,
  };
}

function parseStoredPayload(request: {
  encryptedPayload: string | null;
  encryptedSnapshot: Prisma.JsonValue | null;
  snapshotMeta: Prisma.JsonValue | null;
}): {
  payload: Record<string, unknown>;
  riskSignals: Record<string, unknown>;
} {
  if (request.encryptedPayload) {
    try {
      const decryptedPayload = EncryptionService.decryptPayload(request.encryptedPayload);
      const riskSignals =
        request.snapshotMeta && typeof request.snapshotMeta === 'object' && !Array.isArray(request.snapshotMeta)
          ? (request.snapshotMeta as Record<string, unknown>)
          : {};

      return {
        payload: getMembershipPayloadFields(decryptedPayload),
        riskSignals,
      };
    } catch (error) {
      console.error('Failed to decrypt membership payload:', error);
    }
  }

  if (!request.encryptedSnapshot || typeof request.encryptedSnapshot !== 'object' || Array.isArray(request.encryptedSnapshot)) {
    return { payload: {}, riskSignals: {} };
  }

  const record = request.encryptedSnapshot as Record<string, unknown>;
  const legacyAnswers =
    record.eligibilityAnswers && typeof record.eligibilityAnswers === 'object' && !Array.isArray(record.eligibilityAnswers)
      ? (record.eligibilityAnswers as Record<string, unknown>)
      : {};

  return {
    payload: legacyAnswers,
    riskSignals:
      request.snapshotMeta && typeof request.snapshotMeta === 'object' && !Array.isArray(request.snapshotMeta)
        ? (request.snapshotMeta as Record<string, unknown>)
        : {},
  };
}

async function countRecentMembershipAttempts(input: {
  clubId: string;
  profileId?: string;
  emailHash?: string;
  fingerprintHash?: string;
  payloadHash?: string;
}) {
  const windowStart = getWindowStart(getMembershipSecurityConfig());

  return prisma.membershipApplicationAttempt.count({
    where: {
      clubId: input.clubId,
      createdAt: {
        gte: windowStart,
      },
      OR: [
        input.profileId ? { profileId: input.profileId } : undefined,
        input.emailHash ? { emailHash: input.emailHash } : undefined,
        input.fingerprintHash ? { fingerprintHash: input.fingerprintHash } : undefined,
        input.payloadHash ? { payloadHash: input.payloadHash } : undefined,
      ].filter(Boolean) as Prisma.MembershipApplicationAttemptWhereInput[],
    },
  });
}

async function createMembershipAttempt(input: {
  clubId: string;
  profileId?: string | null;
  leadId?: string | null;
  subjectType: string;
  emailHash?: string | null;
  fingerprintHash?: string | null;
  payloadHash?: string | null;
  riskLevel: RiskLevel;
  decision: string;
  challengeStatus: ChallengeStatus;
  countryCode?: string | null;
}) {
  await prisma.membershipApplicationAttempt.create({
    data: {
      clubId: input.clubId,
      profileId: input.profileId ?? null,
      leadId: input.leadId ?? null,
      subjectType: input.subjectType,
      emailHash: input.emailHash ?? null,
      fingerprintHash: input.fingerprintHash ?? null,
      payloadHash: input.payloadHash ?? null,
      riskLevel: input.riskLevel,
      decision: input.decision,
      challengeStatus: input.challengeStatus,
      countryCode: input.countryCode ?? null,
    },
  });
}

async function createMembershipRequestRecord(
  tx: Prisma.TransactionClient,
  input: {
    profile: CurrentProfile;
    clubId: string;
    message: string;
    encryptedPayload: string;
    snapshotMeta: Record<string, unknown>;
  }
) {
  const request = await tx.membershipRequest.create({
    data: {
      userId: input.profile.id,
      clubId: input.clubId,
      message: input.message,
      currentStage: 'INTAKE',
      encryptedPayload: input.encryptedPayload,
      snapshotMeta: input.snapshotMeta as Prisma.InputJsonValue,
      status: 'PENDING',
    },
  });

  await createStageHistory(tx, request.id, null, 'INTAKE', input.profile.id, 'Application submitted');

  await tx.notification.create({
    data: {
      userId: input.profile.id,
      type: 'APPLICATION_SUBMITTED',
      title: 'Application submitted',
      message: 'Your membership application has been received and is now under review.',
      data: {
        applicationId: request.id,
        clubId: request.clubId,
        stage: 'INTAKE',
      } as Prisma.InputJsonValue,
    },
  });

  return request;
}

export async function submitMembershipApplication(
  data: MembershipApplicationInput
): Promise<{
  success: boolean;
  applicationId?: string;
  estimatedCompletion?: Date;
  challengeRequired?: boolean;
  error?: string;
}> {
  const profile = await getCurrentProfile();

  if (!profile) {
    return { success: false, error: 'Unauthorized' };
  }

  const validated = submitSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0]?.message || 'Invalid input' };
  }

  const club = await getAvailableClub(validated.data.targetClubId);

  if (!club || !club.isActive || !club.isVerified) {
    return { success: false, error: 'Club is not available for applications' };
  }

  if (!club.allowsPreRegistration) {
    return { success: false, error: 'This club is not accepting platform-managed applications right now' };
  }

  const existing = await prisma.membershipRequest.findUnique({
    where: {
      userId_clubId: {
        userId: profile.id,
        clubId: validated.data.targetClubId,
      },
    },
  });

  if (existing) {
    return { success: false, error: 'Application already exists for this club' };
  }

  try {
    const securityContext = await getMembershipSecurityContext();
    const applicationPayload = buildApplicantPayload(validated.data, profile.email);
    const payloadHash = hashPayload(applicationPayload);
    const emailHash = hashEmail(profile.email);
    const config = getMembershipSecurityConfig();
    const recentAttempts = await countRecentMembershipAttempts({
      clubId: validated.data.targetClubId,
      profileId: profile.id,
      emailHash,
      fingerprintHash: securityContext.fingerprintHash,
      payloadHash,
    });
    const challengePassed = validated.data.challengeToken
      ? await verifyTurnstileToken({
          token: validated.data.challengeToken,
          ip: securityContext.ip,
        })
      : false;
    const decision = resolveDecision({
      attempts: recentAttempts,
      softLimit: config.authSoftLimit,
      hardLimit: config.authHardLimit,
      challengePassed,
    });
    const riskLevel = classifyDecision(decision);
    const challengeStatus =
      decision === 'CHALLENGE'
        ? validated.data.challengeToken
          ? 'FAILED'
          : 'REQUIRED'
        : getChallengeStatus(challengePassed, Boolean(validated.data.challengeToken));

    if (decision === 'BLOCK') {
      await createMembershipAttempt({
        clubId: validated.data.targetClubId,
        profileId: profile.id,
        subjectType: 'AUTHENTICATED',
        emailHash,
        fingerprintHash: securityContext.fingerprintHash,
        payloadHash,
        riskLevel,
        decision: 'BLOCK',
        challengeStatus,
        countryCode: validated.data.countryCode,
      });
      await logMembershipSecurityEvent({
        recordId: validated.data.targetClubId,
        operation: 'MEMBERSHIP_APPLICATION_BLOCKED',
        changedBy: profile.authId,
        changeData: {
          clubId: validated.data.targetClubId,
          emailHash,
          fingerprintHash: securityContext.fingerprintHash,
          countryCode: validated.data.countryCode,
          riskLevel,
          challengeStatus,
        },
      });
      return { success: false, error: 'Too many attempts. Please try again later.' };
    }

    if (decision === 'CHALLENGE') {
      await createMembershipAttempt({
        clubId: validated.data.targetClubId,
        profileId: profile.id,
        subjectType: 'AUTHENTICATED',
        emailHash,
        fingerprintHash: securityContext.fingerprintHash,
        payloadHash,
        riskLevel,
        decision: 'CHALLENGE',
        challengeStatus,
        countryCode: validated.data.countryCode,
      });
      await logMembershipSecurityEvent({
        recordId: validated.data.targetClubId,
        operation: 'MEMBERSHIP_APPLICATION_CHALLENGED',
        changedBy: profile.authId,
        changeData: {
          clubId: validated.data.targetClubId,
          emailHash,
          fingerprintHash: securityContext.fingerprintHash,
          countryCode: validated.data.countryCode,
          riskLevel,
          challengeStatus,
        },
      });
      return {
        success: false,
        challengeRequired: true,
        error: 'Please complete the verification challenge to continue.',
      };
    }

    const encryptedPayload = EncryptionService.encryptPayload(applicationPayload);
    const snapshotMeta = buildRequestMeta({
      source: 'direct',
      locale: validated.data.locale,
      countryCode: validated.data.countryCode,
      experience: validated.data.experience,
      riskLevel,
      challengeStatus,
      emailHash,
      fingerprintHash: securityContext.fingerprintHash,
    });

    const created = await runSerializableTransactionWithRetry(async (tx) => {
      return createMembershipRequestRecord(tx, {
        profile,
        clubId: validated.data.targetClubId,
        message: validated.data.message,
        encryptedPayload,
        snapshotMeta,
      });
    });

    await createMembershipAttempt({
      clubId: validated.data.targetClubId,
      profileId: profile.id,
      subjectType: 'AUTHENTICATED',
      emailHash,
      fingerprintHash: securityContext.fingerprintHash,
      payloadHash,
      riskLevel,
      decision: 'ALLOW',
      challengeStatus,
      countryCode: validated.data.countryCode,
    });
    await logMembershipSecurityEvent({
      recordId: created.id,
      operation: 'MEMBERSHIP_APPLICATION_ACCEPTED',
      changedBy: profile.authId,
      changeData: {
        clubId: validated.data.targetClubId,
        countryCode: validated.data.countryCode,
        riskLevel,
        challengeStatus,
      },
    });

    await attemptMembershipEmail(() =>
      sendMembershipSubmissionEmail({
        applicantEmail: profile.email,
        applicantName: profile.displayName,
        clubName: club.name,
        requestId: created.id,
      })
    );

    const completion = new Date(created.createdAt);
    completion.setDate(completion.getDate() + 10);

    return {
      success: true,
      applicationId: created.id,
      estimatedCompletion: completion,
    };
  } catch (error) {
    if (isPrismaKnownError(error, 'P2002')) {
      return { success: false, error: 'Application already exists for this club' };
    }

    console.error('submitMembershipApplication error:', error);
    return { success: false, error: 'Failed to submit application. Please try again.' };
  }
}

export async function createMembershipApplicationLead(
  data: MembershipApplicationInput
): Promise<{
  success: boolean;
  pendingLeadToken?: string;
  expiresAt?: string;
  challengeRequired?: boolean;
  error?: string;
}> {
  const validated = submitSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0]?.message || 'Invalid input' };
  }

  const club = await getAvailableClub(validated.data.targetClubId);
  if (!club || !club.isActive || !club.isVerified) {
    return { success: false, error: 'Club is not available for applications' };
  }

  if (!club.allowsPreRegistration) {
    return { success: false, error: 'This club is not accepting platform-managed applications right now' };
  }

  const securityContext = await getMembershipSecurityContext();
  const applicationPayload = buildApplicantPayload(validated.data);
  const payloadHash = hashPayload(applicationPayload);
  const emailHash = hashEmail(validated.data.email);
  const config = getMembershipSecurityConfig();
  const recentAttempts = await countRecentMembershipAttempts({
    clubId: validated.data.targetClubId,
    emailHash,
    fingerprintHash: securityContext.fingerprintHash,
    payloadHash,
  });
  const challengePassed = validated.data.challengeToken
    ? await verifyTurnstileToken({
        token: validated.data.challengeToken,
        ip: securityContext.ip,
      })
    : false;
  const decision = resolveDecision({
    attempts: recentAttempts,
    softLimit: config.guestSoftLimit,
    hardLimit: config.guestHardLimit,
    challengePassed,
  });
  const riskLevel = classifyDecision(decision);
  const challengeStatus =
    decision === 'CHALLENGE'
      ? validated.data.challengeToken
        ? 'FAILED'
        : 'REQUIRED'
      : getChallengeStatus(challengePassed, Boolean(validated.data.challengeToken));

  const existingLead = await prisma.membershipApplicationLead.findFirst({
    where: {
      clubId: validated.data.targetClubId,
      payloadHash,
      emailHash,
      fingerprintHash: securityContext.fingerprintHash,
      consumedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (decision === 'BLOCK') {
    await createMembershipAttempt({
      clubId: validated.data.targetClubId,
      subjectType: 'GUEST',
      emailHash,
      fingerprintHash: securityContext.fingerprintHash,
      payloadHash,
      riskLevel,
      decision: 'BLOCK',
      challengeStatus,
      countryCode: validated.data.countryCode,
    });
    await logMembershipSecurityEvent({
      recordId: validated.data.targetClubId,
      operation: 'MEMBERSHIP_LEAD_BLOCKED',
      changedBy: `guest:${emailHash.slice(0, 12)}`,
      changeData: {
        clubId: validated.data.targetClubId,
        countryCode: validated.data.countryCode,
        emailHash,
        fingerprintHash: securityContext.fingerprintHash,
        riskLevel,
        challengeStatus,
      },
    });
    return { success: false, error: 'Too many attempts. Please try again later.' };
  }

  if (decision === 'CHALLENGE') {
    await createMembershipAttempt({
      clubId: validated.data.targetClubId,
      leadId: existingLead?.id ?? null,
      subjectType: 'GUEST',
      emailHash,
      fingerprintHash: securityContext.fingerprintHash,
      payloadHash,
      riskLevel,
      decision: 'CHALLENGE',
      challengeStatus,
      countryCode: validated.data.countryCode,
    });
    await logMembershipSecurityEvent({
      recordId: existingLead?.id ?? validated.data.targetClubId,
      operation: 'MEMBERSHIP_LEAD_CHALLENGED',
      changedBy: `guest:${emailHash.slice(0, 12)}`,
      changeData: {
        clubId: validated.data.targetClubId,
        countryCode: validated.data.countryCode,
        emailHash,
        fingerprintHash: securityContext.fingerprintHash,
        riskLevel,
        challengeStatus,
      },
    });
    return {
      success: false,
      challengeRequired: isTurnstileEnabled(),
      error: isTurnstileEnabled()
        ? 'Please complete the verification challenge to continue.'
        : 'Verification is temporarily unavailable. Please try again later.',
    };
  }

  const expiresAt = existingLead?.expiresAt ?? getLeadExpiry(config);

  const lead =
    existingLead ??
    (await prisma.membershipApplicationLead.create({
      data: {
        clubId: validated.data.targetClubId,
        encryptedPayload: EncryptionService.encryptPayload(applicationPayload),
        payloadMeta: buildRequestMeta({
          source: 'lead',
          locale: validated.data.locale,
          countryCode: validated.data.countryCode,
          experience: validated.data.experience,
          riskLevel,
          challengeStatus,
          emailHash,
          fingerprintHash: securityContext.fingerprintHash,
        }) as Prisma.InputJsonValue,
        payloadHash,
        emailHash,
        fingerprintHash: securityContext.fingerprintHash,
        riskLevel,
        challengeStatus,
        challengeRequired: challengeStatus === 'PASSED',
        countryCode: validated.data.countryCode,
        experience: validated.data.experience,
        expiresAt,
        verifiedAt: challengePassed ? new Date() : null,
      },
    }));

  if (existingLead) {
    await prisma.membershipApplicationLead.update({
      where: { id: existingLead.id },
      data: {
        riskLevel,
        challengeStatus,
        challengeRequired: challengeStatus === 'PASSED',
        verifiedAt: challengePassed ? new Date() : existingLead.verifiedAt,
        payloadMeta: buildRequestMeta({
          source: 'lead',
          locale: validated.data.locale,
          countryCode: validated.data.countryCode,
          experience: validated.data.experience,
          riskLevel,
          challengeStatus,
          emailHash,
          fingerprintHash: securityContext.fingerprintHash,
          leadId: existingLead.id,
        }) as Prisma.InputJsonValue,
      },
    });
  }

  await createMembershipAttempt({
    clubId: validated.data.targetClubId,
    leadId: lead.id,
    subjectType: 'GUEST',
    emailHash,
    fingerprintHash: securityContext.fingerprintHash,
    payloadHash,
    riskLevel,
    decision: existingLead ? 'REPLAY' : 'ALLOW',
    challengeStatus,
    countryCode: validated.data.countryCode,
  });
  await logMembershipSecurityEvent({
    recordId: lead.id,
    operation: existingLead ? 'MEMBERSHIP_LEAD_REPLAYED' : 'MEMBERSHIP_LEAD_CAPTURED',
    changedBy: `guest:${emailHash.slice(0, 12)}`,
    changeData: {
      clubId: validated.data.targetClubId,
      countryCode: validated.data.countryCode,
      riskLevel,
      challengeStatus,
    },
  });

  return {
    success: true,
    pendingLeadToken: buildLeadToken({
      leadId: lead.id,
      payloadHash,
      expiresAt: expiresAt.toISOString(),
    }),
    expiresAt: expiresAt.toISOString(),
  };
}

export async function finalizeMembershipApplicationLead(input: {
  pendingLeadToken: string;
}): Promise<{
  success: boolean;
  applicationId?: string;
  estimatedCompletion?: Date;
  error?: string;
}> {
  const profile = await getCurrentProfile();

  if (!profile) {
    return { success: false, error: 'Unauthorized' };
  }

  const validated = finalizeLeadSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0]?.message || 'Invalid input' };
  }

  const tokenPayload = readLeadToken(validated.data.pendingLeadToken);
  if (!tokenPayload) {
    return { success: false, error: 'Invalid or expired application token' };
  }

  const lead = await prisma.membershipApplicationLead.findUnique({
    where: { id: tokenPayload.leadId },
    include: {
      club: {
        select: {
          id: true,
          name: true,
          isActive: true,
          isVerified: true,
          allowsPreRegistration: true,
        },
      },
    },
  });

  if (!lead || lead.consumedAt || new Date(lead.expiresAt) <= new Date()) {
    return { success: false, error: 'Invalid or expired application token' };
  }

  const existing = await prisma.membershipRequest.findUnique({
    where: {
      userId_clubId: {
        userId: profile.id,
        clubId: lead.clubId,
      },
    },
  });

  if (existing) {
    return { success: false, error: 'Application already exists for this club' };
  }

  if (lead.payloadHash !== tokenPayload.payloadHash || tokenPayload.expiresAt !== lead.expiresAt.toISOString()) {
    return { success: false, error: 'Invalid or expired application token' };
  }

  if (!lead.club.isActive || !lead.club.isVerified || !lead.club.allowsPreRegistration) {
    return { success: false, error: 'Club is not available for applications' };
  }

  const profileEmailHash = hashEmail(profile.email);
  if (lead.emailHash !== profileEmailHash) {
    await logMembershipSecurityEvent({
      recordId: lead.id,
      operation: 'MEMBERSHIP_LEAD_FINALIZE_REJECTED',
      changedBy: profile.authId,
      changeData: {
        clubId: lead.clubId,
        reason: 'EMAIL_MISMATCH',
        expectedEmailHash: lead.emailHash,
        attemptedEmailHash: profileEmailHash,
      },
    });

    return {
      success: false,
      error: 'Please sign in with the email used for the original application.',
    };
  }

  const decryptedPayload = EncryptionService.decryptPayload(lead.encryptedPayload);
  const payload = {
    ...decryptedPayload,
    email: profile.email,
  } as Record<string, unknown>;
  const securityContext = await getMembershipSecurityContext();

  try {
    const created = await runSerializableTransactionWithRetry(async (tx) => {
      const request = await createMembershipRequestRecord(tx, {
        profile,
        clubId: lead.clubId,
        message: typeof payload['message'] === 'string' ? payload['message'] : '',
        encryptedPayload: EncryptionService.encryptPayload(payload),
        snapshotMeta: buildRequestMeta({
          source: 'lead',
          locale: resolveMembershipRequestLocale(lead.payloadMeta),
          countryCode: typeof payload['countryCode'] === 'string' ? payload['countryCode'] : lead.countryCode || 'UN',
          experience: typeof payload['experience'] === 'string' ? payload['experience'] : lead.experience || 'curious',
          riskLevel: (lead.riskLevel as RiskLevel) || 'LOW',
          challengeStatus: (lead.challengeStatus as ChallengeStatus) || 'NOT_REQUIRED',
          emailHash: lead.emailHash,
          fingerprintHash: lead.fingerprintHash,
          leadId: lead.id,
        }),
      });

      await tx.membershipApplicationLead.update({
        where: { id: lead.id },
        data: {
          consumedAt: new Date(),
          consumedByProfileId: profile.id,
          verifiedAt: lead.verifiedAt ?? new Date(),
        },
      });

      return request;
    });

    await createMembershipAttempt({
      clubId: lead.clubId,
      profileId: profile.id,
      leadId: lead.id,
      subjectType: 'FINALIZE',
      emailHash: lead.emailHash,
      fingerprintHash: lead.fingerprintHash,
      payloadHash: lead.payloadHash,
      riskLevel: (lead.riskLevel as RiskLevel) || 'LOW',
      decision: 'FINALIZE',
      challengeStatus: (lead.challengeStatus as ChallengeStatus) || 'NOT_REQUIRED',
      countryCode: lead.countryCode,
    });
    await logMembershipSecurityEvent({
      recordId: created.id,
      operation: 'MEMBERSHIP_LEAD_FINALIZED',
      changedBy: profile.authId,
      changeData: {
        leadId: lead.id,
        clubId: lead.clubId,
        riskLevel: lead.riskLevel,
        challengeStatus: lead.challengeStatus,
        countryCode: lead.countryCode,
      },
    });

    await attemptMembershipEmail(() =>
      sendMembershipSubmissionEmail({
        applicantEmail: profile.email,
        applicantName: profile.displayName,
        clubName: lead.club.name,
        requestId: created.id,
      })
    );

    const completion = new Date(created.createdAt);
    completion.setDate(completion.getDate() + 10);

    return {
      success: true,
      applicationId: created.id,
      estimatedCompletion: completion,
    };
  } catch (error) {
    if (isPrismaKnownError(error, 'P2002')) {
      return { success: false, error: 'Application already exists for this club' };
    }

    console.error('finalizeMembershipApplicationLead error:', error);
    return { success: false, error: 'Failed to submit application. Please try again.' };
  }
}

export async function getApplicationStatus(userId: string): Promise<{
  application: {
    id: string;
    status: ApplicationStatus;
    currentStage: ApplicationStage;
    submittedAt: Date;
    estimatedCompletion?: Date;
  } | null;
  stageHistory: ApplicationStageHistoryItem[];
  progressPercentage: number;
  nextSteps?: string[];
}> {
  const request = await prisma.membershipRequest.findFirst({
    where: {
      userId,
      user: { role: 'USER' },
    },
    include: {
      stageHistory: {
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
  });

  if (!request) {
    return {
      application: null,
      stageHistory: [],
      progressPercentage: 0,
      nextSteps: ['Submit your first club application'],
    };
  }

  const currentStage = normalizeApplicationStage(request.currentStage, request.status as RequestStatus);
  const status = getApplicationStatusFromRequest(request.status as RequestStatus, currentStage);
  const estimatedCompletion = estimateCompletion(status, request.createdAt);
  const stageHistory = (request.stageHistory || []).map((entry) => ({
    id: entry.id,
    stage: normalizeApplicationStage(entry.toStage),
    changedAt: entry.createdAt,
    changedBy: entry.changedBy,
    notes: entry.notes || undefined,
  }));

  const progressPercentage =
    status === 'APPROVED' || status === 'REJECTED'
      ? 100
      : status === 'UNDER_REVIEW' || status === 'SUBMITTED'
        ? 60
        : 0;

  return {
    application: {
      id: request.id,
      status,
      currentStage,
      submittedAt: request.createdAt,
      estimatedCompletion,
    },
    stageHistory,
    progressPercentage,
    nextSteps:
      status === 'APPROVED'
        ? ['Access granted to member content']
        : status === 'REJECTED'
          ? ['Review the decision note in your notifications center']
          : ['Wait for admin review'],
  };
}

export async function getUserMembershipRequests(): Promise<MembershipRequestCard[]> {
  const profile = await getCurrentProfile();

  if (!profile) {
    return [];
  }

  const requests = await prisma.membershipRequest.findMany({
    where: {
      userId: profile.id,
      user: { role: 'USER' },
    },
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
  });

  return requests.map((request) => ({
    id: request.id,
    status: request.status as RequestStatus,
    currentStage: normalizeApplicationStage(request.currentStage, request.status as RequestStatus),
    message: request.message,
    createdAt: request.createdAt.toISOString(),
    reviewedAt: request.reviewedAt?.toISOString() || null,
    appointmentNotes: request.appointmentNotes || null,
    rejectionReason: request.rejectionReason || null,
    clubId: request.club.id,
    clubName: request.club.name,
    clubSlug: request.club.slug,
    clubImage: request.club.images[0] || null,
    clubNeighborhood: request.club.neighborhood,
  }));
}

export async function cancelMembershipRequest(requestId: string): Promise<ActionState> {
  const profile = await getCurrentProfile();

  if (!profile) {
    return { success: false, message: 'Unauthorized' };
  }

  const request = await prisma.membershipRequest.findFirst({
    where: {
      id: requestId,
      userId: profile.id,
      user: { role: 'USER' },
      status: 'PENDING',
    },
  });

  if (!request) {
    return { success: false, message: 'Request not found or cannot be cancelled' };
  }

  await prisma.membershipRequest.delete({
    where: { id: requestId },
  });

  revalidatePath('/');

  return { success: true, message: 'Request cancelled successfully' };
}

export async function approveMembershipRequest(
  requestId: string,
  note?: string
): Promise<{ success: boolean; error?: string }> {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const validated = approveSchema.safeParse({ requestId, note });
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0]?.message || 'Invalid input' };
  }

  const request = await getMembershipRequestForDecision(requestId);

  if (!request || (request.user.role && request.user.role !== 'USER')) {
    return { success: false, error: 'Application not found' };
  }

  if ((request.status as RequestStatus) !== 'PENDING') {
    return { success: false, error: getDecisionError(request.status as RequestStatus) };
  }

  const currentStage = normalizeApplicationStage(request.currentStage, request.status as RequestStatus);
  const reviewedAt = new Date();
  const locale = resolveMembershipRequestLocale(request.snapshotMeta);

  try {
    await runSerializableTransactionWithRetry(async (tx) => {
      const updateResult = await tx.membershipRequest.updateMany({
        where: {
          id: request.id,
          status: 'PENDING',
        },
        data: {
          status: 'APPROVED',
          currentStage: 'FINAL_APPROVAL',
          reviewedAt,
          reviewedBy: profile.id,
          rejectionReason: null,
          appointmentNotes: validated.data.note ?? null,
        },
      });

      if (updateResult.count !== 1) {
        throw new MembershipDecisionConflictError();
      }

      await createStageHistory(tx, request.id, currentStage, 'FINAL_APPROVAL', profile.id, validated.data.note);

      await tx.notification.create({
        data: {
          userId: request.userId,
          type: 'APPLICATION_APPROVED',
          title: 'Application approved',
          message: 'Your membership application has been approved.',
        data: {
          applicationId: request.id,
          clubId: request.club.id,
          status: 'APPROVED',
          note: validated.data.note ?? null,
        } as Prisma.InputJsonValue,
      },
    });
    });
  } catch (error) {
    if (isMembershipDecisionConflictError(error)) {
      const latestRequest = await getMembershipRequestForDecision(requestId);
      return {
        success: false,
        error: latestRequest ? getDecisionError(latestRequest.status as RequestStatus) : 'Application not found',
      };
    }

    throw error;
  }

  await logAdminAuditEvent({
    tableName: 'MembershipRequest',
    operation: 'ADMIN_APPROVE_MEMBERSHIP_REQUEST',
    changedBy: profile.authId,
    recordId: request.id,
    changeData: {
      fromStage: currentStage,
      toStage: 'FINAL_APPROVAL',
      status: 'APPROVED',
      note: validated.data.note ?? null,
      locale,
      applicantEmail: request.user.email,
      clubName: request.club.name,
    },
  });

  const emailResult = await sendMembershipApprovalEmail({
    applicantEmail: request.user.email,
    applicantName: request.user.displayName,
    clubName: request.club.name,
    requestId: request.id,
    locale,
    decisionNote: validated.data.note,
  });

  await logMembershipDecisionEmailEvent({
    actorAuthId: profile.authId,
    requestId: request.id,
    emailType: 'APPROVAL',
    result: emailResult,
  });

  revalidatePath('/');

  return { success: true };
}

export async function rejectMembershipRequest(
  requestId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const validated = rejectSchema.safeParse({ requestId, reason });
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0]?.message || 'Invalid input' };
  }

  const request = await getMembershipRequestForDecision(requestId);

  if (!request || (request.user.role && request.user.role !== 'USER')) {
    return { success: false, error: 'Application not found' };
  }

  if ((request.status as RequestStatus) !== 'PENDING') {
    return { success: false, error: getDecisionError(request.status as RequestStatus) };
  }

  const currentStage = normalizeApplicationStage(request.currentStage, request.status as RequestStatus);
  const reviewedAt = new Date();

  const locale = resolveMembershipRequestLocale(request.snapshotMeta);

  try {
    await runSerializableTransactionWithRetry(async (tx) => {
      const updateResult = await tx.membershipRequest.updateMany({
        where: {
          id: requestId,
          status: 'PENDING',
        },
        data: {
          status: 'REJECTED',
          currentStage: 'FINAL_APPROVAL',
          reviewedAt,
          reviewedBy: profile.id,
          rejectionReason: validated.data.reason,
          appointmentNotes: null,
        },
      });

      if (updateResult.count !== 1) {
        throw new MembershipDecisionConflictError();
      }

      await createStageHistory(tx, request.id, currentStage, 'FINAL_APPROVAL', profile.id, validated.data.reason);

      await tx.notification.create({
        data: {
          userId: request.userId,
          type: 'APPLICATION_REJECTED',
          title: 'Application rejected',
          message: 'Your membership application was rejected. Review the note in your notifications center if needed.',
        data: {
          applicationId: request.id,
          clubId: request.club.id,
          status: 'REJECTED',
          reason: validated.data.reason,
          note: validated.data.reason,
        } as Prisma.InputJsonValue,
      },
    });
    });
  } catch (error) {
    if (isMembershipDecisionConflictError(error)) {
      const latestRequest = await getMembershipRequestForDecision(requestId);
      return {
        success: false,
        error: latestRequest ? getDecisionError(latestRequest.status as RequestStatus) : 'Application not found',
      };
    }

    throw error;
  }

  await logAdminAuditEvent({
    tableName: 'MembershipRequest',
    operation: 'ADMIN_REJECT_MEMBERSHIP_REQUEST',
    changedBy: profile.authId,
    recordId: request.id,
    changeData: {
      fromStage: currentStage,
      toStage: 'FINAL_APPROVAL',
      status: 'REJECTED',
      reason: validated.data.reason,
      applicantEmail: request.user.email,
      clubName: request.club.name,
      locale,
    },
  });

  const emailResult = await sendMembershipRejectionEmail({
    applicantEmail: request.user.email,
    applicantName: request.user.displayName,
    clubName: request.club.name,
    requestId: request.id,
    locale,
    decisionNote: validated.data.reason,
  });

  await logMembershipDecisionEmailEvent({
    actorAuthId: profile.authId,
    requestId: request.id,
    emailType: 'REJECTION',
    result: emailResult,
  });

  revalidatePath('/');

  return { success: true };
}

export async function addAdminMembershipNote(
  requestId: string,
  body: string
): Promise<{ success: boolean; error?: string }> {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const validated = noteSchema.safeParse({ requestId, body });
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0]?.message || 'Invalid input' };
  }

  const request = await getMembershipRequestForDecision(requestId);
  if (!request || (request.user.role && request.user.role !== 'USER')) {
    return { success: false, error: 'Application not found' };
  }

  await prisma.membershipRequestNote.create({
    data: {
      requestId,
      authorId: profile.id,
      body: validated.data.body,
    },
  });

  await logAdminAuditEvent({
    tableName: 'MembershipRequest',
    operation: 'ADMIN_ADD_MEMBERSHIP_NOTE',
    changedBy: profile.authId,
    recordId: requestId,
    changeData: {
      body: validated.data.body,
      applicantEmail: request.user.email,
      clubName: request.club.name,
    },
  });

  revalidatePath('/');

  return { success: true };
}

export async function getClubApplications(): Promise<ClubApplicationItem[]> {
  const profile = await getCurrentProfile();

  if (!profile || (!profile.managedClubId && profile.role !== 'ADMIN' && profile.role !== 'CLUB_ADMIN')) {
    return [];
  }

  const where =
    profile.role === 'ADMIN'
      ? { user: { role: 'USER' as const } }
      : { clubId: profile.managedClubId as string, user: { role: 'USER' as const } };

  const requests = await prisma.membershipRequest.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          displayName: true,
          email: true,
          avatarUrl: true,
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
    orderBy: [{ createdAt: 'desc' }],
    take: 200,
  });

  return requests.map((request) => ({
    id: request.id,
    status: request.status as RequestStatus,
    createdAt: request.createdAt.toISOString(),
    message: request.message,
    club: request.club,
    user: {
      id: request.user.id,
      displayName: request.user.displayName,
      avatarUrl: request.user.avatarUrl,
    },
  }));
}

export async function getAdminMembershipQueue(input: {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL';
  query?: string;
  clubId?: string;
} = {}): Promise<AdminMembershipQueueResult> {
  await requireAdminProfile();

  const where: Prisma.MembershipRequestWhereInput = {
    user: { role: 'USER' },
    ...(input.status && input.status !== 'ALL' ? { status: input.status } : {}),
    ...(input.clubId ? { clubId: input.clubId } : {}),
    ...(input.query
      ? {
          OR: [
            { user: { email: { contains: input.query, mode: 'insensitive' } } },
            { user: { displayName: { contains: input.query, mode: 'insensitive' } } },
            { club: { name: { contains: input.query, mode: 'insensitive' } } },
          ],
        }
      : {}),
  };

  const [items, pending, approved, rejected, total, clubs] = await Promise.all([
    prisma.membershipRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
            avatarUrl: true,
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
      orderBy: [{ createdAt: 'desc' }],
      take: 200,
    }),
    prisma.membershipRequest.count({ where: { user: { role: 'USER' }, status: 'PENDING' } }),
    prisma.membershipRequest.count({ where: { user: { role: 'USER' }, status: 'APPROVED' } }),
    prisma.membershipRequest.count({ where: { user: { role: 'USER' }, status: 'REJECTED' } }),
    prisma.membershipRequest.count({ where: { user: { role: 'USER' } } }),
    prisma.club.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  return {
    items: items.map((request) => ({
      id: request.id,
      status: request.status as RequestStatus,
      createdAt: request.createdAt.toISOString(),
      message: request.message,
      reviewedAt: request.reviewedAt?.toISOString() || null,
      reviewedBy: request.reviewedBy || null,
      rejectionReason: request.rejectionReason || null,
      club: request.club,
      user: {
        id: request.user.id,
        displayName: request.user.displayName,
        email: request.user.email,
        avatarUrl: request.user.avatarUrl,
      },
    })),
    counts: {
      total,
      pending,
      approved,
      rejected,
    },
    clubs,
  };
}

export async function getAdminMembershipRequestDetail(requestId: string): Promise<AdminMembershipRequestDetail | null> {
  await requireAdminProfile();

  const request = await prisma.membershipRequest.findUnique({
    where: { id: requestId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          displayName: true,
          avatarUrl: true,
          role: true,
        },
      },
      club: {
        select: {
          id: true,
          name: true,
          slug: true,
          contactEmail: true,
          neighborhood: true,
        },
      },
      stageHistory: {
        orderBy: { createdAt: 'asc' },
      },
      notes: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              displayName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!request || request.user.role !== 'USER') {
    return null;
  }

  const storedPayload = parseStoredPayload(request);

  return {
    id: request.id,
    status: request.status as RequestStatus,
    currentStage: normalizeApplicationStage(request.currentStage, request.status as RequestStatus),
    createdAt: request.createdAt.toISOString(),
    reviewedAt: request.reviewedAt?.toISOString() || null,
    reviewedBy: request.reviewedBy || null,
    rejectionReason: request.rejectionReason || null,
    message: request.message,
    eligibilityAnswers: storedPayload.payload,
    riskSignals: storedPayload.riskSignals,
    appointmentNotes: request.appointmentNotes,
    club: request.club,
    user: {
      id: request.user.id,
      displayName: request.user.displayName,
      email: request.user.email,
      avatarUrl: request.user.avatarUrl,
    },
    stageHistory: request.stageHistory.map((entry) => ({
      id: entry.id,
      stage: normalizeApplicationStage(entry.toStage),
      changedAt: entry.createdAt,
      changedBy: entry.changedBy,
      notes: entry.notes || undefined,
    })),
    notes: request.notes.map((note) => ({
      id: note.id,
      body: note.body,
      createdAt: note.createdAt.toISOString(),
      authorName: note.author.displayName || note.author.email,
    })),
  };
}

export async function addAdminMembershipNoteAction(formData: FormData): Promise<void> {
  const parsed = noteSchema.safeParse({
    requestId: formData.get('requestId'),
    body: formData.get('body'),
    returnPath: formData.get('returnPath'),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || 'Invalid note');
  }

  const result = await addAdminMembershipNote(parsed.data.requestId, parsed.data.body);
  if (!result.success) {
    throw new Error(result.error || 'Failed to add note');
  }

  redirect(getSafeAdminReturnPath(parsed.data.returnPath ?? null, '/en/admin/requests'));
}

export async function approveMembershipRequestAction(formData: FormData): Promise<void> {
  const parsed = approveSchema.safeParse({
    requestId: formData.get('requestId'),
    note: formData.get('note') || undefined,
  });
  const returnPath = String(formData.get('returnPath') || '');

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || 'Invalid approval');
  }

  const result = await approveMembershipRequest(parsed.data.requestId, parsed.data.note);
  if (!result.success) {
    throw new Error(result.error || 'Failed to approve application');
  }

  redirect(getSafeAdminReturnPath(returnPath, '/en/admin/requests'));
}

export async function rejectMembershipRequestAction(formData: FormData): Promise<void> {
  const parsed = rejectSchema.safeParse({
    requestId: formData.get('requestId'),
    reason: formData.get('reason'),
  });
  const returnPath = String(formData.get('returnPath') || '');

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || 'Invalid rejection');
  }

  const result = await rejectMembershipRequest(parsed.data.requestId, parsed.data.reason);
  if (!result.success) {
    throw new Error(result.error || 'Failed to reject application');
  }

  redirect(getSafeAdminReturnPath(returnPath, '/en/admin/requests'));
}

async function findAuthUserByEmail(email: string) {
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabaseAdmin = createAdminClient();
  let page = 1;

  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });

    if (error) {
      throw new Error(error.message);
    }

    const users = data?.users || [];
    const match = users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (match) {
      return match;
    }

    if (users.length < 200) {
      break;
    }

    page += 1;
  }

  return null;
}

export async function bootstrapInitialAdminProfile(input: {
  email: string;
  secret: string;
}): Promise<{ success: boolean; message?: string }> {
  const { getServerEnv } = await import('@/lib/env');
  const env = getServerEnv();
  const parsed = bootstrapSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message || 'Invalid input' };
  }

  const normalizedEmail = parsed.data.email.trim().toLowerCase();
  const bootstrapRateLimited = await isAuthRateLimited({
    operation: 'ADMIN_BOOTSTRAP_FAILED',
    recordId: normalizedEmail,
    maxAttempts: ADMIN_BOOTSTRAP_RATE_LIMIT_MAX_ATTEMPTS,
    windowMinutes: ADMIN_BOOTSTRAP_RATE_LIMIT_WINDOW_MINUTES,
  });

  if (bootstrapRateLimited) {
    await logAuthAuditEvent({
      operation: 'ADMIN_BOOTSTRAP_RATE_LIMITED',
      changedBy: 'anonymous',
      recordId: normalizedEmail,
      changeData: { status: 'failed' },
    });
    return { success: false, message: 'Too many bootstrap attempts. Please try again later.' };
  }

  if (!env.ADMIN_BOOTSTRAP_SECRET || parsed.data.secret !== env.ADMIN_BOOTSTRAP_SECRET) {
    await logAuthAuditEvent({
      operation: 'ADMIN_BOOTSTRAP_FAILED',
      changedBy: 'anonymous',
      recordId: normalizedEmail,
      changeData: { status: 'failed', reason: 'invalid_secret' },
    });
    return { success: false, message: 'Bootstrap failed.' };
  }

  const adminCount = await prisma.profile.count({ where: { role: 'ADMIN' } });
  if (adminCount > 0) {
    return { success: false, message: 'An admin already exists. Bootstrap is locked.' };
  }

  const authUser = await findAuthUserByEmail(normalizedEmail);
  if (!authUser?.id || !authUser.email) {
    await logAuthAuditEvent({
      operation: 'ADMIN_BOOTSTRAP_FAILED',
      changedBy: 'anonymous',
      recordId: normalizedEmail,
      changeData: { status: 'failed', reason: 'missing_auth_user' },
    });
    return { success: false, message: 'Bootstrap failed.' };
  }

  const existingProfile = await prisma.profile.findUnique({
    where: { authId: authUser.id },
    select: { id: true },
  });

  if (existingProfile) {
    await logAuthAuditEvent({
      operation: 'ADMIN_BOOTSTRAP_FAILED',
      changedBy: 'anonymous',
      recordId: normalizedEmail,
      changeData: { status: 'failed', reason: 'existing_profile' },
    });
    return {
      success: false,
      message: 'Bootstrap failed.',
    };
  }

  const profile = await prisma.profile.create({
    data: {
      authId: authUser.id,
      email: authUser.email,
      role: 'ADMIN',
      displayName:
        typeof authUser.user_metadata?.full_name === 'string'
          ? authUser.user_metadata.full_name
          : authUser.email,
      hasCompletedOnboarding: true,
      isVerified: true,
    },
    select: {
      id: true,
      email: true,
    },
  });

  await logAdminAuditEvent({
    tableName: 'Profile',
    operation: 'ADMIN_BOOTSTRAP_CREATE',
    changedBy: authUser.id,
    recordId: profile.id,
    changeData: {
      email: profile.email,
      authId: authUser.id,
      method: 'manual_bootstrap',
    },
  });

  return { success: true, message: 'Initial admin profile created successfully.' };
}

export async function bootstrapInitialAdminProfileAction(formData: FormData): Promise<void> {
  const lang = resolveLocale(String(formData.get('lang') || ''));
  const result = await bootstrapInitialAdminProfile({
    email: String(formData.get('email') || ''),
    secret: String(formData.get('secret') || ''),
  });

  if (!result.success) {
    throw new Error(result.message || 'Failed to bootstrap admin');
  }

  redirect(`/${lang}/admin/login?bootstrap=success`);
}
