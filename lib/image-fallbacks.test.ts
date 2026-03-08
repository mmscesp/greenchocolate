import { describe, expect, it } from 'vitest';

import { DEFAULT_CITY_IMAGE, getCityImage } from './image-fallbacks';

describe('image fallbacks', () => {
  describe('getCityImage', () => {
    it('returns city-specific WebP images for known slugs', () => {
      expect(getCityImage('barcelona')).toBe('/images/cities/barcelona-city.webp');
      expect(getCityImage('madrid')).toBe('/images/cities/madrid-city.webp');
      expect(getCityImage('valencia')).toBe('/images/cities/valencia-city.webp');
      expect(getCityImage('tenerife')).toBe('/images/cities/tenerife-city.webp');
    });

    it('normalizes whitespace and case', () => {
      expect(getCityImage('  Barcelona  ')).toBe('/images/cities/barcelona-city.webp');
      expect(getCityImage('MADRID')).toBe('/images/cities/madrid-city.webp');
    });

    it('falls back to default city image for unknown/empty inputs', () => {
      expect(getCityImage('sevilla')).toBe(DEFAULT_CITY_IMAGE);
      expect(getCityImage('')).toBe(DEFAULT_CITY_IMAGE);
      expect(getCityImage(null)).toBe(DEFAULT_CITY_IMAGE);
      expect(getCityImage(undefined)).toBe(DEFAULT_CITY_IMAGE);
    });
  });
});
