import { NextRequest, NextResponse } from 'next/server';
import { consentAuditPayloadSchema } from '@/lib/consent-audit';
import { EncryptionService } from '@/lib/encryption';
import { prisma } from '@/lib/prisma';
import { validateMutationOrigin } from '@/lib/security/origin';

export async function POST(request: NextRequest) {
  const isAllowedOrigin = await validateMutationOrigin();
  if (!isAllowedOrigin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const payload = consentAuditPayloadSchema.parse(await request.json());
    const userAgent = request.headers.get('user-agent');
    const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();

    await prisma.cookieConsentAudit.create({
      data: {
        subjectId: EncryptionService.hash(payload.subjectId),
        action: payload.action,
        policyVersion: payload.policyVersion,
        necessary: payload.categories.necessary,
        functional: payload.categories.functional,
        measurement: payload.categories.measurement,
        marketing: payload.categories.marketing,
        locale: payload.locale,
        countryCode: payload.countryCode,
        userAgentHash: userAgent ? EncryptionService.hash(userAgent) : null,
        ipHash: forwardedFor ? EncryptionService.hash(forwardedFor) : null,
        metadata: {
          source: 'cookie_banner',
          storedAt: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Cookie consent audit error:', error);
    return NextResponse.json({ error: 'Invalid consent payload' }, { status: 400 });
  }
}
