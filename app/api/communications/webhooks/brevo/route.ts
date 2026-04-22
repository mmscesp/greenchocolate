import { NextRequest, NextResponse } from 'next/server';
import { handleBrevoWebhookEvent, verifyBrevoWebhook } from '@/lib/communications/webhooks';

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  try {
    const signatureValid = verifyBrevoWebhook(request.headers);
    if (!signatureValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await handleBrevoWebhookEvent(payload, signatureValid);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Brevo webhook processing failed:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}
