import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(),
    profile: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    safetyPass: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    notification: {
      create: vi.fn(),
    },
  },
}));

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { generateSafetyPass, renewSafetyPass, validateSafetyPass } from '@/app/actions/safety-pass';

describe('Safety Pass Actions', () => {
  const mockUser = { id: '550e8400-e29b-41d4-a716-446655440001' };
  const mockProfile = {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'test@example.com',
    tier: 'premium',
    isVerified: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
    });

    vi.mocked(prisma.profile.findUnique).mockResolvedValue(mockProfile);
  });

  it('generates and persists safety pass from transaction source of truth', async () => {
    const issuedAt = new Date('2026-03-04T00:00:00.000Z');
    const expiresAt = new Date('2027-03-04T00:00:00.000Z');

    const tx = {
      safetyPass: {
        findUnique: vi.fn().mockResolvedValue(null),
        upsert: vi.fn().mockResolvedValue({
          id: 'pass-1',
          passNumber: 'SMC-2026-ABCDEF123456',
          tier: 'PREMIUM',
          status: 'ACTIVE',
          issuedAt,
          expiresAt,
        }),
      },
      profile: {
        update: vi.fn().mockResolvedValue({ id: mockProfile.id }),
      },
    };

    vi.mocked(prisma.$transaction).mockImplementation(async (fn) => {
      return fn(tx);
    });

    const result = await generateSafetyPass({
      eligibilityAnswers: { ageConfirmed: true, memberRulesAccepted: true },
    });

    expect(result.success).toBe(true);
    expect(result.pass?.status).toBe('ACTIVE');
    expect(result.pass?.tier).toBe('PREMIUM');
    expect(tx.profile.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: mockProfile.id }, data: { isVerified: true } })
    );
    expect(tx.safetyPass.upsert).toHaveBeenCalled();
    expect(prisma.notification.create).toHaveBeenCalled();
  });

  it('validates active persisted pass by pass number', async () => {
    vi.mocked(prisma.safetyPass.findUnique).mockResolvedValue({
      id: 'pass-1',
      passNumber: 'SMC-2026-ABCDEF123456',
      tier: 'STANDARD',
      status: 'ACTIVE',
      issuedAt: new Date('2026-03-04T00:00:00.000Z'),
      expiresAt: new Date('2027-03-04T00:00:00.000Z'),
    });

    const result = await validateSafetyPass('smc-2026-abcdef123456');

    expect(result.valid).toBe(true);
    expect(result.pass?.passNumber).toBe('SMC-2026-ABCDEF123456');
    expect(result.message).toBe('Safety pass is valid');
  });

  it('marks expired pass as invalid', async () => {
    vi.mocked(prisma.safetyPass.findUnique).mockResolvedValue({
      id: 'pass-1',
      passNumber: 'SMC-2026-OLDPASS000001',
      tier: 'ELITE',
      status: 'ACTIVE',
      issuedAt: new Date('2024-01-01T00:00:00.000Z'),
      expiresAt: new Date('2025-01-01T00:00:00.000Z'),
    });

    const result = await validateSafetyPass('SMC-2026-OLDPASS000001');

    expect(result.valid).toBe(false);
    expect(result.pass?.status).toBe('EXPIRED');
    expect(result.message).toBe('Safety pass expired');
  });

  it('renews persisted pass by updating expiry date', async () => {
    vi.mocked(prisma.safetyPass.findUnique).mockResolvedValue({
      id: 'pass-1',
      passNumber: 'SMC-2026-ABCDEF123456',
      status: 'ACTIVE',
      expiresAt: new Date('2027-03-04T00:00:00.000Z'),
    });

    vi.mocked(prisma.safetyPass.update).mockResolvedValue({
      passNumber: 'SMC-2026-ABCDEF123456',
    });

    const result = await renewSafetyPass();

    expect(result.success).toBe(true);
    expect(result.newExpiryDate).toBeInstanceOf(Date);
    expect(prisma.safetyPass.update).toHaveBeenCalled();
    expect(prisma.notification.create).toHaveBeenCalled();
  });
});
