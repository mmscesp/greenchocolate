'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

export type ApplicationStage = 'INTAKE' | 'DOCUMENT_VERIFICATION' | 'BACKGROUND_CHECK' | 'FINAL_APPROVAL';
export type ApplicationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'BACKGROUND_CHECK' | 'APPROVED' | 'REJECTED';

export interface ApplicationStageHistoryItem {
  stage: ApplicationStage;
  changedAt: Date;
  changedBy: string;
  notes?: string;
}

interface ApplicationStageHistoryJsonItem {
  stage: ApplicationStage;
  changedAt: string;
  changedBy: string;
  notes?: string;
}

const submitSchema = z.object({
  targetClubId: z.string().uuid(),
  eligibilityAnswers: z.record(z.string(), z.unknown()).default({}),
  message: z.string().max(500).optional(),
});

const requestStageSchema = z.object({
  requestId: z.string().uuid(),
  toStage: z.enum(['DOCUMENT_VERIFICATION', 'BACKGROUND_CHECK', 'FINAL_APPROVAL']),
  notes: z.string().max(500).optional(),
});

type CurrentProfile = {
  id: string;
  authId: string;
  role: 'USER' | 'ADMIN' | 'CLUB_ADMIN';
  managedClubId: string | null;
};

export interface ClubApplicationItem {
  id: string;
  status: ApplicationStatus;
  stage: ApplicationStage;
  createdAt: string;
  message: string | null;
  user: {
    id: string;
    displayName: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await prisma.profile.findUnique({
    where: { authId: user.id },
    select: {
      id: true,
      authId: true,
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

function mapRequestStatus(status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SCHEDULED'): ApplicationStatus {
  if (status === 'APPROVED') return 'APPROVED';
  if (status === 'REJECTED') return 'REJECTED';
  if (status === 'SCHEDULED') return 'BACKGROUND_CHECK';
  return 'UNDER_REVIEW';
}

function mapStatusToStage(status: ApplicationStatus): ApplicationStage {
  if (status === 'BACKGROUND_CHECK') return 'BACKGROUND_CHECK';
  if (status === 'APPROVED') return 'FINAL_APPROVAL';
  return 'DOCUMENT_VERIFICATION';
}

function estimateCompletion(status: ApplicationStatus, submittedAt: Date): Date | undefined {
  const estimate = new Date(submittedAt);

  if (status === 'UNDER_REVIEW') {
    estimate.setDate(estimate.getDate() + 10);
    return estimate;
  }

  if (status === 'BACKGROUND_CHECK') {
    estimate.setDate(estimate.getDate() + 4);
    return estimate;
  }

  return undefined;
}

function resolveStageFromSnapshot(snapshot: Record<string, unknown> | null, status: ApplicationStatus): ApplicationStage {
  const snapshotStage = snapshot?.stage;
  if (snapshotStage === 'INTAKE' || snapshotStage === 'DOCUMENT_VERIFICATION' || snapshotStage === 'BACKGROUND_CHECK' || snapshotStage === 'FINAL_APPROVAL') {
    return snapshotStage;
  }
  return mapStatusToStage(status);
}

/**
 * Transitional pipeline submit action implemented on top of MembershipRequest.
 */
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

  const created = await prisma.membershipRequest.create({
    // Prisma JSON input requires plain JSON-safe values.
    // We intentionally persist this as a transitional snapshot structure.
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    data: {
      userId: profile.id,
      clubId: validated.data.targetClubId,
      message: validated.data.message,
      encryptedSnapshot: {
        eligibilityAnswers: validated.data.eligibilityAnswers,
        stage: 'INTAKE',
        stageHistory: [
          {
            stage: 'INTAKE',
            changedAt: new Date().toISOString(),
            changedBy: profile.authId,
          },
        ],
      } as Prisma.InputJsonValue,
      status: 'PENDING',
    },
  });

  const completion = new Date(created.createdAt);
  completion.setDate(completion.getDate() + 10);

  return {
    success: true,
    applicationId: created.id,
    estimatedCompletion: completion,
  };
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
    where: { userId },
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

  const status = mapRequestStatus(request.status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'SCHEDULED');
  const currentStage = mapStatusToStage(status);
  const estimatedCompletion = estimateCompletion(status, request.createdAt);

  const snapshot = (request.encryptedSnapshot as Record<string, unknown> | null) || null;
  const stageHistoryJson: ApplicationStageHistoryJsonItem[] = snapshot && Array.isArray(snapshot.stageHistory)
    ? (snapshot.stageHistory as ApplicationStageHistoryJsonItem[])
    : [];

  const stageHistory: ApplicationStageHistoryItem[] = stageHistoryJson.map((entry) => ({
    stage: entry.stage,
    changedAt: new Date(entry.changedAt),
    changedBy: entry.changedBy,
    notes: entry.notes,
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

/**
 * Transitional stage advance on top of MembershipRequest.
 */
export async function advanceApplicationStage(
  requestId: string,
  toStage: ApplicationStage,
  notes?: string
): Promise<{ success: boolean; newStage?: ApplicationStage; error?: string }> {
  const profile = await getCurrentProfile();

  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'CLUB_ADMIN')) {
    return { success: false, error: 'Unauthorized' };
  }

  const validated = requestStageSchema.safeParse({ requestId, toStage, notes });
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0]?.message || 'Invalid input' };
  }

  const request = await prisma.membershipRequest.findUnique({ where: { id: requestId } });

  if (!request) {
    return { success: false, error: 'Application not found' };
  }

  if (profile.role === 'CLUB_ADMIN' && profile.managedClubId !== request.clubId) {
    return { success: false, error: 'Unauthorized for this club' };
  }

  const snapshot = (request.encryptedSnapshot as Record<string, unknown> | null) || {};
  const previousHistory: ApplicationStageHistoryJsonItem[] = Array.isArray(snapshot.stageHistory)
    ? (snapshot.stageHistory as ApplicationStageHistoryJsonItem[])
    : [];

  const nextHistory: ApplicationStageHistoryJsonItem[] = [
    ...previousHistory,
    {
      stage: validated.data.toStage,
      changedAt: new Date().toISOString(),
      changedBy: profile.authId,
      notes: validated.data.notes,
    },
  ];

  const nextStatus =
    validated.data.toStage === 'FINAL_APPROVAL'
      ? 'APPROVED'
      : validated.data.toStage === 'BACKGROUND_CHECK'
        ? 'SCHEDULED'
        : 'PENDING';

  await prisma.membershipRequest.update({
    where: { id: request.id },
    data: {
      status: nextStatus,
      reviewedAt: new Date(),
      reviewedBy: profile.id,
      appointmentNotes: validated.data.notes,
      encryptedSnapshot: {
        ...snapshot,
        stage: validated.data.toStage,
        stageHistory: nextHistory,
      } as unknown as Prisma.InputJsonValue,
    },
  });

  return { success: true, newStage: validated.data.toStage };
}

export async function rejectApplication(
  requestId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  const profile = await getCurrentProfile();

  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'CLUB_ADMIN')) {
    return { success: false, error: 'Unauthorized' };
  }

  const request = await prisma.membershipRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    return { success: false, error: 'Application not found' };
  }

