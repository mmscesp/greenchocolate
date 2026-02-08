export const i18n = {
  defaultLocale: 'es',
  locales: ['es', 'en', 'fr', 'de', 'it', 'pl', 'ru', 'pt'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
