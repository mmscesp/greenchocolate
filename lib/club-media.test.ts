import { describe, expect, it } from 'vitest';
import { buildClubMediaItems, getClubPrimaryMediaImage } from './club-media';

describe('club media resolver', () => {
  it('keeps Club 311 on the configured premium media set', () => {
    const items = buildClubMediaItems({
      slug: 'club-311-barcelona',
      name: 'Club 311',
      citySlug: 'barcelona',
      isVerified: true,
      verificationStatus: 'SCM_VERIFIED',
    });

    expect(getClubPrimaryMediaImage(items)).toBe('/images/clubs/club-311/hero.webp');
  });

  it('uses a district fallback cover for unverified Barcelona listings without images', () => {
    const items = buildClubMediaItems({
      slug: 'dragon-club-barcelona',
      name: 'Dragon Club',
      citySlug: 'barcelona',
      neighborhood: 'Eixample Dreta',
      district: 'Eixample',
      isVerified: false,
      verificationStatus: 'UNVERIFIED',
    });

    expect(items).toEqual([
      {
        kind: 'image',
        src: '/images/fallbacks/Districts/Eixample.webp',
        alt: 'District fallback image for Eixample Dreta, Barcelona',
      },
    ]);
  });

  it('does not replace real media for verified listings', () => {
    const items = buildClubMediaItems({
      slug: 'verified-example-barcelona',
      name: 'Verified Example',
      citySlug: 'barcelona',
      images: ['/images/clubs/example.webp'],
      isVerified: true,
      verificationStatus: 'SCM_VERIFIED',
    });

    expect(getClubPrimaryMediaImage(items)).toBe('/images/clubs/example.webp');
  });
});
