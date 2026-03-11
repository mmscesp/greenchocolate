import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(),
    club: {
      findUnique: vi.fn(),
    },
    membershipRequest: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    membershipApplicationLead: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    membershipApplicationAttempt: {
      count: vi.fn(),
      create: vi.fn(),
    },
    applicationStageHistory: {
      create: vi.fn(),
    },
    notification: {
      create: vi.fn(),
    },
    profile: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/env', () => ({
  publicEnv: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
    NEXT_PUBLIC_APP_URL: 'https://example.com',
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: undefined,
  },
  getServerEnv: () => ({
    NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
    NEXT_PUBLIC_APP_URL: 'https://example.com',
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: undefined,
    DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/test',
    APP_MASTER_KEY: 'test-master-key',
    ENCRYPTION_SALT: 'test-encryption-salt-1234',
    SUPABASE_SERVICE_ROLE_KEY: undefined,
    ADMIN_BOOTSTRAP_SECRET: undefined,
    BREVO_API_KEY: undefined,
    BREVO_SENDER_EMAIL: undefined,
    BREVO_SENDER_NAME: undefined,
    TURNSTILE_SECRET_KEY: undefined,
    SERVER_ACTION_ALLOWED_ORIGINS: undefined,
    MEMBERSHIP_GUEST_SOFT_LIMIT: 3,
    MEMBERSHIP_GUEST_HARD_LIMIT: 6,
    MEMBERSHIP_AUTH_SOFT_LIMIT: 4,
    MEMBERSHIP_AUTH_HARD_LIMIT: 8,
    MEMBERSHIP_RATE_LIMIT_WINDOW_MINUTES: 60,
    MEMBERSHIP_LEAD_TTL_HOURS: 24,
    NODE_ENV: 'test',
  }),
}));

