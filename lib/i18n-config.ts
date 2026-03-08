export const i18n = {
  defaultLocale: 'es',
  locales: ['es', 'en', 'fr', 'de'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

export const localeLabels: Record<Locale, { name: string; flag: string }> = {
  es: { name: 'Español', flag: '🇪🇸' },
  en: { name: 'English', flag: '🇬🇧' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
};

export function isLocale(value: string): value is Locale {
  return i18n.locales.includes(value as Locale);
}
