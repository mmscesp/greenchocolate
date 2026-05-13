export const LIVE_CITY_SLUG = 'barcelona';
export const CANONICAL_DIRECTORY_PATH = '/spain/barcelona/clubs';

export interface SeoIndexPolicy {
  index: boolean;
  follow: boolean;
}

const INDEX_FOLLOW: SeoIndexPolicy = { index: true, follow: true };
const NOINDEX_FOLLOW: SeoIndexPolicy = { index: false, follow: true };
const NOINDEX_NOFOLLOW: SeoIndexPolicy = { index: false, follow: false };

const privateRoutePrefixes = [
  '/account',
  '/auth',
  '/forgot-password',
  '/resend-confirmation',
  '/reset-password',
  '/profile',
  '/admin',
  '/club-panel',
  '/dashboard',
];

const noindexFollowPrefixes = ['/events', '/learn', '/safety'];

export function normalizeSeoPath(path: string): string {
  if (!path || path === '/') {
    return '/';
  }

  const withoutLocale = path.replace(/^\/(es|en|fr|de)(?=\/|$)/, '') || '/';
  return withoutLocale.endsWith('/') && withoutLocale !== '/' ? withoutLocale.slice(0, -1) : withoutLocale;
}

export function isCanonicalDirectoryPath(path: string): boolean {
  return normalizeSeoPath(path) === CANONICAL_DIRECTORY_PATH;
}

export function getCityIndexPolicy(citySlug: string): SeoIndexPolicy {
  return citySlug.toLowerCase() === LIVE_CITY_SLUG ? INDEX_FOLLOW : NOINDEX_FOLLOW;
}

export function getRouteIndexPolicy(path: string): SeoIndexPolicy {
  const normalized = normalizeSeoPath(path);

  if (privateRoutePrefixes.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`))) {
    return NOINDEX_NOFOLLOW;
  }

  if (noindexFollowPrefixes.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`))) {
    return NOINDEX_FOLLOW;
  }

  const cityMatch = normalized.match(/^\/spain\/([^/]+)(?:\/|$)/);
  if (cityMatch) {
    return getCityIndexPolicy(cityMatch[1]);
  }

  return INDEX_FOLLOW;
}

export function shouldIncludeInSitemap(path: string): boolean {
  const normalized = normalizeSeoPath(path);
  const policy = getRouteIndexPolicy(normalized);

  if (!policy.index) {
    return false;
  }

  if (normalized === '/clubs') {
    return false;
  }

  return true;
}
