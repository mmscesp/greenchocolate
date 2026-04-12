import {
  CommunicationAudience,
  CommunicationStatus,
  EmailOutboxStatus,
  EmailProviderRoute,
  Prisma,
} from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { sendMarketingEmail, sendTransactionalEmail } from '@/lib/email/service';
import type { MarketingEmailInput, MarketingEmailSendResult, TransactionalEmailInput, TransactionalEmailSendResult } from '@/lib/email/service';
import { canReceiveMarketingEmail, markSubscriptionEmailDelivered } from '@/lib/communications/subscriptions';

type EmailOutboxPayload =
  | {
      route: 'TRANSACTIONAL';
      input: TransactionalEmailInput;
    }
  | {
      route: 'MARKETING';
      input: MarketingEmailInput;
    };

type EmailOutboxProcessResult =
  | TransactionalEmailSendResult
  | MarketingEmailSendResult;

type EnqueueEmailOutboxInput = {
  type: string;
  audience: CommunicationAudience;
  route: EmailProviderRoute;
  relatedUserId?: string | null;
  relatedRequestId?: string | null;
  recipientEmail?: string | null;
  locale?: string | null;
  subject?: string | null;
  idempotencyKey?: string | null;
  payload: EmailOutboxPayload;
};

function nextAvailableAt(attempts: number) {
  const delayMinutes = Math.min(30, Math.max(1, attempts * 5));
  return new Date(Date.now() + delayMinutes * 60 * 1000);
}

async function updateCommunicationEventForOutbox(input: {
  communicationEventId?: string | null;
  status: CommunicationStatus;
  provider?: string | null;
  errorMessage?: string | null;
  sentAt?: Date | null;
  payloadPatch?: Record<string, unknown> | null;
}) {
  if (!input.communicationEventId) {
    return;
  }

  const existing = await prisma.communicationEvent.findUnique({
    where: { id: input.communicationEventId },
    select: { payload: true },
  });

  const mergedPayload =
    input.payloadPatch && existing?.payload && typeof existing.payload === 'object' && !Array.isArray(existing.payload)
      ? { ...(existing.payload as Record<string, unknown>), ...input.payloadPatch }
      : input.payloadPatch ?? undefined;

  try {
    await prisma.communicationEvent.update({
      where: { id: input.communicationEventId },
      data: {
        status: input.status,
        provider: input.provider ?? undefined,
        errorMessage: input.errorMessage ?? null,
        processedAt: new Date(),
        sentAt: input.sentAt ?? null,
        ...(mergedPayload ? { payload: mergedPayload as Prisma.InputJsonValue } : {}),
      },
    });
  } catch (error) {
    console.error('Failed to update communication event for outbox item:', error);
  }
}

async function sendOutboxPayload(payload: EmailOutboxPayload): Promise<EmailOutboxProcessResult> {
  if (payload.route === EmailProviderRoute.MARKETING) {
    const primaryRecipient = payload.input.to[0]?.email;
    if (primaryRecipient && !(await canReceiveMarketingEmail(primaryRecipient))) {
      return {
        success: false,
        provider: 'BREVO',
        skipped: true,
        error: 'Recipient is unsubscribed from marketing email.',
      };
    }
  }

  if (payload.route === EmailProviderRoute.TRANSACTIONAL) {
    return sendTransactionalEmail(payload.input);
  }

  return sendMarketingEmail(payload.input);
}

export async function enqueueEmailOutbox(input: EnqueueEmailOutboxInput) {
  const communicationEvent = await prisma.communicationEvent.create({
    data: {
      type: input.type,
      audience: input.audience,
      channel: 'EMAIL',
      status: CommunicationStatus.PENDING,
      relatedUserId: input.relatedUserId ?? null,
      relatedRequestId: input.relatedRequestId ?? null,
      idempotencyKey: input.idempotencyKey ?? null,
      locale: input.locale ?? null,
      subject: input.subject ?? null,
      recipientEmail: input.recipientEmail ?? null,
      payload: {
        route: input.route,
      } as Prisma.InputJsonValue,
      processedAt: new Date(),
    },
    select: { id: true },
  });

  return prisma.emailOutbox.create({
    data: {
      communicationEventId: communicationEvent.id,
      audience: input.audience,
      route: input.route,
      status: EmailOutboxStatus.PENDING,
      relatedUserId: input.relatedUserId ?? null,
      relatedRequestId: input.relatedRequestId ?? null,
      idempotencyKey: input.idempotencyKey ?? null,
      payload: input.payload as unknown as Prisma.InputJsonValue,
    },
  });
}

