export const CONSENT_STORAGE_KEY = 'scm.cookie_consent.v1';
export const CONSENT_SUBJECT_STORAGE_KEY = 'scm.cookie_consent.subject_id';
export const CONSENT_AUDIT_QUEUE_STORAGE_KEY = 'scm.cookie_consent.audit_queue.v1';
export const CONSENT_EVENT_NAME = 'scm-cookie-consent-updated';
export const CONSENT_PREFERENCES_OPEN_EVENT_NAME = 'scm-cookie-preferences-open';
export const CONSENT_POLICY_VERSION = process.env.NEXT_PUBLIC_SCM_COOKIE_POLICY_VERSION ?? '2026-05-12';
export const ANALYTICS_SESSION_STORAGE_KEY = 'scm.analytics.session_id';
export const EXPERIMENT_STORAGE_PREFIX = 'scm.exp.';
export const SCROLL_STORAGE_PREFIX = 'scm:scroll:';
export const CONCIERGE_RESULT_STORAGE_KEY = 'scm.concierge_tools.result';

export const CONSENT_CATEGORIES = ['necessary', 'functional', 'measurement', 'marketing'] as const;

export type ConsentCategory = (typeof CONSENT_CATEGORIES)[number];

export type ConsentCategoryState = Record<ConsentCategory, boolean>;

export type ConsentSnapshot = {
  version: string;
  updatedAt: string;
  categories: ConsentCategoryState;
};

type ConsentAuditPayload = {
  subjectId: string;
  action: 'accept_all' | 'reject_all' | 'save_preferences' | 'withdraw';
  policyVersion: string;
  categories: ConsentCategoryState;
  locale?: string;
};

const DEFAULT_CATEGORIES: ConsentCategoryState = {
  necessary: true,
  functional: false,
  measurement: false,
  marketing: false,
};

let inMemorySnapshot: ConsentSnapshot | null = null;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function normalizeCategories(categories?: Partial<Record<ConsentCategory, boolean>>): ConsentCategoryState {
  return {
    necessary: true,
    functional: categories?.functional === true,
    measurement: categories?.measurement === true,
    marketing: categories?.marketing === true,
  };
}

function parseSnapshot(raw: string | null): ConsentSnapshot | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<ConsentSnapshot>;
    if (!parsed || typeof parsed !== 'object' || parsed.version !== CONSENT_POLICY_VERSION) {
      return null;
    }

    return {
      version: parsed.version,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
      categories: normalizeCategories(parsed.categories),
    };
  } catch {
    return null;
  }
}

function parseAuditQueue(raw: string | null): ConsentAuditPayload[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item): ConsentAuditPayload | null => {
        if (!item || typeof item !== 'object') return null;
        const categories = normalizeCategories(item.categories);
        const subjectId = typeof item.subjectId === 'string' ? item.subjectId : null;
        const policyVersion = typeof item.policyVersion === 'string' ? item.policyVersion : null;
        const locale = typeof item.locale === 'string' ? item.locale : undefined;
        const action =
          item.action === 'accept_all' ||
          item.action === 'reject_all' ||
          item.action === 'save_preferences' ||
          item.action === 'withdraw'
            ? item.action
            : null;

        if (!subjectId || !policyVersion || !action) return null;
        return { subjectId, action, policyVersion, categories, locale };
      })
      .filter((item): item is ConsentAuditPayload => Boolean(item));
  } catch {
    return [];
  }
}

function dispatchConsentUpdated(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT_NAME));
}

function removeLocalStorageByPrefix(prefix: string): void {
  const keysToRemove: string[] = [];
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (key?.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => window.localStorage.removeItem(key));
}

