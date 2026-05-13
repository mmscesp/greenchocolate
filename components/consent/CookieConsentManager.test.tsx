import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CookieConsentManager from '@/components/consent/CookieConsentManager';
import {
  CONSENT_PREFERENCES_OPEN_EVENT_NAME,
  CONSENT_STORAGE_KEY,
  setConsentSnapshotForTesting,
} from '@/lib/consent';

vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    language: 'en',
    t: (key: string) => {
      const copy: Record<string, string> = {
        'common.close': 'Close',
        'cookie_consent.banner.aria': 'Cookie consent notice',
        'cookie_consent.banner.title': 'Cookie choices',
        'cookie_consent.banner.body': 'Optional cookies only run after consent.',
        'cookie_consent.banner.policy_link': 'Read the cookie policy.',
        'cookie_consent.dialog.title': 'Manage cookie preferences',
        'cookie_consent.dialog.body': 'Choose optional categories.',
        'cookie_consent.actions.accept_all': 'Accept all',
        'cookie_consent.actions.reject_all': 'Reject all',
        'cookie_consent.actions.manage': 'Manage choices',
        'cookie_consent.actions.save': 'Save choices',
        'cookie_consent.categories.required': 'Required',
        'cookie_consent.categories.necessary.title': 'Necessary',
        'cookie_consent.categories.necessary.body': 'Required storage.',
        'cookie_consent.categories.functional.title': 'Functional',
        'cookie_consent.categories.functional.body': 'Functional storage.',
        'cookie_consent.categories.measurement.title': 'Measurement',
        'cookie_consent.categories.measurement.body': 'Analytics storage.',
        'cookie_consent.categories.marketing.title': 'Marketing',
        'cookie_consent.categories.marketing.body': 'Marketing storage.',
      };
      return copy[key] ?? key;
    },
  }),
}));

describe('CookieConsentManager', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setConsentSnapshotForTesting(null);
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true } as Response)));
  });

  it('stores an all-rejected optional consent decision without blocking access', async () => {
    render(<CookieConsentManager />);

    await screen.findByRole('region', { name: 'Cookie consent notice' });
    await userEvent.click(screen.getByRole('button', { name: 'Reject all' }));

    await waitFor(() => {
      expect(screen.queryByRole('region', { name: 'Cookie consent notice' })).not.toBeInTheDocument();
    });

    expect(JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY) ?? '{}')).toEqual(
      expect.objectContaining({
        categories: {
          necessary: true,
          functional: false,
          measurement: false,
          marketing: false,
        },
      })
    );
    expect(fetch).toHaveBeenCalledWith('/api/consent', expect.objectContaining({ method: 'POST' }));
  });

  it('opens preferences and saves granular choices', async () => {
    render(<CookieConsentManager />);

    await userEvent.click(await screen.findByRole('button', { name: 'Manage choices' }));
    await screen.findByRole('dialog', { name: 'Manage cookie preferences' });
    await userEvent.click(screen.getByRole('switch', { name: 'Measurement' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save choices' }));

    await waitFor(() => {
      const snapshot = JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY) ?? '{}');
      expect(snapshot.categories.measurement).toBe(true);
      expect(snapshot.categories.functional).toBe(false);
      expect(snapshot.categories.marketing).toBe(false);
    });
  });

  it('records withdrawal when optional consent is later rejected', async () => {
    const fetchMock = vi.fn(() => Promise.resolve({ ok: true } as Response));
    vi.stubGlobal('fetch', fetchMock);

    render(<CookieConsentManager />);

    await userEvent.click(await screen.findByRole('button', { name: 'Accept all' }));
    act(() => {
      window.dispatchEvent(new CustomEvent(CONSENT_PREFERENCES_OPEN_EVENT_NAME));
    });
    await screen.findByRole('dialog', { name: 'Manage cookie preferences' });
    await userEvent.click(screen.getByRole('button', { name: 'Reject all' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenLastCalledWith(
        '/api/consent',
        expect.objectContaining({
          body: expect.stringContaining('"action":"withdraw"'),
        })
      );
    });
  });

  it('publishes and clears the consent banner offset for bottom-fixed UI', async () => {
    render(<CookieConsentManager />);

    await screen.findByRole('region', { name: 'Cookie consent notice' });
    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue('--site-consent-offset')).toMatch(/px$/);
    });

    await userEvent.click(screen.getByRole('button', { name: 'Reject all' }));

    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue('--site-consent-offset')).toBe('');
    });
  });
});
