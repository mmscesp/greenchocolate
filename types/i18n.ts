/**
 * Type definitions for i18n translations
 * 
 * This file provides TypeScript type safety for translation keys.
 * It uses the Spanish dictionary as the source of truth.
 */

import type es from '../dictionaries/es.json';

/**
 * Type representing all available translation keys
 * This provides autocompletion and type checking for translation keys
 */
export type TranslationKey = keyof typeof es;

/**
 * Type representing the entire translation dictionary structure
 */
export type Dictionary = typeof es;

/**
 * Helper type to get nested key paths
 * Example: 'home.hero.title' | 'nav.explore' | etc.
 */
export type TranslationKeyPath = Path<typeof es>;

type Path<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | `${K}.${Path<T[K]>}`
        : never;
    }[keyof T]
  : never;

/**
 * Available locales
 */
export type Locale = 'es' | 'en' | 'fr' | 'de' | 'it' | 'pl' | 'ru' | 'pt';

/**
 * Locale configuration
 */
export interface LocaleConfig {
  locales: Locale[];
  defaultLocale: Locale;
}

/**
 * Props for components that receive dictionary/translations
 */
export interface WithDictionaryProps {
  dictionary: Dictionary;
  locale: Locale;
}
