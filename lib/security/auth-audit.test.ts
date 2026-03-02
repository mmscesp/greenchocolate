import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createMock, prismaMock } = vi.hoisted(() => {
  const create = vi.fn();
  const prisma: {
    auditLog?: {
      create: typeof create;
    };
  } = {
    auditLog: {
      create,
    },
  };

  return {
    createMock: create,
    prismaMock: prisma,
  };
});

vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}));

import { logAuthAuditEvent } from './auth-audit';

describe('logAuthAuditEvent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('writes an auth audit record when auditLog is available', async () => {
    createMock.mockResolvedValueOnce({ id: 'audit-id' });

    await logAuthAuditEvent({
      operation: 'LOGIN',
      changedBy: 'user-1',
      recordId: 'user-1',
      changeData: { status: 'success' },
    });

    expect(createMock).toHaveBeenCalledOnce();
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tableName: 'Auth',
          operation: 'LOGIN',
          changedBy: 'user-1',
          recordId: 'user-1',
          changeData: { status: 'success' },
        }),
      })
    );
  });

  it('returns without writing when auditLog is unavailable', async () => {
    const originalAuditLog = prismaMock.auditLog;
    prismaMock.auditLog = undefined;

    await logAuthAuditEvent({
      operation: 'LOGIN',
      changedBy: 'user-2',
      recordId: 'user-2',
      changeData: { status: 'failed' },
    });

    expect(createMock).not.toHaveBeenCalled();

    prismaMock.auditLog = originalAuditLog;
  });

  it('logs an error and does not throw when the write fails', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    createMock.mockRejectedValueOnce(new Error('db down'));

    await expect(
      logAuthAuditEvent({
        operation: 'LOGOUT',
        changedBy: 'user-3',
        recordId: 'user-3',
        changeData: { status: 'failed' },
      })
    ).resolves.toBeUndefined();

    expect(errorSpy).toHaveBeenCalledWith('Failed to write auth audit log:', expect.any(Error));
    errorSpy.mockRestore();
  });
});