vi.mock('@/lib/email/membership', () => ({
  sendMembershipSubmissionEmail: vi.fn().mockResolvedValue({ success: true }),
  sendMembershipApprovalEmail: vi.fn().mockResolvedValue({ success: true }),
  sendMembershipRejectionEmail: vi.fn().mockResolvedValue({ success: true }),
  sendMembershipStageUpdateEmail: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('@/lib/security/admin-audit', () => ({
  logAdminAuditEvent: vi.fn().mockResolvedValue(undefined),
}));

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { EncryptionService } from '@/lib/encryption';
import {
  createMembershipApplicationLead,
  finalizeMembershipApplicationLead,
  submitMembershipApplication,
} from '@/app/actions/applications';
import { buildLeadToken } from '@/lib/security/membership-application';

const mockUser = { id: '550e8400-e29b-41d4-a716-446655440001', email: 'ada@example.com' };
const mockProfile = {
  id: '550e8400-e29b-41d4-a716-446655440002',
  authId: '550e8400-e29b-41d4-a716-446655440001',
  email: 'ada@example.com',
  displayName: 'Test User',
  avatarUrl: null,
  role: 'USER',
  managedClubId: null,
};
const mockClubId = '550e8400-e29b-41d4-a716-446655440003';
const mockRequestId = '550e8400-e29b-41d4-a716-446655440004';
const mockLeadId = '550e8400-e29b-41d4-a716-446655440005';
const futureLeadExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

const validSubmission = {
  targetClubId: mockClubId,
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  city: 'Barcelona',
  country: 'Spain',
  countryCode: 'ES',
  experience: 'regular' as const,
  phone: '',
  message: 'Interested in responsible membership.',
  ageConfirmed: true as const,
  termsConfirmed: true as const,
};

describe('Application Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (createClient as any).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
    });

    (prisma.profile.findUnique as any).mockResolvedValue(mockProfile);
    (prisma.profile.update as any).mockResolvedValue(mockProfile);
    (prisma.club.findUnique as any).mockResolvedValue({
      id: mockClubId,
      name: 'Test Club',
      isActive: true,
      isVerified: true,
      allowsPreRegistration: true,
    });
    (prisma.membershipRequest.findUnique as any).mockResolvedValue(null);
    (prisma.membershipRequest.findFirst as any).mockResolvedValue(null);
    (prisma.membershipApplicationAttempt.count as any).mockResolvedValue(0);
    (prisma.membershipApplicationAttempt.create as any).mockResolvedValue({ id: 'attempt-1' });
    (prisma.membershipApplicationLead.findFirst as any).mockResolvedValue(null);
    (prisma.membershipApplicationLead.create as any).mockResolvedValue({
      id: mockLeadId,
      clubId: mockClubId,
      expiresAt: futureLeadExpiry,
    });
    (prisma.membershipApplicationLead.update as any).mockResolvedValue({ id: mockLeadId });
    (prisma.membershipRequest.create as any).mockResolvedValue({
      id: mockRequestId,
      clubId: mockClubId,
      createdAt: new Date('2026-03-08T10:00:00.000Z'),
    });
    (prisma.notification.create as any).mockResolvedValue({ id: 'notification-1' });
    (prisma.applicationStageHistory.create as any).mockResolvedValue({ id: 'history-1' });
    (prisma.auditLog.create as any).mockResolvedValue({ id: 'audit-1' });

    vi.mocked(prisma.$transaction).mockImplementation(async (arg) => {
      if (typeof arg === 'function') {
        return arg({
          membershipRequest: prisma.membershipRequest,
          membershipApplicationLead: prisma.membershipApplicationLead,
          applicationStageHistory: prisma.applicationStageHistory,
          notification: prisma.notification,
        } as never);
      }

      return Promise.resolve(arg as never);
    });
  });

  it('returns unauthorized when authenticated submit has no current profile', async () => {
    (createClient as any).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    });

    const result = await submitMembershipApplication(validSubmission);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Unauthorized');
  });

  it('creates an encrypted membership request for authenticated users', async () => {
    const result = await submitMembershipApplication(validSubmission);

    expect(result.success).toBe(true);
    expect(result.applicationId).toBe(mockRequestId);

    const createCall = (prisma.membershipRequest.create as any).mock.calls[0][0];
    expect(createCall.data.message).toBe(validSubmission.message);
    expect(createCall.data.encryptedPayload).toEqual(expect.any(String));
    expect(createCall.data.snapshotMeta).toMatchObject({
      countryCode: 'ES',
      experience: 'regular',
      riskLevel: 'LOW',
      source: 'direct',
    });
    expect(createCall.data.encryptedSnapshot).toBeUndefined();
  });

  it('creates a guest lead token instead of a live membership request', async () => {
    const result = await createMembershipApplicationLead(validSubmission);

    expect(result.success).toBe(true);
    expect(result.pendingLeadToken).toEqual(expect.any(String));
    expect(prisma.membershipApplicationLead.create).toHaveBeenCalled();
    expect(prisma.membershipRequest.create).not.toHaveBeenCalled();

    const createCall = (prisma.membershipApplicationLead.create as any).mock.calls[0][0];
    expect(createCall.data.countryCode).toBe('ES');
    expect(createCall.data.experience).toBe('regular');
    expect(createCall.data.encryptedPayload).toEqual(expect.any(String));
  });

  it('requires a challenge after the guest soft limit', async () => {
    (prisma.membershipApplicationAttempt.count as any).mockResolvedValue(3);

    const result = await createMembershipApplicationLead(validSubmission);

    expect(result.success).toBe(false);
    expect(result.challengeRequired).toBe(false);
    expect(result.error).toMatch(/verification/i);
    expect(prisma.membershipApplicationLead.create).not.toHaveBeenCalled();
  });

  it('finalizes a guest lead into a live membership request for an authenticated user', async () => {
    const encryptedPayload = EncryptionService.encryptPayload({
      ...validSubmission,
      phone: null,
    });
    const expiresAt = futureLeadExpiry;
    const pendingLeadToken = buildLeadToken({
      leadId: mockLeadId,
      payloadHash: EncryptionService.hash(
        JSON.stringify({
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.com',
          city: 'Barcelona',
          country: 'Spain',
          countryCode: 'ES',
          experience: 'regular',
          phone: null,
          message: 'Interested in responsible membership.',
          ageConfirmed: true,
          termsConfirmed: true,
        })
      ),
      expiresAt: expiresAt.toISOString(),
    });

    (prisma.membershipApplicationLead.findUnique as any).mockResolvedValue({
      id: mockLeadId,
      clubId: mockClubId,
      encryptedPayload,
      payloadHash: EncryptionService.hash(
        JSON.stringify({
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.com',
          city: 'Barcelona',
          country: 'Spain',
          countryCode: 'ES',
          experience: 'regular',
          phone: null,
          message: 'Interested in responsible membership.',
          ageConfirmed: true,
          termsConfirmed: true,
        })
      ),
      emailHash: EncryptionService.hash('ada@example.com'),
      fingerprintHash: EncryptionService.hash('fingerprint'),
      riskLevel: 'LOW',
      challengeStatus: 'NOT_REQUIRED',
      countryCode: 'ES',
      experience: 'regular',
      expiresAt,
      consumedAt: null,
      verifiedAt: null,
      club: {
        id: mockClubId,
        name: 'Test Club',
        isActive: true,
        isVerified: true,
        allowsPreRegistration: true,
      },
    });

    const result = await finalizeMembershipApplicationLead({ pendingLeadToken });

    expect(result.success).toBe(true);
    expect(prisma.membershipRequest.create).toHaveBeenCalled();
    expect(prisma.membershipApplicationLead.update).toHaveBeenCalledWith({
      where: { id: mockLeadId },
      data: expect.objectContaining({
        consumedByProfileId: mockProfile.id,
      }),
    });
  });

  it('rejects finalizing a guest lead for a different authenticated email', async () => {
    const expiresAt = futureLeadExpiry;
    const encryptedPayload = EncryptionService.encryptPayload({
      ...validSubmission,
      phone: null,
    });

    (prisma.profile.findUnique as any).mockResolvedValue({
      ...mockProfile,
      email: 'different@example.com',
    });
    (prisma.profile.update as any).mockResolvedValue({
      ...mockProfile,
      email: 'different@example.com',
    });
    (prisma.membershipApplicationLead.findUnique as any).mockResolvedValue({
      id: mockLeadId,
      clubId: mockClubId,
      encryptedPayload,
      payloadHash: EncryptionService.hash(
        JSON.stringify({
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.com',
          city: 'Barcelona',
          country: 'Spain',
          countryCode: 'ES',
          experience: 'regular',
          phone: null,
          message: 'Interested in responsible membership.',
          ageConfirmed: true,
          termsConfirmed: true,
        })
      ),
      emailHash: EncryptionService.hash('ada@example.com'),
      fingerprintHash: EncryptionService.hash('fingerprint'),
      riskLevel: 'LOW',
      challengeStatus: 'NOT_REQUIRED',
      countryCode: 'ES',
      experience: 'regular',
      expiresAt,
      consumedAt: null,
      verifiedAt: null,
      club: {
        id: mockClubId,
        name: 'Test Club',
        isActive: true,
        isVerified: true,
        allowsPreRegistration: true,
      },
    });

    const pendingLeadToken = buildLeadToken({
      leadId: mockLeadId,
      payloadHash: EncryptionService.hash(
        JSON.stringify({
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.com',
          city: 'Barcelona',
          country: 'Spain',
          countryCode: 'ES',
          experience: 'regular',
          phone: null,
          message: 'Interested in responsible membership.',
          ageConfirmed: true,
          termsConfirmed: true,
        })
      ),
      expiresAt: expiresAt.toISOString(),
    });

    const result = await finalizeMembershipApplicationLead({ pendingLeadToken });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/sign in with the email used/i);
    expect(prisma.membershipRequest.create).not.toHaveBeenCalled();
    expect(prisma.membershipApplicationLead.update).not.toHaveBeenCalled();
  });

  it('rejects expired guest leads during finalization', async () => {
    const expiredAt = new Date('2026-03-08T00:00:00.000Z');
    const pendingLeadToken = buildLeadToken({
      leadId: mockLeadId,
      payloadHash: EncryptionService.hash(
        JSON.stringify({
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.com',
          city: 'Barcelona',
          country: 'Spain',
          countryCode: 'ES',
          experience: 'regular',
          phone: null,
          message: 'Interested in responsible membership.',
          ageConfirmed: true,
          termsConfirmed: true,
        })
      ),
      expiresAt: expiredAt.toISOString(),
    });

    (prisma.membershipApplicationLead.findUnique as any).mockResolvedValue({
      id: mockLeadId,
      clubId: mockClubId,
      encryptedPayload: EncryptionService.encryptPayload({ ...validSubmission, phone: null }),
      payloadHash: EncryptionService.hash(
        JSON.stringify({
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.com',
          city: 'Barcelona',
          country: 'Spain',
          countryCode: 'ES',
          experience: 'regular',
          phone: null,
          message: 'Interested in responsible membership.',
          ageConfirmed: true,
          termsConfirmed: true,
        })
      ),
      emailHash: EncryptionService.hash('ada@example.com'),
      fingerprintHash: EncryptionService.hash('fingerprint'),
      riskLevel: 'LOW',
      challengeStatus: 'NOT_REQUIRED',
      countryCode: 'ES',
      experience: 'regular',
      expiresAt: expiredAt,
      consumedAt: null,
      verifiedAt: null,
      club: {
        id: mockClubId,
        name: 'Test Club',
        isActive: true,
        isVerified: true,
        allowsPreRegistration: true,
      },
    });

    const result = await finalizeMembershipApplicationLead({ pendingLeadToken });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid or expired application token');
    expect(prisma.membershipRequest.create).not.toHaveBeenCalled();
  });

  it('rejects already consumed guest leads during finalization', async () => {
    const expiresAt = futureLeadExpiry;
    const pendingLeadToken = buildLeadToken({
      leadId: mockLeadId,
      payloadHash: EncryptionService.hash(
        JSON.stringify({
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.com',
          city: 'Barcelona',
          country: 'Spain',
          countryCode: 'ES',
          experience: 'regular',
          phone: null,
          message: 'Interested in responsible membership.',
          ageConfirmed: true,
          termsConfirmed: true,
        })
      ),
      expiresAt: expiresAt.toISOString(),
    });

    (prisma.membershipApplicationLead.findUnique as any).mockResolvedValue({
      id: mockLeadId,
      clubId: mockClubId,
      encryptedPayload: EncryptionService.encryptPayload({ ...validSubmission, phone: null }),
      payloadHash: EncryptionService.hash(
        JSON.stringify({
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.com',
          city: 'Barcelona',
          country: 'Spain',
          countryCode: 'ES',
          experience: 'regular',
          phone: null,
          message: 'Interested in responsible membership.',
          ageConfirmed: true,
          termsConfirmed: true,
        })
      ),
      emailHash: EncryptionService.hash('ada@example.com'),
      fingerprintHash: EncryptionService.hash('fingerprint'),
      riskLevel: 'LOW',
      challengeStatus: 'NOT_REQUIRED',
      countryCode: 'ES',
      experience: 'regular',
      expiresAt,
      consumedAt: new Date('2026-03-09T09:00:00.000Z'),
      verifiedAt: new Date('2026-03-09T08:30:00.000Z'),
      club: {
        id: mockClubId,
        name: 'Test Club',
        isActive: true,
        isVerified: true,
        allowsPreRegistration: true,
      },
    });

    const result = await finalizeMembershipApplicationLead({ pendingLeadToken });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid or expired application token');
    expect(prisma.membershipRequest.create).not.toHaveBeenCalled();
  });
});