  if (profile.role === 'CLUB_ADMIN' && profile.managedClubId !== request.clubId) {
    return { success: false, error: 'Unauthorized for this club' };
  }

  const snapshot = (request.encryptedSnapshot as Record<string, unknown> | null) || {};
  const previousHistory: ApplicationStageHistoryJsonItem[] = Array.isArray(snapshot.stageHistory)
    ? (snapshot.stageHistory as ApplicationStageHistoryJsonItem[])
    : [];

  const nextHistory: ApplicationStageHistoryJsonItem[] = [
    ...previousHistory,
    {
      stage: resolveStageFromSnapshot(snapshot, mapRequestStatus(request.status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'SCHEDULED')),
      changedAt: new Date().toISOString(),
      changedBy: profile.authId,
      notes: reason,
    },
  ];

  await prisma.membershipRequest.update({
    where: { id: requestId },
    data: {
      status: 'REJECTED',
      reviewedAt: new Date(),
      reviewedBy: profile.id,
      rejectionReason: reason,
      encryptedSnapshot: {
        ...snapshot,
        stageHistory: nextHistory,
      } as unknown as Prisma.InputJsonValue,
    },
  });

  return { success: true };
}

export async function getClubApplications(): Promise<ClubApplicationItem[]> {
  const profile = await getCurrentProfile();

  if (!profile || (!profile.managedClubId && profile.role !== 'ADMIN')) {
    return [];
  }

  const where = profile.role === 'ADMIN' ? {} : { clubId: profile.managedClubId as string };

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
    },
    orderBy: [{ createdAt: 'desc' }],
    take: 200,
  });

  return requests.map((request) => {
    const status = mapRequestStatus(request.status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'SCHEDULED');
    const snapshot = (request.encryptedSnapshot as Record<string, unknown> | null) || null;
    const stage = resolveStageFromSnapshot(snapshot, status);

    return {
      id: request.id,
      status,
      stage,
      createdAt: request.createdAt.toISOString(),
      message: request.message,
      user: {
        id: request.user.id,
        displayName: request.user.displayName,
        email: request.user.email,
        avatarUrl: request.user.avatarUrl,
      },
    };
  });
}
