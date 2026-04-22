import { CommunicationAudience, CommunicationChannel, CommunicationStatus, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export type RecordCommunicationEventInput = {
  type: string;
  audience: CommunicationAudience;
  channel?: CommunicationChannel;
  status: CommunicationStatus;
  provider?: string | null;
  relatedUserId?: string | null;
  relatedRequestId?: string | null;
  idempotencyKey?: string | null;
  locale?: string | null;
  subject?: string | null;
  recipientEmail?: string | null;
  payload?: Record<string, unknown> | null;
  errorMessage?: string | null;
  sentAt?: Date | null;
  processedAt?: Date | null;
};

export async function recordCommunicationEvent(input: RecordCommunicationEventInput): Promise<void> {
  try {
    await prisma.communicationEvent.create({
      data: {
        type: input.type,
        audience: input.audience,
        channel: input.channel ?? CommunicationChannel.EMAIL,
        status: input.status,
        provider: input.provider ?? null,
        relatedUserId: input.relatedUserId ?? null,
        relatedRequestId: input.relatedRequestId ?? null,
        idempotencyKey: input.idempotencyKey ?? null,
        locale: input.locale ?? null,
        subject: input.subject ?? null,
        recipientEmail: input.recipientEmail ?? null,
        payload: (input.payload ?? null) as Prisma.InputJsonValue,
        errorMessage: input.errorMessage ?? null,
        sentAt: input.sentAt ?? null,
        processedAt: input.processedAt ?? new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to record communication event:', error);
  }
}
