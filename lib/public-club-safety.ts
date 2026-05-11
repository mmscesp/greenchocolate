import { isVerifiedClubStatus } from './club-verification';

export type ClubPublicStatus = 'verified-profile' | 'public-listing';

export const FULL_COMPLIANCE_COPY =
  'SocialClubsMaps provides educational and informational content. It does not sell cannabis, broker transactions, provide legal advice, or guarantee club acceptance. Readers must follow local law, private association rules, and platform guidelines.';

export const COMPACT_COMPLIANCE_COPY =
  'Educational only. No cannabis sales, transaction brokering, legal advice, or guaranteed club acceptance.';

const PLACEHOLDER_PATTERN =
  /^(?:[-–—\s]*)?(?:fill manually|tbd|todo|unknown|null|n\/a|na)(?:[-–—\s]*)?$/i;

interface StatusLikeClub {
  isVerified?: boolean | null;
  verificationStatus?: string | null;
}

interface TrustPickLikeClub extends StatusLikeClub {
  trustPickReason?: string | null;
}

export interface SafeStructuredDataClub extends StatusLikeClub {
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  neighborhood?: string | null;
  cityName?: string | null;
  image?: string | null;
  url: string;
  website?: string | null;
  priceRange?: string | null;
}

export interface SafeClubSeoMetadataInput extends StatusLikeClub {
  name: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  shortDescription?: string | null;
  cityName?: string | null;
  neighborhood?: string | null;
}

export function getClubPublicStatus(club: StatusLikeClub): ClubPublicStatus {
  return club.isVerified || isVerifiedClubStatus(club.verificationStatus) ? 'verified-profile' : 'public-listing';
}

export function getClubStatusLabel(club: StatusLikeClub): 'Verified Profile' | 'Public Listing' {
  return getClubPublicStatus(club) === 'verified-profile' ? 'Verified Profile' : 'Public Listing';
}

export function getClubStatusDescription(club: StatusLikeClub): string {
  if (getClubPublicStatus(club) === 'verified-profile') {
    return 'A profile that has passed SCM’s current trust checks. It is a trust signal, not a legal guarantee, commercial endorsement, or promise of access.';
  }

  return 'A public research listing that has not completed SCM’s on-site verification review. It is a starting point, not a recommendation or promise of access.';
}

export function canShowTrustPick(club: TrustPickLikeClub): boolean {
  return getClubPublicStatus(club) === 'verified-profile' && Boolean(club.trustPickReason?.trim());
}

export function sanitizePublicLocationText(value?: string | null): string | null {
  const trimmed = value?.trim();
  if (!trimmed || PLACEHOLDER_PATTERN.test(trimmed)) {
    return null;
  }

  return trimmed;
}

export function shouldRenderLocation(value?: string | null): boolean {
  return sanitizePublicLocationText(value) !== null;
}

export function sanitizePublicClubCopy(value?: string | null, fallbackLocation = 'Barcelona'): string {
  const source = value?.trim() || '';
  return source
    .replace(/\s*(?:[-–—]\s*)?fill manually\s*/gi, ` ${fallbackLocation} `)
    .replace(/\btourist-friendly\b/gi, 'visitor-aware')
    .replace(/\btourist-ready\b/gi, 'visitor-aware')
    .replace(/\btourist-approved\b/gi, 'visitor-aware')
    .replace(/\bopen today\b/gi, 'check current information directly')
    .replace(/\s+,/g, ',')
    .replace(/\s+\./g, '.')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function getSafeClubSeoMetadata(club: SafeClubSeoMetadataInput): { title: string; description: string } {
  const fallbackLocation =
    sanitizePublicLocationText(club.neighborhood) ?? sanitizePublicLocationText(club.cityName) ?? 'Barcelona';
  const isVerifiedProfile = getClubPublicStatus(club) === 'verified-profile';
  const fallbackTitle = isVerifiedProfile
    ? `${club.name}: Verified Cannabis Club Profile`
    : `${club.name}: Public Cannabis Club Listing`;
  const fallbackDescription =
    isVerifiedProfile
      ? `${club.name} is a Verified Profile on SocialClubsMaps. Verification is a trust signal, not a guarantee of access.`
      : `${club.name} is a Public Listing on SocialClubsMaps. Use it as a research starting point before you make plans.`;
  const shortDescriptionSeo = club.shortDescription?.trim()
    ? `${club.shortDescription.trim()} Check SCM profile status, member expectations, and safety notes before making plans.`
    : null;

  return {
    title: sanitizePublicClubCopy(club.metaTitle || fallbackTitle, fallbackLocation),
    description: sanitizePublicClubCopy(club.metaDescription || shortDescriptionSeo || fallbackDescription, fallbackLocation),
  };
}

export function getCardLocationLabel(club: { neighborhood?: string | null; cityName?: string | null }): string | null {
  return sanitizePublicLocationText(club.neighborhood) ?? sanitizePublicLocationText(club.cityName) ?? null;
}

export function getProfileLocationLabel(club: { neighborhood?: string | null; cityName?: string | null }): string {
  const neighborhood = sanitizePublicLocationText(club.neighborhood);
  const city = sanitizePublicLocationText(club.cityName) ?? 'Barcelona';
  return neighborhood ? `${neighborhood}, ${city}` : 'Location details are not publicly confirmed in SCM’s current profile data.';
}

export function getSafeStructuredDataForClub(club: SafeStructuredDataClub): Record<string, unknown> {
  const status = getClubPublicStatus(club);
  const cityName = sanitizePublicLocationText(club.cityName) ?? 'Barcelona';
  const neighborhood = sanitizePublicLocationText(club.neighborhood);
  const description = sanitizePublicClubCopy(
    club.shortDescription || club.description || getClubStatusDescription(club),
    neighborhood ?? cityName
  );

  if (status === 'verified-profile') {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: club.name,
      description,
      ...(club.image ? { image: club.image } : {}),
      url: club.url,
      address: {
        '@type': 'PostalAddress',
        addressLocality: neighborhood ?? cityName,
        addressCountry: 'ES',
      },
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'SCM profile status',
          value: 'Verified Profile',
        },
      ],
      ...(club.website ? { sameAs: [club.website] } : {}),
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: `${club.name} | Public Listing`,
    description,
    ...(club.image ? { image: club.image } : {}),
    url: club.url,
    about: {
      '@type': 'Thing',
      name: club.name,
      ...(neighborhood || cityName
        ? {
            location: {
              '@type': 'Place',
              name: neighborhood ?? cityName,
              address: {
                '@type': 'PostalAddress',
                addressLocality: cityName,
                addressCountry: 'ES',
              },
            },
          }
        : {}),
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'SCM profile status',
        value: 'Public Listing',
      },
    ],
  };
}
