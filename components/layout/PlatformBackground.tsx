'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

import { AtmosphericCanvas } from '@/components/AtmosphericCanvas';

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

  return <AtmosphericCanvas fixed />;
}
