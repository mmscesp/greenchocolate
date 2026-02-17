'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { i18n, type Locale } from '@/lib/i18n-config';

// Define the translation key type
export type TranslationKey = string;

// Type for dictionary
export type Dictionary = Record<string, string>;

interface LanguageContextType {
  language: Locale;
  setLanguage: (lang: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  locale: Locale;
  dictionary: Dictionary;
}

export function LanguageProvider({ children, locale, dictionary }: LanguageProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const setLanguage = (newLang: Locale) => {
    if (newLang === locale) return;

    void fetch('/api/locale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ locale: newLang }),
    });

    // Construct new path: Replace /es/about with /en/about
    // We assume the first segment is always the locale due to middleware
    const segments = pathname.split('/');
    if (segments[1] && i18n.locales.includes(segments[1] as Locale)) {
      segments[1] = newLang; // Replace locale segment
    } else {
      segments.splice(1, 0, newLang); // Insert locale at beginning
    }
    const newPath = segments.join('/') || '/';

    router.push(newPath);
  };

  const t = (key: TranslationKey): string => {
    return dictionary[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language: locale, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Hook to get locale for server components
export function useLocale(): Locale {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LanguageProvider');
  }
  return context.language;
}
