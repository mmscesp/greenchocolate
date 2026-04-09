import 'server-only';

import { prisma } from '@/lib/prisma';

type AuthRateLimitInput = {
  operation: string;
  recordId: string;
  maxAttempts: number;
  windowMinutes: number;
  status?: 'failed' | 'success';
};

function getWindowStart(windowMinutes: number): Date {
  const windowStart = new Date();
  windowStart.setMinutes(windowStart.getMinutes() - windowMinutes);
  return windowStart;
}

export async function isAuthRateLimited(input: AuthRateLimitInput): Promise<boolean> {
  if (!prisma.auditLog) {
    return false;
  }

  const attempts = await prisma.auditLog.count({
    where: {
      tableName: 'Auth',
      operation: input.operation,
      recordId: input.recordId,
      ...(input.status
        ? {
            changeData: {
              path: ['status'],
              equals: input.status,
            },
          }
        : {}),
      createdAt: {
        gte: getWindowStart(input.windowMinutes),
      },
    },
  });

  return attempts >= input.maxAttempts;
}
