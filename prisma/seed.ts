// Seed Script for MVP Launch
// Populates database with cities, clubs, and articles

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { prisma } from '../lib/prisma';

// ==========================================
// CITIES SEED DATA
// ==========================================

const cities = [
  {
    name: 'Madrid',
    slug: 'madrid',
    country: 'Spain',
    region: 'Community of Madrid',
    description: 'Discover the best cannabis social clubs in Madrid. From Malasaña to Chueca, find your community in Spain\'s vibrant capital.',
    metaTitle: 'Cannabis Social Clubs in Madrid | Madrid Directory',
    metaDescription: 'Find verified cannabis social clubs in Madrid. Browse Malasaña, Chueca, La Latina and more neighborhoods.',
    latitude: 40.4168,
    longitude: -3.7038,
  },
  {
    name: 'Barcelona',
    slug: 'barcelona',
    country: 'Spain',
    region: 'Catalonia',
    description: 'Explore the cannabis social club scene in Barcelona. From Gothic Quarter to Eixample, find your perfect club.',
    metaTitle: 'Cannabis Social Clubs in Barcelona | Barcelona Directory',
    metaDescription: 'Find verified cannabis social clubs in Barcelona. Browse top neighborhoods and discover your community.',
    latitude: 41.3851,
    longitude: 2.1734,
  },
];

// ==========================================
// CLUBS SEED DATA (Madrid)
// ==========================================

