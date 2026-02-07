import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ClubProfileContent from './ClubProfileContent';
import { getClubBySlug, getCityNeighbors, getClubs } from '@/app/actions/clubs';
import { JsonLd } from '@/components/JsonLd';
import { Club } from '@/lib/types';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

interface ClubPageProps {
  params: {
    slug: string;
  };
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
  const clubDetail = await getClubBySlug(params.slug);
  
  if (!clubDetail) {
    return {
      title: 'Club Not Found | SocialClubsMaps',
      description: 'The requested club could not be found.',
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
      canonical: `https://socialclubsmaps.com/clubs/${clubDetail.slug}`,
    },
  };
}

export default async function ClubPage({ params }: ClubPageProps) {
  const clubDetail = await getClubBySlug(params.slug);

  if (!clubDetail) {
    notFound();
  }

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
    address: clubDetail.addressDisplay,
    contactEmail: clubDetail.contactEmail,
    phoneNumber: clubDetail.phoneNumber || '',
    website: clubDetail.website || undefined,
    socialMedia: clubDetail.socialMedia || undefined,
    rating: clubDetail.rating || undefined,
    reviewCount: clubDetail.reviewCount || undefined,
    priceRange: clubDetail.priceRange as '$' | '$$' | '$$$',
    capacity: clubDetail.capacity,
    foundedYear: clubDetail.foundedYear,
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
        name: 'Home',
        item: 'https://socialclubsmaps.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Clubs',
        item: 'https://socialclubsmaps.com/clubs',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: clubDetail.cityName,
        item: `https://socialclubsmaps.com/clubs?city=${clubDetail.citySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: club.name,
        item: `https://socialclubsmaps.com/clubs/${club.slug}`,
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
