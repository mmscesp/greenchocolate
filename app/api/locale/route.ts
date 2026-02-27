import { NextRequest, NextResponse } from 'next/server';
import { i18n } from '@/lib/i18n-config';
import { validateMutationOrigin } from '@/lib/security/origin';

export async function POST(request: NextRequest) {
  const isAllowedOrigin = await validateMutationOrigin();
  if (!isAllowedOrigin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { locale } = await request.json() as { locale?: string };

    if (!locale || !i18n.locales.includes(locale as typeof i18n.locales[number])) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
