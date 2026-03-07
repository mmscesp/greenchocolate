import { config } from 'dotenv';
import { resolve } from 'path';
import { prisma } from '../lib/prisma';

config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '.env.local') });

const cities = [
  {
    name: 'Barcelona',
    slug: 'barcelona',
    country: 'Spain',
    region: 'Catalonia',
    description: 'Barcelona cannabis social club directory and city guidance.',
    metaTitle: 'Cannabis Social Clubs in Barcelona | SocialClubsMaps',
    metaDescription: 'Browse verified cannabis social clubs and guides for Barcelona.',
    latitude: 41.3851,
    longitude: 2.1734,
  },
  {
    name: 'Madrid',
    slug: 'madrid',
    country: 'Spain',
    region: 'Community of Madrid',
    description: 'Madrid cannabis social club directory and city guidance.',
    metaTitle: 'Cannabis Social Clubs in Madrid | SocialClubsMaps',
    metaDescription: 'Browse verified cannabis social clubs and guides for Madrid.',
    latitude: 40.4168,
    longitude: -3.7038,
  },
  {
    name: 'Valencia',
    slug: 'valencia',
    country: 'Spain',
    region: 'Valencian Community',
    description: 'Valencia cannabis social club directory and city guidance.',
    metaTitle: 'Cannabis Social Clubs in Valencia | SocialClubsMaps',
    metaDescription: 'Browse verified cannabis social clubs and guides for Valencia.',
    latitude: 39.4699,
    longitude: -0.3763,
  },
  {
    name: 'Tenerife',
    slug: 'tenerife',
    country: 'Spain',
    region: 'Canary Islands',
    description: 'Tenerife cannabis social club directory and city guidance.',
    metaTitle: 'Cannabis Social Clubs in Tenerife | SocialClubsMaps',
    metaDescription: 'Browse verified cannabis social clubs and guides for Tenerife.',
    latitude: 28.2916,
    longitude: -16.6291,
  },
];

const clubs = [
  {
    name: 'Club 311 Barcelona',
    slug: 'club-311-barcelona',
    description: 'Club 311 Barcelona is a private members club near Sagrada Familia built around quality, safety, community, and a welcoming indoor lounge experience for respectful adults.',
    shortDescription: 'Verified private club near Sagrada Familia with warm indoor lounges and guided member onboarding.',
    citySlug: 'barcelona',
    neighborhood: 'Eixample',
    addressDisplay: "Carrer de Lepant, 311, L'Eixample, 08025 Barcelona",
    coordinates: { lat: 41.4065678, lng: 2.1736872 },
    contactEmail: 'info.club311@gmail.com',
    phoneNumber: '+34 693 224 138',
    website: 'club311barcelona.com',
    socialMedia: { instagram: '@club_311' },
    isVerified: true,
    isActive: true,
    allowsPreRegistration: true,
    openingHours: {
      monday: '10:30 - 00:00',
      tuesday: '10:30 - 00:00',
      wednesday: '10:30 - 00:00',
      thursday: '10:30 - 00:00',
      friday: '10:30 - 00:00',
      saturday: '10:30 - 00:00',
      sunday: '12:00 - 00:00',
    },
    amenities: ['Indoor Lounge', 'Private Member Area', 'Member Events', 'Vegan Options', 'Knowledgeable Staff', 'Late Hours'],
    vibeTags: ['Community', 'Respectful', 'Education-First', 'Tourist-Friendly'],
    priceRange: '$$',
    capacity: 10000,
    foundedYear: 2018,
    images: [
      '/images/clubs/club-311/hero.webp',
      '/images/clubs/club-311/gallery-lounge.webp',
      '/images/clubs/club-311/gallery-cinema.webp',
      '/images/clubs/club-311/gallery-mural.webp',
      '/images/clubs/club-311/gallery-main-room.webp',
      '/images/clubs/club-311/gallery-sofas.webp',
      '/images/clubs/club-311/gallery-corner.webp',
      '/images/clubs/club-311/gallery-table.webp',
      '/images/clubs/club-311/gallery-art.webp',
    ],
  },
];

