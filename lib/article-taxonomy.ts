export const ARTICLE_CATEGORY_KEY_MAP = {
  Legal: 'editorial.categories.legal.title',
  Etiquette: 'editorial.categories.etiquette.title',
  'Harm Reduction': 'editorial.categories.safety.title',
  Culture: 'editorial.categories.culture.title',
} as const;

export function getLocalizedArticleCategory(
  category: string,
  t: (key: string) => string
): string {
  const translationKey =
    ARTICLE_CATEGORY_KEY_MAP[category as keyof typeof ARTICLE_CATEGORY_KEY_MAP];

  return translationKey ? t(translationKey) : category;
}

