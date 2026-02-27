import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type AdminAuditEvent = {
  tableName: string;
  operation: string;
  changedBy: string;
  recordId: string;
  changeData: Prisma.InputJsonValue;
};

export async function logAdminAuditEvent(event: AdminAuditEvent): Promise<void> {
  try {
    if (!prisma.auditLog) {
      return;
    }

    await prisma.auditLog.create({
      data: {
        tableName: event.tableName,
        operation: event.operation,
        changedBy: event.changedBy,
        recordId: event.recordId,
        changeData: event.changeData,
        changeHash: `${event.tableName}:${event.operation}:${event.recordId}:${Date.now()}`,
      },
    });
  } catch (error) {
    console.error('Failed to write admin audit log:', error);
  }
}
