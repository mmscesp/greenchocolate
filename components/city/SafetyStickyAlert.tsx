'use client';

import { AlertTriangle } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';

export default function SafetyStickyAlert() {
  const { t } = useLanguage();

  return (
    <div className="sticky top-0 z-40 w-full bg-brand/90 text-black backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-2 text-sm font-semibold">
        <AlertTriangle className="h-4 w-4" />
        <span>{t('safety_alert.public_consumption')}</span>
      </div>
    </div>
  );
}
