'use server';

import {
  CommunicationAudience,
  CommunicationStatus,
  EmailOutboxStatus,
  type Prisma,
} from '@prisma/client';
import { redirect } from 'next/navigation';
import {
  processEmailOutboxItem,
  processPendingEmailOutbox,
  processSpecificEmailOutboxItems,
  retryEmailOutboxItem,
} from '@/lib/communications/outbox';
import { getServerEnv } from '@/lib/env';
import { getPlatformControlState } from '@/lib/platform-control';
import { prisma } from '@/lib/prisma';
import { logAdminAuditEvent } from '@/lib/security/admin-audit';
import { getAdminSessionProfile } from '@/lib/security/admin-guard';
import {
  getSafeAdminReturnPath,
  revalidateAdminPortalPaths,
  withAdminActionStatus,
} from '@/lib/security/admin-portal';

type AdminCommunicationsFilterInput = {
  search?: string;
  audience?: 'ALL' | CommunicationAudience;
  status?: 'ALL' | CommunicationStatus;
  outboxStatus?: 'ALL' | EmailOutboxStatus;
};

function getOutboxWhere(input: AdminCommunicationsFilterInput): Prisma.EmailOutboxWhereInput {
  return {
    ...(input.audience && input.audience !== 'ALL' ? { audience: input.audience } : {}),
    ...(input.outboxStatus && input.outboxStatus !== 'ALL' ? { status: input.outboxStatus } : {}),
    ...(input.status && input.status !== 'ALL'
      ? {
          communicationEvent: {
            is: {
              status: input.status,
            },
          },
        }
      : {}),
    ...(input.search
      ? {
          OR: [
            { provider: { contains: input.search, mode: 'insensitive' } },
            { lastError: { contains: input.search, mode: 'insensitive' } },
            {
              communicationEvent: {
                is: {
                  OR: [
                    { recipientEmail: { contains: input.search, mode: 'insensitive' } },
                    { type: { contains: input.search, mode: 'insensitive' } },
                    { subject: { contains: input.search, mode: 'insensitive' } },
                  ],
                },
              },
            },
          ],
        }
      : {}),
  };
}

