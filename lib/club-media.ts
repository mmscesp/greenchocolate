import { getClubImageGallery } from '@/lib/image-fallbacks';

export interface ClubImageMediaItem {
  kind: 'image';
  src: string;
  alt: string;
}

export interface ClubVideoMediaItem {
  kind: 'video';
  src: string;
  alt: string;
  poster: string;
  mp4Fallback?: string;
}

export type ClubMediaItem = ClubImageMediaItem | ClubVideoMediaItem;

const CLUB_MEDIA_BY_SLUG: Record<string, ClubMediaItem[]> = {
  'club-311-barcelona': [
    {
      kind: 'image',
      src: '/images/clubs/club-311/hero.webp',
      alt: 'Club 311 main room with lounge seating and tables',
    },
    {
      kind: 'video',
      src: '/images/clubs/club-311/club-tour.webm',
      mp4Fallback: '/images/clubs/club-311/club-tour.mp4',
      poster: '/images/clubs/club-311/poster.webp',
      alt: 'Club 311 interior video tour',
    },
    {
      kind: 'image',
      src: '/images/clubs/club-311/gallery-lounge.webp',
      alt: 'Club 311 lounge seating area',
    },
    {
      kind: 'image',
      src: '/images/clubs/club-311/gallery-cinema.webp',
      alt: 'Club 311 cinema corner seating',
    },
    {
      kind: 'image',
      src: '/images/clubs/club-311/gallery-mural.webp',
      alt: 'Club 311 accessories and display details',
    },
    {
      kind: 'image',
      src: '/images/clubs/club-311/gallery-main-room.webp',
      alt: 'Club 311 branded entrance mural',
    },
    {
      kind: 'image',
      src: '/images/clubs/club-311/gallery-sofas.webp',
      alt: 'Club 311 sofa lounge area',
    },
    {
      kind: 'image',
      src: '/images/clubs/club-311/gallery-corner.webp',
      alt: 'Club 311 side lounge and table area',
    },
    {
      kind: 'image',
      src: '/images/clubs/club-311/gallery-table.webp',
      alt: 'Club 311 private table corner',
    },
    {
      kind: 'image',
      src: '/images/clubs/club-311/gallery-art.webp',
      alt: 'Club 311 art wall and lounge details',
    },
  ],
};

export function buildClubMediaItems(params: {
  slug: string;
  name: string;
  images?: string[] | null;
  citySlug?: string | null;
}): ClubMediaItem[] {
  const configured = CLUB_MEDIA_BY_SLUG[params.slug];
  if (configured) {
    return configured;
  }

  return getClubImageGallery(params.images, params.citySlug).map((src, index) => ({
    kind: 'image' as const,
    src,
    alt: `${params.name} gallery image ${index + 1}`,
  }));
}

export function getClubPrimaryMediaImage(mediaItems: ClubMediaItem[]): string {
  const first = mediaItems[0];

  if (!first) {
    return '/images/fallbacks/club-default.jpg';
  }

  return first.kind === 'video' ? first.poster : first.src;
}
