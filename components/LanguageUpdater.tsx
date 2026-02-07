'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

export default function LanguageUpdater() {
  const { language } = useLanguage();

  useEffect(() => {
    // Update the HTML lang attribute when language changes
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
