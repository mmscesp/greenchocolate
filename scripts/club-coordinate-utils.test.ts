import {
  coordinatesForPrisma,
  getReviewedCoordinateFromRow,
  isBarcelonaCityDisplayName,
  isKnownBarcelonaFallbackCoordinate,
  isWithinBarcelonaBounds,
} from './club-coordinate-utils.mjs';

describe('club coordinate script utilities', () => {
  it('accepts reviewed Barcelona coordinates', () => {
    expect(getReviewedCoordinateFromRow({
      latitude: 41.3902,
      longitude: 2.154,
      coordinateStatus: 'accepted',
      coordinateSource: 'xlsx',
      coordinateReviewedAt: '2026-06-08T11:42:13.031Z',
    })).toEqual({
      lat: 41.3902,
      lng: 2.154,
    });
    expect(coordinatesForPrisma({
      latitude: 41.3902,
      longitude: 2.154,
      coordinateStatus: 'accepted',
      coordinateSource: 'xlsx',
      coordinateReviewedAt: '2026-06-08T11:42:13.031Z',
    })).toEqual({
      lat: 41.3902,
      lng: 2.154,
      source: 'xlsx',
      reviewedAt: '2026-06-08T11:42:13.031Z',
    });
  });

  it('stores an empty coordinates object when no reviewed coordinate exists', () => {
    expect(coordinatesForPrisma({
      latitude: null,
      longitude: null,
      coordinateStatus: 'missing',
      coordinateSource: null,
    })).toEqual({});
  });

  it('rejects out-of-bounds and non-accepted coordinates', () => {
    expect(isWithinBarcelonaBounds({ lat: 40.4168, lng: -3.7038 })).toBe(false);
    expect(getReviewedCoordinateFromRow({
      latitude: 40.4168,
      longitude: -3.7038,
      coordinateStatus: 'accepted',
      coordinateSource: 'xlsx',
    })).toBeNull();
    expect(getReviewedCoordinateFromRow({
      latitude: 41.3902,
      longitude: 2.154,
      coordinateStatus: 'needs_review',
      coordinateSource: 'nominatim_address',
    })).toBeNull();
  });

  it('rejects the known fallback unless manually reviewed', () => {
    expect(isKnownBarcelonaFallbackCoordinate({ lat: 41.3874, lng: 2.1686 })).toBe(true);
    expect(getReviewedCoordinateFromRow({
      latitude: 41.3874,
      longitude: 2.1686,
      coordinateStatus: 'accepted',
      coordinateSource: 'nominatim_address',
    })).toBeNull();
    expect(getReviewedCoordinateFromRow({
      latitude: 41.3874,
      longitude: 2.1686,
      coordinateStatus: 'accepted',
      coordinateSource: 'manual_review',
    })).toEqual({ lat: 41.3874, lng: 2.1686 });
  });

  it('distinguishes Barcelona city from Barcelona province results', () => {
    expect(isBarcelonaCityDisplayName(
      '14, Carrer dels Mirallers, la Ribera, Barcelona, Barcelonès, Barcelona, Catalonia, Spain'
    )).toBe(true);
    expect(isBarcelonaCityDisplayName(
      '37, Carrer de Castella, Centre, el Prat de Llobregat, Baix Llobregat, Barcelona, Catalonia, Spain'
    )).toBe(false);
  });
});
