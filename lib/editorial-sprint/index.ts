import type { Locale } from '@/lib/i18n-config';
import { localizeEditorialPath, SPRINT_INTERNAL_LINKS } from '@/lib/editorial-sprint/shared';
import type {
  EditorialSprintCarouselSlide,
  EditorialSprintImageBundle,
  EditorialSprintPackage,
} from '@/lib/editorial-sprint/types';
import { membershipPackage } from '@/lib/editorial-sprint/packages/membership';
import { realityPackage } from '@/lib/editorial-sprint/packages/reality';
import { redFlagsPackage } from '@/lib/editorial-sprint/packages/red-flags';
import { pressurePackage } from '@/lib/editorial-sprint/packages/pressure';
import { VERIFICATION_CONTENT_PACKAGE } from '@/lib/editorial-sprint/packages/verification-package';
import { WEEKLY_DIGEST_SUPPORT_PACKAGE } from '@/lib/editorial-sprint/packages/weekly-digest-support';

type SupportedLocale = Extract<Locale, 'en' | 'es' | 'fr' | 'de'>;

function normalizeCategory(category: string): EditorialSprintPackage['category'] {
  const normalized = category.toLowerCase();
  if (normalized.includes('legal') || normalized.includes('risk')) return 'legal';
  if (normalized.includes('etiquette') || normalized.includes('membership')) return 'etiquette';
  if (normalized.includes('harm')) return 'harm-reduction';
  return 'culture';
}

function buildImageBundleFromPromptBundle(bundle: any): EditorialSprintImageBundle {
  const hero = bundle.assets?.find((asset: any) => asset.useCase === 'hero') ?? bundle.assets?.[0];
  const carousel = bundle.assets?.find((asset: any) => asset.useCase === 'carousel') ?? bundle.assets?.[1] ?? hero;
  const teaser =
    bundle.assets?.find((asset: any) => asset.useCase === 'teaser') ??
    bundle.assets?.find((asset: any) => asset.useCase === 'digest') ??
    bundle.assets?.[2] ??
    hero;

  return {
    hero: {
      label: hero?.id ?? 'Hero prompt',
      prompt: hero?.masterPrompt ?? '',
      bestUse: hero?.bestUse ?? '',
      cropNote: bundle.cropGuidance?.landscape ?? '',
    },
    carousel: {
      label: carousel?.id ?? 'Carousel prompt',
      prompt: carousel?.masterPrompt ?? '',
      bestUse: carousel?.bestUse ?? '',
      cropNote: bundle.cropGuidance?.square ?? '',
    },
    teaser: {
      label: teaser?.id ?? 'Teaser prompt',
      prompt: teaser?.masterPrompt ?? '',
      bestUse: teaser?.bestUse ?? '',
      cropNote: bundle.cropGuidance?.portrait ?? '',
    },
    negativePrompt: Array.isArray(bundle.negativePromptList) ? bundle.negativePromptList.join(', ') : '',
    variantGuidance: Array.isArray(hero?.variantGuidance)
      ? hero.variantGuidance.join(' ')
      : hero?.variantGuidance ?? '',
  };
}

function buildImageBundleFromAssetList(
  assets: any[],
  negativePromptList: string[] | undefined,
  cropGuidance: { landscape?: string; square?: string; portrait?: string } | undefined
): EditorialSprintImageBundle {
  const hero = assets.find((asset) => asset.asset === 'hero') ?? assets[0];
  const carousel = assets.find((asset) => asset.asset === 'carousel') ?? assets[1] ?? hero;
  const teaser = assets.find((asset) => asset.asset === 'teaser') ?? assets[2] ?? hero;

  return {
    hero: {
      label: hero?.asset ?? 'Hero prompt',
      prompt: hero?.prompt ?? '',
      bestUse: hero?.bestUse ?? '',
      cropNote: cropGuidance?.landscape ?? '',
    },
    carousel: {
      label: carousel?.asset ?? 'Carousel prompt',
      prompt: carousel?.prompt ?? '',
      bestUse: carousel?.bestUse ?? '',
      cropNote: cropGuidance?.square ?? '',
    },
    teaser: {
      label: teaser?.asset ?? 'Teaser prompt',
      prompt: teaser?.prompt ?? '',
      bestUse: teaser?.bestUse ?? '',
      cropNote: cropGuidance?.portrait ?? '',
    },
    negativePrompt: Array.isArray(negativePromptList) ? negativePromptList.join(', ') : '',
    variantGuidance: hero?.variantGuidance ?? '',
  };
}

