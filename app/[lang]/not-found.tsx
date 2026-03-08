'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Home, ArrowLeft } from '@/lib/icons';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * Global 404 Not Found Page
 * Displayed when a route doesn't exist
 * Phase 2: Safety & Stability
 */
export default function NotFound() {
  const router = useRouter();
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-16 md:pt-20">
      <div className="max-w-lg w-full bg-card border border-border rounded-xl shadow-lg p-8 text-center">
        <div className="w-24 h-24 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="h-12 w-12 text-primary" />
        </div>

        <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>

        <h2 className="text-2xl font-semibold text-foreground mb-4">
          {t('not_found.title')}
        </h2>

        <p className="text-muted-foreground mb-8">
          {t('not_found.description')}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/${language}`} passHref>
            <Button>
              <Home className="h-4 w-4 mr-2" />
              {t('not_found.back_home')}
            </Button>
          </Link>

          <Button
            variant="secondary"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('not_found.back')}
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {t('not_found.need_help')}{' '}
            <Link
              href={`/${language}/contact`}
              className="text-primary hover:text-primary/80 font-medium"
            >
              {t('not_found.contact')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
