import type { Locale } from '@/lib/i18n-config';

export type EditorialSprintPillar =
  | 'reality'
  | 'membership'
  | 'red-flags'
  | 'pressure'
  | 'verification';

export type EditorialSprintCarouselTemplate =
  | 'explainer'
  | 'audit'
  | 'blueprint'
  | 'debunk'
  | 'spotlight'
  | 'single-post';

export interface LocalizedEditorialSprintFields {
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
  tags: string[];
}

export interface EditorialSprintTeaserCopy {
  badge: string;
  title: string;
  body: string;
  ctaLabel: string;
}

export interface EditorialSprintDigestCopy {
  title: string;
  body: string;
  ctaLabel: string;
}

export interface EditorialSprintCarouselSlide {
  title: string;
  eyebrow?: string;
  body: string[];
  kicker?: string;
}

export interface EditorialSprintImagePrompt {
  label: string;
  prompt: string;
  bestUse: string;
  cropNote: string;
}

export interface EditorialSprintImageBundle {
  hero: EditorialSprintImagePrompt;
  carousel: EditorialSprintImagePrompt;
  teaser: EditorialSprintImagePrompt;
  negativePrompt: string;
  variantGuidance: string;
}

export interface EditorialSprintPackage {
  pillar: EditorialSprintPillar;
  slug: string;
  category: 'legal' | 'etiquette' | 'harm-reduction' | 'culture';
  featuredOrder: number;
  citySlug: string;
  cityName: string;
  authorName: string;
  authorBio: string;
  publishedAt: string;
  readTime: number;
  heroImageAlt: string;
  disclaimerRequired: boolean;
  legalAnchors: string[];
  primaryCtaHref: string;
  secondaryCtaHref: string;
  english: LocalizedEditorialSprintFields;
  localized: Record<Exclude<Locale, 'en'>, LocalizedEditorialSprintFields>;
  teaser: Record<Locale, EditorialSprintTeaserCopy>;
  digest: Record<Locale, EditorialSprintDigestCopy>;
  carouselTemplate: EditorialSprintCarouselTemplate;
  carouselSlides: Record<Locale, EditorialSprintCarouselSlide[]>;
  imageBundle: EditorialSprintImageBundle;
}
