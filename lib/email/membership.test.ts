import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendBrevoEmailMock = vi.fn();

vi.mock('@/lib/email/brevo', () => ({
  sendBrevoEmail: (...args: unknown[]) => sendBrevoEmailMock(...args),
}));

vi.mock('@/lib/env', () => ({
  publicEnv: {
    NEXT_PUBLIC_APP_URL: 'https://example.com',
  },
  getServerEnv: () => ({
    BREVO_TEMPLATE_MEMBERSHIP_APPROVED_EN: 101,
    BREVO_TEMPLATE_MEMBERSHIP_APPROVED_ES: 102,
    BREVO_TEMPLATE_MEMBERSHIP_APPROVED_FR: undefined,
    BREVO_TEMPLATE_MEMBERSHIP_APPROVED_DE: undefined,
    BREVO_TEMPLATE_MEMBERSHIP_REJECTED_EN: 201,
    BREVO_TEMPLATE_MEMBERSHIP_REJECTED_ES: undefined,
    BREVO_TEMPLATE_MEMBERSHIP_REJECTED_FR: undefined,
    BREVO_TEMPLATE_MEMBERSHIP_REJECTED_DE: undefined,
  }),
}));

import { sendMembershipApprovalEmail, sendMembershipRejectionEmail } from '@/lib/email/membership';

describe('membership email helpers', () => {
  beforeEach(() => {
    sendBrevoEmailMock.mockReset();
    sendBrevoEmailMock.mockResolvedValue({ success: true, messageId: 'brevo-message' });
  });

  it('uses the localized Brevo approval template when configured', async () => {
    const result = await sendMembershipApprovalEmail({
      applicantEmail: 'member@example.com',
      applicantName: 'Ada',
      clubName: 'Club One',
      requestId: 'request-1',
      locale: 'es',
      decisionNote: 'Trae tu identificacion',
    });

    expect(sendBrevoEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        templateId: 102,
        params: expect.objectContaining({
          applicantName: 'Ada',
          clubName: 'Club One',
          decisionNote: 'Trae tu identificacion',
          requestsUrl: 'https://example.com/es/profile/requests',
        }),
        tags: ['membership_approved'],
      })
    );
    expect(result.templateId).toBe(102);
    expect(result.fallbackUsed).toBe(false);
  });

  it('falls back to the English approval template when the locale-specific template is missing', async () => {
    const result = await sendMembershipApprovalEmail({
      applicantEmail: 'member@example.com',
      applicantName: 'Ada',
      clubName: 'Club One',
      requestId: 'request-2',
      locale: 'fr',
      decisionNote: 'Apportez une piece d identite',
    });

    expect(sendBrevoEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        templateId: 101,
        params: expect.objectContaining({
          requestsUrl: 'https://example.com/fr/profile/requests',
        }),
        tags: ['membership_approved'],
      })
    );
    expect(result.templateId).toBe(101);
    expect(result.fallbackUsed).toBe(true);
  });

  it('falls back to the English rejection template when the locale-specific template is missing', async () => {
    const result = await sendMembershipRejectionEmail({
      applicantEmail: 'member@example.com',
      applicantName: 'Ada',
      clubName: 'Club One',
      requestId: 'request-3',
      locale: 'es',
      decisionNote: 'Falta informacion obligatoria',
    });

    expect(sendBrevoEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        templateId: 201,
        params: expect.objectContaining({
          decisionNote: 'Falta informacion obligatoria',
          requestsUrl: 'https://example.com/es/profile/requests',
        }),
        tags: ['membership_rejected'],
      })
    );
    expect(result.templateId).toBe(201);
    expect(result.fallbackUsed).toBe(true);
  });
});
