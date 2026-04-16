import { CommunicationStatus, EmailOutboxStatus } from '@prisma/client';
import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma';
import { getServerEnv } from '@/lib/env';
import { unsubscribeMarketingEmail, markSubscriptionEmailDelivered } from '@/lib/communications/subscriptions';

async function recordWebhookEvent(input: {
  provider: string;
  eventType: string;
  externalId?: string | null;
  recipientEmail?: string | null;
  signatureValid: boolean;
  payload: unknown;
  errorMessage?: string | null;
}) {
  return prisma.providerWebhookEvent.create({
    data: {
      provider: input.provider,
      eventType: input.eventType,
      externalId: input.externalId ?? null,
      recipientEmail: input.recipientEmail ?? null,
      signatureValid: input.signatureValid,
      processedAt: new Date(),
      errorMessage: input.errorMessage ?? null,
      payload: input.payload as any,
    },
  });
}

function extractRecipientEmail(data: Record<string, unknown>) {
  const direct = data.to;
  if (typeof direct === 'string') {
    return direct.toLowerCase();
  }
  const email = data.email;
  if (typeof email === 'string') {
    return email.toLowerCase();
  }
  return null;
}

async function updateOutboxByMessageId(messageId: string | null, status: EmailOutboxStatus, errorMessage?: string | null) {
  if (!messageId) {
    return;
  }

  const candidate = await prisma.communicationEvent.findFirst({
    where: {
      payload: {
        path: ['messageId'],
        equals: messageId,
      },
    },
    select: {
      id: true,
      emailOutbox: {
        select: { id: true },
      },
    },
  });

  if (!candidate?.emailOutbox?.id) {
    return;
  }

  await prisma.emailOutbox.update({
    where: { id: candidate.emailOutbox.id },
    data: {
      status,
      processedAt: new Date(),
      ...(status === EmailOutboxStatus.SENT ? { sentAt: new Date() } : {}),
      ...(errorMessage ? { lastError: errorMessage } : {}),
    },
  });

  await prisma.communicationEvent.update({
    where: { id: candidate.id },
    data: {
      status:
        status === EmailOutboxStatus.SENT
          ? CommunicationStatus.SENT
          : status === EmailOutboxStatus.SKIPPED
            ? CommunicationStatus.SKIPPED
            : CommunicationStatus.FAILED,
      processedAt: new Date(),
      ...(status === EmailOutboxStatus.SENT ? { sentAt: new Date() } : {}),
      ...(errorMessage ? { errorMessage } : {}),
    },
  });
}

export async function verifyResendWebhook(rawBody: string, headers: Headers) {
  const secret = getServerEnv().RESEND_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('Resend webhook secret is not configured.');
  }

  const webhook = new Webhook(secret);

  return webhook.verify(rawBody, {
    'svix-id': headers.get('svix-id') || '',
    'svix-timestamp': headers.get('svix-timestamp') || '',
    'svix-signature': headers.get('svix-signature') || '',
  }) as Record<string, unknown>;
}

export async function handleResendWebhookEvent(payload: Record<string, unknown>) {
  const eventType = typeof payload.type === 'string' ? payload.type : 'unknown';
  const data =
    payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)
      ? (payload.data as Record<string, unknown>)
      : {};
  const messageId = typeof data.email_id === 'string' ? data.email_id : typeof data.id === 'string' ? data.id : null;
  const recipientEmail = extractRecipientEmail(data);

  if (eventType === 'email.delivered' && recipientEmail) {
    await markSubscriptionEmailDelivered({ email: recipientEmail, audience: 'transactional' });
  }

  if (eventType === 'email.bounced' || eventType === 'email.complained' || eventType === 'email.suppressed') {
    await updateOutboxByMessageId(messageId, EmailOutboxStatus.FAILED, eventType);
  } else if (eventType === 'email.delivered' || eventType === 'email.sent') {
    await updateOutboxByMessageId(messageId, EmailOutboxStatus.SENT);
  }

  await recordWebhookEvent({
    provider: 'RESEND',
    eventType,
    externalId: messageId,
    recipientEmail,
    signatureValid: true,
    payload,
  });
}

function getBrevoWebhookSecret(headers: Headers) {
  return headers.get('x-communications-secret') || headers.get('authorization')?.replace(/^Bearer\s+/i, '') || null;
}

export function verifyBrevoWebhook(headers: Headers) {
  const expected = getServerEnv().BREVO_WEBHOOK_SECRET;
  if (!expected) {
    throw new Error('Brevo webhook secret is not configured.');
  }

  const provided = getBrevoWebhookSecret(headers);
  return provided === expected;
}

export async function handleBrevoWebhookEvent(payload: Record<string, unknown>, signatureValid: boolean) {
  const eventType = typeof payload.event === 'string' ? payload.event : 'unknown';
  const recipientEmail = typeof payload.email === 'string' ? payload.email.toLowerCase() : null;
  const messageId =
    typeof payload['message-id'] === 'string'
      ? payload['message-id']
      : typeof payload.messageId === 'string'
        ? payload.messageId
        : null;

  if (recipientEmail && ['unsubscribe', 'unsubscribed', 'hard_bounce', 'hardBounce', 'spam'].includes(eventType)) {
    await unsubscribeMarketingEmail({
      email: recipientEmail,
      provider: 'BREVO',
      metadata: payload,
    });
  }

  if (
    recipientEmail &&
    ['delivered', 'request', 'requests', 'opened', 'unique_opened', 'uniqueOpened'].includes(eventType)
  ) {
    await markSubscriptionEmailDelivered({ email: recipientEmail, audience: 'marketing' });
  }

  if (['delivered', 'request', 'requests', 'opened', 'unique_opened', 'uniqueOpened'].includes(eventType)) {
    await updateOutboxByMessageId(messageId, EmailOutboxStatus.SENT);
  }

  if (['hard_bounce', 'hardBounce', 'softBounce', 'blocked', 'error', 'spam'].includes(eventType)) {
    await updateOutboxByMessageId(messageId, EmailOutboxStatus.FAILED, eventType);
  }

  await recordWebhookEvent({
    provider: 'BREVO',
    eventType,
    externalId: messageId,
    recipientEmail,
    signatureValid,
    payload,
  });
}
