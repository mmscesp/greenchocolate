import { render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ArticleViewTracker } from '@/components/article/ArticleViewTracker';

const analyticsMocks = vi.hoisted(() => ({
  trackEvent: vi.fn(),
  getAnalyticsSessionId: vi.fn(() => 'sess_test_123'),
}));

vi.mock('@/lib/analytics', () => ({
  trackEvent: analyticsMocks.trackEvent,
  getAnalyticsSessionId: analyticsMocks.getAnalyticsSessionId,
}));

describe('ArticleViewTracker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
      } as Response)
    ));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('tracks an article view and posts it to the backend once mounted', async () => {
    render(<ArticleViewTracker articleSlug="club-etiquette" locale="en" category="Etiquette" />);

    await waitFor(() => {
      expect(analyticsMocks.trackEvent).toHaveBeenCalledWith(
        'editorial_article_view',
        expect.objectContaining({
          article_slug: 'club-etiquette',
          article_locale: 'en',
          article_category: 'Etiquette',
        })
      );
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/articles/view',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            slug: 'club-etiquette',
            locale: 'en',
            sessionId: 'sess_test_123',
          }),
        })
      );
    });
  });
});
