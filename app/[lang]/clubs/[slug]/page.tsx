import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ClubProfileContent from './ClubProfileContent';
import { getClubBySlug, getCityNeighbors, getClubs } from '@/app/actions/clubs';
import { getClubDetailsWithAccess } from '@/app/actions/gated-content';
import { JsonLd } from '@/components/JsonLd';
import { Club } from '@/lib/types';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

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
    const clubs = await getClubs({ isVerified: true });
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
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const clubDetail = await getClubBySlug(slug);
  
  if (!clubDetail) {
    return {
      title: `${t('clubs.detail.not_found_title')} | SocialClubsMaps`,
      description: t('clubs.detail.not_found_description'),
    };
  }

  return {
    title: `${clubDetail.name} | ${clubDetail.neighborhood}`,
    description: clubDetail.shortDescription || `Discover ${clubDetail.name} in ${clubDetail.neighborhood}`,
    openGraph: {
      title: clubDetail.name,
      description: clubDetail.shortDescription || '',
      images: clubDetail.images.length > 0 ? [clubDetail.images[0]] : [],
      type: 'website',
    },
    alternates: {
      canonical: `https://socialclubsmaps.com/${lang}/clubs/${clubDetail.slug}`,
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

  const gatedClub = await getClubDetailsWithAccess(clubDetail.id);

  const neighboringClubs = await getCityNeighbors(clubDetail.id, 4);

  // Map ClubDetail to Club type expected by ClubProfileContent
  const club: Club = {
    id: clubDetail.id,
    name: clubDetail.name,
    slug: clubDetail.slug,
    isVerified: clubDetail.isVerified,
    neighborhood: clubDetail.neighborhood,
    images: clubDetail.images,
    description: clubDetail.description,
    amenities: clubDetail.amenities,
    vibeTags: clubDetail.vibeTags,
    openingHours: clubDetail.openingHours,
    allowsPreRegistration: true, // Default value
    coordinates: clubDetail.coordinates,
    address: gatedClub.accessLevel === 'FULL' ? clubDetail.addressDisplay : undefined,
    contactEmail: gatedClub.club?.contactEmail || '',
    phoneNumber: gatedClub.club?.phoneNumber || '',
    website: clubDetail.website || undefined,
    socialMedia: clubDetail.socialMedia || undefined,
    rating: clubDetail.rating || undefined,
    reviewCount: clubDetail.reviewCount || undefined,
    priceRange: clubDetail.priceRange as '$' | '$$' | '$$$',
    capacity: clubDetail.capacity,
    foundedYear: clubDetail.foundedYear,
    cityId: '', // Default value - not used in UI
    addressDisplay: clubDetail.addressDisplay,
    isActive: true, // Default value
    createdAt: new Date(), // Default value
    updatedAt: new Date(), // Default value
  };

  // LocalBusiness Schema.org structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: club.name,
    description: club.description,
    image: club.images[0],
    address: {
      '@type': 'PostalAddress',
      addressLocality: club.neighborhood,
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: club.coordinates.lat,
      longitude: club.coordinates.lng,
    },
    priceRange: club.priceRange,
    telephone: club.phoneNumber,
    url: club.website,
    email: club.contactEmail,
    amenityFeature: club.amenities.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('nav.home'),
        item: `https://socialclubsmaps.com/${lang}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('clubs.title'),
        item: `https://socialclubsmaps.com/${lang}/clubs`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: clubDetail.cityName,
        item: `https://socialclubsmaps.com/${lang}/clubs?city=${clubDetail.citySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: club.name,
        item: `https://socialclubsmaps.com/${lang}/clubs/${club.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <ClubProfileContent club={club} />
    </>
  );
}
