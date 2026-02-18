import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock prisma and supabase
vi.mock('@/lib/prisma', () => ({
  prisma: {
    membershipRequest: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    applicationStageHistory: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    notification: {
      create: vi.fn(),
    },
    profile: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import {
  submitMembershipApplication,
  getApplicationStatus,
  advanceApplicationStage,
  rejectApplication,
  getClubApplications,
  mapRequestStatus,
  mapStatusToStage,
} from '@/app/actions/applications';

describe('Application Actions', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' };
  const mockProfile = {
    id: 'profile-123',
    authId: 'user-123',
    role: 'USER',
    managedClubId: null,
  };
  const mockClubId = 'club-123';
  const mockRequestId = 'request-123';

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as any).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
    });
  });

  describe('mapRequestStatus', () => {
    it('should map APPROVED to APPROVED', () => {
      expect(mapRequestStatus('APPROVED')).toBe('APPROVED');
    });

    it('should map REJECTED to REJECTED', () => {
      expect(mapRequestStatus('REJECTED')).toBe('REJECTED');
    });

    it('should map SCHEDULED to BACKGROUND_CHECK', () => {
      expect(mapRequestStatus('SCHEDULED')).toBe('BACKGROUND_CHECK');
    });

    it('should map PENDING to UNDER_REVIEW', () => {
      expect(mapRequestStatus('PENDING')).toBe('UNDER_REVIEW');
    });
  });

  describe('mapStatusToStage', () => {
    it('should map BACKGROUND_CHECK to BACKGROUND_CHECK', () => {
      expect(mapStatusToStage('BACKGROUND_CHECK')).toBe('BACKGROUND_CHECK');
    });

    it('should map APPROVED to FINAL_APPROVAL', () => {
      expect(mapStatusToStage('APPROVED')).toBe('FINAL_APPROVAL');
    });

    it('should map UNDER_REVIEW to DOCUMENT_VERIFICATION', () => {
      expect(mapStatusToStage('UNDER_REVIEW')).toBe('DOCUMENT_VERIFICATION');
    });
  });

  describe('submitMembershipApplication', () => {
    it('should return error when user is not authenticated', async () => {
      (createClient as any).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      });

      const result = await submitMembershipApplication({
        targetClubId: mockClubId,
        eligibilityAnswers: {},
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });

    it('should return error when application already exists', async () => {
      (prisma.profile.findUnique as any).mockResolvedValue(mockProfile);
      (prisma.membershipRequest.findUnique as any).mockResolvedValue({ id: 'existing' });

      const result = await submitMembershipApplication({
        targetClubId: mockClubId,
        eligibilityAnswers: {},
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Application already exists for this club');
    });

    it('should create application and stage history when successful', async () => {
      (prisma.profile.findUnique as any).mockResolvedValue(mockProfile);
      (prisma.membershipRequest.findUnique as any).mockResolvedValue(null);
      (prisma.membershipRequest.create as any).mockResolvedValue({
        id: mockRequestId,
        clubId: mockClubId,
        createdAt: new Date(),
      });
      (prisma.applicationStageHistory.create as any).mockResolvedValue({ id: 'history-1' });
      (prisma.notification.create as any).mockResolvedValue({ id: 'notification-1' });

      const result = await submitMembershipApplication({
        targetClubId: mockClubId,
        eligibilityAnswers: { over18: true },
        message: 'Test application',
      });

      expect(result.success).toBe(true);
      expect(result.applicationId).toBe(mockRequestId);
      expect(prisma.membershipRequest.create).toHaveBeenCalled();
      expect(prisma.applicationStageHistory.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          applicationId: mockRequestId,
          fromStage: null,
          toStage: 'INTAKE',
          changedBy: mockUser.id,
          notes: 'Application submitted',
        }),
      });
      expect(prisma.notification.create).toHaveBeenCalled();
    });
  });

  describe('getApplicationStatus', () => {
    it('should return null application when no request exists', async () => {
      (prisma.membershipRequest.findFirst as any).mockResolvedValue(null);

      const result = await getApplicationStatus('user-123');

      expect(result.application).toBeNull();
      expect(result.stageHistory).toEqual([]);
      expect(result.progressPercentage).toBe(0);
    });

    it('should return application with stage history from DB', async () => {
      const mockHistory = [
        { toStage: 'INTAKE', createdAt: new Date('2026-01-01'), changedBy: 'user-123', notes: null },
        { toStage: 'DOCUMENT_VERIFICATION', createdAt: new Date('2026-01-02'), changedBy: 'admin-1', notes: 'Docs verified' },
      ];

      (prisma.membershipRequest.findFirst as any).mockResolvedValue({
        id: mockRequestId,
        status: 'PENDING',
        createdAt: new Date('2026-01-01'),
        stageHistory: mockHistory,
      });

      const result = await getApplicationStatus('user-123');

      expect(result.application).not.toBeNull();
      expect(result.stageHistory).toHaveLength(2);
      expect(result.stageHistory[0].stage).toBe('INTAKE');
      expect(result.stageHistory[1].stage).toBe('DOCUMENT_VERIFICATION');
    });
  });

  describe('advanceApplicationStage', () => {
    it('should return error for unauthorized user', async () => {
      (prisma.profile.findUnique as any).mockResolvedValue({ ...mockProfile, role: 'USER' });

      const result = await advanceApplicationStage(mockRequestId, 'BACKGROUND_CHECK');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });

    it('should advance stage and create history entry', async () => {
      (prisma.profile.findUnique as any).mockResolvedValue({ ...mockProfile, role: 'CLUB_ADMIN', managedClubId: mockClubId });
      (prisma.membershipRequest.findUnique as any).mockResolvedValue({
        id: mockRequestId,
        clubId: mockClubId,
        userId: 'user-456',
      });
      (prisma.applicationStageHistory.findFirst as any).mockResolvedValue({ toStage: 'INTAKE' });
      (prisma.membershipRequest.update as any).mockResolvedValue({});
      (prisma.applicationStageHistory.create as any).mockResolvedValue({ id: 'history-2' });
      (prisma.notification.create as any).mockResolvedValue({ id: 'notification-2' });

      const result = await advanceApplicationStage(mockRequestId, 'BACKGROUND_CHECK', 'Moving to background check');

      expect(result.success).toBe(true);
      expect(prisma.membershipRequest.update).toHaveBeenCalled();
      expect(prisma.applicationStageHistory.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          applicationId: mockRequestId,
          fromStage: 'INTAKE',
          toStage: 'BACKGROUND_CHECK',
          changedBy: mockUser.id,
          notes: 'Moving to background check',
        }),
      });
      expect(prisma.notification.create).toHaveBeenCalled();
    });
  });

  describe('rejectApplication', () => {
    it('should reject application and create history entry', async () => {
      (prisma.profile.findUnique as any).mockResolvedValue({ ...mockProfile, role: 'ADMIN' });
      (prisma.membershipRequest.findUnique as any).mockResolvedValue({
        id: mockRequestId,
        clubId: mockClubId,
        userId: 'user-456',
        status: 'PENDING',
      });
      (prisma.applicationStageHistory.findFirst as any).mockResolvedValue({ toStage: 'DOCUMENT_VERIFICATION' });
      (prisma.membershipRequest.update as any).mockResolvedValue({});
      (prisma.applicationStageHistory.create as any).mockResolvedValue({ id: 'history-3' });
      (prisma.notification.create as any).mockResolvedValue({ id: 'notification-3' });

      const result = await rejectApplication(mockRequestId, 'Missing required documents');

      expect(result.success).toBe(true);
      expect(prisma.membershipRequest.update).toHaveBeenCalledWith({
        where: { id: mockRequestId },
        data: expect.objectContaining({
          status: 'REJECTED',
          rejectionReason: 'Missing required documents',
        }),
      });
      expect(prisma.applicationStageHistory.create).toHaveBeenCalled();
    });
  });

  describe('getClubApplications', () => {
    it('should return empty array for non-admin without managed club', async () => {
      (prisma.profile.findUnique as any).mockResolvedValue(mockProfile);

      const result = await getClubApplications();

      expect(result).toEqual([]);
    });

    it('should return applications with latest stage from history', async () => {
      (prisma.profile.findUnique as any).mockResolvedValue({ ...mockProfile, role: 'CLUB_ADMIN', managedClubId: mockClubId });
      (prisma.membershipRequest.findMany as any).mockResolvedValue([
        {
          id: mockRequestId,
          status: 'PENDING',
          createdAt: new Date(),
          message: 'Test',
          user: { id: 'user-1', displayName: 'Test User', email: 'test@example.com', avatarUrl: null },
          stageHistory: [{ toStage: 'DOCUMENT_VERIFICATION' }],
        },
      ]);

      const result = await getClubApplications();

      expect(result).toHaveLength(1);
      expect(result[0].stage).toBe('DOCUMENT_VERIFICATION');
    });
  });
});
