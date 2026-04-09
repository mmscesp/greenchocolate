import { describe, expect, it } from 'vitest';
import {
  buildLocalizedAuthPath,
  buildLocalizedPath,
  getAuthCallbackPath,
  getResetPasswordPath,
  getSafeRedirectPath,
  resolvePreferredLocale,
} from '@/lib/auth-urls';

describe('auth URL helpers', () => {
  it('builds localized callback paths', () => {
    expect(getAuthCallbackPath('en')).toBe('/en/auth/callback');
    expect(getAuthCallbackPath('de', '/de/profile/requests')).toBe(
      '/de/auth/callback?redirect=%2Fde%2Fprofile%2Frequests'
    );
  });

  it('builds localized reset-password paths', () => {
    expect(getResetPasswordPath('fr')).toBe('/fr/reset-password');
  });

  it('normalizes redirect paths to the active locale', () => {
    expect(getSafeRedirectPath('/club-panel/dashboard', 'es')).toBe('/es/club-panel/dashboard');
    expect(getSafeRedirectPath('/en/profile', 'de')).toBe('/de/profile');
    expect(getSafeRedirectPath('https://example.com', 'en')).toBe('/en');
  });

  it('resolves preferred locale from cookie or browser languages', () => {
    expect(resolvePreferredLocale(['fr', 'en-US'])).toBe('fr');
    expect(resolvePreferredLocale([null, 'it-IT', 'de-DE'])).toBe('de');
  });

  it('localizes root paths', () => {
    expect(buildLocalizedPath('en', '/')).toBe('/en');
  });

  it('builds localized auth paths while preserving safe redirects', () => {
    expect(buildLocalizedAuthPath('es', '/account/login', '/club-panel/dashboard')).toBe(
      '/es/account/login?redirect=%2Fclub-panel%2Fdashboard'
    );
    expect(buildLocalizedAuthPath('es', '/account/login', 'https://evil.test')).toBe('/es/account/login');
  });
});
