'use client';

import { useEffect } from 'react';
import { getAnalyticsSessionId, trackEvent } from '@/lib/analytics';
import { canUseMeasurement } from '@/lib/consent';

interface ArticleViewTrackerProps {
  articleSlug: string;
  locale: string;
  category: string;
}

export function ArticleViewTracker({ articleSlug, locale, category }: ArticleViewTrackerProps) {
  useEffect(() => {
    if (!canUseMeasurement()) return;

    const sessionId = getAnalyticsSessionId();
    if (!sessionId) return;

    trackEvent('editorial_article_view', {
      article_slug: articleSlug,
      article_locale: locale,
      article_category: category,
    });

    void fetch('/api/articles/view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug: articleSlug,
        locale,
        sessionId,
      }),
    }).catch(() => {
      // Non-blocking popularity tracking.
    });
  }, [articleSlug, category, locale]);

  return null;
}
