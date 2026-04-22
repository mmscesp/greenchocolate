import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    profile: {
      count: vi.fn(),
    },
    auditLog: {
      count: vi.fn(),
    },
    club: {
      count: vi.fn(),
    },
    membershipRequest: {
      count: vi.fn(),
    },
    booking: {
      count: vi.fn(),
    },
    safetyPass: {
      count: vi.fn(),
    },
    contactInquiry: {
      count: vi.fn(),
    },
    emailSubscription: {
      count: vi.fn(),
    },
    platformSetting: {
      upsert: vi.fn(),
    },
  },
}));

vi.mock('@/lib/security/membership-application', () => ({
  getMembershipSecurityConfig: vi.fn(),
}));

vi.mock('@/lib/security/admin-audit', () => ({
  logAdminAuditEvent: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/security/admin-guard', () => ({
  getAdminSessionProfile: vi.fn(),
}));

vi.mock('@/lib/platform-control', () => ({
  getPlatformControlState: vi.fn(),
  platformControlKeys: [
    'CONTACT_INQUIRY_INTAKE_ENABLED',
    'MARKETING_LEAD_CAPTURE_ENABLED',
    'MEMBERSHIP_INTAKE_ENABLED',
  ],
}));

vi.mock('@/lib/env', () => ({
  getServerEnv: vi.fn(() => ({
    RESEND_API_KEY: 'resend-key',
    RESEND_SENDER_EMAIL: 'ops@example.com',
    RESEND_WEBHOOK_SECRET: 'resend-webhook',
    BREVO_API_KEY: 'brevo-key',
    BREVO_SENDER_EMAIL: 'growth@example.com',
    BREVO_WEBHOOK_SECRET: 'brevo-webhook',
    COMMUNICATIONS_CRON_SECRET: 'cron-secret',
    TURNSTILE_SECRET_KEY: 'turnstile-secret',
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'turnstile-site-key',
    ADMIN_BOOTSTRAP_SECRET: 'bootstrap-secret',
  })),
}));

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getMembershipSecurityConfig } from '@/lib/security/membership-application';
import { logAdminAuditEvent } from '@/lib/security/admin-audit';
import { getAdminSessionProfile } from '@/lib/security/admin-guard';
import { getPlatformControlState } from '@/lib/platform-control';
import {
  getAdminSettingsOverview,
  updatePlatformControlSettingAction,
} from '@/app/actions/admin-settings';

const mockAdmin = {
  id: '550e8400-e29b-41d4-a716-446655440130',
  authId: '550e8400-e29b-41d4-a716-446655440131',
  email: 'founder@example.com',
  displayName: 'Founder',
  avatarUrl: null,
  role: 'ADMIN' as const,
};

describe('admin settings actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getAdminSessionProfile).mockResolvedValue(mockAdmin);
    vi.mocked(getMembershipSecurityConfig).mockReturnValue({
      guestSoftLimit: 3,
      guestHardLimit: 6,
      authSoftLimit: 4,
      authHardLimit: 8,
      windowMinutes: 60,
      leadTtlHours: 24,
    } as never);
    vi.mocked(getPlatformControlState).mockResolvedValue({
      contactInquiryIntakeEnabled: true,
      marketingLeadCaptureEnabled: false,
      membershipIntakeEnabled: true,
    });

    vi.mocked(prisma.profile.count).mockResolvedValue(2);
    vi.mocked(prisma.auditLog.count).mockResolvedValue(410);
    vi.mocked(prisma.club.count).mockResolvedValue(5);
    vi.mocked(prisma.membershipRequest.count).mockResolvedValue(7);
    vi.mocked(prisma.booking.count).mockResolvedValue(3);
    vi.mocked(prisma.safetyPass.count).mockResolvedValue(4);
    vi.mocked(prisma.contactInquiry.count).mockResolvedValue(9);
    vi.mocked(prisma.emailSubscription.count).mockResolvedValue(14);
    vi.mocked(prisma.platformSetting.upsert).mockResolvedValue({
      key: 'CONTACT_INQUIRY_INTAKE_ENABLED',
    } as never);
  });

  it('returns the settings overview with live control, readiness, and summary data', async () => {
    const overview = await getAdminSettingsOverview();

    expect(overview).not.toBeNull();
    expect(overview?.summary).toEqual({
      adminCount: 2,
      auditEvents: 410,
      pendingVerifications: 5,
      pendingRequests: 7,
      pendingBookings: 3,
      expiringSafetyPasses: 4,
      openContactInquiries: 9,
      newLeads7d: 14,
    });
    expect(overview?.controls).toEqual([
      expect.objectContaining({
        key: 'CONTACT_INQUIRY_INTAKE_ENABLED',
        enabled: true,
      }),
      expect.objectContaining({
        key: 'MARKETING_LEAD_CAPTURE_ENABLED',
        enabled: false,
      }),
      expect.objectContaining({
        key: 'MEMBERSHIP_INTAKE_ENABLED',
        enabled: true,
      }),
    ]);
    expect(overview?.readiness).toEqual({
      resendApi: true,
      resendWebhook: true,
      brevoApi: true,
      brevoWebhook: true,
      cronSecret: true,
      turnstile: true,
      bootstrapSecret: true,
    });
    expect(logAdminAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: 'ADMIN_VIEW_SETTINGS',
        recordId: 'overview',
      })
    );
  });

  it('persists control-plane changes and redirects with a success status', async () => {
    const formData = new FormData();
    formData.append('returnPath', '/en/admin/settings');
    formData.append('key', 'CONTACT_INQUIRY_INTAKE_ENABLED');
    formData.append('enabled', 'false');

    await updatePlatformControlSettingAction(formData);

    expect(prisma.platformSetting.upsert).toHaveBeenCalledWith({
      where: { key: 'CONTACT_INQUIRY_INTAKE_ENABLED' },
      update: {
        value: { enabled: false },
        updatedBy: mockAdmin.authId,
      },
      create: {
        key: 'CONTACT_INQUIRY_INTAKE_ENABLED',
        value: { enabled: false },
        updatedBy: mockAdmin.authId,
      },
    });
    expect(logAdminAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: 'ADMIN_UPDATE_PLATFORM_CONTROL',
        recordId: 'CONTACT_INQUIRY_INTAKE_ENABLED',
      })
    );
    expect(redirect).toHaveBeenCalledWith(
      '/en/admin/settings?status=success&message=Contact+inquiry+intake+disabled.'
    );
  });
});
