'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import { i18n } from '@/lib/i18n-config';

export async function generateMetadata({ params }: { params: Promise<{ lang: string; city: string }> }): Promise<Metadata> {
  const { lang, city } = await params;
  const citySlug = city.toLowerCase();

  const cityNames: Record<string, Record<string, string>> = {
    barcelona: { es: 'Barcelona', en: 'Barcelona', fr: 'Barcelone', de: 'Barcelona', it: 'Barcellona', pl: 'Barcelona', ru: 'Барселона', pt: 'Barcelona' },
    madrid: { es: 'Madrid', en: 'Madrid', fr: 'Madrid', de: 'Madrid', it: 'Madrid', pl: 'Madryt', ru: 'Мадрид', pt: 'Madrid' },
    valencia: { es: 'Valencia', en: 'Valencia', fr: 'Valence', de: 'Valencia', it: 'Valencia', pl: 'Walencja', ru: 'Валенсия', pt: 'Valência' },
    sevilla: { es: 'Sevilla', en: 'Seville', fr: 'Séville', de: 'Sevilla', it: 'Siviglia', pl: 'Sewilla', ru: 'Севилья', pt: 'Sevilha' },
    malaga: { es: 'Málaga', en: 'Málaga', fr: 'Málaga', de: 'Málaga', it: 'Malaga', pl: 'Malaga', ru: 'Малага', pt: 'Málaga' },
  };

  const cityName = cityNames[citySlug]?.[lang] || cityNames[citySlug]?.en || citySlug;

  const titles: Record<string, string> = {
    es: `Cannabis Social Clubs en ${cityName} | Directorio Verificado | SocialClubsMaps`,
    en: `Cannabis Social Clubs in ${cityName} | Verified Directory | SocialClubsMaps`,
    fr: `Clubs Sociaux Cannabis à ${cityName} | Annuaire Vérifié | SocialClubsMaps`,
    de: `Cannabis Social Clubs in ${cityName} | Verifiziertes Verzeichnis | SocialClubsMaps`,
    it: `Club Sociali Cannabis a ${cityName} | Directory Verificato | SocialClubsMaps`,
    pl: `Społecznościowe Kluby Konopi w ${cityName} | Zweryfikowany Katalog | SocialClubsMaps`,
    ru: `Социальные Клубы Конопли в ${cityName} | Проверенный Каталог | SocialClubsMaps`,
    pt: `Clubes Sociais de Cânhamo em ${cityName} | Diretório Verificado | SocialClubsMaps`,
  };

  const descriptions: Record<string, string> = {
    es: `Explora cannabis social clubs en ${cityName}. Directorio verificado con clubes verificados, vecindarios y guías locales. Pre-regístrate para membresía.`,
    en: `Explore cannabis social clubs in ${cityName}. Verified directory with verified clubs, neighborhoods, and local guides. Pre-register for membership.`,
    fr: `Explorez les clubs sociaux cannabis à ${cityName}. Annuaire vérifié avec clubs, quartiers et guides locaux. Pré-inscription au membership.`,
    de: `Erkunden Sie Cannabis-Social-Clubs in ${cityName}. Verifiziertes Verzeichnis mit Clubs, Vierteln und lokalen Leitfäden. Vorregistrierung für Mitgliedschaft.`,
    it: `Esplora club sociali cannabis a ${cityName}. Directory verificato con club, quartieri e guide locali. Pre-registrazione per membership.`,
    pl: `Odkryj społecznościowe kluby konopi w ${cityName}. Zweryfikowany katalog z klubami, dzielnicami i lokalnymi przewodnikami. Przedrejestracja do członkostwa.`,
    ru: `Изучите социальные клубы конопли в ${cityName}. Проверенный каталог с клубами, районами и местными гидами. Предварительная регистрация для членства.`,
    pt: `Explore clubes sociais de cânhamo em ${cityName}. Diretório verificado com clubes, bairros e guias locais. Pré-cadastro para inúmera.`,
  };

  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    keywords: [`cannabis social clubs ${cityName}`, `${cityName} cannabis clubs`, 'cannabis Spain', 'marijuana clubs', 'cannabis directory'],
    openGraph: {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      type: 'website',
      locale: lang === 'es' ? 'es_ES' : lang === 'en' ? 'en_US' : `${lang}_${lang.toUpperCase()}`,
      url: `https://socialclubsmaps.com/${lang}/spain/${citySlug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
    },
    alternates: {
      canonical: `https://socialclubsmaps.com/${lang}/spain/${citySlug}`,
    },
  };
}

import { 
  MapPin, 
  Building2, 
  Shield, 
  ArrowRight, 
  Star, 
  Compass,
  BookOpen,
  CheckCircle
} from 'lucide-react';

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
  neighborhoods: string[];
}

