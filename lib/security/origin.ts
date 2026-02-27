import { headers } from 'next/headers';
import { publicEnv } from '@/lib/env';

function getAllowedOrigins(): Set<string> {
  const configured = [publicEnv.NEXT_PUBLIC_APP_URL].filter((value): value is string => Boolean(value));
  return new Set(configured.map((value) => new URL(value).origin));
}

export async function validateMutationOrigin(): Promise<boolean> {
  const headerStore = await headers();
  const origin = headerStore.get('origin');
  const host = headerStore.get('host');
  const forwardedProto = headerStore.get('x-forwarded-proto');

  if (!origin || !host) {
    return false;
  }

  try {
    const requestOrigin = new URL(origin).origin;
    const allowedOrigins = getAllowedOrigins();

    if (allowedOrigins.has(requestOrigin)) {
      return true;
    }

    const protocol = forwardedProto ?? (host.includes('localhost') ? 'http' : 'https');
    const hostOrigin = `${protocol}://${host}`;
    return requestOrigin === hostOrigin;
  } catch {
    return false;
  }
}