const launchArticles = [
  {
    title: 'What Cannabis Social Clubs in Spain Actually Are — And Why It Matters for Your Trip',
    slug: 'what-are-cannabis-social-clubs-spain',
    excerpt: 'Foundational guide to what CSCs are and how they differ from public models.',
    content: 'Launch article placeholder. Source-of-truth body is currently MDX editorial content.',
    category: 'Essential Guide',
    tags: ['Launch', 'CSC', 'Guide'],
    heroImage: 'https://images.pexels.com/photos/4113892/pexels-photo-4113892.jpeg',
    heroImageAlt: 'Cannabis social clubs in Spain',
    authorName: 'SocialClubsMaps Editorial',
    authorBio: 'Launch editorial team.',
    isPublished: true,
    publishedAt: new Date('2026-03-01T10:00:00.000Z'),
    featuredOrder: 1,
    readTime: 12,
    metaTitle: 'What Cannabis Social Clubs in Spain Actually Are',
    metaDescription: 'Understand CSC basics before your trip.',
    citySlug: 'barcelona',
  },
  {
    title: 'The Safety Kit: What Every Visitor Should Know Before Setting Foot in a Club',
    slug: 'safety-kit-visitors-spain',
    excerpt: 'Safety-first launch guide: red flags, legal lines, and practical protection.',
    content: 'Launch article placeholder. Source-of-truth body is currently MDX editorial content.',
    category: 'Safety',
    tags: ['Launch', 'Safety', 'Visitors'],
    heroImage: 'https://images.pexels.com/photos/7492875/pexels-photo-7492875.jpeg',
    heroImageAlt: 'Visitor safety kit',
    authorName: 'SocialClubsMaps Editorial',
    authorBio: 'Launch editorial team.',
    isPublished: true,
    publishedAt: new Date('2026-03-01T10:05:00.000Z'),
    featuredOrder: 2,
    readTime: 8,
    metaTitle: 'Safety Kit for Visitors in Spain',
    metaDescription: 'Safety checklist for cannabis club visitors in Spain.',
    citySlug: 'barcelona',
  },
  {
    title: 'Barcelona vs. Amsterdam: Two Cities, Two Systems, Two Completely Different Realities',
    slug: 'barcelona-vs-amsterdam-cannabis',
    excerpt: 'Direct comparison to reset expectations for travelers.',
    content: 'Launch article placeholder. Source-of-truth body is currently MDX editorial content.',
    category: 'Culture',
    tags: ['Launch', 'Culture', 'Comparison'],
    heroImage: 'https://images.pexels.com/photos/6231900/pexels-photo-6231900.jpeg',
    heroImageAlt: 'Barcelona vs Amsterdam comparison',
    authorName: 'SocialClubsMaps Editorial',
    authorBio: 'Launch editorial team.',
    isPublished: true,
    publishedAt: new Date('2026-03-01T10:10:00.000Z'),
    featuredOrder: 3,
    readTime: 10,
    metaTitle: 'Barcelona vs Amsterdam Cannabis Systems',
    metaDescription: 'Understand why Barcelona clubs are not Amsterdam coffeeshops.',
    citySlug: 'barcelona',
  },
  {
    title: 'Your First Time in a Barcelona Cannabis Club: The Respectful Way In',
    slug: 'first-time-barcelona-cannabis-club',
    excerpt: 'Step-by-step first-visit guide for Barcelona newcomers.',
    content: 'Launch article placeholder. Source-of-truth body is currently MDX editorial content.',
    category: 'City Guide',
    tags: ['Launch', 'Barcelona', 'First Time'],
    heroImage: 'https://images.pexels.com/photos/3799197/pexels-photo-3799197.jpeg',
    heroImageAlt: 'First time guide Barcelona',
    authorName: 'SocialClubsMaps Editorial',
    authorBio: 'Launch editorial team.',
    isPublished: true,
    publishedAt: new Date('2026-03-01T10:15:00.000Z'),
    featuredOrder: 4,
    readTime: 15,
    metaTitle: 'First Time Barcelona Cannabis Club Guide',
    metaDescription: 'How to prepare, apply, and visit safely in Barcelona.',
    citySlug: 'barcelona',
  },
  {
    title: "Spain's Cannabis Laws: What Tourists Actually Need to Know",
    slug: 'spain-cannabis-laws-tourists',
    excerpt: 'Legal-context launch guide focused on tourist-facing realities.',
    content: 'Launch article placeholder. Source-of-truth body is currently MDX editorial content.',
    category: 'Legal',
    tags: ['Launch', 'Legal', 'Tourists'],
    heroImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    heroImageAlt: 'Spain legal guide',
    authorName: 'SocialClubsMaps Editorial',
    authorBio: 'Launch editorial team.',
    isPublished: true,
    publishedAt: new Date('2026-03-01T10:20:00.000Z'),
    featuredOrder: 5,
    readTime: 10,
    metaTitle: "Spain's Cannabis Laws for Tourists",
    metaDescription: 'Private vs public and legal boundaries in Spain.',
    citySlug: 'barcelona',
  },
  {
    title: 'Spannabis Bilbao 2026: What to Know Before You Go',
    slug: 'spannabis-bilbao-2026',
    excerpt: 'Launch event guide for Spannabis Bilbao 2026.',
    content: 'Launch article placeholder for event editorial guide.',
    category: 'Events',
    tags: ['Launch', 'Events', 'Spannabis'],
    heroImage: 'https://images.pexels.com/photos/3586966/pexels-photo-3586966.jpeg',
    heroImageAlt: 'Spannabis event guide',
    authorName: 'SocialClubsMaps Editorial',
    authorBio: 'Launch editorial team.',
    isPublished: true,
    publishedAt: new Date('2026-03-01T10:25:00.000Z'),
    featuredOrder: 6,
    readTime: 6,
    metaTitle: 'Spannabis Bilbao 2026 Guide',
    metaDescription: 'Key details for Spannabis Bilbao 2026.',
    citySlug: null,
  },
  {
    title: "ICBC Berlin 2026: Europe's Cannabis Business Conference",
    slug: 'icbc-berlin-2026',
    excerpt: 'Launch event guide for ICBC Berlin 2026.',
    content: 'Launch article placeholder for event editorial guide.',
    category: 'Events',
    tags: ['Launch', 'Events', 'ICBC'],
    heroImage: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg',
    heroImageAlt: 'ICBC Berlin event guide',
    authorName: 'SocialClubsMaps Editorial',
    authorBio: 'Launch editorial team.',
    isPublished: true,
    publishedAt: new Date('2026-03-01T10:30:00.000Z'),
    featuredOrder: 7,
    readTime: 5,
    metaTitle: 'ICBC Berlin 2026 Guide',
    metaDescription: 'Key details for ICBC Berlin 2026.',
    citySlug: null,
  },
  {
    title: 'Cannabis Europa London 2026: Where Policy Meets Industry',
    slug: 'cannabis-europa-london-2026',
    excerpt: 'Launch event guide for Cannabis Europa London 2026.',
    content: 'Launch article placeholder for event editorial guide.',
    category: 'Events',
    tags: ['Launch', 'Events', 'Cannabis Europa'],
    heroImage: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg',
    heroImageAlt: 'Cannabis Europa London event guide',
    authorName: 'SocialClubsMaps Editorial',
    authorBio: 'Launch editorial team.',
    isPublished: true,
    publishedAt: new Date('2026-03-01T10:35:00.000Z'),
    featuredOrder: 8,
    readTime: 5,
    metaTitle: 'Cannabis Europa London 2026 Guide',
    metaDescription: 'Key details for Cannabis Europa London 2026.',
    citySlug: null,
  },
];

