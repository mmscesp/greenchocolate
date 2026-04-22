import { createHmac, timingSafeEqual } from 'crypto';
import { publicEnv } from '@/lib/env';

function getSecret() {
  const secret = process.env.COMMUNICATIONS_CRON_SECRET || process.env.APP_MASTER_KEY;
  if (!secret) {
    throw new Error('A communications signing secret is required.');
  }

  return secret;
}

function toBase64Url(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function fromBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signValue(value: string) {
  return createHmac('sha256', getSecret()).update(value).digest('base64url');
}

export function createUnsubscribeToken(input: { email: string; locale?: string | null }) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const payload = JSON.stringify({
    email: normalizedEmail,
    locale: input.locale ?? 'en',
  });
  const encodedPayload = toBase64Url(payload);
  const signature = signValue(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function parseUnsubscribeToken(token: string): { email: string; locale: string } | null {
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) {
    return null;
  }

  const expected = signValue(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const parsed = JSON.parse(fromBase64Url(encodedPayload)) as { email?: string; locale?: string };
    if (!parsed.email) {
      return null;
    }

    return {
      email: parsed.email.trim().toLowerCase(),
      locale: parsed.locale || 'en',
    };
  } catch {
    return null;
  }
}

export function buildUnsubscribeUrl(input: { email: string; locale?: string | null }) {
  const appUrl = publicEnv.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'http://localhost:3000';
  const token = createUnsubscribeToken(input);
  return `${appUrl}/api/communications/unsubscribe?token=${encodeURIComponent(token)}`;
}