// Mock data for different cities
const cityData: Record<string, CityDetail> = {
  barcelona: {
    name: 'Barcelona',
    country: 'Spain',
    description: 'Experience Barcelona\'s premier cannabis social clubs with verified access and local expertise.',
    neighborhoods: ['Eixample', 'Barceloneta', 'Gracia', 'Born', 'Gothic']
  },
  madrid: {
    name: 'Madrid',
    country: 'Spain',
    description: 'Discover Madrid\'s growing cannabis culture with exclusive access to the city\'s finest private clubs.',
    neighborhoods: ['Malasaña', 'Chueca', 'Salamanca', 'La Latina', 'Chamberí']
  },
  valencia: {
    name: 'Valencia',
    country: 'Spain',
    description: 'Explore Valencia\'s vibrant cannabis scene with Mediterranean flair and welcoming club culture.',
    neighborhoods: ['El Carmen', 'Ruzafa', 'Ensanche', 'Malvarrosa', 'Benimaclet']
  },
  sevilla: {
    name: 'Sevilla',
    country: 'Spain',
    description: 'Join Sevilla\'s intimate cannabis community in the heart of Andalusia.',
    neighborhoods: ['Alameda', 'Santa Cruz', 'Triana', 'Nervión', 'Macarena']
  },
  malaga: {
    name: 'Málaga',
    country: 'Spain',
    description: 'Experience Málaga\'s laid-back cannabis culture along the beautiful Costa del Sol.',
    neighborhoods: ['Centro', 'Pedregalejo', 'El Palo', 'Soho', 'La Merced']
  }
};

const clubsData: Record<string, Club[]> = {
  barcelona: [
    {
      id: '1',
      slug: 'green-house',
      name: 'Green House Barcelona',
      isVerified: true,
      shortDescription: 'Premium cannabis club in the heart of Barcelona with exclusive strains.',
      description: 'Premium cannabis club in the heart of Barcelona with exclusive strains and top-tier amenities.',
      neighborhood: 'Eixample',
      priceRange: '$$'
    },
    {
      id: '2',
      slug: 'ocean-club',
      name: 'Ocean Club',
      isVerified: true,
      shortDescription: 'Beachside cannabis lounge with stunning Mediterranean views.',
      description: 'Beachside cannabis lounge with stunning Mediterranean views and relaxed atmosphere.',
      neighborhood: 'Barceloneta',
      priceRange: '$$$'
    },
    {
      id: '3',
      slug: 'mountain-high',
      name: 'Mountain High',
      isVerified: true,
      shortDescription: 'Elevated cannabis experience with panoramic city views.',
      description: 'Elevated cannabis experience with panoramic city views and premium selection.',
      neighborhood: 'Gracia',
      priceRange: '$$'
    }
  ],
  madrid: [
    {
      id: '1',
      slug: 'malasana-green',
      name: 'Malasaña Green',
      isVerified: true,
      shortDescription: 'Trendy cannabis club in Madrid\'s most vibrant neighborhood.',
      description: 'Trendy cannabis club in Madrid\'s most vibrant neighborhood with urban style and premium selection.',
      neighborhood: 'Malasaña',
      priceRange: '$$'
    },
    {
      id: '2',
      slug: 'salamanca-spirits',
      name: 'Salamanca Spirits',
      isVerified: true,
      shortDescription: 'Luxury cannabis club in Madrid\'s upscale Salamanca district.',
      description: 'Luxury cannabis club in Madrid\'s upscale Salamanca district with refined atmosphere.',
      neighborhood: 'Salamanca',
      priceRange: '$$$'
    },
    {
      id: '3',
      slug: 'latina-lounge',
      name: 'Latina Lounge',
      isVerified: true,
      shortDescription: 'Cozy cannabis club with traditional Madrid charm.',
      description: 'Cozy cannabis club with traditional Madrid charm and welcoming community.',
      neighborhood: 'La Latina',
      priceRange: '$'
    }
  ],
  valencia: [
    {
      id: '1',
      slug: 'el-carmen-club',
      name: 'El Carmen Club',
      isVerified: true,
      shortDescription: 'Historic cannabis club in Valencia\'s old town.',
      description: 'Historic cannabis club in Valencia\'s old town with artistic vibes.',
      neighborhood: 'El Carmen',
      priceRange: '$$'
    },
    {
      id: '2',
      slug: 'ruzafa-garden',
      name: 'Ruzafa Garden',
      isVerified: true,
      shortDescription: 'Garden-style cannabis club with Mediterranean flair.',
      description: 'Garden-style cannabis club with Mediterranean flair and relaxed terrace.',
      neighborhood: 'Ruzafa',
      priceRange: '$$'
    }
  ],
  sevilla: [
    {
      id: '1',
      slug: 'alameda-spirits',
      name: 'Alameda Spirits',
      isVerified: true,
      shortDescription: 'Andalusian-style cannabis club with local character.',
      description: 'Andalusian-style cannabis club with local character and warm hospitality.',
      neighborhood: 'Alameda',
      priceRange: '$'
    },
    {
      id: '2',
      slug: 'triana-terrace',
      name: 'Triana Terrace',
      isVerified: true,
      shortDescription: 'Riverside cannabis club with traditional Sevillan charm.',
      description: 'Riverside cannabis club with traditional Sevillan charm and river views.',
      neighborhood: 'Triana',
      priceRange: '$$'
    }
  ],
  malaga: [
    {
      id: '1',
      slug: 'costa-club',
      name: 'Costa Club Málaga',
      isVerified: true,
      shortDescription: 'Beach-inspired cannabis club on the Costa del Sol.',
      description: 'Beach-inspired cannabis club on the Costa del Sol with sunny vibes.',
      neighborhood: 'Pedregalejo',
      priceRange: '$$'
    },
    {
      id: '2',
      slug: 'soho-green',
      name: 'Soho Green',
      isVerified: true,
      shortDescription: 'Art district cannabis club with creative atmosphere.',
      description: 'Art district cannabis club with creative atmosphere and contemporary design.',
      neighborhood: 'Soho',
      priceRange: '$$'
    }
  ]
};

