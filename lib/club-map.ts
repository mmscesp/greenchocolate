export interface GeoCoordinate {
  lat: number;
  lng: number;
}

export interface PublicClubMapPoint extends GeoCoordinate {
  precision: 'exact';
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export const DEFAULT_CITY_MAP_CENTER: GeoCoordinate = {
  lat: 41.3851,
  lng: 2.1734,
};

export const KNOWN_BARCELONA_FALLBACK_COORDINATE: GeoCoordinate = {
  lat: 41.3874,
  lng: 2.1686,
};

const COORDINATE_EPSILON = 0.000001;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function isValidCoordinate(value: unknown): value is GeoCoordinate {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<GeoCoordinate>;

  return (
    isFiniteNumber(candidate.lat) &&
    isFiniteNumber(candidate.lng) &&
    candidate.lat >= -90 &&
    candidate.lat <= 90 &&
    candidate.lng >= -180 &&
    candidate.lng <= 180
  );
}

export function isKnownBarcelonaFallbackCoordinate(value: unknown): boolean {
  if (!isValidCoordinate(value)) {
    return false;
  }

  return (
    Math.abs(value.lat - KNOWN_BARCELONA_FALLBACK_COORDINATE.lat) < COORDINATE_EPSILON &&
    Math.abs(value.lng - KNOWN_BARCELONA_FALLBACK_COORDINATE.lng) < COORDINATE_EPSILON
  );
}

function hasReviewedCoordinateMetadata(value: unknown): boolean {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as { source?: unknown; reviewedAt?: unknown };

  return typeof candidate.source === 'string' && candidate.source.length > 0 && typeof candidate.reviewedAt === 'string' && candidate.reviewedAt.length > 0;
}

export function getPublicClubMapPoint(value: unknown): PublicClubMapPoint | null {
  if (!isValidCoordinate(value)) {
    return null;
  }

  if (isKnownBarcelonaFallbackCoordinate(value) && !hasReviewedCoordinateMetadata(value)) {
    return null;
  }

  return {
    lat: value.lat,
    lng: value.lng,
    precision: 'exact',
  };
}

export function getBoundsForMapPoints(points: PublicClubMapPoint[]): MapBounds | null {
  if (points.length === 0) {
    return null;
  }

  return points.reduce<MapBounds>(
    (bounds, point) => ({
      north: Math.max(bounds.north, point.lat),
      south: Math.min(bounds.south, point.lat),
      east: Math.max(bounds.east, point.lng),
      west: Math.min(bounds.west, point.lng),
    }),
    {
      north: points[0].lat,
      south: points[0].lat,
      east: points[0].lng,
      west: points[0].lng,
    }
  );
}
