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
} from '@/app/actions/applications';
import { mapRequestStatus, mapStatusToStage } from '@/lib/application-utils';

describe('Application Actions', () => {
  const mockUser = { id: '550e8400-e29b-41d4-a716-446655440001', email: 'test@example.com' };
  const mockProfile = {
    id: '550e8400-e29b-41d4-a716-446655440002',
    authId: '550e8400-e29b-41d4-a716-446655440001',
    role: 'USER',
    managedClubId: null,
  };
  const mockClubId = '550e8400-e29b-41d4-a716-446655440003';
  const mockRequestId = '550e8400-e29b-41d4-a716-446655440004';

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
      (prisma.notification.create as any).mockResolvedValue({ id: 'notification-1' });

      const result = await submitMembershipApplication({
        targetClubId: mockClubId,
        eligibilityAnswers: { over18: true },
        message: 'Test application',
      });

      expect(result.success).toBe(true);
      expect(result.applicationId).toBe(mockRequestId);
      expect(prisma.membershipRequest.create).toHaveBeenCalled();
      // Stage history is stored in encryptedSnapshot JSON field, not separate table
      const createCall = (prisma.membershipRequest.create as any).mock.calls[0][0];
      expect(createCall.data.encryptedSnapshot).toMatchObject({
        stage: 'INTAKE',
        stageHistory: expect.arrayContaining([
          expect.objectContaining({
            stage: 'INTAKE',
            changedBy: mockUser.id,
          }),
        ]),
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
        { stage: 'INTAKE', changedAt: '2026-01-01T00:00:00.000Z', changedBy: '550e8400-e29b-41d4-a716-446655440001', notes: undefined },
        { stage: 'DOCUMENT_VERIFICATION', changedAt: '2026-01-02T00:00:00.000Z', changedBy: '550e8400-e29b-41d4-a716-446655440005', notes: 'Docs verified' },
      ];

      (prisma.membershipRequest.findFirst as any).mockResolvedValue({
        id: mockRequestId,
        status: 'PENDING',
        createdAt: new Date('2026-01-01'),
        encryptedSnapshot: {
          stage: 'DOCUMENT_VERIFICATION',
          stageHistory: mockHistory,
        },
      });

      const result = await getApplicationStatus('550e8400-e29b-41d4-a716-446655440001');

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
      const adminProfile = { ...mockProfile, role: 'CLUB_ADMIN', managedClubId: mockClubId };
      (prisma.profile.findUnique as any).mockResolvedValue(adminProfile);
      (prisma.membershipRequest.findUnique as any).mockResolvedValue({
        id: mockRequestId,
        clubId: mockClubId,
        userId: '550e8400-e29b-41d4-a716-446655440006',
        status: 'PENDING',
        encryptedSnapshot: {
          stage: 'INTAKE',
          stageHistory: [
            { stage: 'INTAKE', changedAt: '2026-01-01T00:00:00.000Z', changedBy: '550e8400-e29b-41d4-a716-446655440006' },
          ],
        },
      });
      (prisma.membershipRequest.update as any).mockResolvedValue({});
      (prisma.notification.create as any).mockResolvedValue({ id: 'notification-2' });

      const result = await advanceApplicationStage(mockRequestId, 'BACKGROUND_CHECK', 'Moving to background check');

      expect(result.success).toBe(true);
      expect(prisma.membershipRequest.update).toHaveBeenCalled();
      // Stage history is stored in encryptedSnapshot JSON field, not separate table
      const updateCall = (prisma.membershipRequest.update as any).mock.calls[0][0];
      expect(updateCall.data.encryptedSnapshot).toMatchObject({
        stage: 'BACKGROUND_CHECK',
        stageHistory: expect.arrayContaining([
          expect.objectContaining({ stage: 'INTAKE' }),
          expect.objectContaining({ stage: 'BACKGROUND_CHECK', notes: 'Moving to background check' }),
        ]),
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
        userId: '550e8400-e29b-41d4-a716-446655440006',
        status: 'PENDING',
        encryptedSnapshot: {
          stage: 'DOCUMENT_VERIFICATION',
          stageHistory: [
            { stage: 'INTAKE', changedAt: '2026-01-01T00:00:00.000Z', changedBy: '550e8400-e29b-41d4-a716-446655440006' },
            { stage: 'DOCUMENT_VERIFICATION', changedAt: '2026-01-02T00:00:00.000Z', changedBy: '550e8400-e29b-41d4-a716-446655440001' },
          ],
        },
      });
      (prisma.membershipRequest.update as any).mockResolvedValue({});
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
      // Stage history is stored in encryptedSnapshot JSON field, not separate table
      const updateCall = (prisma.membershipRequest.update as any).mock.calls[0][0];
      expect(updateCall.data.encryptedSnapshot).toMatchObject({
        stageHistory: expect.arrayContaining([
          expect.objectContaining({ notes: 'Missing required documents' }),
        ]),
      });
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
