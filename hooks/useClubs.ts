'use client';

import { useState, useEffect, useMemo } from 'react';
import { Club, FilterOptions } from '@/lib/types';
import clubsData from '@/data/dummy-clubs.json';

export const useClubs = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setClubs(clubsData as Club[]);
      setLoading(false);
    }, 500);
  }, []);

  return { clubs, loading };
};

export const useClubFilters = () => {
  const { clubs, loading } = useClubs();
  const [filters, setFilters] = useState<FilterOptions>({
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