function removeSessionStorageByPrefix(prefix: string): void {
  const keysToRemove: string[] = [];
  for (let index = 0; index < window.sessionStorage.length; index += 1) {
    const key = window.sessionStorage.key(index);
    if (key?.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => window.sessionStorage.removeItem(key));
}

export function clearOptionalConsentStorage(categories: ConsentCategoryState): void {
  if (!isBrowser()) return;

  if (!categories.functional) {
    window.sessionStorage.removeItem(CONCIERGE_RESULT_STORAGE_KEY);
    removeSessionStorageByPrefix(SCROLL_STORAGE_PREFIX);
  }

  if (!categories.measurement) {
    window.localStorage.removeItem(ANALYTICS_SESSION_STORAGE_KEY);
    removeLocalStorageByPrefix(EXPERIMENT_STORAGE_PREFIX);
    window.dataLayer = [];
  }
}

function getQueuedConsentAudits(): ConsentAuditPayload[] {
  if (!isBrowser()) return [];
  return parseAuditQueue(window.localStorage.getItem(CONSENT_AUDIT_QUEUE_STORAGE_KEY));
}

function saveQueuedConsentAudits(queue: ConsentAuditPayload[]): void {
  if (!isBrowser()) return;

  const boundedQueue = queue.slice(-20);
  if (boundedQueue.length === 0) {
    window.localStorage.removeItem(CONSENT_AUDIT_QUEUE_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(CONSENT_AUDIT_QUEUE_STORAGE_KEY, JSON.stringify(boundedQueue));
}

function enqueueConsentAudit(payload: ConsentAuditPayload): void {
  saveQueuedConsentAudits([...getQueuedConsentAudits(), payload]);
}

async function sendConsentAuditPayload(payload: ConsentAuditPayload): Promise<boolean> {
  try {
    const response = await fetch('/api/consent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch {
    return false;
  }
}

export function getConsentSnapshot(): ConsentSnapshot | null {
  if (inMemorySnapshot?.version === CONSENT_POLICY_VERSION) {
    return inMemorySnapshot;
  }

  if (!isBrowser()) return null;

  const stored = parseSnapshot(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  inMemorySnapshot = stored;
  return stored;
}

export function saveConsentSnapshot(categories: Partial<Record<ConsentCategory, boolean>>): ConsentSnapshot {
  const snapshot: ConsentSnapshot = {
    version: CONSENT_POLICY_VERSION,
    updatedAt: new Date().toISOString(),
    categories: normalizeCategories(categories),
  };

  inMemorySnapshot = snapshot;

  if (isBrowser()) {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(snapshot));
    clearOptionalConsentStorage(snapshot.categories);
    dispatchConsentUpdated();
  }

  return snapshot;
}

export function clearConsentSnapshot(): void {
  inMemorySnapshot = null;

  if (isBrowser()) {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    dispatchConsentUpdated();
  }
}

export function getOrCreateConsentSubjectId(): string | null {
  if (!isBrowser()) return null;

  const existing = window.localStorage.getItem(CONSENT_SUBJECT_STORAGE_KEY);
  if (existing) return existing;

  const randomValue =
    typeof window.crypto?.randomUUID === 'function'
      ? window.crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
  const created = `sub_scm_${randomValue}`;
  window.localStorage.setItem(CONSENT_SUBJECT_STORAGE_KEY, created);
  return created;
}

export function hasConsent(category: ConsentCategory): boolean {
  if (category === 'necessary') return true;
  return getConsentSnapshot()?.categories[category] === true;
}

export function canUseFunctionalStorage(): boolean {
  return hasConsent('functional');
}

export function canUseMeasurement(): boolean {
  return hasConsent('measurement');
}

export function canUseMarketing(): boolean {
  return hasConsent('marketing');
}

export function setConsentSnapshotForTesting(snapshot: ConsentSnapshot | null): void {
  inMemorySnapshot = snapshot;

  if (!isBrowser()) return;

  if (snapshot) {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(snapshot));
  } else {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  }

  dispatchConsentUpdated();
}

export async function flushPendingConsentAudits(): Promise<void> {
  if (!isBrowser()) return;

  const queue = getQueuedConsentAudits();
  if (queue.length === 0) return;

  const remaining: ConsentAuditPayload[] = [];
  for (const payload of queue) {
    const delivered = await sendConsentAuditPayload(payload);
    if (!delivered) {
      remaining.push(payload);
    }
  }

  saveQueuedConsentAudits(remaining);
}

export async function recordConsentAudit(params: {
  snapshot: ConsentSnapshot;
  action: 'accept_all' | 'reject_all' | 'save_preferences' | 'withdraw';
  locale?: string;
}): Promise<void> {
  const subjectId = getOrCreateConsentSubjectId();
  if (!subjectId) return;

  await flushPendingConsentAudits();

  const payload: ConsentAuditPayload = {
    subjectId,
    action: params.action,
    policyVersion: params.snapshot.version,
    categories: params.snapshot.categories,
    locale: params.locale,
  };

  const delivered = await sendConsentAuditPayload(payload);
  if (!delivered) {
    enqueueConsentAudit(payload);
  }
}
