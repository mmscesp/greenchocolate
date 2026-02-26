import 'server-only';
import type { Locale } from './i18n-config';
import type { Dictionary } from '@/hooks/useLanguage';

// We import these dynamically to avoid bundling all languages
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  es: () => import('@/dictionaries/es.json').then((module) => module.default as Dictionary),
  en: () => import('@/dictionaries/en.json').then((module) => module.default as Dictionary),
  fr: () => import('@/dictionaries/fr.json').then((module) => module.default as Dictionary),
  de: () => import('@/dictionaries/de.json').then((module) => module.default as Dictionary),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale]?.() ?? dictionaries.es();
};
