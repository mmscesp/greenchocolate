'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { logAdminAuditEvent } from '@/lib/security/admin-audit';
import {
  mapRequestStatus,
  normalizeApplicationStage,
  type ApplicationStage,
  type ApplicationStatus,
} from '@/lib/application-utils';
import {
  sendMembershipApprovalEmail,
  sendMembershipRejectionEmail,
  sendMembershipStageUpdateEmail,
  sendMembershipSubmissionEmail,
} from '@/lib/email/membership';

const TRANSACTION_MAX_RETRIES = 3;

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
  status: ApplicationStatus;
  stage: ApplicationStage;
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
    email: string;
    avatarUrl: string | null;
  };
}

export interface AdminMembershipQueueItem extends ClubApplicationItem {
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
}

export interface AdminMembershipRequestDetail {
  id: string;
  status: RequestStatus;
  applicationStatus: ApplicationStatus;
  currentStage: ApplicationStage;
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
  message: string | null;
  eligibilityAnswers: Record<string, unknown>;
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

const submitSchema = z.object({
  targetClubId: z.string().uuid(),
  eligibilityAnswers: z.record(z.string(), z.unknown()).default({}),
  message: z.string().max(500).optional(),
});

const requestStageSchema = z.object({
  requestId: z.string().uuid(),
  toStage: z.enum(['DOCUMENT_VERIFICATION', 'BACKGROUND_CHECK', 'FINAL_APPROVAL']),
  notes: z.string().max(1000).optional(),
});

const rejectSchema = z.object({
  requestId: z.string().uuid(),
  reason: z.string().min(1).max(1000),
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await prisma.profile.findUnique({
    where: { authId: user.id },
    select: {
      id: true,
      authId: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      role: true,
      managedClubId: true,
    },
  });

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

  if (status === 'BACKGROUND_CHECK') {
    estimate.setDate(estimate.getDate() + 4);
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

function getRequestStageLabel(stage: ApplicationStage): string {
  switch (stage) {
    case 'INTAKE':
      return 'intake';
    case 'DOCUMENT_VERIFICATION':
      return 'document verification';
    case 'BACKGROUND_CHECK':
      return 'background check';
    case 'FINAL_APPROVAL':
      return 'final approval';
    default:
      return String(stage).toLowerCase().replaceAll('_', ' ');
  }
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

function parseEligibilityAnswers(snapshot: Prisma.JsonValue | null): Record<string, unknown> {
  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
    return {};
  }

  const record = snapshot as Record<string, unknown>;
  if (!record.eligibilityAnswers || typeof record.eligibilityAnswers !== 'object' || Array.isArray(record.eligibilityAnswers)) {
    return {};
  }

  return record.eligibilityAnswers as Record<string, unknown>;
}

export async function submitMembershipApplication(data: {
  targetClubId: string;
  eligibilityAnswers: Record<string, unknown>;
  message?: string;
}): Promise<{ success: boolean; applicationId?: string; estimatedCompletion?: Date; error?: string }> {
  const profile = await getCurrentProfile();

  if (!profile) {
    return { success: false, error: 'Unauthorized' };
  }

  const validated = submitSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0]?.message || 'Invalid input' };
  }

  const club = await prisma.club.findUnique({
    where: { id: validated.data.targetClubId },
    select: {
      id: true,
      name: true,
      isActive: true,
      isVerified: true,
      allowsPreRegistration: true,
    },
  });

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
    const created = await runSerializableTransactionWithRetry(async (tx) => {
      const request = await tx.membershipRequest.create({
        data: {
          userId: profile.id,
          clubId: validated.data.targetClubId,
          message: validated.data.message,
          currentStage: 'INTAKE',
          encryptedSnapshot: {
            eligibilityAnswers: validated.data.eligibilityAnswers,
          } as Prisma.InputJsonValue,
          status: 'PENDING',
        },
      });

      await createStageHistory(tx, request.id, null, 'INTAKE', profile.id, 'Application submitted');

      await tx.notification.create({
        data: {
          userId: profile.id,
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

  const stageIndex: Record<ApplicationStage, number> = {
    INTAKE: 1,
    DOCUMENT_VERIFICATION: 2,
    BACKGROUND_CHECK: 3,
    FINAL_APPROVAL: 4,
  };

  const progressPercentage = Math.round((stageIndex[currentStage] / 4) * 100);

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
    nextSteps: status === 'APPROVED' ? ['Access granted to member content'] : ['Wait for admin review'],
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

export async function advanceApplicationStage(
  requestId: string,
  toStage: ApplicationStage,
  notes?: string
): Promise<{ success: boolean; newStage?: ApplicationStage; error?: string }> {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const validated = requestStageSchema.safeParse({ requestId, toStage, notes });
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0]?.message || 'Invalid input' };
  }

  const request = await getMembershipRequestForDecision(requestId);

  if (!request || (request.user.role && request.user.role !== 'USER')) {
    return { success: false, error: 'Application not found' };
  }

  const currentStage = normalizeApplicationStage(request.currentStage, request.status as RequestStatus);
  const nextStatus: RequestStatus = validated.data.toStage === 'FINAL_APPROVAL' ? 'APPROVED' : 'PENDING';

  await prisma.$transaction(async (tx) => {
    await tx.membershipRequest.update({
      where: { id: request.id },
      data: {
        status: nextStatus,
        currentStage: validated.data.toStage,
        reviewedAt: new Date(),
        reviewedBy: profile.id,
        appointmentNotes: validated.data.notes,
      },
    });

    await createStageHistory(tx, request.id, currentStage, validated.data.toStage, profile.id, validated.data.notes);

    await tx.notification.create({
      data: {
        userId: request.userId,
        type: nextStatus === 'APPROVED' ? 'APPLICATION_APPROVED' : 'APPLICATION_STAGE_CHANGED',
        title: nextStatus === 'APPROVED' ? 'Application approved' : 'Application stage updated',
        message:
          nextStatus === 'APPROVED'
            ? 'Your membership application has been approved.'
            : `Your application moved to ${getRequestStageLabel(validated.data.toStage)}.`,
        data: {
          applicationId: request.id,
          stage: validated.data.toStage,
        } as Prisma.InputJsonValue,
      },
    });
  });

  await logAdminAuditEvent({
    tableName: 'MembershipRequest',
    operation: nextStatus === 'APPROVED' ? 'ADMIN_APPROVE_MEMBERSHIP_REQUEST' : 'ADMIN_ADVANCE_MEMBERSHIP_STAGE',
    changedBy: profile.authId,
    recordId: request.id,
    changeData: {
      fromStage: currentStage,
      toStage: validated.data.toStage,
      status: nextStatus,
      notes: validated.data.notes || null,
      applicantEmail: request.user.email,
      clubName: request.club.name,
    },
  });

  const emailResult = await attemptMembershipEmail(() =>
    nextStatus === 'APPROVED'
      ? sendMembershipApprovalEmail({
          applicantEmail: request.user.email,
          applicantName: request.user.displayName,
          clubName: request.club.name,
          requestId: request.id,
          notes: validated.data.notes,
        })
      : sendMembershipStageUpdateEmail(
          {
            applicantEmail: request.user.email,
            applicantName: request.user.displayName,
            clubName: request.club.name,
            requestId: request.id,
            notes: validated.data.notes,
          },
          getRequestStageLabel(validated.data.toStage)
        )
  );

  if (!emailResult.success && !emailResult.skipped) {
    await logAdminAuditEvent({
      tableName: 'MembershipRequest',
      operation: 'MEMBERSHIP_EMAIL_FAILED',
      changedBy: profile.authId,
      recordId: request.id,
      changeData: {
        stage: validated.data.toStage,
        error: emailResult.error || 'Unknown email error',
      },
    });
  }

  revalidatePath('/');

  return { success: true, newStage: validated.data.toStage };
}

export async function rejectApplication(
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

  const currentStage = normalizeApplicationStage(request.currentStage, request.status as RequestStatus);

  await prisma.$transaction(async (tx) => {
    await tx.membershipRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        reviewedBy: profile.id,
        rejectionReason: validated.data.reason,
      },
    });

    await createStageHistory(tx, request.id, currentStage, currentStage, profile.id, validated.data.reason);

    await tx.notification.create({
      data: {
        userId: request.userId,
        type: 'APPLICATION_REJECTED',
        title: 'Application rejected',
        message: 'Your membership application was rejected. Please review notes and contact support if needed.',
        data: {
          applicationId: request.id,
          reason: validated.data.reason,
        } as Prisma.InputJsonValue,
      },
    });
  });

  await logAdminAuditEvent({
    tableName: 'MembershipRequest',
    operation: 'ADMIN_REJECT_MEMBERSHIP_REQUEST',
    changedBy: profile.authId,
    recordId: request.id,
    changeData: {
      stage: currentStage,
      reason: validated.data.reason,
      applicantEmail: request.user.email,
      clubName: request.club.name,
    },
  });

  const emailResult = await attemptMembershipEmail(() =>
    sendMembershipRejectionEmail({
      applicantEmail: request.user.email,
      applicantName: request.user.displayName,
      clubName: request.club.name,
      requestId: request.id,
      notes: validated.data.reason,
    })
  );

  if (!emailResult.success && !emailResult.skipped) {
    await logAdminAuditEvent({
      tableName: 'MembershipRequest',
      operation: 'MEMBERSHIP_EMAIL_FAILED',
      changedBy: profile.authId,
      recordId: request.id,
      changeData: {
        stage: currentStage,
        error: emailResult.error || 'Unknown email error',
      },
    });
  }

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
    status: getApplicationStatusFromRequest(request.status as RequestStatus, request.currentStage),
    stage: normalizeApplicationStage(request.currentStage, request.status as RequestStatus),
    createdAt: request.createdAt.toISOString(),
    message: request.message,
    club: request.club,
    user: {
      id: request.user.id,
      displayName: request.user.displayName,
      email: request.user.email,
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
      status: getApplicationStatusFromRequest(request.status as RequestStatus, request.currentStage),
      stage: normalizeApplicationStage(request.currentStage, request.status as RequestStatus),
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

  return {
    id: request.id,
    status: request.status as RequestStatus,
    applicationStatus: getApplicationStatusFromRequest(request.status as RequestStatus, request.currentStage),
    currentStage: normalizeApplicationStage(request.currentStage, request.status as RequestStatus),
    createdAt: request.createdAt.toISOString(),
    reviewedAt: request.reviewedAt?.toISOString() || null,
    reviewedBy: request.reviewedBy || null,
    rejectionReason: request.rejectionReason || null,
    message: request.message,
    eligibilityAnswers: parseEligibilityAnswers(request.encryptedSnapshot),
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

  if (parsed.data.returnPath) {
    redirect(parsed.data.returnPath);
  }
}

export async function advanceApplicationStageAction(formData: FormData): Promise<void> {
  const parsed = requestStageSchema.safeParse({
    requestId: formData.get('requestId'),
    toStage: formData.get('toStage'),
    notes: formData.get('notes') || undefined,
  });
  const returnPath = String(formData.get('returnPath') || '');

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || 'Invalid stage update');
  }

  const result = await advanceApplicationStage(parsed.data.requestId, parsed.data.toStage, parsed.data.notes);
  if (!result.success) {
    throw new Error(result.error || 'Failed to update stage');
  }

  if (returnPath) {
    redirect(returnPath);
  }
}

export async function rejectApplicationAction(formData: FormData): Promise<void> {
  const parsed = rejectSchema.safeParse({
    requestId: formData.get('requestId'),
    reason: formData.get('reason'),
  });
  const returnPath = String(formData.get('returnPath') || '');

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || 'Invalid rejection');
  }

  const result = await rejectApplication(parsed.data.requestId, parsed.data.reason);
  if (!result.success) {
    throw new Error(result.error || 'Failed to reject application');
  }

  if (returnPath) {
    redirect(returnPath);
  }
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

  if (!env.ADMIN_BOOTSTRAP_SECRET || parsed.data.secret !== env.ADMIN_BOOTSTRAP_SECRET) {
    return { success: false, message: 'Invalid bootstrap secret' };
  }

  const adminCount = await prisma.profile.count({ where: { role: 'ADMIN' } });
  if (adminCount > 0) {
    return { success: false, message: 'An admin already exists. Bootstrap is locked.' };
  }

  const authUser = await findAuthUserByEmail(parsed.data.email);
  if (!authUser?.id || !authUser.email) {
    return { success: false, message: 'No Supabase auth user found for that email' };
  }

  const existingProfile = await prisma.profile.findUnique({
    where: { authId: authUser.id },
    select: { id: true },
  });

  if (existingProfile) {
    return {
      success: false,
      message: 'A profile already exists for that auth user. Create the admin directly in Supabase first, without app signup.',
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
  const result = await bootstrapInitialAdminProfile({
    email: String(formData.get('email') || ''),
    secret: String(formData.get('secret') || ''),
  });

  if (!result.success) {
    throw new Error(result.message || 'Failed to bootstrap admin');
  }

  redirect('/en/admin/login?bootstrap=success');
}