export async function processEmailOutboxItem(outboxId: string): Promise<EmailOutboxProcessResult | null> {
  const claimed = await prisma.emailOutbox.updateMany({
    where: {
      id: outboxId,
      status: {
        in: [EmailOutboxStatus.PENDING, EmailOutboxStatus.FAILED],
      },
      availableAt: {
        lte: new Date(),
      },
    },
    data: {
      status: EmailOutboxStatus.PROCESSING,
      lockedAt: new Date(),
      attempts: {
        increment: 1,
      },
    },
  });

  if (claimed.count !== 1) {
    return null;
  }

  const item = await prisma.emailOutbox.findUnique({
    where: { id: outboxId },
  });

  if (!item) {
    return null;
  }

  const payload = item.payload as unknown as EmailOutboxPayload;
  const result = await sendOutboxPayload(payload);
  const processedAt = new Date();

  if (result.success) {
    await prisma.emailOutbox.update({
      where: { id: item.id },
      data: {
        status: EmailOutboxStatus.SENT,
        provider: result.provider,
        sentAt: processedAt,
        processedAt,
        lockedAt: null,
        lastError: null,
      },
    });

    await updateCommunicationEventForOutbox({
      communicationEventId: item.communicationEventId,
      status: CommunicationStatus.SENT,
      provider: result.provider,
      sentAt: processedAt,
      payloadPatch: {
        messageId: result.messageId ?? null,
      },
    });

    const recipientEmail =
      payload.route === EmailProviderRoute.TRANSACTIONAL
        ? payload.input.to[0]?.email
        : payload.input.to[0]?.email;

    if (recipientEmail) {
      await markSubscriptionEmailDelivered({
        email: recipientEmail,
        audience: item.route === EmailProviderRoute.MARKETING ? 'marketing' : 'transactional',
      });
    }

    return result;
  }

  const terminalStatus =
    result.skipped || item.attempts >= item.maxAttempts
      ? EmailOutboxStatus.SKIPPED
      : EmailOutboxStatus.FAILED;

  await prisma.emailOutbox.update({
    where: { id: item.id },
    data: {
      status: terminalStatus,
      provider: result.provider,
      processedAt,
      lockedAt: null,
      lastError: result.error ?? 'Unknown email error',
      availableAt: terminalStatus === EmailOutboxStatus.FAILED ? nextAvailableAt(item.attempts) : item.availableAt,
    },
  });

  await updateCommunicationEventForOutbox({
    communicationEventId: item.communicationEventId,
    status: result.skipped ? CommunicationStatus.SKIPPED : CommunicationStatus.FAILED,
    provider: result.provider,
    errorMessage: result.error ?? 'Unknown email error',
  });

  return result;
}

export async function enqueueAndProcessEmailOutbox(input: EnqueueEmailOutboxInput) {
  const item = await enqueueEmailOutbox(input);
  const result = await processEmailOutboxItem(item.id);

  if (result) {
    return result;
  }

  return {
    success: false,
    provider: input.route === EmailProviderRoute.TRANSACTIONAL ? 'RESEND' : 'BREVO',
    error: 'Email outbox item could not be processed.',
  } as EmailOutboxProcessResult;
}

export async function processPendingEmailOutbox(limit = 25) {
  const items = await prisma.emailOutbox.findMany({
    where: {
      status: {
        in: [EmailOutboxStatus.PENDING, EmailOutboxStatus.FAILED],
      },
      availableAt: {
        lte: new Date(),
      },
    },
    orderBy: [{ availableAt: 'asc' }, { createdAt: 'asc' }],
    take: Math.max(1, Math.min(limit, 100)),
    select: { id: true },
  });

  const results = [];

  for (const item of items) {
    const result = await processEmailOutboxItem(item.id);
    if (result) {
      results.push({ id: item.id, result });
    }
  }

  return results;
}
