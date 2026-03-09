import { publicEnv } from '@/lib/env';
import { i18n, isLocale, type Locale } from '@/lib/i18n-config';

function ensureLeadingSlash(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

function extractLocaleSegment(path: string): string | null {
  const firstSegment = ensureLeadingSlash(path).split('/')[1];
  return firstSegment && isLocale(firstSegment) ? firstSegment : null;
}

function appendRedirectParam(path: string, redirect: string | null | undefined): string {
  if (!redirect) {
    return path;
  }

  const normalized = redirect.trim();

  if (!normalized.startsWith('/') || normalized.startsWith('//') || normalized.includes('://')) {
    return path;
  }

  const url = new URL(path, 'https://scm.local');
  url.searchParams.set('redirect', normalized);
  return `${url.pathname}${url.search}`;
}

export function resolveLocale(value: string | null | undefined): Locale {
  return value && isLocale(value) ? value : i18n.defaultLocale;
}

export function resolvePreferredLocale(
  candidates: readonly (string | null | undefined)[]
): Locale {
  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const parts = candidate.split(',');

    for (const part of parts) {
      const normalized = part.trim().toLowerCase();

      if (!normalized) {
        continue;
      }

      if (isLocale(normalized)) {
        return normalized;
      }

      const prefix = normalized.split('-')[0];
      if (isLocale(prefix)) {
        return prefix;
      }
    }
  }

  return i18n.defaultLocale;
}

export function buildLocalizedPath(lang: string | null | undefined, path: string): string {
  const locale = resolveLocale(lang);
  const normalizedPath = ensureLeadingSlash(path);
  const pathLocale = extractLocaleSegment(normalizedPath);

  if (normalizedPath === '/') {
    return `/${locale}`;
  }

  if (pathLocale) {
    const strippedPath = normalizedPath.replace(new RegExp(`^/${pathLocale}`), '') || '/';
    return strippedPath === '/' ? `/${locale}` : `/${locale}${strippedPath}`;
  }

  return `/${locale}${normalizedPath}`;
}

export function getAuthCallbackPath(
  lang: string | null | undefined,
  redirect: string | null | undefined = null
): string {
  return appendRedirectParam(buildLocalizedPath(lang, '/auth/callback'), redirect);
}

export function getResetPasswordPath(lang: string | null | undefined): string {
  return buildLocalizedPath(lang, '/reset-password');
}

export function getLocalizedHomePath(lang: string | null | undefined): string {
  return buildLocalizedPath(lang, '/');
}

export function getSafeRedirectPath(
  rawRedirect: string | null | undefined,
  lang: string | null | undefined,
  fallbackPath?: string
): string {
  const locale = resolveLocale(lang);
  const fallback = fallbackPath ? buildLocalizedPath(locale, fallbackPath) : getLocalizedHomePath(locale);

  if (!rawRedirect) {
    return fallback;
  }

  const normalized = rawRedirect.trim();

  if (!normalized.startsWith('/') || normalized.startsWith('//') || normalized.includes('://')) {
    return fallback;
  }

  return buildLocalizedPath(locale, normalized);
}

export function buildAbsoluteAppUrl(
  path: string,
  origin: string | null | undefined = publicEnv.NEXT_PUBLIC_APP_URL
): string {
  if (!origin) {
    throw new Error('NEXT_PUBLIC_APP_URL is required to build absolute auth URLs.');
  }

  return new URL(path, origin).toString();
}

export function getAuthCallbackUrl(
  lang: string | null | undefined,
  redirect: string | null | undefined = null,
  origin?: string | null
): string {
  return buildAbsoluteAppUrl(getAuthCallbackPath(lang, redirect), origin);
}

export function getResetPasswordUrl(
  lang: string | null | undefined,
  origin?: string | null
): string {
  return buildAbsoluteAppUrl(getResetPasswordPath(lang), origin);
}
