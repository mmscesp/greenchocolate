'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from '@/lib/icons';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * Global Error Boundary
 * Catches errors in the root layout and all child components
 * Phase 2: Safety & Stability
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language, t } = useLanguage();
  useEffect(() => {
    // Log error to monitoring service
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-16 md:pt-20">
      <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-destructive/15 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t('error.title')}
        </h1>

        <p className="text-muted-foreground mb-6">
          {t('error.description')}
        </p>

        {error.digest && (
          <p className="text-xs text-muted-foreground/80 mb-6">
            {t('error.id_prefix')} {error.digest}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <Button onClick={reset} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('error.retry')}
          </Button>

          <Link href={`/${language}`} passHref className="w-full">
            <Button variant="secondary" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              {t('error.back_home')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
