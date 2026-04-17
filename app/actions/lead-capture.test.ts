import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/communications/outbox', () => ({
  enqueueAndProcessEmailOutbox: vi.fn(),
}));

vi.mock('@/lib/communications/subscriptions', () => ({
  subscribeMarketingEmail: vi.fn(),
}));

vi.mock('@/lib/platform-control', () => ({
  getPlatformControlState: vi.fn(),
}));

import { enqueueAndProcessEmailOutbox } from '@/lib/communications/outbox';
import { subscribeMarketingEmail } from '@/lib/communications/subscriptions';
import { getPlatformControlState } from '@/lib/platform-control';
import {
  deliverEditorialDigestLead,
  deliverSafetyKitLead,
} from '@/app/actions/lead-capture';

describe('lead capture actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getPlatformControlState).mockResolvedValue({
      contactInquiryIntakeEnabled: true,
      marketingLeadCaptureEnabled: true,
      membershipIntakeEnabled: true,
    });
    vi.mocked(subscribeMarketingEmail).mockResolvedValue({
      success: true,
      subscription: null,
      event: null,
    } as never);
    vi.mocked(enqueueAndProcessEmailOutbox).mockResolvedValue({
      success: true,
      provider: 'BREVO',
      messageId: 'brevo-message-1',
    } as never);
  });

  it('falls back to direct delivery when marketing lead capture is paused', async () => {
    vi.mocked(getPlatformControlState).mockResolvedValue({
      contactInquiryIntakeEnabled: true,
      marketingLeadCaptureEnabled: false,
      membershipIntakeEnabled: true,
    });

    const result = await deliverSafetyKitLead({
      email: 'lead@example.com',
      locale: 'en',
      source: 'safety_kit_funnel',
    });

    expect(result).toEqual({
      success: true,
      deliveryMode: 'direct',
      fallbackPath: '/en/editorial/safety-kit-visitors-spain',
      downloadPath: '/material/spain-safety-kit-en.pdf',
      error: 'Lead capture is temporarily paused.',
    });
    expect(subscribeMarketingEmail).not.toHaveBeenCalled();
    expect(enqueueAndProcessEmailOutbox).not.toHaveBeenCalled();
  });

  it('subscribes and queues a marketing email when lead capture is live', async () => {
    const result = await deliverSafetyKitLead({
      email: 'lead@example.com',
      locale: 'en',
      source: 'safety_kit_funnel',
    });

    expect(result).toEqual({
      success: true,
      deliveryMode: 'email',
      fallbackPath: '/en/editorial/safety-kit-visitors-spain',
      downloadPath: '/material/spain-safety-kit-en.pdf',
    });
    expect(subscribeMarketingEmail).toHaveBeenCalledWith({
      email: 'lead@example.com',
      locale: 'en',
      source: 'safety_kit_funnel',
      metadata: {
        fallbackPath: '/en/editorial/safety-kit-visitors-spain',
        type: 'SAFETY_KIT_LEAD_EMAIL',
      },
    });
    expect(enqueueAndProcessEmailOutbox).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SAFETY_KIT_LEAD_EMAIL',
        recipientEmail: 'lead@example.com',
        locale: 'en',
        route: 'MARKETING',
        payload: expect.objectContaining({
          route: 'MARKETING',
          input: expect.objectContaining({
            tags: ['scm-safety-kit-lead-email', 'locale-en', 'source-safety-kit-funnel'],
            headers: {
              'X-Scm-Lead-Type': 'SAFETY_KIT_LEAD_EMAIL',
              'X-Scm-Locale': 'en',
              'X-Scm-Lead-Source': 'safety_kit_funnel',
            },
          }),
        }),
      })
    );
  });

  it('returns direct fallback mode when marketing delivery fails after capture', async () => {
    vi.mocked(enqueueAndProcessEmailOutbox).mockResolvedValue({
      success: false,
      provider: 'BREVO',
      error: 'Brevo provider error',
    } as never);

    const result = await deliverEditorialDigestLead({
      email: 'digest@example.com',
      locale: 'en',
      primaryHref: '/en/editorial',
      primaryLabel: 'Open editorial',
      source: 'landing_climax',
    });

    expect(result).toEqual({
      success: true,
      deliveryMode: 'direct',
      fallbackPath: '/en/editorial',
      error: 'Brevo provider error',
    });
    expect(subscribeMarketingEmail).toHaveBeenCalledWith({
      email: 'digest@example.com',
      locale: 'en',
      source: 'landing_climax',
      metadata: {
        fallbackPath: '/en/editorial',
        type: 'EDITORIAL_DIGEST_EMAIL',
      },
    });
  });
});
