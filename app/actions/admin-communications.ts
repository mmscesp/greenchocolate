'use server';

import { CommunicationAudience, CommunicationStatus, EmailOutboxStatus, type Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';
import { processPendingEmailOutbox, retryEmailOutboxItem, processEmailOutboxItem } from '@/lib/communications/outbox';
import { getServerEnv } from '@/lib/env';
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
};

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
  const filters = {
    search: rawInput.search?.trim() || '',
    audience: rawInput.audience ?? 'ALL',
    status: rawInput.status ?? 'ALL',
  } satisfies AdminCommunicationsFilterInput;

  const communicationWhere = getCommunicationEventWhere(filters);

  const [
    sentLast24Hours,
    failedLast24Hours,
    pendingOutbox,
    failedOutbox,
    staleOutbox,
    unsubscribedCount,
    recentEvents,
    recentOutbox,
    recentSubscriptions,
    recentWebhooks,
    invalidWebhooks7d,
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
        payload: true,
      },
    }),
    prisma.emailOutbox.findMany({
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
        communicationEvent: {
          select: {
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
  ]);

  await logAdminAuditEvent({
    tableName: 'CommunicationEvent',
    operation: 'ADMIN_LIST_COMMUNICATIONS',
    changedBy: admin.authId,
    recordId: 'overview',
    changeData: {
      filters,
      eventsReturned: recentEvents.length,
      outboxReturned: recentOutbox.length,
    },
  });

  const env = getServerEnv();

  return {
    filters,
    summary: {
      sentLast24Hours,
      failedLast24Hours,
      pendingOutbox,
      failedOutbox,
      unsubscribedCount,
      invalidWebhooks7d,
      oldestReadyOutboxAgeMinutes: staleOutbox
        ? Math.max(0, Math.round((now.getTime() - staleOutbox.createdAt.getTime()) / 60000))
        : null,
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
          : `Processed ${results.length} queued communications. ${sent} succeeded, ${failed} need attention.`
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
    const retried = await retryEmailOutboxItem(outboxId);
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
        result,
      },
    });

    revalidateAdminPortalPaths(['/communications', '/users']);
    redirect(
      withAdminActionStatus(
        returnPath,
        result?.success
          ? 'success'
          : 'error',
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
