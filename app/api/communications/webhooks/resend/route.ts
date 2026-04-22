import { NextRequest, NextResponse } from 'next/server';
import { handleResendWebhookEvent, verifyResendWebhook } from '@/lib/communications/webhooks';

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  try {
    const payload = await verifyResendWebhook(rawBody, request.headers);
    await handleResendWebhookEvent(payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Resend webhook processing failed:', error);
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 });
  }
}
