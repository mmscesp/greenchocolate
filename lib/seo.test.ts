import { afterEach, describe, expect, it } from 'vitest';
import { buildAvailableLanguageAlternates, buildLanguageAlternates, getBaseUrl, toAbsoluteUrl } from '@/lib/seo';

const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;
const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  if (typeof originalAppUrl === 'undefined') {
    delete process.env.NEXT_PUBLIC_APP_URL;
  } else {
    process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  }

  if (typeof originalNodeEnv === 'undefined') {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = originalNodeEnv;
  }
});

describe('seo base URL helpers', () => {
  it('uses the canonical fallback when NEXT_PUBLIC_APP_URL is missing', () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    process.env.NODE_ENV = 'production';

    expect(getBaseUrl()).toBe('https://www.socialclubsmaps.com');
  });

  it('normalizes a valid HTTPS env URL to origin', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://www.socialclubsmaps.com/some/path/';
    process.env.NODE_ENV = 'production';

    expect(getBaseUrl()).toBe('https://www.socialclubsmaps.com');
  });

  it('falls back to canonical URL for malformed env values', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'not-a-url';
    process.env.NODE_ENV = 'production';

    expect(getBaseUrl()).toBe('https://www.socialclubsmaps.com');
  });

  it('rejects insecure HTTP URL in production', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'http://socialclubsmaps.com';
    process.env.NODE_ENV = 'production';

    expect(getBaseUrl()).toBe('https://www.socialclubsmaps.com');
  });

  it('allows HTTP URL outside production for local development', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000/';
    process.env.NODE_ENV = 'development';

    expect(getBaseUrl()).toBe('http://localhost:3000');
    expect(toAbsoluteUrl('/es/spain/barcelona')).toBe('http://localhost:3000/es/spain/barcelona');
  });

  it('builds absolute hreflang URLs for every supported locale', () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    process.env.NODE_ENV = 'production';

    expect(buildLanguageAlternates('/safety-kit')).toEqual({
      es: 'https://www.socialclubsmaps.com/es/safety-kit',
      en: 'https://www.socialclubsmaps.com/en/safety-kit',
      fr: 'https://www.socialclubsmaps.com/fr/safety-kit',
      de: 'https://www.socialclubsmaps.com/de/safety-kit',
      'x-default': 'https://www.socialclubsmaps.com/es/safety-kit',
    });
  });

  it('builds hreflang alternates only for available locales', () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    process.env.NODE_ENV = 'production';

    expect(buildAvailableLanguageAlternates('/editorial/example', ['en', 'es'])).toEqual({
      es: 'https://www.socialclubsmaps.com/es/editorial/example',
      en: 'https://www.socialclubsmaps.com/en/editorial/example',
      'x-default': 'https://www.socialclubsmaps.com/es/editorial/example',
    });
  });
});
