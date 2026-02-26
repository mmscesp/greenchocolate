/**
 * Type definitions for i18n translations
 * 
 * This file provides TypeScript type safety for translation keys.
 * It uses a flexible type that accepts any string key.
 */

// Use Record<string, string> for flexibility with dynamic keys
export type Dictionary = Record<string, string>;

/**
 * Type representing all available translation keys
 * This provides autocompletion and type checking for translation keys
 */
export type TranslationKey = string;

/**
 * Helper type to get nested key paths
 * Example: 'home.hero.title' | 'nav.explore' | etc.
 */
export type TranslationKeyPath = string;

/**
 * Available locales
 */
export type Locale = 'es' | 'en' | 'fr' | 'de';

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
