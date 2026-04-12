import { beforeEach, describe, expect, it, vi } from 'vitest';

const getServerEnvMock = vi.fn();

vi.mock('@/lib/env', () => ({
  getServerEnv: () => getServerEnvMock(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    providerWebhookEvent: {
      create: vi.fn(),
    },
    communicationEvent: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    emailOutbox: {
      update: vi.fn(),
    },
  },
}));

const unsubscribeMarketingEmailMock = vi.fn();
const markSubscriptionEmailDeliveredMock = vi.fn();

vi.mock('@/lib/communications/subscriptions', () => ({
  unsubscribeMarketingEmail: (...args: unknown[]) => unsubscribeMarketingEmailMock(...args),
  markSubscriptionEmailDelivered: (...args: unknown[]) => markSubscriptionEmailDeliveredMock(...args),
}));

import { prisma } from '@/lib/prisma';
import { handleBrevoWebhookEvent, verifyBrevoWebhook } from '@/lib/communications/webhooks';

describe('communication webhooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getServerEnvMock.mockReturnValue({
      BREVO_WEBHOOK_SECRET: 'brevo-secret',
      RESEND_WEBHOOK_SECRET: 'resend-secret',
    });
    (prisma.providerWebhookEvent.create as any).mockResolvedValue({ id: 'evt-1' });
    (prisma.communicationEvent.findFirst as any).mockResolvedValue(null);
    (prisma.emailOutbox.update as any).mockResolvedValue({});
    (prisma.communicationEvent.update as any).mockResolvedValue({});
  });

  it('verifies brevo webhooks using the shared secret header', () => {
    const headers = new Headers({
      'x-communications-secret': 'brevo-secret',
    });

    expect(verifyBrevoWebhook(headers)).toBe(true);
  });

  it('marks marketing recipients unsubscribed on brevo unsubscribe events', async () => {
    await handleBrevoWebhookEvent(
      {
        event: 'unsubscribe',
        email: 'member@example.com',
        'message-id': 'msg-1',
      },
      true
    );

    expect(unsubscribeMarketingEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'member@example.com',
        provider: 'BREVO',
      })
    );
    expect(prisma.providerWebhookEvent.create).toHaveBeenCalled();
  });
});
