'use client';

import { useState, useEffect, useMemo } from 'react';
import { Club } from '@/lib/types';
import { getClubs, type ClubFilters } from '@/app/actions/clubs';

export const useClubs = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClubs() {
      try {
        // Fetch from server action instead of dummy JSON
        const data = await getClubs({});
        
        // Map ClubCard to Club type for backward compatibility
        const mappedClubs = data.map(card => ({
          id: card.id,
          name: card.name,
          slug: card.slug,
          isVerified: card.isVerified,
          neighborhood: card.neighborhood,
          images: card.images,
          description: card.description,
          amenities: card.amenities,
          vibeTags: card.vibeTags,
          openingHours: {},
          allowsPreRegistration: true,
          coordinates: { lat: 0, lng: 0 },
          address: '',
          contactEmail: '',
          phoneNumber: '',
          rating: card.rating || undefined,
          reviewCount: card.reviewCount || undefined,
          priceRange: card.priceRange as '$' | '$$' | '$$$',
          capacity: card.capacity,
          foundedYear: card.foundedYear,
        }));
        
        setClubs(mappedClubs);
      } catch (error) {
        console.error('Failed to fetch clubs:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchClubs();
  }, []);

  return { clubs, loading };
};

export const useClubFilters = () => {
  const { clubs, loading } = useClubs();
  const [filters, setFilters] = useState<{
    neighborhood: string;
    amenities: string[];
    vibes: string[];
    isVerified: boolean;
    priceRange: string[];
    rating: number;
  }>({
    neighborhood: '',
    amenities: [],
    vibes: [],
    isVerified: false,
    priceRange: [],
    rating: 0
  });

  const filteredClubs = useMemo(() => {
    return clubs.filter(club => {
      // Neighborhood filter
      if (filters.neighborhood && club.neighborhood !== filters.neighborhood) {
        return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          club.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      // Vibes filter
      if (filters.vibes.length > 0) {
        const hasAllVibes = filters.vibes.every(vibe => 
          club.vibeTags.includes(vibe)
        );
        if (!hasAllVibes) return false;
      }

      // Verified filter
      if (filters.isVerified && !club.isVerified) {
        return false;
      }

      // Price range filter
      if (filters.priceRange.length > 0 && !filters.priceRange.includes(club.priceRange)) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && (!club.rating || club.rating < filters.rating)) {
        return false;
      }

      return true;
    });
  }, [clubs, filters]);

  return {
    clubs: filteredClubs,
    filters,
    setFilters,
    loading
  };
};

export const useClubById = (slug: string) => {
  const { clubs, loading } = useClubs();
  const club = clubs.find(c => c.slug === slug);
  
  return { club, loading };
};