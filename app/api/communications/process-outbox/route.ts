import { NextRequest, NextResponse } from 'next/server';
import { processPendingEmailOutbox } from '@/lib/communications/outbox';
import { getServerEnv } from '@/lib/env';

function isAuthorized(request: NextRequest) {
  const secret = getServerEnv().COMMUNICATIONS_CRON_SECRET;

  if (!secret) {
    return false;
  }

  const bearer = request.headers.get('authorization');
  if (bearer === `Bearer ${secret}`) {
    return true;
  }

  const headerSecret = request.headers.get('x-communications-secret');
  return headerSecret === secret;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const requestedLimit = typeof body?.limit === 'number' ? body.limit : 25;
  const limit = Math.max(1, Math.min(requestedLimit, 100));

  const results = await processPendingEmailOutbox(limit);

  return NextResponse.json({
    processed: results.length,
    results: results.map((item) => ({
      id: item.id,
      success: item.result.success,
      provider: item.result.provider,
      skipped: item.result.skipped ?? false,
      error: item.result.error ?? null,
      messageId: item.result.messageId ?? null,
    })),
  });
}
