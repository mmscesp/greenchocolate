import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ClubCard } from '@/app/actions/clubs';
import ClubsPageClient from './ClubsPageClient';

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt, fill: _fill, priority: _priority, ...props }: { alt: string; src: string; fill?: boolean; priority?: boolean }) => <img alt={alt} {...props} />,
}));

vi.mock('@/components/clubs/ClubDirectoryMapView', () => ({
  default: ({ clubs }: { clubs: ClubCard[] }) => (
    <div data-testid="club-directory-map-view">Map clubs: {clubs.map((club) => club.name).join(', ')}</div>
  ),
}));

vi.mock('@/components/ClubCard', () => ({
  default: ({ club }: { club: ClubCard }) => <article>{club.name}</article>,
}));

vi.mock('@/components/FilterBar', () => ({
  default: () => <div data-testid="filter-bar" />,
}));

vi.mock('@/components/StructuredData', () => ({
  CollectionPageStructuredData: () => null,
}));

vi.mock('@/components/landing/editorial-concierge/typography/EditorialHeading', () => ({
  EditorialHeading: ({ as: Tag = 'h2', children, className }: { as?: keyof JSX.IntrinsicElements; children: React.ReactNode; className?: string }) => (
    <Tag className={className}>{children}</Tag>
  ),
}));

vi.mock('@/components/landing/editorial-concierge/typography/ConciergeLabel', () => ({
  ConciergeLabel: ({ children, className }: { children: React.ReactNode; className?: string }) => <span className={className}>{children}</span>,
}));

vi.mock('@/components/landing/editorial-concierge/layout/SectionWrapper', () => ({
  SectionWrapper: ({ children, className }: { children: React.ReactNode; className?: string }) => <section className={className}>{children}</section>,
}));

vi.mock('@/components/landing/editorial-concierge/interactive/PulsingStatusDot', () => ({
  PulsingStatusDot: () => <span data-testid="status-dot" />,
}));

vi.mock('@/app/actions/clubs', () => ({
  getClubs: vi.fn(async () => []),
}));

vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
}));

vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    language: 'en',
    t: (key: string) => {
      const dictionary: Record<string, string> = {
        'clubs.subtitle': 'Compare verified profiles and clearly labeled public listings before you make plans.',
        'clubs.title': 'Club Directory',
        'clubs.verified_directory': 'Club Directory',
        'clubs.hero.title_prefix': 'Discover',
        'clubs.hero.title_highlight': 'Social Club',
        'clubs.hero.title_suffix': 'Profiles',
        'clubs.status_explainer.verified.title': 'Verified Profile',
        'clubs.status_explainer.verified.body': 'Trust signal, not a guarantee.',
        'clubs.status_explainer.public.title': 'Public Listing',
        'clubs.status_explainer.public.body': 'Research starting point only.',
        'clubs.sidebar.concierge_tip': 'Concierge Tip',
        'clubs.sidebar.concierge_quote': 'Compare profile status before making plans.',
        'clubs.sidebar.learn_standard': 'Learn standard',
        'clubs.view_mode.grid': 'Grid View',
        'clubs.view_mode.map': 'Map View',
        'clubs.status.updating_directory': 'Updating directory...',
        'city_clubs.label': 'City directory',
        'city_clubs.hero_highlight': 'Club Directory',
        'city_clubs.showing_count': 'Showing {{visible}} of {{total}} profiles',
        'city_clubs.view_more_profiles': 'View more profiles',
        'city_clubs.scope_note': 'City scoped',
        'clubs.no_results.title': 'No clubs found',
        'clubs.no_results.subtitle': 'Adjust filters.',
        'clubs.clear_filters': 'Clear filters',
      };
      return dictionary[key] ?? key;
    },
  }),
}));

const club: ClubCard = {
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

describe('ClubsPageClient map mode', () => {
  it('opens in map view by default with the current clubs', () => {
    render(
      <ClubsPageClient
        initialClubs={[club]}
        neighborhoods={['Eixample']}
        amenities={['Private Lounge Areas']}
        vibes={['Community-Focused']}
        cityContext={{
          cityName: 'Barcelona',
          citySlug: 'barcelona',
          backHref: '/en/spain/barcelona',
          backLabel: 'Back to Barcelona',
          title: 'Barcelona Club Directory',
          subtitle: 'Profiles in Barcelona.',
        }}
        cityCenter={{ lat: 41.3851, lng: 2.1734 }}
      />
    );

    expect(screen.getByTestId('club-directory-map-view')).toHaveTextContent('Club 311 Barcelona');
    expect(screen.queryByTestId('filter-bar')).not.toBeInTheDocument();
  });

  it('keeps grid view available from the view toggle', async () => {
    render(
      <ClubsPageClient
        initialClubs={[club]}
        neighborhoods={['Eixample']}
        amenities={['Private Lounge Areas']}
        vibes={['Community-Focused']}
        cityContext={{
          cityName: 'Barcelona',
          citySlug: 'barcelona',
          backHref: '/en/spain/barcelona',
          backLabel: 'Back to Barcelona',
          title: 'Barcelona Club Directory',
          subtitle: 'Profiles in Barcelona.',
        }}
        cityCenter={{ lat: 41.3851, lng: 2.1734 }}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /grid view/i }));

    expect(screen.getByTestId('filter-bar')).toBeInTheDocument();
    expect(screen.getByText('Club 311 Barcelona')).toBeInTheDocument();
    expect(screen.queryByTestId('club-directory-map-view')).not.toBeInTheDocument();
  });
});
