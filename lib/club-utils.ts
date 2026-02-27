import { Club } from '@/lib/types';

export interface ClubCard {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string;
  neighborhood: string;
  cityName: string;
  citySlug: string;
  images: string[];
  logoUrl: string | null;
  rating: number | null;
  reviewCount: number | null;
  priceRange: string;
  amenities: string[];
  vibeTags: string[];
  isVerified: boolean;
  capacity: number;
  foundedYear: number;
  // Extended fields for full club data
  addressDisplay?: string;
  contactEmail?: string;
  phoneNumber?: string;
  website?: string;
  socialMedia?: Record<string, string> | null;
  openingHours?: Record<string, string>;
}

/**
 * Convert ClubCard to Club for backward compatibility
 */
export function clubCardToClub(card: ClubCard): Club {
  return {
    id: card.id,
    name: card.name,
    slug: card.slug,
    description: card.description,
    shortDescription: card.shortDescription ?? undefined,
    cityId: '',
    neighborhood: card.neighborhood,
    addressDisplay: card.addressDisplay ?? '',
    address: '',
    coordinates: { lat: 0, lng: 0 },
    contactEmail: card.contactEmail ?? '',
    phoneNumber: card.phoneNumber ?? undefined,
    website: card.website ?? undefined,
    socialMedia: card.socialMedia ?? null,
    isVerified: card.isVerified,
    isActive: true,
    allowsPreRegistration: true,
    openingHours: card.openingHours ?? {},
    amenities: card.amenities,
    vibeTags: card.vibeTags,
    priceRange: card.priceRange as '$' | '$$' | '$$$',
    capacity: card.capacity,
    foundedYear: card.foundedYear,
    images: card.images,
    logoUrl: card.logoUrl ?? undefined,
    coverImageUrl: undefined,
    metaTitle: undefined,
    metaDescription: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    rating: card.rating ?? undefined,
    reviewCount: card.reviewCount ?? undefined,
  };
}

/**
 * Check if club has complete data
 */
export function isClubComplete(club: Club | ClubCard): boolean {
  const hasBasicInfo = !!(club.name && club.slug && club.description);
  const hasLocation = !!club.neighborhood;
  const hasImages = club.images && club.images.length > 0;
  const hasContact = !!(club.contactEmail || (club as Club).addressDisplay);
  
  return hasBasicInfo && hasLocation && hasImages && hasContact;
}

/**
 * Get club status based on verification and activity
 */
export function getClubStatus(club: Club | ClubCard): 'active' | 'pending' | 'inactive' {
  if (!(club as Club).isActive) {
    return 'inactive';
  }
  if (!(club).isVerified) {
    return 'pending';
  }
  return 'active';
}

/**
 * Format club price range for display
 */
export function formatPriceRange(priceRange: string): string {
  const priceMap: Record<string, string> = {
    '$': 'Budget Friendly',
    '$$': 'Moderate',
    '$$$': 'Premium',
  };
  return priceMap[priceRange] || priceRange;
}

/**
 * Calculate club completion percentage
 */
export function getClubCompletion(club: Partial<Club>): number {
  const fields = [
    club.name,
    club.description,
    club.shortDescription,
    club.neighborhood,
    club.addressDisplay,
    club.contactEmail,
    club.phoneNumber,
    club.website,
    club.logoUrl,
    club.coverImageUrl,
    club.images?.length,
    club.amenities?.length,
    club.vibeTags?.length,
  ];

  const filledFields = fields.filter(Boolean).length;
  return Math.round((filledFields / fields.length) * 100);
}