const madridClubs = [
  {
    name: 'Green Harmony Madrid',
    slug: 'green-harmony-madrid',
    description: 'Un espacio acogedor en el corazón de Malasaña donde la comunidad cannabis se reúne para compartir experiencias, conocimiento y momentos de relajación. Nuestro ambiente combina lo tradicional con lo moderno.',
    shortDescription: 'Cozy community space in Malasaña',
    cityName: 'Madrid',
    neighborhood: 'Malasaña',
    addressDisplay: 'Calle del Espíritu Santo, 15, Malasaña, Madrid',
    coordinates: { lat: 40.4245, lng: -3.7038 },
    contactEmail: 'info@greenharmony.es',
    phoneNumber: '+34 91 123 4567',
    website: 'www.greenharmony.es',
    socialMedia: {
      instagram: '@greenharmonymadrid',
      facebook: 'greenharmonymadrid',
    },
    isVerified: true,
    isActive: true,
    allowsPreRegistration: true,
    openingHours: {
      monday: '16:00 - 00:00',
      tuesday: '16:00 - 00:00',
      wednesday: '16:00 - 00:00',
      thursday: '16:00 - 02:00',
      friday: '16:00 - 02:00',
      saturday: '14:00 - 02:00',
      sunday: '14:00 - 00:00',
    },
    amenities: ['WiFi Gratis', 'Zona Chill Out', 'Juegos de Mesa', 'Música en Vivo', 'Snacks', 'Bebidas'],
    vibeTags: ['Relajado', 'Social', 'Creativo'],
    priceRange: '$$',
    capacity: 85,
    foundedYear: 2019,
    images: [
      'https://images.pexels.com/photos/4113892/pexels-photo-4113892.jpeg',
      'https://images.pexels.com/photos/7492875/pexels-photo-7492875.jpeg',
      'https://images.pexels.com/photos/6231900/pexels-photo-6231900.jpeg',
    ],
    rating: 4.8,
    reviewCount: 142,
  },
  {
    name: 'Cannabis Culture Centro',
    slug: 'cannabis-culture-centro',
    description: 'Ubicado en el centro histórico de Madrid, somos pioneros en educación cannábica y cultura responsable. Un espacio elegante que combina tradición y vanguardia.',
    shortDescription: 'Pioneers in cannabis education in Madrid Centro',
    cityName: 'Madrid',
    neighborhood: 'Centro',
    addressDisplay: 'Plaza Mayor, 8, Centro, Madrid',
    coordinates: { lat: 40.4168, lng: -3.7038 },
    contactEmail: 'hola@cannabisculture.es',
    phoneNumber: '+34 91 234 5678',
    socialMedia: {
      instagram: '@cannabisculturecentro',
    },
    isVerified: true,
    isActive: true,
    allowsPreRegistration: true,
    openingHours: {
      monday: '15:00 - 23:00',
      tuesday: '15:00 - 23:00',
      wednesday: '15:00 - 23:00',
      thursday: '15:00 - 01:00',
      friday: '15:00 - 01:00',
      saturday: '13:00 - 01:00',
      sunday: '13:00 - 23:00',
    },
    amenities: ['WiFi Gratis', 'Biblioteca Cannabis', 'Talleres', 'Arte Local', 'Terraza', 'Eventos Privados'],
    vibeTags: ['Educativo', 'Cultural', 'Íntimo'],
    priceRange: '$$$',
    capacity: 120,
    foundedYear: 2017,
    images: [
      'https://images.pexels.com/photos/6231900/pexels-photo-6231900.jpeg',
      'https://images.pexels.com/photos/4113892/pexels-photo-4113892.jpeg',
      'https://images.pexels.com/photos/7492875/pexels-photo-7492875.jpeg',
    ],
    rating: 4.9,
    reviewCount: 203,
  },
  {
    name: 'Chill Zone Chueca',
    slug: 'chill-zone-chueca',
    description: 'El lugar perfecto para relajarse en Chueca. Ambiente distendido, música ambient y una comunidad diversa que valora la inclusión y el respeto mutuo.',
    shortDescription: 'Relaxed atmosphere in diverse Chueca',
    cityName: 'Madrid',
    neighborhood: 'Chueca',
    addressDisplay: 'Calle de Hortaleza, 32, Chueca, Madrid',
    coordinates: { lat: 40.4215, lng: -3.6960 },
    contactEmail: 'info@chillzonechueca.com',
    phoneNumber: '+34 91 345 6789',
    isVerified: true,
    isActive: true,
    allowsPreRegistration: true,
    openingHours: {
      monday: '17:00 - 00:00',
      tuesday: '17:00 - 00:00',
      wednesday: '17:00 - 00:00',
      thursday: '17:00 - 01:00',
      friday: '17:00 - 02:00',
      saturday: '15:00 - 02:00',
      sunday: '15:00 - 00:00',
    },
    amenities: ['Zona Chill Out', 'Playstation', 'Snacks', 'Bebidas', 'WiFi Gratis'],
    vibeTags: ['Relajado', 'Inclusivo', 'Alternativo'],
    priceRange: '$',
    capacity: 60,
    foundedYear: 2020,
    images: [
      'https://images.pexels.com/photos/7492875/pexels-photo-7492875.jpeg',
      'https://images.pexels.com/photos/4113892/pexels-photo-4113892.jpeg',
    ],
    rating: 4.5,
    reviewCount: 89,
  },
];

// ==========================================
// ARTICLES SEED DATA
// ==========================================

