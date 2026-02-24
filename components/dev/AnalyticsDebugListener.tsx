'use client';

import { useEffect } from 'react';

interface AnalyticsEventDetail {
  event?: string;
  timestamp?: number;
  [key: string]: unknown;
}

export default function AnalyticsDebugListener() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<AnalyticsEventDetail>;
      const detail = customEvent.detail;
      if (!detail?.event) return;
      console.debug('[analytics]', detail.event, detail);
    };

    window.addEventListener('scm:analytics', handler);

    return () => {
      window.removeEventListener('scm:analytics', handler);
    };
  }, []);

  return null;
}
