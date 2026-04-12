import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendTransactionalEmailMock = vi.fn();

vi.mock('@/lib/email/service', () => ({
  sendTransactionalEmail: (...args: unknown[]) => sendTransactionalEmailMock(...args),
}));

vi.mock('@/lib/env', () => ({
  publicEnv: {
    NEXT_PUBLIC_APP_URL: 'https://example.com',
  },
}));

import { sendMembershipApprovalEmail, sendMembershipRejectionEmail } from '@/lib/email/membership';

describe('membership email helpers', () => {
  beforeEach(() => {
    sendTransactionalEmailMock.mockReset();
    sendTransactionalEmailMock.mockResolvedValue({
      success: true,
      provider: 'RESEND',
      messageId: 'resend-message',
    });
  });

  it('sends approval emails through the transactional provider with an idempotency key', async () => {
    const result = await sendMembershipApprovalEmail({
      applicantEmail: 'member@example.com',
      applicantName: 'Ada',
      clubName: 'Club One',
      requestId: 'request-1',
      locale: 'es',
      decisionNote: 'Trae tu identificacion',
    });

    expect(sendTransactionalEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Tu solicitud de membresia fue aprobada - Club One',
        idempotencyKey: 'membership-approved:request-1',
        textContent: expect.stringContaining('https://example.com/es/profile/requests'),
      })
    );
    expect(result.provider).toBe('RESEND');
    expect(result.fallbackUsed).toBe(false);
  });

  it('falls back to English copy when locale is unknown', async () => {
    const result = await sendMembershipApprovalEmail({
      applicantEmail: 'member@example.com',
      applicantName: 'Ada',
      clubName: 'Club One',
      requestId: 'request-2',
      locale: 'it',
      decisionNote: 'Bring ID',
    });

    expect(sendTransactionalEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Your membership request was approved - Club One',
      })
    );
    expect(result.locale).toBe('en');
    expect(result.fallbackUsed).toBe(true);
  });

  it('sends rejection emails through the transactional provider', async () => {
    const result = await sendMembershipRejectionEmail({
      applicantEmail: 'member@example.com',
      applicantName: 'Ada',
      clubName: 'Club One',
      requestId: 'request-3',
      locale: 'es',
      decisionNote: 'Falta informacion obligatoria',
    });

    expect(sendTransactionalEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Tu solicitud de membresia no fue aprobada - Club One',
        idempotencyKey: 'membership-rejected:request-3',
        textContent: expect.stringContaining('Falta informacion obligatoria'),
      })
    );
    expect(result.provider).toBe('RESEND');
    expect(result.fallbackUsed).toBe(false);
  });
});
