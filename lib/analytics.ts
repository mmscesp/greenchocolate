export type AnalyticsValue = string | number | boolean | null | undefined;
export type AnalyticsPayload = Record<string, AnalyticsValue>;

const SESSION_STORAGE_KEY = 'scm.analytics.session_id';
let analyticsContext: AnalyticsPayload = {};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(event: string, payload: AnalyticsPayload = {}): void {
  if (typeof window === 'undefined') return;

  const sessionId = getOrCreateSessionId();
  const pagePath = window.location.pathname;

  const eventPayload: Record<string, unknown> = {
    event,
    ...analyticsContext,
    session_id: sessionId,
    page_path: pagePath,
    ...payload,
    timestamp: Date.now(),
  };

  if (window.dataLayer) {
    window.dataLayer.push(eventPayload);
  }

  window.dispatchEvent(
    new CustomEvent('scm:analytics', {
      detail: eventPayload,
    })
  );
}

export function setAnalyticsContext(context: AnalyticsPayload): void {
  analyticsContext = {
    ...analyticsContext,
    ...context,
  };
}

export function clearAnalyticsContext(keys?: string[]): void {
  if (!keys || keys.length === 0) {
    analyticsContext = {};
    return;
  }

  for (const key of keys) {
    delete analyticsContext[key];
  }
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server';

  const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) return existing;

  const created = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(SESSION_STORAGE_KEY, created);
  return created;
}
