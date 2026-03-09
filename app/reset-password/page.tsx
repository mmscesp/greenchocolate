'use client';

import { useEffect } from 'react';
import { Loader2 } from '@/lib/icons';
import { getResetPasswordPath, resolvePreferredLocale } from '@/lib/auth-urls';

function readLocaleCookie(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export default function RootResetPasswordBridgePage() {
  useEffect(() => {
    const locale = resolvePreferredLocale([
      readLocaleCookie(),
      ...navigator.languages,
      navigator.language,
    ]);

    const target = `${getResetPasswordPath(locale)}${window.location.search}${window.location.hash}`;
    window.location.replace(target);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
