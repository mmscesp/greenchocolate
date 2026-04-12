import { beforeEach, describe, expect, it, vi } from 'vitest';

const getServerEnvMock = vi.fn();

vi.mock('@/lib/env', () => ({
  getServerEnv: () => getServerEnvMock(),
}));

import { sendResendEmail } from '@/lib/email/resend';

describe('sendResendEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getServerEnvMock.mockReturnValue({
      RESEND_API_KEY: 're_test_key',
      RESEND_SENDER_EMAIL: 'noreply@example.com',
      RESEND_SENDER_NAME: 'SocialClubsMaps',
      RESEND_REPLY_TO_EMAIL: 'support@example.com',
      RESEND_REPLY_TO_NAME: 'Support',
    });
  });

  it('returns a skipped result when Resend is not configured', async () => {
    getServerEnvMock.mockReturnValue({
      RESEND_API_KEY: undefined,
      RESEND_SENDER_EMAIL: undefined,
      RESEND_SENDER_NAME: undefined,
      RESEND_REPLY_TO_EMAIL: undefined,
      RESEND_REPLY_TO_NAME: undefined,
    });

    const result = await sendResendEmail({
      to: [{ email: 'member@example.com' }],
      subject: 'Hello',
      htmlContent: '<p>Hello</p>',
    });

    expect(result).toEqual({
      success: false,
      provider: 'RESEND',
      skipped: true,
      error: 'Resend is not configured.',
    });
  });

  it('sends through the Resend API with an idempotency key', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ id: 'email_123' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await sendResendEmail({
      to: [{ email: 'member@example.com', name: 'Ada' }],
      subject: 'Hello',
      htmlContent: '<p>Hello</p>',
      textContent: 'Hello',
      idempotencyKey: 'membership-approved:req_123',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer re_test_key',
          'Idempotency-Key': 'membership-approved:req_123',
        }),
      })
    );
    expect(result).toEqual({
      success: true,
      provider: 'RESEND',
      messageId: 'email_123',
    });
  });
});
