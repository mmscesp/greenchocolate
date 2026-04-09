import { beforeEach, describe, expect, it, vi } from 'vitest';

const { countMock, prismaMock } = vi.hoisted(() => {
  const count = vi.fn();
  const prisma: {
    auditLog?: {
      count: typeof count;
    };
  } = {
    auditLog: {
      count,
    },
  };

  return {
    countMock: count,
    prismaMock: prisma,
  };
});

vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}));

import { isAuthRateLimited } from './auth-rate-limit';

describe('isAuthRateLimited', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('counts only matching failed attempts when a status filter is provided', async () => {
    countMock.mockResolvedValueOnce(5);

    const result = await isAuthRateLimited({
      operation: 'LOGIN',
      recordId: 'member@example.com',
      maxAttempts: 5,
      windowMinutes: 15,
      status: 'failed',
    });

    expect(result).toBe(true);
    expect(countMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          operation: 'LOGIN',
          recordId: 'member@example.com',
          changeData: {
            path: ['status'],
            equals: 'failed',
          },
        }),
      })
    );
  });

  it('does not add a JSON status filter when no status is provided', async () => {
    countMock.mockResolvedValueOnce(0);

    await isAuthRateLimited({
      operation: 'SIGN_UP',
      recordId: 'member@example.com',
      maxAttempts: 5,
      windowMinutes: 15,
    });

    expect(countMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.not.objectContaining({
          changeData: expect.anything(),
        }),
      })
    );
  });
});
