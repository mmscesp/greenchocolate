'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, 
Building2, 
Shield, 
ArrowRight, 
Star, 
Users, 
BookOpen, 
Compass,
Cannabis,
CheckCircle } from '@/lib/icons';
import { Heading, H1, H2, H3, H4, Label, Eyebrow, Text, Lead } from '@/components/typography';

interface Club {
  id: string;
  slug: string;
  name: string;
  isVerified: boolean;
  shortDescription: string | null;
  description: string;
  neighborhood: string;
  priceRange: string;
}

interface CityDetail {
  name: string;
  country: string;
  description: string | null;
}

interface CityPageClientProps {
  lang: string;
  city: string;
}

// Mock data for different cities
const cityData: Record<string, CityDetail> = {
  barcelona: {
    name: 'Barcelona',
    country: 'Spain',
    description: 'Experience Barcelona\'s premier cannabis social clubs with verified access and local expertise.',
  },
  madrid: {
    name: 'Madrid',
    country: 'Spain',
    description: 'Discover Madrid\'s growing cannabis culture with exclusive access to the city\'s finest private clubs.',
  },
  valencia: {
    name: 'Valencia',
    country: 'Spain',
    description: 'Explore Valencia\'s vibrant cannabis scene with Mediterranean flair and welcoming club culture.',
  },
  sevilla: {
    name: 'Sevilla',
    country: 'Spain',
    description: 'Join Sevilla\'s intimate cannabis community in the heart of Andalusia.',
  },
  malaga: {
    name: 'Málaga',
    country: 'Spain',
    description: 'Experience Málaga\'s laid-back cannabis culture along the beautiful Costa del Sol.',
  }
};

const clubsData: Record<string, Club[]> = {
  barcelona: [
    { id: '1', slug: 'green-house', name: 'Green House Barcelona', isVerified: true, shortDescription: 'Premium cannabis club', description: 'Premium cannabis club', neighborhood: 'Eixample', priceRange: '$$' },
    { id: '2', slug: 'ocean-club', name: 'Ocean Club', isVerified: true, shortDescription: 'Beachside lounge', description: 'Beachside lounge', neighborhood: 'Barceloneta', priceRange: '$$$' },
    { id: '3', slug: 'mountain-high', name: 'Mountain High', isVerified: true, shortDescription: 'Panoramic views', description: 'Panoramic views', neighborhood: 'Gracia', priceRange: '$$' },
  ],
  madrid: [
    { id: '1', slug: 'malasana-green', name: 'Malasaña Green', isVerified: true, shortDescription: 'Trendy spot', description: 'Trendy spot', neighborhood: 'Malasaña', priceRange: '$$' },
    { id: '2', slug: 'salamanca-spirits', name: 'Salamanca Spirits', isVerified: true, shortDescription: 'Luxury experience', description: 'Luxury experience', neighborhood: 'Salamanca', priceRange: '$$$' },
    { id: '3', slug: 'latina-lounge', name: 'Latina Lounge', isVerified: true, shortDescription: 'Cozy atmosphere', description: 'Cozy atmosphere', neighborhood: 'La Latina', priceRange: '$' },
  ],
  valencia: [
    { id: '1', slug: 'el-carmen-club', name: 'El Carmen Club', isVerified: true, shortDescription: 'Historic venue', description: 'Historic venue', neighborhood: 'El Carmen', priceRange: '$$' },
    { id: '2', slug: 'ruzafa-garden', name: 'Ruzafa Garden', isVerified: true, shortDescription: 'Garden style', description: 'Garden style', neighborhood: 'Ruzafa', priceRange: '$$' },
  ],
  sevilla: [
    { id: '1', slug: 'alameda-spirits', name: 'Alameda Spirits', isVerified: true, shortDescription: 'Andalusian style', description: 'Andalusian style', neighborhood: 'Alameda', priceRange: '$' },
    { id: '2', slug: 'triana-terrace', name: 'Triana Terrace', isVerified: true, shortDescription: 'Riverside views', description: 'Riverside views', neighborhood: 'Triana', priceRange: '$$' },
  ],
  malaga: [
    { id: '1', slug: 'costa-club', name: 'Costa Club Málaga', isVerified: true, shortDescription: 'Beach vibes', description: 'Beach vibes', neighborhood: 'Pedregalejo', priceRange: '$$' },
    { id: '2', slug: 'soho-green', name: 'Soho Green', isVerified: true, shortDescription: 'Art district', description: 'Art district', neighborhood: 'Soho', priceRange: '$$' },
  ],
};

