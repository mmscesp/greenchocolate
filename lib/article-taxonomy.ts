export const ARTICLE_CATEGORY_KEY_MAP = {
  Legal: 'editorial.categories.legal.title',
  Etiquette: 'editorial.categories.etiquette.title',
  'Harm Reduction': 'editorial.categories.safety.title',
  Safety: 'editorial.categories.safety.title',
  Culture: 'editorial.categories.culture.title',
} as const;

export const ARTICLE_CATEGORY_ROUTE_MAP = {
  Legal: '/editorial/legal',
  Etiquette: '/editorial/etiquette',
  'Harm Reduction': '/editorial/safety',
  Safety: '/editorial/safety',
  Culture: '/editorial/culture',
} as const;

export function getLocalizedArticleCategory(
  category: string,
  t: (key: string) => string
): string {
  const translationKey =
    ARTICLE_CATEGORY_KEY_MAP[category as keyof typeof ARTICLE_CATEGORY_KEY_MAP];

  return translationKey ? t(translationKey) : category;
}

export function getArticleCategoryPath(category: string): string {
  return ARTICLE_CATEGORY_ROUTE_MAP[category as keyof typeof ARTICLE_CATEGORY_ROUTE_MAP] ?? '/editorial';
}

