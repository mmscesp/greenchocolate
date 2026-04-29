import { describe, expect, it } from 'vitest';
import {
  COMPACT_COMPLIANCE_COPY,
  canShowTrustPick,
  getClubPublicStatus,
  getClubStatusLabel,
  getSafeStructuredDataForClub,
  sanitizePublicClubCopy,
  sanitizePublicLocationText,
  shouldRenderLocation,
} from './public-club-safety';

describe('public club safety helpers', () => {
  it('labels verified and public listing records with the public taxonomy', () => {
    expect(getClubPublicStatus({ isVerified: true })).toBe('verified-profile');
    expect(getClubPublicStatus({ verificationStatus: 'SCM_VERIFIED' })).toBe('verified-profile');
    expect(getClubPublicStatus({ verificationStatus: 'FEATURED' })).toBe('verified-profile');
    expect(getClubPublicStatus({ isVerified: false, verificationStatus: 'UNVERIFIED' })).toBe('public-listing');
    expect(getClubStatusLabel({ verificationStatus: 'UNVERIFIED' })).toBe('Public Listing');
    expect(getClubStatusLabel({ verificationStatus: 'SCM_VERIFIED' })).toBe('Verified Profile');
  });

  it('does not allow SCM Trust Pick for public listings or undocumented featured records', () => {
    expect(canShowTrustPick({ verificationStatus: 'UNVERIFIED', trustPickReason: 'Editorial reason' })).toBe(false);
    expect(canShowTrustPick({ verificationStatus: 'FEATURED' })).toBe(false);
    expect(canShowTrustPick({ verificationStatus: 'FEATURED', trustPickReason: 'Documented review reason' })).toBe(true);
  });

  it('strips public placeholder location values', () => {
    for (const value of ['— fill manually', '-- fill manually', '- fill manually', 'fill manually', 'FILL MANUALLY', 'tbd', 'todo', 'unknown', '', ' null ']) {
      expect(sanitizePublicLocationText(value)).toBeNull();
      expect(shouldRenderLocation(value)).toBe(false);
    }

    expect(sanitizePublicLocationText('L’Eixample')).toBe('L’Eixample');
    expect(shouldRenderLocation('L’Eixample')).toBe(true);
  });

  it('sanitizes live database copy before public rendering', () => {
    expect(
      sanitizePublicClubCopy(
        'Cali Weed Barcelona is listed as a public Barcelona club profile in — fill manually. Tourist-friendly membership experience.',
        'Barcelona'
      )
    ).toBe('Cali Weed Barcelona is listed as a public Barcelona club profile in Barcelona. visitor-aware membership experience.');
  });

  it('returns lighter structured data for public listings and never exposes price range', () => {
    const publicListing = getSafeStructuredDataForClub({
      name: 'Haze Social Club',
      slug: 'haze-social-club',
      description: 'Public research listing.',
      isVerified: false,
      verificationStatus: 'UNVERIFIED',
      neighborhood: '— fill manually',
      cityName: 'Barcelona',
      image: '/image.jpg',
      url: 'https://example.test/en/clubs/haze-social-club',
      priceRange: '$$',
    });

    expect(publicListing['@type']).toBe('ProfilePage');
    expect(JSON.stringify(publicListing)).not.toContain('priceRange');
    expect(JSON.stringify(publicListing)).not.toContain('fill manually');

    const verified = getSafeStructuredDataForClub({
      name: 'Club 311 Barcelona',
      slug: 'club-311-barcelona',
      description: 'Verified profile.',
      isVerified: true,
      verificationStatus: 'SCM_VERIFIED',
      neighborhood: 'Sagrada Familia',
      cityName: 'Barcelona',
      image: '/image.jpg',
      url: 'https://example.test/en/clubs/club-311-barcelona',
      priceRange: '$$$',
    });

    expect(verified['@type']).toBe('LocalBusiness');
    expect(JSON.stringify(verified)).not.toContain('priceRange');
  });

  it('exports the compact compliance baseline', () => {
    expect(COMPACT_COMPLIANCE_COPY).toBe(
      'Educational only. No cannabis sales, transaction brokering, legal advice, or guaranteed club acceptance.'
    );
  });
});
