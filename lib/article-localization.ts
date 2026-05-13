import { ARTICLE_TRANSLATIONS } from '@/lib/article-translations';
import { i18n, type Locale } from '@/lib/i18n-config';

export interface ArticleLocaleState {
  locale: Locale;
  isSourceLocale: boolean;
  hasHumanTranslation: boolean;
  shouldIndex: boolean;
}

export const ARTICLE_SOURCE_LOCALE: Locale = 'en';

export function hasArticleTranslation(slug: string, locale: Locale): boolean {
  if (locale === ARTICLE_SOURCE_LOCALE) {
    return true;
  }

  return Boolean(ARTICLE_TRANSLATIONS[locale]?.[slug]);
}

export function getArticleLocaleState(slug: string, locale: Locale): ArticleLocaleState {
  const isSourceLocale = locale === ARTICLE_SOURCE_LOCALE;
  const hasHumanTranslation = hasArticleTranslation(slug, locale);

  return {
    locale,
    isSourceLocale,
    hasHumanTranslation,
    shouldIndex: isSourceLocale || hasHumanTranslation,
  };
}

export function getArticleAvailableLocales(slug: string): Locale[] {
  return i18n.locales.filter((locale) => hasArticleTranslation(slug, locale));
}
