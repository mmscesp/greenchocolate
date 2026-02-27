import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type AuthAuditEvent = {
  operation: string;
  changedBy: string;
  recordId: string;
  changeData: Prisma.InputJsonValue;
};

export async function logAuthAuditEvent(event: AuthAuditEvent): Promise<void> {
  try {
    if (!prisma.auditLog) {
      return;
    }

    await prisma.auditLog.create({
      data: {
        tableName: 'Auth',
        operation: event.operation,
        changedBy: event.changedBy,
        recordId: event.recordId,
        changeData: event.changeData,
        changeHash: `${event.operation}:${event.recordId}:${Date.now()}`,
      },
    });
  } catch (error) {
    console.error('Failed to write auth audit log:', error);
  }
}
