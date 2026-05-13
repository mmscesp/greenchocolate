import { describe, expect, it } from 'vitest';
import { getArticleAvailableLocales, getArticleLocaleState } from '@/lib/article-localization';

describe('article localization', () => {
  it('treats English as source locale', () => {
    expect(getArticleLocaleState('what-are-cannabis-social-clubs-spain', 'en')).toEqual({
      locale: 'en',
      isSourceLocale: true,
      hasHumanTranslation: true,
      shouldIndex: true,
    });
  });

  it('indexes known translated articles', () => {
    expect(getArticleLocaleState('what-are-cannabis-social-clubs-spain', 'es').shouldIndex).toBe(true);
  });

  it('noindexes missing translations outside the source locale', () => {
    expect(getArticleLocaleState('missing-translation-slug', 'fr')).toEqual({
      locale: 'fr',
      isSourceLocale: false,
      hasHumanTranslation: false,
      shouldIndex: false,
    });
  });

  it('returns only available locales for hreflang clusters', () => {
    expect(getArticleAvailableLocales('what-are-cannabis-social-clubs-spain')).toContain('en');
    expect(getArticleAvailableLocales('what-are-cannabis-social-clubs-spain')).toContain('es');
  });
});