function adaptWorkerPackage(raw: any, options: { featuredOrder: number; citySlug?: string; cityName?: string }): EditorialSprintPackage {
  const imageBundle = raw.imagePromptBundle
    ? buildImageBundleFromPromptBundle(raw.imagePromptBundle)
    : buildImageBundleFromAssetList(raw.imageAssets ?? [], raw.negativePromptList, raw.cropGuidance);

  const locales = raw.locales as Record<SupportedLocale, any>;

  return {
    pillar: String(raw.pillar).toLowerCase().replace(/\s+/g, '-') as EditorialSprintPackage['pillar'],
    slug: raw.canonicalSlug,
    category: normalizeCategory(raw.category),
    featuredOrder: options.featuredOrder,
    citySlug: options.citySlug ?? 'barcelona',
    cityName: options.cityName ?? 'Barcelona',
    authorName: 'SCM Editorial Desk',
    authorBio:
      'SocialClubsMaps covers Spain club reality through a legal, civic, and verification-first lens.',
    publishedAt: '2026-04-25T09:30:00.000Z',
    readTime: 8,
    heroImageAlt: locales.en.heroImageAlt ?? `${raw.canonicalTitle} editorial hero image`,
    disclaimerRequired: raw.legalReview?.disclaimerRequired ?? raw.disclaimerRequired ?? false,
    legalAnchors: Array.isArray(raw.legalAnchors)
      ? raw.legalAnchors.map((anchor: any) => anchor.detail ?? anchor.summary ?? String(anchor))
      : [],
    primaryCtaHref:
      locales.en.ctaPrimary?.href ??
      raw.ctaPrimary?.href ??
      raw.ctaPrimaryHref ??
      SPRINT_INTERNAL_LINKS.safetyKit,
    secondaryCtaHref:
      locales.en.ctaSecondary?.href ??
      raw.ctaSecondary?.href ??
      raw.ctaSecondaryHref ??
      SPRINT_INTERNAL_LINKS.mission,
    english: {
      title: locales.en.title ?? locales.en.meta?.title ?? raw.canonicalTitle,
      excerpt: locales.en.excerpt ?? locales.en.meta?.excerpt ?? '',
      metaTitle: locales.en.metaTitle ?? locales.en.meta?.metaTitle ?? locales.en.title ?? raw.canonicalTitle,
      metaDescription:
        locales.en.metaDescription ?? locales.en.meta?.metaDescription ?? locales.en.excerpt ?? '',
      content: locales.en.body ?? locales.en.articleBody ?? '',
      tags: raw.queryClass ?? [raw.pillar],
    },
    localized: {
      es: {
        title: locales.es.title ?? locales.es.meta?.title ?? '',
        excerpt: locales.es.excerpt ?? locales.es.meta?.excerpt ?? '',
        metaTitle: locales.es.metaTitle ?? locales.es.meta?.metaTitle ?? '',
        metaDescription: locales.es.metaDescription ?? locales.es.meta?.metaDescription ?? '',
        content: locales.es.body ?? locales.es.articleBody ?? '',
        tags: raw.queryClass ?? [raw.pillar],
      },
      fr: {
        title: locales.fr.title ?? locales.fr.meta?.title ?? '',
        excerpt: locales.fr.excerpt ?? locales.fr.meta?.excerpt ?? '',
        metaTitle: locales.fr.metaTitle ?? locales.fr.meta?.metaTitle ?? '',
        metaDescription: locales.fr.metaDescription ?? locales.fr.meta?.metaDescription ?? '',
        content: locales.fr.body ?? locales.fr.articleBody ?? '',
        tags: raw.queryClass ?? [raw.pillar],
      },
      de: {
        title: locales.de.title ?? locales.de.meta?.title ?? '',
        excerpt: locales.de.excerpt ?? locales.de.meta?.excerpt ?? '',
        metaTitle: locales.de.metaTitle ?? locales.de.meta?.metaTitle ?? '',
        metaDescription: locales.de.metaDescription ?? locales.de.meta?.metaDescription ?? '',
        content: locales.de.body ?? locales.de.articleBody ?? '',
        tags: raw.queryClass ?? [raw.pillar],
      },
    },
    teaser: {
      en: {
        badge: raw.pillar,
        title: locales.en.teaserMedium?.title ?? locales.en.teaserShort?.title ?? locales.en.title ?? raw.canonicalTitle,
        body: locales.en.teaserMedium?.body ?? locales.en.teaser?.medium ?? '',
        ctaLabel:
          locales.en.teaserMedium?.ctaLabel ?? locales.en.teaserShort?.ctaLabel ?? locales.en.ctaPrimaryLabel ?? 'Read more',
      },
      es: {
        badge: raw.pillar,
        title: locales.es.teaserMedium?.title ?? locales.es.teaserShort?.title ?? locales.es.meta?.title ?? '',
        body: locales.es.teaserMedium?.body ?? locales.es.teaser?.medium ?? '',
        ctaLabel:
          locales.es.teaserMedium?.ctaLabel ?? locales.es.teaserShort?.ctaLabel ?? locales.es.ctaPrimaryLabel ?? 'Leer mas',
      },
      fr: {
        badge: raw.pillar,
        title: locales.fr.teaserMedium?.title ?? locales.fr.teaserShort?.title ?? locales.fr.meta?.title ?? '',
        body: locales.fr.teaserMedium?.body ?? locales.fr.teaser?.medium ?? '',
        ctaLabel:
          locales.fr.teaserMedium?.ctaLabel ?? locales.fr.teaserShort?.ctaLabel ?? locales.fr.ctaPrimaryLabel ?? 'Lire',
      },
      de: {
        badge: raw.pillar,
        title: locales.de.teaserMedium?.title ?? locales.de.teaserShort?.title ?? locales.de.meta?.title ?? '',
        body: locales.de.teaserMedium?.body ?? locales.de.teaser?.medium ?? '',
        ctaLabel:
          locales.de.teaserMedium?.ctaLabel ?? locales.de.teaserShort?.ctaLabel ?? locales.de.ctaPrimaryLabel ?? 'Lesen',
      },
    },
    digest: {
      en: locales.en.digestCard,
      es: locales.es.digestCard,
      fr: locales.fr.digestCard,
      de: locales.de.digestCard,
    },
    carouselTemplate: raw.template ?? raw.carouselTemplate ?? 'explainer',
    carouselSlides: {
      en: (locales.en.carouselSlides ?? []).map((slide: any) => ({
        eyebrow: slide.eyebrow ?? slide.kicker,
        title: slide.headline,
        body: [slide.body].flat().filter(Boolean),
      })),
      es: (locales.es.carouselSlides ?? []).map((slide: any) => ({
        eyebrow: slide.eyebrow ?? slide.kicker,
        title: slide.headline,
        body: [slide.body].flat().filter(Boolean),
      })),
      fr: (locales.fr.carouselSlides ?? []).map((slide: any) => ({
        eyebrow: slide.eyebrow ?? slide.kicker,
        title: slide.headline,
        body: [slide.body].flat().filter(Boolean),
      })),
      de: (locales.de.carouselSlides ?? []).map((slide: any) => ({
        eyebrow: slide.eyebrow ?? slide.kicker,
        title: slide.headline,
        body: [slide.body].flat().filter(Boolean),
      })),
    },
    imageBundle,
  };
}