function getCommunicationEventWhere(input: AdminCommunicationsFilterInput): Prisma.CommunicationEventWhereInput {
  const search = input.search?.trim();

  return {
    ...(input.audience && input.audience !== 'ALL' ? { audience: input.audience } : {}),
    ...(input.status && input.status !== 'ALL' ? { status: input.status } : {}),
    ...(search
      ? {
          OR: [
            { recipientEmail: { contains: search, mode: 'insensitive' } },
            { type: { contains: search, mode: 'insensitive' } },
            { provider: { contains: search, mode: 'insensitive' } },
            { subject: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };
}

export async function getAdminCommunicationsOverview(rawInput: AdminCommunicationsFilterInput = {}) {
  const admin = await getAdminSessionProfile();
  if (!admin) {
    return null;
  }

  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const filters = {
    search: rawInput.search?.trim() || '',
    audience: rawInput.audience ?? 'ALL',
    status: rawInput.status ?? 'ALL',
    outboxStatus: rawInput.outboxStatus ?? 'ALL',
  } satisfies AdminCommunicationsFilterInput;

  const communicationWhere = getCommunicationEventWhere(filters);
  const outboxWhere = getOutboxWhere(filters);

  const [
    sentLast24Hours,
    failedLast24Hours,
    pendingOutbox,
    failedOutbox,
    deadLetterCandidates,
    staleOutbox,
    unsubscribedCount,
    recentEvents,
    recentOutbox,
    recentSubscriptions,
    recentWebhooks,
    invalidWebhooks7d,
    sentLast7Days,
    failedLast7Days,
    sentLast30Days,
    failedLast30Days,
    outboxCreated24Hours,
    outboxCreated7Days,
    outboxCreated30Days,
    verifiedWebhooks7d,
    verifiedWebhooks30d,
    invalidWebhooks30d,
    recentContactInquiries,
    openContactInquiries,
    newContactInquiries7d,
    marketingLeads7d,
    recentLeadSubscriptions,
    pendingMembershipLeads,
    recentMembershipLeads,
    controlState,
  ] = await Promise.all([
    prisma.communicationEvent.count({
      where: {
        status: CommunicationStatus.SENT,
        createdAt: { gte: last24Hours },
      },
    }),
    prisma.communicationEvent.count({
      where: {
        status: CommunicationStatus.FAILED,
        createdAt: { gte: last24Hours },
      },
    }),
    prisma.emailOutbox.count({
      where: {
        status: {
          in: [EmailOutboxStatus.PENDING, EmailOutboxStatus.PROCESSING],
        },
      },
    }),
    prisma.emailOutbox.count({
      where: { status: EmailOutboxStatus.FAILED },
    }),
    prisma.emailOutbox.findMany({
      where: {
        status: {
          in: [EmailOutboxStatus.FAILED, EmailOutboxStatus.SKIPPED],
        },
      },
      select: {
        id: true,
        status: true,
        attempts: true,
        maxAttempts: true,
      },
    }),
    prisma.emailOutbox.findFirst({
      where: {
        status: {
          in: [EmailOutboxStatus.PENDING, EmailOutboxStatus.FAILED],
        },
        availableAt: { lte: now },
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        createdAt: true,
      },
    }),
    prisma.emailSubscription.count({
      where: { status: 'UNSUBSCRIBED' },
    }),
    prisma.communicationEvent.findMany({
      where: communicationWhere,
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        type: true,
        audience: true,
        provider: true,
        status: true,
        recipientEmail: true,
        locale: true,
        subject: true,
        errorMessage: true,
        sentAt: true,
        createdAt: true,
      },
    }),
    prisma.emailOutbox.findMany({
      where: outboxWhere,
      orderBy: [{ updatedAt: 'desc' }],
      take: 25,
      select: {
        id: true,
        audience: true,
        route: true,
        status: true,
        provider: true,
        attempts: true,
        maxAttempts: true,
        availableAt: true,
        sentAt: true,
        lastError: true,
        createdAt: true,
        updatedAt: true,
        relatedRequestId: true,
        communicationEvent: {
          select: {
            id: true,
            type: true,
            recipientEmail: true,
            subject: true,
          },
        },
      },
    }),
    prisma.emailSubscription.findMany({
      orderBy: [{ updatedAt: 'desc' }],
      take: 25,
      select: {
        id: true,
        email: true,
        status: true,
        locale: true,
        source: true,
        provider: true,
        marketingConsentAt: true,
        unsubscribedAt: true,
        lastMarketingEmailAt: true,
        lastTransactionalEmailAt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.providerWebhookEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 25,
      select: {
        id: true,
        provider: true,
        eventType: true,
        recipientEmail: true,
        externalId: true,
        signatureValid: true,
        errorMessage: true,
        createdAt: true,
      },
    }),
    prisma.providerWebhookEvent.count({
      where: {
        signatureValid: false,
        createdAt: { gte: last7Days },
      },
    }),
    prisma.communicationEvent.count({
      where: {
        status: CommunicationStatus.SENT,
        createdAt: { gte: last7Days },
      },
    }),
    prisma.communicationEvent.count({
      where: {
        status: CommunicationStatus.FAILED,
        createdAt: { gte: last7Days },
      },
    }),
    prisma.communicationEvent.count({
      where: {
        status: CommunicationStatus.SENT,
        createdAt: { gte: last30Days },
      },
    }),
    prisma.communicationEvent.count({
      where: {
        status: CommunicationStatus.FAILED,
        createdAt: { gte: last30Days },
      },
    }),
    prisma.emailOutbox.count({
      where: {
        createdAt: { gte: last24Hours },
      },
    }),
    prisma.emailOutbox.count({
      where: {
        createdAt: { gte: last7Days },
      },
    }),
    prisma.emailOutbox.count({
      where: {
        createdAt: { gte: last30Days },
      },
    }),
    prisma.providerWebhookEvent.count({
      where: {
        signatureValid: true,
        createdAt: { gte: last7Days },
      },
    }),
    prisma.providerWebhookEvent.count({
      where: {
        signatureValid: true,
        createdAt: { gte: last30Days },
      },
    }),
    prisma.providerWebhookEvent.count({
      where: {
        signatureValid: false,
        createdAt: { gte: last30Days },
      },
    }),
    prisma.contactInquiry.findMany({
      orderBy: [{ updatedAt: 'desc' }],
      take: 20,
      select: {
        id: true,
        category: true,
        status: true,
        name: true,
        email: true,
        subject: true,
        message: true,
        adminNotes: true,
        source: true,
        resolvedAt: true,
        createdAt: true,
        updatedAt: true,
        assignedAdmin: {
          select: {
            displayName: true,
            email: true,
          },
        },
      },
    }),
    prisma.contactInquiry.count({
      where: {
        status: {
          in: ['NEW', 'IN_PROGRESS'],
        },
      },
    }),
    prisma.contactInquiry.count({
      where: {
        createdAt: {
          gte: last7Days,
        },
      },
    }),
    prisma.emailSubscription.count({
      where: {
        marketingConsentAt: {
          gte: last7Days,
        },
      },
    }),
    prisma.emailSubscription.findMany({
      where: {
        marketingConsentAt: {
          not: null,
        },
      },
      orderBy: [{ updatedAt: 'desc' }],
      take: 20,
      select: {
        id: true,
        email: true,
        status: true,
        locale: true,
        source: true,
        marketingConsentAt: true,
        lastMarketingEmailAt: true,
        createdAt: true,
        updatedAt: true,
        metadata: true,
      },
    }),
    prisma.membershipApplicationLead.count({
      where: {
        consumedAt: null,
        expiresAt: {
          gt: now,
        },
      },
    }),
    prisma.membershipApplicationLead.findMany({
      orderBy: [{ createdAt: 'desc' }],
      take: 20,
      select: {
        id: true,
        riskLevel: true,
        challengeStatus: true,
        expiresAt: true,
        consumedAt: true,
        countryCode: true,
        createdAt: true,
        club: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    }),
    getPlatformControlState(),
  ]);

  const deadLetterOutbox = deadLetterCandidates.filter(
    (item) => item.status === EmailOutboxStatus.SKIPPED || item.attempts >= item.maxAttempts
  ).length;

  await logAdminAuditEvent({
    tableName: 'CommunicationEvent',
    operation: 'ADMIN_LIST_COMMUNICATIONS',
    changedBy: admin.authId,
    recordId: 'overview',
    changeData: {
      filters,
      eventsReturned: recentEvents.length,
      outboxReturned: recentOutbox.length,
      inquiriesReturned: recentContactInquiries.length,
    },
  });

  const env = getServerEnv();

  return {
    filters,
    controls: controlState,
    summary: {
      sentLast24Hours,
      failedLast24Hours,
      pendingOutbox,
      failedOutbox,
      deadLetterOutbox,
      unsubscribedCount,
      oldestReadyOutboxAgeMinutes: staleOutbox
        ? Math.max(0, Math.round((now.getTime() - staleOutbox.createdAt.getTime()) / 60000))
        : null,
      openContactInquiries,
      newContactInquiries7d,
      marketingLeads7d,
      pendingMembershipLeads,
    },
    analytics: {
      failureRate7d:
        sentLast7Days + failedLast7Days > 0
          ? Math.round((failedLast7Days / (sentLast7Days + failedLast7Days)) * 1000) / 10
          : 0,
      failureRate30d:
        sentLast30Days + failedLast30Days > 0
          ? Math.round((failedLast30Days / (sentLast30Days + failedLast30Days)) * 1000) / 10
          : 0,
      backlogCreated24Hours: outboxCreated24Hours,
      backlogCreated7Days: outboxCreated7Days,
      backlogCreated30Days: outboxCreated30Days,
      verifiedWebhooks7d,
      verifiedWebhooks30d,
      invalidWebhooks30d,
      webhookIntegrityRate7d:
        verifiedWebhooks7d + invalidWebhooks7d > 0
          ? Math.round((verifiedWebhooks7d / (verifiedWebhooks7d + invalidWebhooks7d)) * 1000) / 10
          : 100,
      webhookIntegrityRate30d:
        verifiedWebhooks30d + invalidWebhooks30d > 0
          ? Math.round((verifiedWebhooks30d / (verifiedWebhooks30d + invalidWebhooks30d)) * 1000) / 10
          : 100,
    },
    readiness: {
      resendApi: Boolean(env.RESEND_API_KEY && env.RESEND_SENDER_EMAIL),
      resendWebhook: Boolean(env.RESEND_WEBHOOK_SECRET),
      brevoApi: Boolean(env.BREVO_API_KEY && env.BREVO_SENDER_EMAIL),
      brevoWebhook: Boolean(env.BREVO_WEBHOOK_SECRET),
      cronSecret: Boolean(env.COMMUNICATIONS_CRON_SECRET),
    },
    recentEvents,
    recentOutbox,
    recentSubscriptions,
    recentWebhooks,
    recentContactInquiries,
    recentLeadSubscriptions,
    recentMembershipLeads,
  };
}

export async function processAdminPendingCommunications(formData: FormData): Promise<void> {
  const admin = await getAdminSessionProfile();
  const returnPath = getSafeAdminReturnPath(formData.get('returnPath'), '/en/admin/communications');

  if (!admin) {
    redirect(withAdminActionStatus(returnPath, 'error', 'Admin session is required.'));
    return;
  }

  const rawLimit = Number(formData.get('limit') || 25);
  const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.min(rawLimit, 100)) : 25;

  try {
    const results = await processPendingEmailOutbox(limit);
    const sent = results.filter((entry) => entry.result.success).length;
    const failed = results.length - sent;

    await logAdminAuditEvent({
      tableName: 'EmailOutbox',
      operation: 'ADMIN_PROCESS_PENDING_COMMUNICATIONS',
      changedBy: admin.authId,
      recordId: 'batch',
      changeData: {
        limit,
        processed: results.length,
        sent,
        failed,
      },
    });

    revalidateAdminPortalPaths(['/communications']);
    redirect(
      withAdminActionStatus(
        returnPath,
        'success',
        results.length === 0
          ? 'No pending communications were ready to process.'
          : `Processed ${results.length} queued communications in the outbox. ${sent} succeeded, ${failed} still need attention.`
      )
    );
  } catch (error) {
    console.error('processAdminPendingCommunications error:', error);
    redirect(withAdminActionStatus(returnPath, 'error', 'Failed to process queued communications.'));
  }
}

export async function replayAdminCommunicationOutboxItem(formData: FormData): Promise<void> {
  const admin = await getAdminSessionProfile();
  const returnPath = getSafeAdminReturnPath(formData.get('returnPath'), '/en/admin/communications');

  if (!admin) {
    redirect(withAdminActionStatus(returnPath, 'error', 'Admin session is required.'));
    return;
  }

  const outboxId = String(formData.get('outboxId') || '').trim();
  if (!outboxId) {
    redirect(withAdminActionStatus(returnPath, 'error', 'Outbox item identifier is required.'));
    return;
  }

  try {
    const existing = await prisma.emailOutbox.findUnique({
      where: { id: outboxId },
      select: {
        status: true,
        attempts: true,
        maxAttempts: true,
        provider: true,
        lastError: true,
      },
    });

    const retried = await retryEmailOutboxItem(outboxId, {
      replayedBy: admin.email,
      replayReason: 'admin_single_replay',
    });
    if (!retried.success) {
      redirect(withAdminActionStatus(returnPath, 'error', retried.error));
      return;
    }

    const result = await processEmailOutboxItem(outboxId);

    await logAdminAuditEvent({
      tableName: 'EmailOutbox',
      operation: 'ADMIN_REPLAY_COMMUNICATION',
      changedBy: admin.authId,
      recordId: outboxId,
      changeData: {
        previousState: existing,
        result,
      },
    });

    revalidateAdminPortalPaths(['/communications', '/users']);
    redirect(
      withAdminActionStatus(
        returnPath,
        result?.success ? 'success' : 'error',
        result?.success
          ? 'Communication replay completed successfully.'
          : result?.error || 'Communication replay did not complete successfully.'
      )
    );
  } catch (error) {
    console.error('replayAdminCommunicationOutboxItem error:', error);
    redirect(withAdminActionStatus(returnPath, 'error', 'Failed to replay communication outbox item.'));
  }
}

export async function replayAdminCommunicationOutboxBatch(formData: FormData): Promise<void> {
  const admin = await getAdminSessionProfile();
  const returnPath = getSafeAdminReturnPath(formData.get('returnPath'), '/en/admin/communications');

  if (!admin) {
    redirect(withAdminActionStatus(returnPath, 'error', 'Admin session is required.'));
    return;
  }

  const filters: AdminCommunicationsFilterInput = {
    search: String(formData.get('search') || '').trim() || undefined,
    audience: (String(formData.get('audience') || 'ALL') as AdminCommunicationsFilterInput['audience']) ?? 'ALL',
    status: (String(formData.get('eventStatus') || 'ALL') as AdminCommunicationsFilterInput['status']) ?? 'ALL',
    outboxStatus: (String(formData.get('outboxStatus') || 'ALL') as AdminCommunicationsFilterInput['outboxStatus']) ?? 'ALL',
  };
  const limit = Math.max(1, Math.min(Number(formData.get('limit') || 25), 50));

  try {
    const outboxItems = await prisma.emailOutbox.findMany({
      where: {
        ...getOutboxWhere(filters),
        status: {
          in: [EmailOutboxStatus.FAILED, EmailOutboxStatus.SKIPPED],
        },
      },
      orderBy: [{ updatedAt: 'desc' }],
      take: limit,
      select: {
        id: true,
        status: true,
        attempts: true,
        maxAttempts: true,
        provider: true,
        lastError: true,
      },
    });

    if (outboxItems.length === 0) {
      redirect(withAdminActionStatus(returnPath, 'error', 'No failed or skipped communications matched the current filters.'));
      return;
    }

    const retried = await Promise.all(
      outboxItems.map(async (item) => ({
        id: item.id,
        retry: await retryEmailOutboxItem(item.id, {
          replayedBy: admin.email,
          replayReason: 'admin_batch_replay',
        }),
      }))
    );

    const processableIds = retried.filter((entry) => entry.retry.success).map((entry) => entry.id);
    const processed = processableIds.length > 0 ? await processSpecificEmailOutboxItems(processableIds, 4) : [];
    const succeeded = processed.filter((entry) => entry.result.success).length;
    const failed = outboxItems.length - succeeded;

    await logAdminAuditEvent({
      tableName: 'EmailOutbox',
      operation: 'ADMIN_BULK_REPLAY_COMMUNICATIONS',
      changedBy: admin.authId,
      recordId: 'batch',
      changeData: {
        filters,
        limit,
        replayedIds: outboxItems.map((item) => item.id),
        replayedCount: outboxItems.length,
        processableIds,
        succeeded,
        failed,
      },
    });

    revalidateAdminPortalPaths(['/communications', '/requests', '/users']);
    redirect(
      withAdminActionStatus(
        returnPath,
        succeeded > 0 ? 'success' : 'error',
        `Bulk replay processed ${outboxItems.length} queued communications. ${succeeded} succeeded, ${failed} still need attention.`
      )
    );
  } catch (error) {
    console.error('replayAdminCommunicationOutboxBatch error:', error);
    redirect(withAdminActionStatus(returnPath, 'error', 'Failed to replay the filtered backlog.'));
  }
}