interface CityPageProps {
  params: Promise<{ lang: string; city: string }>;
}

export default function CityPage({ params }: CityPageProps) {
  const [lang, setLang] = useState('en');
  const [citySlug, setCitySlug] = useState('barcelona');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    params.then(({ lang: resolvedLang, city: resolvedCity }) => {
      setLang(resolvedLang);
      setCitySlug(resolvedCity.toLowerCase());
      setIsLoading(false);
    });
  }, [params]);

  const cityDetail = cityData[citySlug] || cityData.barcelona;
  const cityClubs = clubsData[citySlug] || clubsData.barcelona;
  const neighborhoods = cityDetail.neighborhoods;
  const featuredClubs = cityClubs.slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-64 bg-white/5 rounded-3xl mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-white/5 rounded-2xl" />
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white/5 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-green-500/5 to-transparent" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Hero Section */}
        <motion.section 
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:p-12 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
              <MapPin className="h-5 w-5 text-green-400" />
            </div>
            <Badge variant="outline" className="border-white/20 text-zinc-400 bg-white/5">
              {cityDetail.country}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            Cannabis Clubs in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-500">
              {cityDetail.name}
            </span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl mb-8 leading-relaxed">
            {cityDetail.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-zinc-400 bg-white/5 px-4 py-2 rounded-full">
              <Building2 className="h-4 w-4 text-green-400" /> 
              <span className="font-bold text-white">{cityClubs.length}</span> 
              <span>verified clubs</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 bg-white/5 px-4 py-2 rounded-full">
              <Compass className="h-4 w-4 text-blue-400" /> 
              <span className="font-bold text-white">{neighborhoods.length}</span> 
              <span>neighborhoods</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 bg-white/5 px-4 py-2 rounded-full">
              <Shield className="h-4 w-4 text-purple-400" /> 
              <span>Private-association model</span>
            </div>
          </div>
        </motion.section>

        {/* Quick Links Grid */}
        <motion.section 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link 
            href={`/${lang}/spain/${citySlug}/clubs`} 
            className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-green-500/30 hover:bg-white/[0.07] transition-all duration-500 overflow-hidden"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/0 to-emerald-500/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10" />
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="h-6 w-6 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Club Directory</h2>
            <p className="text-sm text-zinc-400">Browse verified clubs with public safety-first previews.</p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full group-hover:w-1/4 transition-all duration-500" />
          </Link>
          
          <Link 
            href={`/${lang}/spain/${citySlug}/neighborhoods`} 
            className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-blue-500/30 hover:bg-white/[0.07] transition-all duration-500 overflow-hidden"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/0 to-indigo-500/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10" />
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Compass className="h-6 w-6 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Neighborhoods</h2>
            <p className="text-sm text-zinc-400">Compare local zones by activity and available club coverage.</p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full group-hover:w-1/4 transition-all duration-500" />
          </Link>
          
          <Link 
            href={`/${lang}/spain/${citySlug}/guides`} 
            className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all duration-500 overflow-hidden"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/0 to-violet-500/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10" />
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="h-6 w-6 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Guides</h2>
            <p className="text-sm text-zinc-400">Read city-specific legal, etiquette, and safety content.</p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full group-hover:w-1/4 transition-all duration-500" />
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
                <Star className="h-5 w-5 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Featured Verified Clubs</h2>
            </div>
            <Button 
              variant="outline" 
              asChild
              className="border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white rounded-xl"
            >
              <Link href={`/${lang}/spain/${citySlug}/clubs`}>View all clubs</Link>
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
                  href={`/${lang}/spain/${citySlug}/clubs/${club.slug}`}
                  className="group block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-green-500/30 hover:bg-white/[0.07] transition-all duration-500"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="font-bold text-xl text-white group-hover:text-green-400 transition-colors">{club.name}</h3>
                    {club.isVerified && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{club.shortDescription || club.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-zinc-400 bg-white/5 px-3 py-1.5 rounded-full">
                        <MapPin className="h-3 w-3 inline mr-1 text-green-400" />
                        {club.neighborhood}
                      </span>
                      <span className="text-green-400 font-bold bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                        {club.priceRange}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-green-400 font-bold group-hover:translate-x-1 transition-transform">
                      Open profile <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )) : (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-zinc-500" />
                </div>
                <p className="text-zinc-400">No verified clubs found for this city yet.</p>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
