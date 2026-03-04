import 'server-only';
import type { Locale } from './i18n-config';
import type { Dictionary } from '@/hooks/useLanguage';

const toDictionary = (value: unknown): Dictionary => value as unknown as Dictionary;

// We import these dynamically to avoid bundling all languages
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  es: () => import('@/dictionaries/es.json').then((module) => toDictionary(module.default)),
  en: () => import('@/dictionaries/en.json').then((module) => toDictionary(module.default)),
  fr: () => import('@/dictionaries/fr.json').then((module) => toDictionary(module.default)),
  de: () => import('@/dictionaries/de.json').then((module) => toDictionary(module.default)),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale]?.() ?? dictionaries.es();
};
