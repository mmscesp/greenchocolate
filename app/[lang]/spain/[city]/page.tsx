import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CityPageClient from './CityPageClient';

const COMING_SOON_CITY_SLUGS = new Set(['valencia', 'tenerife']);

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

import { MapPin, 
Building2, 
Shield, 
ArrowRight, 
Star, 
Compass,
BookOpen,
CheckCircle } from '@/lib/icons';

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

export default async function CityPage({ params }: CityPageProps) {
  const { lang, city } = await params;
  const citySlug = city.toLowerCase();

  if (COMING_SOON_CITY_SLUGS.has(citySlug)) {
    notFound();
  }

  return <CityPageClient lang={lang} city={citySlug} />;
}
