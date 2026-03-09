import { describe, expect, it, vi } from 'vitest';

const { redirectMock } = vi.hoisted(() => ({
  redirectMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}));

import { getLandingPageByRole, roleRedirect } from './auth-utils';

describe('auth utils', () => {
  it('returns the club dashboard path when the role is CLUB_ADMIN', () => {
    expect(getLandingPageByRole('CLUB_ADMIN', 'es')).toBe('/es/club-panel/dashboard');
  });

  it('returns the admin path when the role is ADMIN', () => {
    expect(getLandingPageByRole('ADMIN', 'fr')).toBe('/fr/admin');
  });

  it('returns the locale root when the role is USER', () => {
    expect(getLandingPageByRole('USER', 'de')).toBe('/de');
  });

  it('returns the locale root when the role is unknown', () => {
    expect(getLandingPageByRole('SOMETHING_ELSE', 'en')).toBe('/en');
  });

  it('uses the configured default locale when none is provided', () => {
    expect(getLandingPageByRole('USER')).toBe('/es');
  });

  it('redirects to the role landing page for roleRedirect', () => {
    roleRedirect('ADMIN', 'es');
    expect(redirectMock).toHaveBeenCalledWith('/es/admin');
  });
});
