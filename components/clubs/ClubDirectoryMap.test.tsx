import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ClubCard } from '@/app/actions/clubs';
import ClubDirectoryMap from './ClubDirectoryMap';

const mockFlyTo = vi.fn();
const mockEaseTo = vi.fn();
const mockFitBounds = vi.fn();
const mockStop = vi.fn();
const mockRemoveMap = vi.fn();
const mockAddControl = vi.fn();
const mockMarkerRemove = vi.fn();
const mockResize = vi.fn();

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt, fill: _fill, ...props }: { alt: string; src: string; fill?: boolean }) => <img alt={alt} {...props} />,
}));

vi.mock('maplibre-gl', () => {
  class MockMap {
    container: HTMLElement;

    constructor(options: { container: HTMLElement }) {
      this.container = options.container;
    }

    flyTo = mockFlyTo;
    easeTo = mockEaseTo;
    fitBounds = mockFitBounds;
    stop = mockStop;
    remove = mockRemoveMap;
    addControl = mockAddControl;
    resize = mockResize;
    getZoom = () => 12;
    project = () => ({ x: 320, y: 360 });

    on(event: string, callback: () => void) {
      if (event === 'load') {
        callback();
      }
      return this;
    }

    off() {
      return this;
    }
  }

  class MockMarker {
    element: HTMLElement;

    constructor(options: { element: HTMLElement }) {
      this.element = options.element;
    }

    setLngLat() {
      return this;
    }

    addTo(map: MockMap) {
      map.container.appendChild(this.element);
      return this;
    }

    remove = mockMarkerRemove;
  }

  class MockNavigationControl {}

  return {
    default: {
      Map: MockMap,
      Marker: MockMarker,
      NavigationControl: MockNavigationControl,
    },
    Map: MockMap,
    Marker: MockMarker,
    NavigationControl: MockNavigationControl,
  };
});

vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    language: 'en',
    t: (key: string) => {
      const dictionary: Record<string, string> = {
        'clubs.map.aria_label': 'Club directory map',
        'clubs.map.empty_title': 'No mappable club profiles',
        'clubs.map.empty_body': 'Try clearing filters or switch back to grid view.',
        'clubs.map.approximate_notice': 'Pins show reviewed address-level locations for active club profiles.',
        'clubs.map.attribution': '© OpenStreetMap contributors',
        'clubs.map.close_preview': 'Close preview',
        'clubs.map.marker_public': 'Public',
        'clubs.card.explore_this_club': 'View profile',
      };
      return dictionary[key] ?? key;
    },
  }),
}));

const baseClub: ClubCard = {
  id: 'club-1',
  name: 'Club 311 Barcelona',
  slug: 'club-311-barcelona',
  shortDescription: 'Private members club near Sagrada Familia.',
  description: 'Private members club near Sagrada Familia.',
  neighborhood: 'Eixample',
  cityName: 'Barcelona',
  citySlug: 'barcelona',
  images: ['/images/clubs/club-311/hero.webp'],
  logoUrl: null,
  rating: null,
  reviewCount: null,
  priceRange: '$$',
  amenities: ['Private Lounge Areas'],
  vibeTags: ['Community-Focused'],
  isVerified: true,
  verificationStatus: 'SCM_VERIFIED',
  listingTier: 'STANDARD',
  district: null,
  googlePlaceId: null,
  googleMapsUrl: null,
  googleRatingSnapshot: null,
  googleReviewCountSnapshot: null,
  publicDataReviewedAt: null,
  metaTitle: null,
  metaDescription: null,
  capacity: 100,
  foundedYear: 2018,
  mapPoint: { lat: 41.4065678, lng: 2.1736872, precision: 'exact' },
};

describe('ClubDirectoryMap', () => {
  beforeEach(() => {
    mockFlyTo.mockClear();
    mockEaseTo.mockClear();
    mockFitBounds.mockClear();
    mockStop.mockClear();
    mockRemoveMap.mockClear();
    mockAddControl.mockClear();
    mockMarkerRemove.mockClear();
    mockResize.mockClear();
  });

  it('renders visible OpenStreetMap attribution', async () => {
    render(<ClubDirectoryMap clubs={[baseClub]} cityCenter={{ lat: 41.3851, lng: 2.1734 }} />);

    expect(screen.getByText('© OpenStreetMap contributors')).toBeInTheDocument();
    await waitFor(() => expect(mockAddControl).toHaveBeenCalled());
  });

  it('renders a marker button for mappable clubs and calls selection', async () => {
    const handleSelectClub = vi.fn();
    render(<ClubDirectoryMap clubs={[baseClub]} cityCenter={{ lat: 41.3851, lng: 2.1734 }} onSelectClub={handleSelectClub} />);

    const marker = await screen.findByRole('button', { name: 'Club 311 Barcelona, Verified Profile, Eixample' });
    await userEvent.click(marker);

    expect(handleSelectClub).toHaveBeenCalledWith('club-1');
    const previews = await screen.findAllByRole('article', { name: /Club 311 Barcelona Verified Profile/i });
    expect(previews.length).toBeGreaterThan(0);
    await waitFor(() => expect(mockEaseTo).toHaveBeenCalledWith(expect.objectContaining({
      center: [2.1736872, 41.4065678],
    })));
    expect(mockStop).toHaveBeenCalled();
  });

  it('does not print exact source coordinates in marker UI', async () => {
    render(<ClubDirectoryMap clubs={[baseClub]} cityCenter={{ lat: 41.3851, lng: 2.1734 }} />);

    await screen.findByRole('button', { name: 'Club 311 Barcelona, Verified Profile, Eixample' });
    expect(screen.queryByText('41.4065678')).not.toBeInTheDocument();
    expect(screen.queryByText('2.1736872')).not.toBeInTheDocument();
  });

  it('renders public listing markers when they have valid coordinates', async () => {
    render(
      <ClubDirectoryMap
        clubs={[{
          ...baseClub,
          id: 'club-public',
          name: 'Dragon club',
          slug: 'dragon-club-barcelona',
          isVerified: false,
          verificationStatus: 'UNVERIFIED',
          mapPoint: { lat: 41.389, lng: 2.17, precision: 'exact' },
        }]}
        cityCenter={{ lat: 41.3851, lng: 2.1734 }}
      />
    );

    const marker = await screen.findByRole('button', { name: 'Dragon club, Public Listing, Eixample' });
    expect(marker).toHaveClass('scm-map-marker-public');
    expect(marker.querySelector('.scm-map-marker-icon')).toBeInTheDocument();
  });

  it('renders an empty state when no clubs have map points', () => {
    render(<ClubDirectoryMap clubs={[{ ...baseClub, mapPoint: null }]} cityCenter={{ lat: 41.3851, lng: 2.1734 }} />);

    expect(screen.getByRole('heading', { name: 'No mappable club profiles' })).toBeInTheDocument();
  });
});
