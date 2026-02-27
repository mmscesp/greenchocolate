import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { createClient } from '@/lib/supabase/server';
import { validateMutationOrigin } from '@/lib/security/origin';
import { logAuthAuditEvent } from '@/lib/security/auth-audit';

const authAuditSchema = z.object({
  operation: z.string().min(1),
  status: z.enum(['success', 'failed']),
  metadata: z.record(z.unknown()).optional(),
});

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

    const metadata = (parsed.data.metadata ?? {}) as Prisma.JsonObject;

    await logAuthAuditEvent({
      operation: parsed.data.operation,
      changedBy,
      recordId: changedBy,
      changeData: {
        status: parsed.data.status,
        metadata,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