function adaptVerificationPackage(raw: any): EditorialSprintPackage {
  const localized = Object.fromEntries(
    (['es', 'fr', 'de'] as const).map((locale) => [
      locale,
      {
        title: raw.locales[locale].title,
        excerpt: raw.locales[locale].excerpt,
        metaTitle: raw.locales[locale].metaTitle,
        metaDescription: raw.locales[locale].metaDescription,
        content: raw.locales[locale].body,
        tags: ['Verification', 'Barcelona', 'SCM Standard'],
      },
    ])
  ) as EditorialSprintPackage['localized'];

  const buildSlides = (locale: SupportedLocale): EditorialSprintCarouselSlide[] =>
    raw.carouselSlides.map((slide: any) => ({
      eyebrow: slide.id,
      title: slide.headline[locale],
      body: [slide.body[locale]],
    }));

  return {
    pillar: 'verification',
    slug: raw.canonicalSlug,
    category: 'culture',
    featuredOrder: 9,
    citySlug: 'barcelona',
    cityName: 'Barcelona',
    authorName: 'SCM Editorial Desk',
    authorBio:
      'SocialClubsMaps covers Spain club reality through a legal, civic, and verification-first lens.',
    publishedAt: '2026-04-25T10:00:00.000Z',
    readTime: 8,
    heroImageAlt: 'A premium verification-themed editorial image for SocialClubsMaps.',
    disclaimerRequired: raw.disclaimerRequired,
    legalAnchors: raw.legalAnchors,
    primaryCtaHref: raw.ctaPrimary.href,
    secondaryCtaHref: raw.ctaSecondary.href,
    english: {
      title: raw.locales.en.title,
      excerpt: raw.locales.en.excerpt,
      metaTitle: raw.locales.en.metaTitle,
      metaDescription: raw.locales.en.metaDescription,
      content: raw.locales.en.body,
      tags: ['Verification', 'Barcelona', 'SCM Standard'],
    },
    localized,
    teaser: {
      en: {
        badge: 'Verification',
        title: raw.digestCardCopy.en.title,
        body: raw.teaserMedium.en,
        ctaLabel: raw.digestCardCopy.en.ctaLabel,
      },
      es: {
        badge: 'Verification',
        title: raw.digestCardCopy.es.title,
        body: raw.teaserMedium.es,
        ctaLabel: raw.digestCardCopy.es.ctaLabel,
      },
      fr: {
        badge: 'Verification',
        title: raw.digestCardCopy.fr.title,
        body: raw.teaserMedium.fr,
        ctaLabel: raw.digestCardCopy.fr.ctaLabel,
      },
      de: {
        badge: 'Verification',
        title: raw.digestCardCopy.de.title,
        body: raw.teaserMedium.de,
        ctaLabel: raw.digestCardCopy.de.ctaLabel,
      },
    },
    digest: {
      en: raw.digestCardCopy.en,
      es: raw.digestCardCopy.es,
      fr: raw.digestCardCopy.fr,
      de: raw.digestCardCopy.de,
    },
    carouselTemplate: raw.carouselTemplate,
    carouselSlides: {
      en: buildSlides('en'),
      es: buildSlides('es'),
      fr: buildSlides('fr'),
      de: buildSlides('de'),
    },
    imageBundle: {
      hero: {
        label: 'verification-hero',
        prompt: raw.imageAssets.hero.masterPrompt,
        bestUse: raw.imageAssets.hero.bestUseNote,
        cropNote: raw.imageAssets.hero.cropNote,
      },
      carousel: {
        label: 'verification-carousel',
        prompt: raw.imageAssets.carouselSupport.masterPrompt,
        bestUse: raw.imageAssets.carouselSupport.bestUseNote,
        cropNote: raw.imageAssets.carouselSupport.cropNote,
      },
      teaser: {
        label: 'verification-teaser',
        prompt: raw.imageAssets.teaserBanner.masterPrompt,
        bestUse: raw.imageAssets.teaserBanner.bestUseNote,
        cropNote: raw.imageAssets.teaserBanner.cropNote,
      },
      negativePrompt: raw.imageAssets.hero.negativePrompt.join(', '),
      variantGuidance: raw.imageAssets.hero.variantGuidance,
    },
  };
}

