'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

import { AtmosphericCanvas } from '@/components/AtmosphericCanvas';
import { isLocale } from '@/lib/i18n-config';
const HOME_PATH_REGEX = /^\/(es|en|fr|de|it|pl|ru|pt)$/;

export default function PlatformBackground() {
  const pathname = usePathname();

  const normalizedPath = useMemo(() => {
    if (!pathname) return '/';
    const trimmed = pathname.replace(/\/+$/, '');
    return trimmed === '' ? '/' : trimmed;
  }, [pathname]);

  if (HOME_PATH_REGEX.test(normalizedPath)) {
    return null;
  }

  // Dashboard route check to conditionally hide background canvas
  const segments = (pathname || '/').split('/');
  const firstSegment = segments[1] ?? '';
  const normalizedPathnameWithoutLocale = isLocale(firstSegment)
    ? `/${segments.slice(2).join('/')}`.replace(/\/+$/, '') || '/'
    : pathname || '/';

  const isDashboardRoute =
    normalizedPathnameWithoutLocale.startsWith('/profile') ||
    normalizedPathnameWithoutLocale.startsWith('/club-panel') ||
    normalizedPathnameWithoutLocale.startsWith('/admin');

  if (isDashboardRoute) {
    return null;
  }

  return <AtmosphericCanvas fixed />;
}
