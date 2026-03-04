import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { createClient } from '@/lib/supabase/server';
import { validateMutationOrigin } from '@/lib/security/origin';
import { logAuthAuditEvent } from '@/lib/security/auth-audit';

const allowedOperations = [
  'LOGIN',
  'SIGN_UP',
  'SIGN_OUT',
  'OAUTH_START',
  'ADMIN_LOGIN',
  'ADMIN_SIGN_OUT',
] as const;

const primitiveMetadataSchema = z.union([
  z.string().max(500),
  z.number().finite(),
  z.boolean(),
  z.null(),
]);

const authAuditSchema = z.object({
  operation: z.enum(allowedOperations),
  status: z.enum(['success', 'failed']),
  metadata: z
    .record(primitiveMetadataSchema)
    .refine((value) => Object.keys(value).length <= 20, 'Metadata has too many keys')
    .optional(),
});

function hasSensitiveMetadataKeys(metadata: Record<string, unknown>): boolean {
  const sensitivePatterns = ['password', 'token', 'secret', 'authorization', 'cookie', 'apiKey'];
  return Object.keys(metadata).some((key) => {
    const lower = key.toLowerCase();
    return sensitivePatterns.some((pattern) => lower.includes(pattern.toLowerCase()));
  });
}

export async function POST(request: NextRequest) {
  const isAllowedOrigin = await validateMutationOrigin();
  if (!isAllowedOrigin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const payload = await request.json();
    const parsed = authAuditSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const changedBy = user?.id ?? 'anonymous';

    const metadata = parsed.data.metadata ?? {};

    if (hasSensitiveMetadataKeys(metadata)) {
      return NextResponse.json({ error: 'Sensitive metadata keys are not allowed' }, { status: 400 });
    }

    await logAuthAuditEvent({
      operation: parsed.data.operation,
      changedBy,
      recordId: changedBy,
      changeData: {
        status: parsed.data.status,
        metadata: metadata as Prisma.JsonObject,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
