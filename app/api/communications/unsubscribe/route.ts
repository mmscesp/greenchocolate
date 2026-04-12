import { NextRequest, NextResponse } from 'next/server';
import { unsubscribeMarketingEmail } from '@/lib/communications/subscriptions';
import { parseUnsubscribeToken } from '@/lib/communications/unsubscribe';
import { publicEnv } from '@/lib/env';

function getRedirectUrl(locale: string, status: 'success' | 'invalid') {
  const baseUrl = publicEnv.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'http://localhost:3000';
  return `${baseUrl}/${locale}?email_unsubscribe=${status}`;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.redirect(getRedirectUrl('en', 'invalid'));
  }

  const parsed = parseUnsubscribeToken(token);
  if (!parsed) {
    return NextResponse.redirect(getRedirectUrl('en', 'invalid'));
  }

  await unsubscribeMarketingEmail({
    email: parsed.email,
    provider: 'LOCAL_UNSUBSCRIBE',
    metadata: {
      source: 'unsubscribe_link',
    },
  });

  return NextResponse.redirect(getRedirectUrl(parsed.locale, 'success'));
}