const launchEvents = [
  {
    name: 'Spannabis Bilbao 2026',
    slug: 'spannabis-bilbao-2026',
    description: 'Flagship cannabis fair with exhibitors, talks, and culture programming.',
    startDate: new Date('2026-04-17T09:00:00.000Z'),
    endDate: new Date('2026-04-19T18:00:00.000Z'),
    location: 'Bilbao Exhibition Centre (BEC), Barakaldo, Spain',
    isPublished: true,
    imageUrl: 'https://images.pexels.com/photos/3586966/pexels-photo-3586966.jpeg',
    eventUrl: 'https://www.spannabis.com',
    citySlug: null,
    clubSlug: null,
  },
  {
    name: 'ICBC Berlin 2026',
    slug: 'icbc-berlin-2026',
    description: 'Business and policy conference for the European cannabis sector.',
    startDate: new Date('2026-04-13T09:00:00.000Z'),
    endDate: new Date('2026-04-15T18:00:00.000Z'),
    location: 'Berlin, Germany',
    isPublished: true,
    imageUrl: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg',
    eventUrl: 'https://internationalcbc.com',
    citySlug: null,
    clubSlug: null,
  },
  {
    name: 'Cannabis Europa London 2026',
    slug: 'cannabis-europa-london-2026',
    description: 'Policy, regulation, and industry leadership conference in London.',
    startDate: new Date('2026-05-26T09:00:00.000Z'),
    endDate: new Date('2026-05-27T18:00:00.000Z'),
    location: 'London, United Kingdom',
    isPublished: true,
    imageUrl: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg',
    eventUrl: 'https://www.cannabis-europa.com',
    citySlug: null,
    clubSlug: null,
  },
];

