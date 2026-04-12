import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CommunicationAudience, CommunicationStatus, EmailOutboxStatus, EmailProviderRoute } from '@prisma/client';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    communicationEvent: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    emailOutbox: {
      create: vi.fn(),
      updateMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

const sendTransactionalEmailMock = vi.fn();
const sendMarketingEmailMock = vi.fn();
const canReceiveMarketingEmailMock = vi.fn();
const markSubscriptionEmailDeliveredMock = vi.fn();

vi.mock('@/lib/email/service', () => ({
  sendTransactionalEmail: (...args: unknown[]) => sendTransactionalEmailMock(...args),
  sendMarketingEmail: (...args: unknown[]) => sendMarketingEmailMock(...args),
}));

vi.mock('@/lib/communications/subscriptions', () => ({
  canReceiveMarketingEmail: (...args: unknown[]) => canReceiveMarketingEmailMock(...args),
  markSubscriptionEmailDelivered: (...args: unknown[]) => markSubscriptionEmailDeliveredMock(...args),
}));

import { prisma } from '@/lib/prisma';
import { enqueueAndProcessEmailOutbox, processEmailOutboxItem } from '@/lib/communications/outbox';

describe('email outbox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.communicationEvent.create as any).mockResolvedValue({ id: 'comm-1' });
    (prisma.communicationEvent.findUnique as any).mockResolvedValue({ payload: { route: 'TRANSACTIONAL' } });
    (prisma.emailOutbox.create as any).mockResolvedValue({ id: 'outbox-1' });
    (prisma.emailOutbox.updateMany as any).mockResolvedValue({ count: 1 });
    (prisma.emailOutbox.findUnique as any).mockResolvedValue({
      id: 'outbox-1',
      communicationEventId: 'comm-1',
      route: EmailProviderRoute.TRANSACTIONAL,
      status: EmailOutboxStatus.PROCESSING,
      attempts: 1,
      maxAttempts: 3,
      availableAt: new Date('2026-04-12T12:00:00.000Z'),
      payload: {
        route: EmailProviderRoute.TRANSACTIONAL,
        input: {
          to: [{ email: 'member@example.com' }],
          subject: 'Hello',
          htmlContent: '<p>Hello</p>',
          idempotencyKey: 'key-1',
        },
      },
    });
    sendTransactionalEmailMock.mockResolvedValue({
      success: true,
      provider: 'RESEND',
      messageId: 'email-1',
    });
    canReceiveMarketingEmailMock.mockResolvedValue(true);
    markSubscriptionEmailDeliveredMock.mockResolvedValue(undefined);
  });

  it('enqueues and processes a transactional outbox item', async () => {
    const result = await enqueueAndProcessEmailOutbox({
      type: 'MEMBERSHIP_APPROVAL_EMAIL',
      audience: CommunicationAudience.TRANSACTIONAL,
      route: EmailProviderRoute.TRANSACTIONAL,
      recipientEmail: 'member@example.com',
      subject: 'Hello',
      idempotencyKey: 'key-1',
      payload: {
        route: EmailProviderRoute.TRANSACTIONAL,
        input: {
          to: [{ email: 'member@example.com' }],
          subject: 'Hello',
          htmlContent: '<p>Hello</p>',
          idempotencyKey: 'key-1',
        },
      },
    });

    expect(prisma.communicationEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: 'MEMBERSHIP_APPROVAL_EMAIL',
          status: CommunicationStatus.PENDING,
        }),
      })
    );
    expect(sendTransactionalEmailMock).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      provider: 'RESEND',
      messageId: 'email-1',
    });
  });

  it('marks a skipped item when the provider returns skipped', async () => {
    sendTransactionalEmailMock.mockResolvedValueOnce({
      success: false,
      provider: 'RESEND',
      skipped: true,
      error: 'Resend is not configured.',
    });

    const result = await processEmailOutboxItem('outbox-1');

    expect(prisma.emailOutbox.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: EmailOutboxStatus.SKIPPED,
        }),
      })
    );
    expect(result).toEqual({
      success: false,
      provider: 'RESEND',
      skipped: true,
      error: 'Resend is not configured.',
    });
  });
});
