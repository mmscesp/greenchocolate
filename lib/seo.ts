import type { Metadata } from 'next';
import { i18n, type Locale } from '@/lib/i18n-config';
export { isLocale } from '@/lib/i18n-config';

const DEFAULT_BASE_URL = 'https://socialclubsmaps.com';
const DEFAULT_OG_IMAGE_PATH = '/images/SCM_Logo_OG.png';

const OG_LOCALE_BY_LANG: Record<Locale, string> = {
  es: 'es_ES',
  en: 'en_US',
  fr: 'fr_FR',
  de: 'de_DE',
};

interface BuildLocalizedMetadataOptions {
  lang: Locale;
  path: string;
  title: string;
  description: string;
  type?: 'website' | 'article';
  imagePath?: string;
  keywords?: string[];
  noindex?: boolean;
}

function normalizePath(path: string): string {
  if (!path || path === '/') {
    return '';
  }

  return path.startsWith('/') ? path : `/${path}`;
}

function buildLocalizedPath(lang: Locale, path: string): string {
  return `/${lang}${normalizePath(path)}`;
}

export function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!envUrl) {
    return DEFAULT_BASE_URL;
  }

  return envUrl.replace(/\/+$/, '');
}

export function toAbsoluteUrl(path: string): string {
  return `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

export function buildLanguageAlternates(path: string): Record<string, string> {
  const localizedAlternates = Object.fromEntries(
    i18n.locales.map((locale) => [locale, toAbsoluteUrl(buildLocalizedPath(locale, path))])
  );

  return {
    ...localizedAlternates,
    'x-default': toAbsoluteUrl(buildLocalizedPath(i18n.defaultLocale, path)),
  };
}

export function buildNoIndexMetadata(): Metadata {
  return {
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        'max-image-preview': 'none',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

export function buildLocalizedMetadata({
  lang,
  path,
  title,
  description,
  type = 'website',
  imagePath = DEFAULT_OG_IMAGE_PATH,
  keywords,
  noindex = false,
}: BuildLocalizedMetadataOptions): Metadata {
  const localizedPath = buildLocalizedPath(lang, path);
  const canonical = toAbsoluteUrl(localizedPath);
  const imageUrl = toAbsoluteUrl(imagePath);

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      type,
      locale: OG_LOCALE_BY_LANG[lang],
      url: canonical,
      siteName: 'SocialClubsMaps',
      title,
      description,
      images: [
        {
          url: imageUrl,
          alt: 'SocialClubsMaps',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@socialclubsmaps',
    },
    ...(noindex ? buildNoIndexMetadata() : {}),
  };
}
