export type EditorialLocale = 'en' | 'es' | 'fr' | 'de';

export interface EditorialFaqItem {
  question: string;
  answer: string;
}

export interface EditorialCarouselSlide {
  eyebrow: string;
  headline: string;
  body: string;
}

export interface EditorialDigestCard {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
}

export interface EditorialTeaserCopy {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
}

export interface EditorialArticleLocaleContent {
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  heroImageAlt: string;
  body: string;
  faq: EditorialFaqItem[];
  teaserShort: EditorialTeaserCopy;
  teaserMedium: EditorialTeaserCopy;
  digestCard: EditorialDigestCard;
  carouselSlides: EditorialCarouselSlide[];
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
}

export interface EditorialInternalLink {
  href: string;
  label: string;
  purpose: string;
}

export interface EditorialLegalAnchor {
  id: string;
  label: string;
  detail: string;
}

export interface EditorialImagePromptAsset {
  id: string;
  useCase: 'hero' | 'carousel' | 'teaser' | 'digest';
  bestUse: string;
  aspectRatio: string;
  masterPrompt: string;
  variantGuidance: string[];
}

export interface EditorialCropGuidance {
  landscape: string;
  square: string;
  portrait: string;
}

export interface EditorialImagePromptBundle {
  artDirection: string;
  assets: EditorialImagePromptAsset[];
  negativePromptList: string[];
  cropGuidance: EditorialCropGuidance;
}

export interface EditorialLegalReview {
  riskClassification: 'LOW' | 'MEDIUM' | 'HIGH';
  disclaimerRequired: boolean;
  status: 'PASS' | 'REVISE' | 'HOLD';
  notes: string[];
}

export interface EditorialSprintPackage {
  pillar: 'Reality' | 'Membership' | 'Red Flags' | 'Pressure' | 'Verification';
  canonicalSlug: string;
  canonicalLocale?: 'en';
  category: string;
  queryClass?: string[];
  objective?: string;
  audience?: string;
  thesis?: string;
  template?: string;
  publishPriority?: number;
  mode?: 'public-safe';
  riskClassification?: 'LOW' | 'MEDIUM' | 'HIGH';
  publishStatus?: 'PASS' | 'REVISE' | 'HOLD';
  legalAnchors: unknown;
  internalLinks: unknown;
  locales: Record<EditorialLocale, Record<string, unknown>>;
  imagePromptBundle?: EditorialImagePromptBundle;
  imageAssets?: unknown;
  negativePromptList?: string[];
  cropGuidance?: EditorialCropGuidance;
  legalReview?: EditorialLegalReview | Record<string, unknown>;
  disclaimerRequired?: boolean;
  disclaimerText?: string | null;
  carouselTemplate?: string;
}

export const SCM_REQUIRED_DISCLAIMER =
  'SCM provides information, not legal advice. The legal landscape for cannabis social clubs in Spain is complex and evolving. Always verify club status independently and consult local legal resources if in doubt.';

export const SCM_DISCLAIMER = SCM_REQUIRED_DISCLAIMER;

export const SCM_NEGATIVE_PROMPT_LIST = [
  'cannabis leaves',
  'dispensary counters',
  'obvious menus',
  'smoke clouds',
  'party or rave scenes',
  'DJ booths',
  'tourist caricatures',
  'street deals',
  'money exchange',
  'bright novelty weed branding',
  'Amsterdam coffeeshop aesthetics',
  'glamorized consumption',
];

export const DEFAULT_CROP_GUIDANCE: EditorialCropGuidance = {
  landscape:
    'Keep the main threshold, doorway, or civic cue in the central band with enough room for editorial overlays.',
  square:
    'Preserve the primary visual signal in the center so the image remains legible in a 1:1 crop.',
  portrait:
    'Hold negative space in the upper third and keep the main scene signal inside the middle of the frame for 4:5 reuse.',
};
