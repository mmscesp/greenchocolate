export interface Club {
  id: string;
  name: string;
  slug: string;
  isVerified: boolean;
  neighborhood: string;
  images: string[];
  description: string;
  amenities: string[];
  vibeTags: string[];
  openingHours: Record<string, string>;
  allowsPreRegistration: boolean;
  coordinates: { lat: number; lng: number };
  address: string;
  contactEmail: string;
  phoneNumber: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
  };
  rating?: number;
  reviewCount?: number;
  priceRange: '$' | '$$' | '$$$';
  capacity: number;
  foundedYear: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  heroImage: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: string;
  readTime: number;
  tags: string[];
}

export interface MembershipRequest {
  id: string;
  clubId: string;
  userName: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  age: number;
  experience: string;
}

export interface FilterOptions {
  neighborhood: string;
  amenities: string[];
  vibes: string[];
  isVerified: boolean;
  priceRange: string[];
  rating: number;
}