const articles = [
  {
    title: 'Guía Completa de Cannabis Medicinal en España 2026',
    slug: 'guia-cannabis-medicinal-espana-2026',
    excerpt: 'Todo lo que necesitas saber sobre el acceso legal al cannabis medicinal en España, desde la prescripción hasta los productos disponibles.',
    content: `# Cannabis Medicinal en España: Guía Completa 2026

El cannabis medicinal en España ha experimentado importantes avances legislativos en los últimos años. Los clubs sociales operan en un marco legal específico que permite el consumo compartido en espacios privados.

## Marco Legal Actual

En España, el cannabis medicinal está regulado por la Agencia Española de Medicamentos y Productos Sanitarios. Los pacientes pueden acceder a tratamientos con cannabis a través de:

1. **Prescripción médica**: Solo ciertos especialistas pueden prescribir cannabis medicinal
2. **Farmacias autorizadas**: Dispensación con receta oficial
3. **Centros especializados**: Bajo supervisión médica adecuada

## Productos Disponibles

Los productos de cannabis medicinal disponibles en España incluyen:
- Extractos estandarizados
- Formulations farmacéuticas
- Aceites de CBD
- Preparaciones magistrales

## Consideraciones Importantes

Es fundamental consultar con profesionales de la salud antes de iniciar cualquier tratamiento con cannabis.`,
    category: 'Salud & Bienestar',
    tags: ['cannabis medicinal', 'legislación', 'salud', 'España'],
    heroImage: 'https://images.pexels.com/photos/7492875/pexels-photo-7492875.jpeg',
    heroImageAlt: 'Cannabis medicinal en España',
    authorName: 'Dr. María González',
    authorBio: 'Médico especializada en tratamientos con cannabis. Experta en legislación sanitaria española.',
    isPublished: true,
    publishedAt: new Date('2026-01-15'),
    featuredOrder: 1,
    readTime: 8,
    citySlug: 'madrid',
  },
  {
    title: 'Los Mejores Eventos Cannabis de Madrid en 2026',
    slug: 'mejores-eventos-cannabis-madrid-2026',
    excerpt: 'Descubre los eventos más importantes de la cultura cannabis en Madrid este año, desde conferencias hasta festivales.',
    content: `# Eventos Cannabis en Madrid 2026

Madrid se consolida como epicentro de la cultura cannabis en España con una agenda repleta de eventos para todos los intereses.

## Eventos Destacados

### 1. Madrid Cannabis Week
La semana del cannabis más esperada del año incluye:
- Ferias de productos
- Conferencias educativas
- Eventos sociales
- Workshops de cultivadores

### 2. Ferias del Cannabis
Encuentra los mejores productos y conoce a los expertos del sector.

### 3. Eventos Culturales
Exposiciones, arte y música inspirada en la cultura cannabis.

## Calendario 2026

Mantente actualizado con nuestro calendario de eventos para no perderte ninguna actividad.`,
    category: 'Eventos',
    tags: ['eventos', 'Madrid', 'cultura cannabis', 'festivales'],
    heroImage: 'https://images.pexels.com/photos/4113892/pexels-photo-4113892.jpeg',
    heroImageAlt: 'Eventos de cannabis en Madrid',
    authorName: 'Carlos Ruiz',
    authorBio: 'Periodista especializado en cultura cannabis y eventos.',
    isPublished: true,
    publishedAt: new Date('2026-01-12'),
    featuredOrder: 2,
    readTime: 6,
    citySlug: 'madrid',
  },
  {
    title: 'Cómo Elegir tu Primer Club Social de Cannabis',
    slug: 'como-elegir-primer-club-cannabis',
    excerpt: 'Consejos esenciales para nuevos miembros: qué buscar, qué preguntar y cómo tomar la mejor decisión.',
    content: `# Guía para Elegir tu Primer Club de Cannabis

Elegir tu primer club social de cannabis puede parecer abrumador, pero con la información correcta, tomarás la mejor decisión.

## Qué Buscar en un Club

### 1. Legalidad y Transparencia
- Verifica que esté registrado legalmente
- Revisa sus políticas claras
- Comprueba las medidas de seguridad

### 2. Comunidad y Ambiente
- Observa el ambiente general
- Conoce a los miembros actuales
- Evalúa la inclusividad

### 3. Instalaciones y Servicios
- Calidad de los productos
- Horarios convenientes
- Actividades y eventos

## Preguntas Clave

Antes de unirte, considera:
- ¿El club tiene buena reputación?
- ¿Los precios son transparentes?
- ¿Hay actividades de tu interés?

## Tu Primera Visita

Recomendamos visitar varios clubs antes de decidirte. Muchos ofrecen días de puertas abiertas para nuevos interesados.`,
    category: 'Educación',
    tags: ['principiantes', 'clubs sociales', 'consejos', 'educación'],
    heroImage: 'https://images.pexels.com/photos/6231900/pexels-photo-6231900.jpeg',
    heroImageAlt: 'Elegir club de cannabis',
    authorName: 'Ana López',
    authorBio: 'Experta en regulación de clubs sociales con 10 años de experiencia.',
    isPublished: true,
    publishedAt: new Date('2026-01-10'),
    featuredOrder: 3,
    readTime: 5,
    citySlug: null,
  },
  {
    title: 'Variedades de Cannabis: Sativa vs Indica vs Híbridos',
    slug: 'variedades-cannabis-sativa-indica-hibridos',
    excerpt: 'Comprende las diferencias entre las principales variedades de cannabis y sus efectos para decisiones informadas.',
    content: `# Variedades de Cannabis: Guía Completa

La clasificación del cannabis en sativa, indica e híbridos es fundamental para entender los efectos de cada variedad.

## Cannabis Sativa

**Origen:** Regiones tropicales y ecuatoriales
**Características:** Plantas altas, hojas largas y estrechas
**Efectos:** 
- Energizante
- Creatividad estimulada
- Mejora del estado de ánimo
- Ideal para uso diurno

## Cannabis Indica

**Origen:** Regiones montañosas de Asia Central
**Características:** Plantas compactas, hojas anchas
**Efectos:**
- Relajante
- Sedante suave
- Alivio del estrés
- Ideal para uso nocturno

## Híbridos

Combinaciones deliberadas de sativa e indica:
- Indica-dominantes: Relajación con euforia
- Sativa-dominantes: Energía con calma
- Equilibrados: Efectos intermedios

## Cómo Elegir

Considera:
- Tu tolerancia
- El momento del día
- Los efectos deseados
- Tu experiencia previa`,
    category: 'Educación',
    tags: ['variedades', 'sativa', 'indica', 'educación', 'efectos'],
    heroImage: 'https://images.pexels.com/photos/7492875/pexels-photo-7492875.jpeg',
    heroImageAlt: 'Variedades de cannabis',
    authorName: 'Jorge Mendez',
    authorBio: 'Cultivador experto y educador cannábico con 15 años de experiencia.',
    isPublished: true,
    publishedAt: new Date('2026-01-08'),
    featuredOrder: 0,
    readTime: 7,
    citySlug: null,
  },
];

