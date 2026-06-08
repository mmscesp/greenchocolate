import {
  DEFAULT_CITY_MAP_CENTER,
  getBoundsForMapPoints,
  getPublicClubMapPoint,
  isKnownBarcelonaFallbackCoordinate,
  isValidCoordinate,
  type PublicClubMapPoint,
} from '@/lib/club-map';

describe('club map helpers', () => {
  it('accepts valid latitude and longitude pairs', () => {
    expect(isValidCoordinate({ lat: 41.4065678, lng: 2.1736872 })).toBe(true);
  });

  it('rejects missing, non-finite, and out-of-range coordinates', () => {
    expect(isValidCoordinate(null)).toBe(false);
    expect(isValidCoordinate({ lat: Number.NaN, lng: 2.17 })).toBe(false);
    expect(isValidCoordinate({ lat: 91, lng: 2.17 })).toBe(false);
    expect(isValidCoordinate({ lat: 41.4, lng: 181 })).toBe(false);
    expect(isValidCoordinate({ lat: '41.4', lng: 2.17 })).toBe(false);
  });

  it('returns exact reviewed map coordinates', () => {
    const point = getPublicClubMapPoint({ lat: 41.4065678, lng: 2.1736872 });

    expect(point).toEqual({
      lat: 41.4065678,
      lng: 2.1736872,
      precision: 'exact',
    });
  });

  it('returns null when source coordinates are invalid', () => {
    expect(getPublicClubMapPoint({})).toBeNull();
    expect(getPublicClubMapPoint({ lat: 0, lng: 999 })).toBeNull();
    expect(getPublicClubMapPoint({ lat: '41.4', lng: '2.1' })).toBeNull();
  });

  it('rejects the known Barcelona import fallback coordinate unless reviewed', () => {
    expect(isKnownBarcelonaFallbackCoordinate({ lat: 41.3874, lng: 2.1686 })).toBe(true);
    expect(getPublicClubMapPoint({ lat: 41.3874, lng: 2.1686 })).toBeNull();
    expect(getPublicClubMapPoint({
      lat: 41.3874,
      lng: 2.1686,
      source: 'manual_review',
      reviewedAt: '2026-06-08T00:00:00.000Z',
    })).toEqual({
      lat: 41.3874,
      lng: 2.1686,
      precision: 'exact',
    });
  });

  it('builds bounds for multiple map points', () => {
    const points: PublicClubMapPoint[] = [
      { lat: 41.4065678, lng: 2.1736872, precision: 'exact' },
      { lat: 41.388, lng: 2.159, precision: 'exact' },
    ];

    expect(getBoundsForMapPoints(points)).toEqual({
      north: 41.4065678,
      south: 41.388,
      east: 2.1736872,
      west: 2.159,
    });
  });

  it('returns null bounds for an empty point set', () => {
    expect(getBoundsForMapPoints([])).toBeNull();
  });

  it('keeps a Barcelona fallback center', () => {
    expect(DEFAULT_CITY_MAP_CENTER).toEqual({ lat: 41.3851, lng: 2.1734 });
  });
});
