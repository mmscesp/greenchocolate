import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ClubProfileContent from './ClubProfileContent';
import UnverifiedClubProfileContent from './UnverifiedClubProfileContent';
import { getClubBySlug, getClubs } from '@/app/actions/clubs';
import { getClubDetailsWithAccess } from '@/app/actions/gated-content';
import { JsonLd } from '@/components/JsonLd';
import { Club } from '@/lib/types';
import { getDictionary } from '@/lib/dictionary';
import { type Locale } from '@/lib/i18n-config';
import { getClubImageGallery } from '@/lib/image-fallbacks';
import { buildClubMediaItems, getClubPrimaryMediaImage } from '@/lib/club-media';
import { toAbsoluteHttpUrl } from '@/lib/url';
import { buildLanguageAlternates, isLocale, toAbsoluteUrl } from '@/lib/seo';

// ISR: Revalidate every hour
export const revalidate = 3600;

interface ClubPageProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}

// Generate static params for all clubs at build time
export async function generateStaticParams() {
  try {
    const clubs = await getClubs();
    return clubs.map((club) => ({
      slug: club.slug,
    }));
  } catch (error) {
    console.warn('Failed to fetch clubs during build, using empty params');
    return [];
  }
}

export async function generateMetadata({ params }: ClubPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) {
    return {};
  }
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const clubDetail = await getClubBySlug(slug);

  if (!clubDetail) {
    return {
      title: `${t('clubs.detail.not_found_title')} | SocialClubsMaps`,
      description: t('clubs.detail.not_found_description'),
    };
  }

  const mediaItems = buildClubMediaItems({
    slug: clubDetail.slug,
    name: clubDetail.name,
    images: clubDetail.images,
    citySlug: clubDetail.citySlug,
    neighborhood: clubDetail.neighborhood,
    district: clubDetail.district,
    isVerified: clubDetail.isVerified,
    verificationStatus: clubDetail.verificationStatus,
  });
  const primaryImage = getClubPrimaryMediaImage(mediaItems);

  return {
    title: `${clubDetail.name} | ${clubDetail.neighborhood}`,
    description: clubDetail.shortDescription || `Discover ${clubDetail.name} in ${clubDetail.neighborhood}`,
    keywords: [
      `${clubDetail.name} cannabis social club`,
      `${clubDetail.cityName} cannabis club`,
      'verified cannabis social club Spain',
      'cannabis club membership Spain',
    ],
    openGraph: {
      title: `${clubDetail.name} | SocialClubsMaps`,
      description: clubDetail.shortDescription || `Discover ${clubDetail.name} in ${clubDetail.neighborhood}`,
      url: toAbsoluteUrl(`/${lang}/clubs/${clubDetail.slug}`),
      images: [primaryImage],
      type: 'website',
      siteName: 'SocialClubsMaps',
      locale: lang === 'es' ? 'es_ES' : lang === 'en' ? 'en_US' : lang === 'fr' ? 'fr_FR' : 'de_DE',
    },
    alternates: {
      canonical: toAbsoluteUrl(`/${lang}/clubs/${clubDetail.slug}`),
      languages: buildLanguageAlternates(`/clubs/${clubDetail.slug}`),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${clubDetail.name} | SocialClubsMaps`,
      description: clubDetail.shortDescription || `Discover ${clubDetail.name} in ${clubDetail.neighborhood}`,
      images: [primaryImage],
    },
  };
}

export default async function ClubPage({ params }: ClubPageProps) {
  const { lang, slug } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const clubDetail = await getClubBySlug(slug);

  if (!clubDetail) {
    notFound();
  }

  const clubImages = getClubImageGallery(clubDetail.images, clubDetail.citySlug);
  const mediaItems = buildClubMediaItems({
    slug: clubDetail.slug,
    name: clubDetail.name,
    images: clubImages,
    citySlug: clubDetail.citySlug,
    neighborhood: clubDetail.neighborhood,
    district: clubDetail.district,
    isVerified: clubDetail.isVerified,
    verificationStatus: clubDetail.verificationStatus,
  });
  const primaryImage = getClubPrimaryMediaImage(mediaItems);
  const gatedClub = clubDetail.isVerified ? await getClubDetailsWithAccess(clubDetail.id) : null;
  const hasFullAccess = gatedClub?.accessLevel === 'FULL';

  // Map ClubDetail to Club type expected by ClubProfileContent
  const club: Club = {
    id: clubDetail.id,
    name: clubDetail.name,
    slug: clubDetail.slug,
    isVerified: clubDetail.isVerified,
    verificationStatus: clubDetail.verificationStatus as Club['verificationStatus'],
    listingTier: clubDetail.listingTier as Club['listingTier'],
    district: clubDetail.district || undefined,
    googlePlaceId: clubDetail.googlePlaceId || undefined,
    googleMapsUrl: clubDetail.googleMapsUrl || undefined,
    googleRatingSnapshot: clubDetail.googleRatingSnapshot || undefined,
    googleReviewCountSnapshot: clubDetail.googleReviewCountSnapshot || undefined,
    publicDataReviewedAt: clubDetail.publicDataReviewedAt ? new Date(clubDetail.publicDataReviewedAt) : undefined,
    neighborhood: clubDetail.neighborhood,
    images: clubImages,
    description: clubDetail.description,
    amenities: clubDetail.amenities,
    vibeTags: clubDetail.vibeTags,
    openingHours: clubDetail.openingHours,
    allowsPreRegistration: clubDetail.allowsPreRegistration,
    coordinates: hasFullAccess ? clubDetail.coordinates : undefined,
    address: hasFullAccess ? clubDetail.addressDisplay : undefined,
    contactEmail: hasFullAccess ? gatedClub?.club?.contactEmail || '' : '',
    phoneNumber: hasFullAccess ? gatedClub?.club?.phoneNumber || '' : '',
    website: clubDetail.website || undefined,
    socialMedia: clubDetail.socialMedia || undefined,
    rating: clubDetail.rating || undefined,
    reviewCount: clubDetail.reviewCount || undefined,
    priceRange: clubDetail.priceRange as '$' | '$$' | '$$$',
    capacity: clubDetail.capacity,
    foundedYear: clubDetail.foundedYear,
    cityId: '',
    addressDisplay: hasFullAccess ? clubDetail.addressDisplay : clubDetail.neighborhood,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: club.name,
    description: club.description,
    image: primaryImage,
    address: {
      '@type': 'PostalAddress',
      addressLocality: club.neighborhood,
      addressCountry: 'ES',
    },
    url: toAbsoluteUrl(`/${lang}/clubs/${club.slug}`),
    amenityFeature: club.amenities.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
    })),
    ...(hasFullAccess && club.coordinates
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: club.coordinates.lat,
            longitude: club.coordinates.lng,
          },
        }
      : {}),
    ...(club.isVerified && club.website ? { sameAs: [toAbsoluteHttpUrl(club.website)] } : {}),
    ...(club.isVerified && hasFullAccess && club.phoneNumber ? { telephone: club.phoneNumber } : {}),
    ...(club.isVerified && hasFullAccess && club.contactEmail ? { email: club.contactEmail } : {}),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('nav.home'),
        item: toAbsoluteUrl(`/${lang}`),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('clubs.title'),
        item: toAbsoluteUrl(`/${lang}/clubs`),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: clubDetail.cityName,
        item: toAbsoluteUrl(`/${lang}/spain/${clubDetail.citySlug}`),
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: club.name,
        item: toAbsoluteUrl(`/${lang}/clubs/${club.slug}`),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {club.isVerified ? (
        <ClubProfileContent club={club} mediaItems={mediaItems} />
      ) : (
        <UnverifiedClubProfileContent club={club} mediaItems={mediaItems} lang={lang} />
      )}
    </>
  );
}