const workerRealityPackage = adaptWorkerPackage(realityPackage as any, {
  featuredOrder: 5,
});
const workerRedFlagsPackage = adaptWorkerPackage(redFlagsPackage as any, {
  featuredOrder: 7,
});
const workerPressurePackage = adaptWorkerPackage(pressurePackage as any, {
  featuredOrder: 8,
});
const verificationSprintPackage = adaptVerificationPackage(VERIFICATION_CONTENT_PACKAGE as any);

export const EDITORIAL_SPRINT_PACKAGES: EditorialSprintPackage[] = [
  workerRealityPackage,
  membershipPackage,
  workerRedFlagsPackage,
  workerPressurePackage,
  verificationSprintPackage,
];

export function getEditorialSprintPackageBySlug(slug: string) {
  return EDITORIAL_SPRINT_PACKAGES.find((pkg) => pkg.slug === slug) ?? null;
}

export function getEditorialSprintLocaleFields(pkg: EditorialSprintPackage, locale: SupportedLocale) {
  if (locale === 'en') {
    return pkg.english;
  }

  return pkg.localized[locale];
}

export function getEditorialSprintPackagesForLocale(locale: SupportedLocale) {
  return EDITORIAL_SPRINT_PACKAGES.map((pkg) => ({
    ...pkg,
    localeFields: getEditorialSprintLocaleFields(pkg, locale),
  }));
}

