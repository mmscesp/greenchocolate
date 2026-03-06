const CITY_IMAGE_BY_SLUG = {
  barcelona: '/images/cities/barcelona-dusk.jpg',
  madrid: '/images/cities/madrid-night.jpg',
  valencia: '/images/cities/valencia-arts.jpg',
  sevilla: '/images/cities/sevilla-oldtown.jpg',
  malaga: '/images/cities/malaga-harbor.jpg',
  tenerife: '/images/cities/tenerife-coast.jpg',
} as const;

const CATEGORY_IMAGE_BY_SLUG = {
  legal: '/images/editorial/legal-brief.jpg',
  etiquette: '/images/editorial/first-time-bcn.jpg',
  culture: '/images/editorial/bcn-vs-ams.jpg',
  'harm-reduction': '/images/editorial/safety-kit-hero.jpg',
} as const;

const DEFAULT_CITY_IMAGE = CITY_IMAGE_BY_SLUG.barcelona;
const DEFAULT_EDITORIAL_IMAGE = '/images/editorial/club-interior-warm.jpg';
const DEFAULT_CLUB_IMAGE = '/images/fallbacks/club-default.jpg';
const DEFAULT_EVENT_IMAGE = '/images/fallbacks/event-default.jpg';

type CitySlug = keyof typeof CITY_IMAGE_BY_SLUG;
type CategorySlug = keyof typeof CATEGORY_IMAGE_BY_SLUG;

function normalizeCitySlug(citySlug?: string | null): CitySlug | null {
  if (!citySlug) {
    return null;
  }

  const normalized = citySlug.trim().toLowerCase();
  if (normalized in CITY_IMAGE_BY_SLUG) {
    return normalized as CitySlug;
  }

  return null;
}

function normalizeCategorySlug(category?: string | null): CategorySlug | null {
  if (!category) {
    return null;
  }

  const normalized = category.trim().toLowerCase();
  if (normalized in CATEGORY_IMAGE_BY_SLUG) {
    return normalized as CategorySlug;
  }

  if (normalized === 'harm reduction' || normalized === 'safety') {
    return 'harm-reduction';
  }

  return null;
}

function sanitizeImageUrl(image?: string | null): string | null {
  if (!image) {
    return null;
  }

  const trimmed = image.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function getCityImage(citySlug?: string | null): string {
  const normalizedCity = normalizeCitySlug(citySlug);
  if (!normalizedCity) {
    return DEFAULT_CITY_IMAGE;
  }

  return CITY_IMAGE_BY_SLUG[normalizedCity];
}

export function getCategoryImage(category?: string | null): string {
  const normalizedCategory = normalizeCategorySlug(category);
  if (!normalizedCategory) {
    return DEFAULT_EDITORIAL_IMAGE;
  }

  return CATEGORY_IMAGE_BY_SLUG[normalizedCategory];
}

export function getArticleCardImage(params: {
  heroImage?: string | null;
  category?: string | null;
  citySlug?: string | null;
}): string {
  const direct = sanitizeImageUrl(params.heroImage);
  if (direct) {
    return direct;
  }

  const byCategory = getCategoryImage(params.category);
  if (byCategory) {
    return byCategory;
  }

  return getCityImage(params.citySlug);
}

export function getClubPrimaryImage(images?: string[] | null, citySlug?: string | null): string {
  const first = sanitizeImageUrl(images?.[0]);
  if (first) {
    return first;
  }

  const normalizedCity = normalizeCitySlug(citySlug);
  if (normalizedCity) {
    return CITY_IMAGE_BY_SLUG[normalizedCity];
  }

  return DEFAULT_CLUB_IMAGE;
}

export function getClubImageGallery(images?: string[] | null, citySlug?: string | null): string[] {
  if (!images || images.length === 0) {
    return [getClubPrimaryImage(images, citySlug)];
  }

  const sanitized = images
    .map((image) => sanitizeImageUrl(image))
    .filter((image): image is string => Boolean(image));

  if (sanitized.length === 0) {
    return [getClubPrimaryImage(images, citySlug)];
  }

  return sanitized;
}

export function getEventImage(imageUrl?: string | null, citySlug?: string | null): string {
  const direct = sanitizeImageUrl(imageUrl);
  if (direct) {
    return direct;
  }

  const normalizedCity = normalizeCitySlug(citySlug);
  if (normalizedCity) {
    return CITY_IMAGE_BY_SLUG[normalizedCity];
  }

  return DEFAULT_EVENT_IMAGE;
}

export {
  CATEGORY_IMAGE_BY_SLUG,
  CITY_IMAGE_BY_SLUG,
  DEFAULT_CITY_IMAGE,
  DEFAULT_CLUB_IMAGE,
  DEFAULT_EDITORIAL_IMAGE,
  DEFAULT_EVENT_IMAGE,
};

