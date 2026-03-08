import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/encryption', () => ({
  EncryptionService: {
    encryptPayload: vi.fn(() => 'encrypted-registration-snapshot'),
  },
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(),
    city: {
      findFirst: vi.fn(),
    },
    club: {
      findUnique: vi.fn(),
    },
  },
}));

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { clubSignUp } from '@/app/actions/club-auth';

function buildValidFormData(): FormData {
  const formData = new FormData();
  formData.append('clubName', 'Barcelona Green Club');
  formData.append('email', 'club@example.com');
  formData.append('password', 'StrongPass1!');
  formData.append('address', 'Calle Verde 123');
  formData.append('phone', '+34911111222');
  formData.append('description', 'A verified and compliant local cannabis social club.');
  return formData;
}

describe('clubSignUp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns validation errors for invalid payload', async () => {
    const formData = new FormData();
    formData.append('clubName', 'A');

    const result = await clubSignUp({ success: false }, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Please fix the errors below');
    expect(result.errors).toBeDefined();
  });

  it('returns controlled failure if default city is not configured', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: { user: { id: 'auth-user-1' } },
          error: null,
        }),
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      },
    } as never);

    vi.mocked(prisma.city.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.club.findUnique).mockResolvedValue(null);

    const result = await clubSignUp({ success: false }, buildValidFormData());

    expect(result.success).toBe(false);
    expect(result.message).toBe('Club signup is temporarily unavailable. Please try again later.');
  });

  it('creates club and membership request without empty foreign keys', async () => {
    const tx = {
      profile: {
        findUnique: vi.fn().mockResolvedValue({ id: 'profile-1' }),
        create: vi.fn(),
        update: vi.fn().mockResolvedValue({ id: 'profile-1' }),
      },
      club: {
        create: vi.fn().mockResolvedValue({ id: 'club-1' }),
      },
      clubRegistrationRequest: {
        create: vi.fn().mockResolvedValue({ id: 'request-1' }),
      },
      $executeRaw: vi.fn().mockResolvedValue(1),
    };

    vi.mocked(createClient).mockResolvedValue({
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: { user: { id: 'auth-user-1' } },
          error: null,
        }),
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      },
    } as never);

    vi.mocked(prisma.city.findFirst).mockResolvedValue({ id: 'city-1' });
    vi.mocked(prisma.club.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.$transaction).mockImplementation(async (fn) => {
      return fn(tx as never);
    });

    const result = await clubSignUp({ success: false }, buildValidFormData());

    expect(result.success).toBe(true);
    expect(tx.club.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          cityId: 'city-1',
        }),
      })
    );
    expect(tx.clubRegistrationRequest.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          profileId: 'profile-1',
          clubId: 'club-1',
        }),
      })
    );
  });
});