export function getWeeklyIntelligencePackages(locale: SupportedLocale) {
  const slugs = ['barcelona-club-reality-what-most-people-get-wrong', 'barcelona-club-red-flags', 'why-barcelona-clubs-are-under-pressure-2026'];
  return slugs
    .map((slug) => getEditorialSprintPackageBySlug(slug))
    .filter((pkg): pkg is EditorialSprintPackage => Boolean(pkg))
    .map((pkg) => ({
      href: `/${locale}/editorial/${pkg.slug}`,
      title: getEditorialSprintLocaleFields(pkg, locale).title,
      content: pkg.digest[locale].body,
      eyebrow: pkg.teaser[locale].badge,
      pillar: pkg.pillar,
    }));
}

export function getFeaturedVaultPackages(locale: SupportedLocale) {
  return EDITORIAL_SPRINT_PACKAGES.slice()
    .sort((a, b) => a.featuredOrder - b.featuredOrder)
    .slice(0, 4)
    .map((pkg) => ({
      id: pkg.slug,
      tag: pkg.teaser[locale].badge,
      title: getEditorialSprintLocaleFields(pkg, locale).title,
      description: getEditorialSprintLocaleFields(pkg, locale).excerpt,
      readTime: pkg.readTime,
      slug: pkg.slug,
      category: pkg.category,
      citySlug: pkg.citySlug,
    }));
}

export function getWeeklyDigestSupport(locale: SupportedLocale) {
  return WEEKLY_DIGEST_SUPPORT_PACKAGE.lead[locale];
}

export function getWeeklyDigestCoverPrompt() {
  return WEEKLY_DIGEST_SUPPORT_PACKAGE.digestCoverImage;
}

export function getLocalizedInternalLink(path: string, locale: SupportedLocale) {
  return localizeEditorialPath(path, locale);
}
