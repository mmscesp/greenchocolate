import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PendingApplicationProcessor from '@/components/clubs/PendingApplicationProcessor';

const useAuthMock = vi.fn();
const finalizeMembershipApplicationLeadMock = vi.fn();
const pushMock = vi.fn();
const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();

function createStorageMock() {
  const store = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    clear: vi.fn(() => {
      store.clear();
    }),
  };
}

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock('@/components/auth/AuthProvider', () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock('@/app/actions/applications', () => ({
  finalizeMembershipApplicationLead: (...args: unknown[]) => finalizeMembershipApplicationLeadMock(...args),
}));

vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    language: 'en',
    t: (key: string) =>
      (
        {
          'club_profile.modal.success.message':
            'SocialClubsMaps received your application. We review it centrally and unlock gated club details after approval.',
          'form.submitting': 'Submitting...',
        } as Record<string, string>
      )[key] ?? key,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}));

describe('PendingApplicationProcessor', () => {
  beforeEach(() => {
    useAuthMock.mockReset();
    finalizeMembershipApplicationLeadMock.mockReset();
    pushMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();

    const sessionStorageMock = createStorageMock();
    const localStorageMock = createStorageMock();

    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      configurable: true,
    });
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      configurable: true,
    });
  });

  it('auto-finalizes a pending lead for the matching account and clears storage', async () => {
    useAuthMock.mockReturnValue({ user: { id: 'user-1' } });
    window.sessionStorage.setItem(
      'pendingMembershipLead',
      JSON.stringify({
        pendingLeadToken: 'pending-token',
        clubId: 'club-1',
        clubSlug: 'club-one',
        expiresAt: '2026-03-10T12:00:00.000Z',
      })
    );
    finalizeMembershipApplicationLeadMock.mockResolvedValue({
      success: true,
      applicationId: 'request-1',
    });

    render(<PendingApplicationProcessor />);

    await waitFor(() => {
      expect(finalizeMembershipApplicationLeadMock).toHaveBeenCalledWith({
        pendingLeadToken: 'pending-token',
      });
    });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/en/profile/requests');
    });

    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('pendingMembershipLead');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('pendingMembershipLead');
    expect(toastSuccessMock).toHaveBeenCalled();
  });
});