// ==========================================
// MAIN SEED FUNCTION
// ==========================================

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data (in reverse order of dependencies)
  console.log('🗑️  Clearing existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.consentRecord.deleteMany();
  await prisma.membershipRequest.deleteMany();
  await prisma.article.deleteMany();
  await prisma.club.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.city.deleteMany();
  console.log('✅ Existing data cleared\n');

  // Create Cities
  console.log('🏙️  Creating cities...');
  for (const city of cities) {
    await prisma.city.create({ data: city });
    console.log(`   Created city: ${city.name}`);
  }
  console.log('✅ Cities created\n');

  // Create Madrid Clubs
  console.log('🌿 Creating Madrid clubs...');
  const madridCity = await prisma.city.findUnique({ where: { slug: 'madrid' } });
  
  for (const club of madridClubs) {
    const { cityName, ...clubData } = club;
    await prisma.club.create({
      data: {
        ...clubData,
        cityId: madridCity!.id,
      },
    });
    console.log(`   Created club: ${club.name}`);
  }
  console.log('✅ Clubs created\n');

  // Create Articles
  console.log('📝 Creating articles...');
  for (const article of articles) {
    const { citySlug, ...articleData } = article;
    
    let cityId = null;
    if (citySlug) {
      const city = await prisma.city.findUnique({ where: { slug: citySlug } });
      cityId = city?.id || null;
    }

    await prisma.article.create({
      data: {
        ...articleData,
        cityId,
      },
    });
    console.log(`   Created article: ${article.title}`);
  }
  console.log('✅ Articles created\n');

  console.log('🎉 Database seeded successfully!\n');
  
  // Summary
  const cityCount = await prisma.city.count();
  const clubCount = await prisma.club.count();
  const articleCount = await prisma.article.count();
  
  console.log('📊 Summary:');
  console.log(`   Cities: ${cityCount}`);
  console.log(`   Clubs: ${clubCount}`);
  console.log(`   Articles: ${articleCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
