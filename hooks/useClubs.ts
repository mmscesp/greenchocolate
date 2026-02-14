'use client';

import { useState, useEffect } from 'react';
import { Club } from '@/lib/types';
import { getClubs, type ClubFilters } from '@/app/actions/clubs';

export const useClubs = (filters?: ClubFilters) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClubs() {
      try {
        // Fetch from server action with filters
        const data = await getClubs(filters);
        
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
          cityId: '',
          addressDisplay: '',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        
        setClubs(mappedClubs);
      } catch (error) {
        console.error('Failed to fetch clubs:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchClubs();
  }, [filters?.neighborhood, filters?.amenities, filters?.vibes, filters?.priceRange, filters?.isVerified]);

  return { clubs, loading };
};

export const useClubFilters = () => {
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

  // Server-side filtering via useClubs
  const { clubs, loading } = useClubs({
    neighborhood: filters.neighborhood || undefined,
    amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
    vibes: filters.vibes.length > 0 ? filters.vibes : undefined,
    priceRange: filters.priceRange.length > 0 ? filters.priceRange : undefined,
    isVerified: filters.isVerified || undefined,
  });

  // Client-side only rating filter (not supported by server)
  const filteredClubs = clubs.filter(club => {
    if (filters.rating > 0 && (!club.rating || club.rating < filters.rating)) {
      return false;
    }
    return true;
  });

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