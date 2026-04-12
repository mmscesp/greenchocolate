import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    profile: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    emailSubscription: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';
import {
  canReceiveMarketingEmail,
  subscribeMarketingEmail,
  unsubscribeMarketingEmail,
} from '@/lib/communications/subscriptions';

describe('subscriptions helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.profile.findUnique as any).mockResolvedValue({
      id: 'profile-1',
      preferences: {
        notifications: {
          email: true,
          marketing: false,
        },
      },
    });
    (prisma.emailSubscription.upsert as any).mockResolvedValue({ id: 'sub-1' });
    (prisma.profile.update as any).mockResolvedValue({});
  });

  it('subscribes a marketing email and enables profile marketing preferences when possible', async () => {
    await subscribeMarketingEmail({
      email: 'Member@Example.com',
      locale: 'en',
      source: 'newsletter',
    });

    expect(prisma.emailSubscription.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: 'member@example.com' },
      })
    );
    expect(prisma.profile.update).toHaveBeenCalled();
  });

  it('marks a subscription as unsubscribed and disables profile marketing preferences', async () => {
    await unsubscribeMarketingEmail({
      email: 'member@example.com',
      provider: 'BREVO',
    });

    expect(prisma.emailSubscription.upsert).toHaveBeenCalled();
    expect(prisma.profile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          preferences: expect.objectContaining({
            notifications: expect.objectContaining({
              marketing: false,
            }),
          }),
        }),
      })
    );
  });

  it('blocks marketing sends only for explicitly unsubscribed emails', async () => {
    (prisma.emailSubscription.findUnique as any)
      .mockResolvedValueOnce({ status: 'UNSUBSCRIBED' })
      .mockResolvedValueOnce(null);

    await expect(canReceiveMarketingEmail('member@example.com')).resolves.toBe(false);
    await expect(canReceiveMarketingEmail('fresh@example.com')).resolves.toBe(true);
  });

  it('allows a contact to resubscribe after being unsubscribed', async () => {
    await unsubscribeMarketingEmail({
      email: 'member@example.com',
      provider: 'BREVO',
    });

    await subscribeMarketingEmail({
      email: 'member@example.com',
      locale: 'en',
      source: 'newsletter_reoptin',
    });

    expect(prisma.emailSubscription.upsert).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: { email: 'member@example.com' },
        update: expect.objectContaining({
          status: 'SUBSCRIBED',
          unsubscribedAt: null,
        }),
      })
    );
  });
});