async function main() {
  console.log('🌱 Starting launch-aligned database seed...\n');

  console.log('🗑️  Clearing existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.applicationStageHistory.deleteMany();
  await prisma.consentRecord.deleteMany();
  await prisma.membershipRequest.deleteMany();
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.event.deleteMany();
  await prisma.article.deleteMany();
  await prisma.club.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.city.deleteMany();
  console.log('✅ Existing data cleared\n');

  console.log('🏙️  Creating cities...');
  for (const city of cities) {
    await prisma.city.create({ data: city });
    console.log(`   Created city: ${city.name}`);
  }
  console.log('✅ Cities created\n');

  console.log('🌿 Creating clubs...');
  for (const club of clubs) {
    const { citySlug, ...clubData } = club;
    const city = await prisma.city.findUnique({ where: { slug: citySlug } });
    if (!city) {
      throw new Error(`City not found for club ${club.slug}: ${citySlug}`);
    }
    await prisma.club.create({
      data: {
        ...clubData,
        cityId: city.id,
      },
    });
    console.log(`   Created club: ${club.name}`);
  }
  console.log('✅ Clubs created\n');

  console.log('🗓️  Creating events...');
  for (const event of launchEvents) {
    const { citySlug, clubSlug, ...eventData } = event;
    const city = citySlug ? await prisma.city.findUnique({ where: { slug: citySlug } }) : null;
    const club = clubSlug ? await prisma.club.findUnique({ where: { slug: clubSlug } }) : null;

    await prisma.event.create({
      data: {
        ...eventData,
        cityId: city?.id ?? null,
        clubId: club?.id ?? null,
      },
    });
    console.log(`   Created event: ${event.name}`);
  }
  console.log('✅ Events created\n');

  console.log('📝 Creating launch articles...');
  for (const article of launchArticles) {
    const { citySlug, ...articleData } = article;
    const city = citySlug ? await prisma.city.findUnique({ where: { slug: citySlug } }) : null;

    await prisma.article.create({
      data: {
        ...articleData,
        cityId: city?.id ?? null,
      },
    });
    console.log(`   Created article: ${article.title}`);
  }
  console.log('✅ Launch articles created\n');

  const cityCount = await prisma.city.count();
  const clubCount = await prisma.club.count();
  const eventCount = await prisma.event.count();
  const articleCount = await prisma.article.count();

  console.log('🎉 Launch seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   Cities: ${cityCount}`);
  console.log(`   Clubs: ${clubCount}`);
  console.log(`   Events: ${eventCount}`);
  console.log(`   Articles: ${articleCount}`);
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
