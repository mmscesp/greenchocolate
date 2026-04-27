import { describe, expect, it } from 'vitest';
import {
  getBarcelonaIllustratedCover,
  getIllustratedCoverAlt,
  slugifyVisualKey,
} from './club-visuals';

describe('club visuals', () => {
  it('normalizes Barcelona visual keys with accents and punctuation', () => {
    expect(slugifyVisualKey('Sarrià - Sant Gervasi')).toBe('sarria-sant-gervasi');
    expect(slugifyVisualKey('El Born / Gòtic')).toBe('el-born-gotic');
  });

  it('prefers neighborhood covers before district covers', () => {
    expect(getBarcelonaIllustratedCover({ neighborhood: 'Raval', district: 'Eixample' })).toContain(
      '/images/fallbacks/Districts/ElRaval.webp'
    );
  });

  it('falls back to the generic Barcelona cover when no mapping exists', () => {
    expect(getBarcelonaIllustratedCover({ neighborhood: 'Unknown', district: 'Unknown' })).toBe(
      '/images/cities/barcelona-city.webp'
    );
  });

  it('keeps alt text explicit that the fallback is district-based', () => {
    expect(getIllustratedCoverAlt('Eixample')).toBe('District fallback image for Eixample, Barcelona');
  });
});
