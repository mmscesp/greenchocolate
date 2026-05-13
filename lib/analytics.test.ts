import { beforeEach, describe, expect, it } from 'vitest';
import { getAnalyticsSessionId, trackEvent } from '@/lib/analytics';
import { setConsentSnapshotForTesting } from '@/lib/consent';

describe('analytics consent gating', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.dataLayer = [];
    setConsentSnapshotForTesting(null);
  });

  it('does not create a session id or emit events before measurement consent', () => {
    trackEvent('test_event', { value: 'blocked' });

    expect(window.localStorage.getItem('scm.analytics.session_id')).toBeNull();
    expect(window.dataLayer).toEqual([]);
    expect(getAnalyticsSessionId()).toBeNull();
  });

  it('emits events and persists a session id after measurement consent', () => {
    setConsentSnapshotForTesting({
      version: '2026-05-12',
      updatedAt: '2026-05-12T00:00:00.000Z',
      categories: {
        necessary: true,
        functional: false,
        measurement: true,
        marketing: false,
      },
    });

    trackEvent('test_event', { value: 'allowed' });

    expect(window.localStorage.getItem('scm.analytics.session_id')).toMatch(/^sess_/);
    expect(window.dataLayer).toEqual([
      expect.objectContaining({
        event: 'test_event',
        value: 'allowed',
        session_id: expect.stringMatching(/^sess_/),
      }),
    ]);
    expect(getAnalyticsSessionId()).toMatch(/^sess_/);
  });
});
