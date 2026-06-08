export const KNOWN_BARCELONA_FALLBACK_COORDINATE = Object.freeze({
  lat: 41.3874,
  lng: 2.1686,
});

export const BARCELONA_COORDINATE_BOUNDS = Object.freeze({
  north: 41.47,
  south: 41.32,
  east: 2.25,
  west: 2.05,
});

const COORDINATE_EPSILON = 0.000001;

export function toFiniteNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().replace(',', '.');
    if (!normalized) {
      return null;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function isValidCoordinate(value) {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const lat = toFiniteNumber(value.lat);
  const lng = toFiniteNumber(value.lng);

  return lat !== null && lng !== null && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export function normalizeCoordinate(value) {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const lat = toFiniteNumber(value.lat);
  const lng = toFiniteNumber(value.lng);

  if (lat === null || lng === null || !isValidCoordinate({ lat, lng })) {
    return null;
  }

  return { lat, lng };
}

export function isKnownBarcelonaFallbackCoordinate(value) {
  const coordinate = normalizeCoordinate(value);
  if (!coordinate) {
    return false;
  }

  return (
    Math.abs(coordinate.lat - KNOWN_BARCELONA_FALLBACK_COORDINATE.lat) < COORDINATE_EPSILON &&
    Math.abs(coordinate.lng - KNOWN_BARCELONA_FALLBACK_COORDINATE.lng) < COORDINATE_EPSILON
  );
}

export function isWithinBarcelonaBounds(value) {
  const coordinate = normalizeCoordinate(value);
  if (!coordinate) {
    return false;
  }

  return (
    coordinate.lat >= BARCELONA_COORDINATE_BOUNDS.south &&
    coordinate.lat <= BARCELONA_COORDINATE_BOUNDS.north &&
    coordinate.lng >= BARCELONA_COORDINATE_BOUNDS.west &&
    coordinate.lng <= BARCELONA_COORDINATE_BOUNDS.east
  );
}

export function isBarcelonaCityDisplayName(displayName) {
  const normalized = String(displayName || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

  return /\bBarcelona,\s*Barcelones\b/i.test(normalized);
}

export function getReviewedCoordinateFromRow(row) {
  const coordinate = normalizeCoordinate({
    lat: row?.latitude,
    lng: row?.longitude,
  });

  if (!coordinate) {
    return null;
  }

  if (row.coordinateStatus && row.coordinateStatus !== 'accepted') {
    return null;
  }

  if (!isWithinBarcelonaBounds(coordinate)) {
    return null;
  }

  if (isKnownBarcelonaFallbackCoordinate(coordinate) && row.coordinateSource !== 'manual_review') {
    return null;
  }

  return coordinate;
}

export function coordinatesForPrisma(row) {
  const coordinate = getReviewedCoordinateFromRow(row);
  if (!coordinate) {
    return {};
  }

  const source = typeof row?.coordinateSource === 'string' ? row.coordinateSource.trim() : '';
  const reviewedAt = typeof row?.coordinateReviewedAt === 'string'
    ? row.coordinateReviewedAt.trim()
    : typeof row?.generatedAt === 'string'
      ? row.generatedAt.trim()
      : '';

  return {
    ...coordinate,
    ...(source ? { source } : {}),
    ...(reviewedAt ? { reviewedAt } : {}),
  };
}

export function buildAddressQuery(row) {
  const address = typeof row?.addressDisplay === 'string' ? row.addressDisplay.trim() : '';
  if (!address) {
    return '';
  }

  const hasBarcelona = /\bbarcelona\b/i.test(address);
  const hasSpain = /\bspain\b|\bespaña\b/i.test(address);

  return [
    address,
    hasBarcelona ? null : 'Barcelona',
    hasSpain ? null : 'Spain',
  ]
    .filter(Boolean)
    .join(', ');
}
