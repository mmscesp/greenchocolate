import { describe, expect, it } from 'vitest';

import { buildUnsubscribeUrl, createUnsubscribeToken, parseUnsubscribeToken } from '@/lib/communications/unsubscribe';

describe('unsubscribe helpers', () => {
  it('creates and parses a signed unsubscribe token', () => {
    process.env.APP_MASTER_KEY = 'test-master-key-very-secret';
    const token = createUnsubscribeToken({
      email: 'Member@Example.com',
      locale: 'es',
    });

    expect(parseUnsubscribeToken(token)).toEqual({
      email: 'member@example.com',
      locale: 'es',
    });
  });

  it('builds an unsubscribe URL with a token', () => {
    process.env.APP_MASTER_KEY = 'test-master-key-very-secret';
    process.env.NEXT_PUBLIC_APP_URL = 'https://example.com';

    const url = buildUnsubscribeUrl({
      email: 'member@example.com',
      locale: 'en',
    });

    expect(url).toContain('/api/communications/unsubscribe?token=');
  });
});
