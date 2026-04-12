import { beforeEach, describe, expect, it, vi } from 'vitest';

const enqueueAndProcessEmailOutboxMock = vi.fn();

vi.mock('@/lib/communications/outbox', () => ({
  enqueueAndProcessEmailOutbox: (...args: unknown[]) => enqueueAndProcessEmailOutboxMock(...args),
}));

vi.mock('@/lib/env', () => ({
  publicEnv: {
    NEXT_PUBLIC_APP_URL: 'https://example.com',
  },
}));

import { sendMembershipApprovalEmail, sendMembershipRejectionEmail } from '@/lib/email/membership';

describe('membership email helpers', () => {
  beforeEach(() => {
    enqueueAndProcessEmailOutboxMock.mockReset();
    enqueueAndProcessEmailOutboxMock.mockResolvedValue({
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

    expect(enqueueAndProcessEmailOutboxMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Tu solicitud de membresia fue aprobada - Club One',
        idempotencyKey: 'membership-approved:request-1',
        type: 'MEMBERSHIP_APPROVAL_EMAIL',
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

    expect(enqueueAndProcessEmailOutboxMock).toHaveBeenCalledWith(
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

    expect(enqueueAndProcessEmailOutboxMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Tu solicitud de membresia no fue aprobada - Club One',
        idempotencyKey: 'membership-rejected:request-3',
        type: 'MEMBERSHIP_REJECTION_EMAIL',
      })
    );
    expect(result.provider).toBe('RESEND');
    expect(result.fallbackUsed).toBe(false);
  });
});
