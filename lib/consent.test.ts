import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ANALYTICS_SESSION_STORAGE_KEY,
  CONSENT_AUDIT_QUEUE_STORAGE_KEY,
  CONCIERGE_RESULT_STORAGE_KEY,
  CONSENT_CATEGORIES,
  EXPERIMENT_STORAGE_PREFIX,
  SCROLL_STORAGE_PREFIX,
  canUseFunctionalStorage,
  canUseMarketing,
  canUseMeasurement,
  flushPendingConsentAudits,
  getConsentSnapshot,
  recordConsentAudit,
  saveConsentSnapshot,
  setConsentSnapshotForTesting,
} from '@/lib/consent';

describe('consent helpers', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setConsentSnapshotForTesting(null);
  });

  it('treats optional categories as denied before a visitor chooses', () => {
    expect(CONSENT_CATEGORIES).toEqual(['necessary', 'functional', 'measurement', 'marketing']);
    expect(canUseFunctionalStorage()).toBe(false);
    expect(canUseMeasurement()).toBe(false);
    expect(canUseMarketing()).toBe(false);
  });

  it('allows only categories explicitly granted by the saved consent snapshot', () => {
    setConsentSnapshotForTesting({
      version: '2026-05-12',
      updatedAt: '2026-05-12T00:00:00.000Z',
      categories: {
        necessary: true,
        functional: true,
        measurement: false,
        marketing: false,
      },
    });

    expect(canUseFunctionalStorage()).toBe(true);
    expect(canUseMeasurement()).toBe(false);
    expect(canUseMarketing()).toBe(false);
  });

  it('falls back to a persisted local snapshot when no in-memory snapshot exists', () => {
    window.localStorage.setItem(
      'scm.cookie_consent.v1',
      JSON.stringify({
        version: '2026-05-12',
        updatedAt: '2026-05-12T00:00:00.000Z',
        categories: {
          necessary: true,
          functional: false,
          measurement: true,
          marketing: false,
        },
      })
    );

    expect(getConsentSnapshot()?.categories.measurement).toBe(true);
    expect(canUseMeasurement()).toBe(true);
    expect(canUseFunctionalStorage()).toBe(false);
  });

  it('notifies listeners when the consent snapshot changes', () => {
    const listener = vi.fn();

    window.addEventListener('scm-cookie-consent-updated', listener);
    setConsentSnapshotForTesting({
      version: '2026-05-12',
      updatedAt: '2026-05-12T00:00:00.000Z',
      categories: {
        necessary: true,
        functional: true,
        measurement: true,
        marketing: false,
      },
    });
    window.removeEventListener('scm-cookie-consent-updated', listener);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('clears optional functional and measurement storage when those categories are denied', () => {
    window.localStorage.setItem(ANALYTICS_SESSION_STORAGE_KEY, 'sess_existing');
    window.localStorage.setItem(`${EXPERIMENT_STORAGE_PREFIX}landing.arm`, 'benefit');
    window.sessionStorage.setItem(CONCIERGE_RESULT_STORAGE_KEY, '{"status":"ready"}');
    window.sessionStorage.setItem(`${SCROLL_STORAGE_PREFIX}/en`, '300');
    window.dataLayer = [{ event: 'existing_event' }];

    saveConsentSnapshot({
      necessary: true,
      functional: false,
      measurement: false,
      marketing: false,
    });

    expect(window.localStorage.getItem(ANALYTICS_SESSION_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(`${EXPERIMENT_STORAGE_PREFIX}landing.arm`)).toBeNull();
    expect(window.sessionStorage.getItem(CONCIERGE_RESULT_STORAGE_KEY)).toBeNull();
    expect(window.sessionStorage.getItem(`${SCROLL_STORAGE_PREFIX}/en`)).toBeNull();
    expect(window.dataLayer).toEqual([]);
  });

  it('queues failed audit writes and flushes them later', async () => {
    const failedFetch = vi.fn(() => Promise.resolve({ ok: false } as Response));
    vi.stubGlobal('fetch', failedFetch);

    await recordConsentAudit({
      snapshot: saveConsentSnapshot({
        necessary: true,
        functional: false,
        measurement: false,
        marketing: false,
      }),
      action: 'reject_all',
      locale: 'en',
    });

    expect(JSON.parse(window.localStorage.getItem(CONSENT_AUDIT_QUEUE_STORAGE_KEY) ?? '[]')).toHaveLength(1);

    const successfulFetch = vi.fn(() => Promise.resolve({ ok: true } as Response));
    vi.stubGlobal('fetch', successfulFetch);

    await flushPendingConsentAudits();

    expect(window.localStorage.getItem(CONSENT_AUDIT_QUEUE_STORAGE_KEY)).toBeNull();
    expect(successfulFetch).toHaveBeenCalledWith('/api/consent', expect.objectContaining({ method: 'POST' }));
  });
});
