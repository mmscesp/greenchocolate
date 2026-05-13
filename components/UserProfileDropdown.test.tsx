import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UserProfileDropdown from '@/components/UserProfileDropdown';

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  useLanguage: vi.fn(),
  getUnreadNotificationCount: vi.fn(),
}));

vi.mock('next/image', () => ({
  default: () => <span data-testid="mock-next-image" />,
}));

vi.mock('@/components/auth/AuthProvider', () => ({
  useAuth: mocks.useAuth,
}));

vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: mocks.useLanguage,
}));

vi.mock('@/app/actions/notifications', () => ({
  getUnreadNotificationCount: mocks.getUnreadNotificationCount,
}));

const dictionary: Record<string, string> = {
  'user.my_profile': 'My profile',
  'user.menu.profile_desc': 'Account settings',
  'user.favorites': 'Favorites',
  'user.menu.favorites_desc': 'Saved clubs',
  'user.my_reviews': 'My reviews',
  'user.menu.reviews_desc': 'Reviews',
  'user.bookings': 'Bookings',
  'user.bookings_desc': 'Bookings',
  'user.notifications': 'Notifications',
  'user.menu.new_count': '{{count}} new',
  'user.settings': 'Settings',
  'user.settings_desc': 'Settings',
  'user.member_since': 'Member since',
  'user.fallback.name': 'Member',
  'user.role.club_admin': 'Club Admin',
  'nav.dashboard': 'Club Panel',
  'nav.logout': 'Log out',
  'profile.nav.title': 'Profile navigation',
  'profile.subtitle': 'Manage your personal information and settings',
};

function mockSignedInProfile(role: 'USER' | 'ADMIN' | 'CLUB_ADMIN' = 'USER') {
  mocks.getUnreadNotificationCount.mockResolvedValue(0);
  mocks.useLanguage.mockReturnValue({
    language: 'en',
    t: (key: string) => dictionary[key] ?? key,
  });
  mocks.useAuth.mockReturnValue({
    loading: false,
    user: {
      id: 'user-1',
      email: 'member@example.com',
      user_metadata: {},
    },
    profile: {
      displayName: 'Member Name',
      email: 'member@example.com',
      role,
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    signOut: vi.fn(),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('UserProfileDropdown desktop trigger', () => {
  it('compacts long profile names and keeps tight width classes', async () => {
    mocks.getUnreadNotificationCount.mockResolvedValue(0);
    mocks.useLanguage.mockReturnValue({
      language: 'en',
      t: (key: string) => key,
    });
    mocks.useAuth.mockReturnValue({
      loading: false,
      user: {
        id: 'user-1',
        email: 'verylongusernameperson@example.com',
        user_metadata: {},
      },
      profile: {
        displayName: 'VeryLongUsernamePerson',
        role: 'USER',
      },
      signOut: vi.fn(),
    });

    render(<UserProfileDropdown />);

    const triggerButton = screen.getByRole('button');
    const compactName = screen.getByTestId('desktop-profile-name');

    expect(triggerButton).toHaveClass('max-w-[9rem]');
    expect(compactName).toHaveClass('max-w-[4.25rem]');
    expect(compactName).toHaveTextContent('VeryLong...');
  });
});

describe('UserProfileDropdown mobile menu row', () => {
  it('opens a high-layer profile drawer with a localized My profile link', async () => {
    const user = userEvent.setup();
    mockSignedInProfile();

    render(<UserProfileDropdown variant="mobile-menu-row" />);

    await user.click(screen.getByRole('button', { name: /member name/i }));

    const profileLink = await screen.findByRole('link', { name: /my profile/i });
    const drawerPanel = profileLink.closest('[data-vaul-drawer]');
    const drawerOverlay = document.querySelector('[data-vaul-overlay]');

    expect(profileLink).toHaveAttribute('href', '/en/profile');
    expect(drawerPanel).toHaveClass('z-[120]');
    expect(drawerOverlay).toHaveClass('z-[110]');
  });

  it('closes the mobile menu when My profile is selected', async () => {
    const user = userEvent.setup();
    const onMobileClose = vi.fn();
    mockSignedInProfile();

    render(<UserProfileDropdown variant="mobile-menu-row" onMobileClose={onMobileClose} />);

    await user.click(screen.getByRole('button', { name: /member name/i }));
    const profileLink = await screen.findByRole('link', { name: /my profile/i });
    profileLink.addEventListener('click', (event) => event.preventDefault());
    fireEvent.click(profileLink);

    expect(onMobileClose).toHaveBeenCalledTimes(1);
  });

  it('shows a protected club dashboard link for club admins', async () => {
    const user = userEvent.setup();
    mockSignedInProfile('CLUB_ADMIN');

    render(<UserProfileDropdown variant="mobile-menu-row" />);

    await user.click(screen.getByRole('button', { name: /member name/i }));

    expect(await screen.findByRole('link', { name: /club panel/i })).toHaveAttribute(
      'href',
      '/en/club-panel/dashboard'
    );
  });
});
