import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
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