const neighborhoodsData: Record<string, string[]> = {
  barcelona: ['Eixample', 'Barceloneta', 'Gracia', 'Born', 'Gothic'],
  madrid: ['Malasaña', 'Chueca', 'Salamanca', 'La Latina', 'Chamberí'],
  valencia: ['El Carmen', 'Ruzafa', 'Ensanche', 'Malvarrosa', 'Benimaclet'],
  sevilla: ['Alameda', 'Santa Cruz', 'Triana', 'Nervión', 'Macarena'],
  malaga: ['Centro', 'Pedregalejo', 'El Palo', 'Soho', 'La Merced'],
};

export default function CityPageClient({ lang, city }: CityPageClientProps) {
  const citySlug = city.toLowerCase();
  const cityDetail = cityData[citySlug] || cityData.barcelona;
  const cityClubs = clubsData[citySlug] || clubsData.barcelona;
  const neighborhoods = neighborhoodsData[citySlug] || neighborhoodsData.barcelona;
  const featuredClubs = cityClubs.slice(0, 3); 

  return (
    <div className="min-h-screen bg-background relative">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-12 relative">
        {/* Hero Section */}
        <motion.section 
          className="rounded-3xl border bg-card shadow-lg shadow-primary/5 p-8 md:p-12 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
              {cityDetail.country}
            </Badge>
          </div>
          
          <H1 className="mb-6">
            Cannabis Clubs in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/80">
              {cityDetail.name}
            </span>
          </H1>
          
          <Lead className="max-w-3xl mb-8">
            {cityDetail.description || `Verified navigation for ${cityDetail.name}: local etiquette, neighborhoods, and club discovery.`}
          </Lead>
          
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground bg-muted px-4 py-2 rounded-full">
              <Building2 className="h-4 w-4 text-primary" /> 
              <span className="font-bold text-foreground">{cityClubs.length}</span> 
              <span>verified clubs</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted px-4 py-2 rounded-full">
              <Compass className="h-4 w-4 text-primary" /> 
              <span className="font-bold text-foreground">{neighborhoods.length}</span> 
              <span>neighborhoods</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted px-4 py-2 rounded-full">
              <Shield className="h-4 w-4 text-primary" /> 
              <span>Private-association model</span>
            </div>
          </div>
        </motion.section>

        {/* Quick Links Grid - 2 columns for Clubs & Guides */}
        <motion.section 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >

          <Link 
            href={`/${lang}/spain/${city}/clubs`} 
            className="group relative rounded-2xl border bg-card p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Club Directory</h2>
            <Text size="sm" variant="muted">Browse verified clubs with public safety-first previews.</Text>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary rounded-full group-hover:w-1/4 transition-all duration-300" />
          </Link>


          
          <Link 
            href={`/${lang}/spain/${city}/guides`} 
            className="group relative rounded-2xl border bg-card p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Guides</h2>
            <Text size="sm" variant="muted">Read city-specific legal, etiquette, and safety content.</Text>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary rounded-full group-hover:w-1/4 transition-all duration-300" />
          </Link>
        </motion.section>

        {/* Featured Clubs Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Star className="h-5 w-5 text-amber-500" />
              </div>
              <H2>Featured Verified Clubs</H2>
            </div>
            <Button 
              variant="outline" 
              asChild
              className="border-border text-foreground hover:bg-muted hover:text-foreground rounded-xl"
            >
              <Link href={`/${lang}/spain/${city}/clubs`}>View all clubs</Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {featuredClubs.length > 0 ? featuredClubs.map((club, index) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/${lang}/spain/${city}/clubs/${club.slug}`}
                  className="group block rounded-2xl border bg-card p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <H3 className="group-hover:text-primary transition-colors">{club.name}</H3>
                    {club.isVerified && (
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        <CheckCircle className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    )}
                  </div>
                  <Text variant="muted" size="sm" className="mb-4 line-clamp-2">{club.shortDescription || club.description}</Text>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                        <MapPin className="h-3 w-3 inline mr-1 text-primary" />
                        {club.neighborhood}
                      </span>
                      <span className="text-primary font-bold bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                        {club.priceRange}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-primary font-bold group-hover:translate-x-1 transition-transform">
                      Open profile <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )) : (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <Text variant="muted">No verified clubs found for this city yet.</Text>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
