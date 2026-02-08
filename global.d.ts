/**
 * Global Type Augmentation for i18n
 * 
 * This file provides TypeScript type safety for translation keys.
 * It augments the global IntlMessages interface with the structure from es.json.
 */

import type es from './dictionaries/es.json';

declare global {
  /**
   * Interface for type-safe translations
   * This provides autocompletion and type checking for all translation keys
   */
  interface IntlMessages extends Record<string, unknown> {}
}

// Augment IntlMessages with the actual dictionary structure
type Messages = typeof es;
declare global {
  interface IntlMessages extends Messages {}
}

export {};
