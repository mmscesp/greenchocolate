/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MembershipApplicationModal from '@/components/clubs/MembershipApplicationModal';
import type { Club } from '@/lib/types';

const submitMembershipApplicationMock = vi.fn();
const createMembershipApplicationLeadMock = vi.fn();
const useAuthMock = vi.fn();

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { alt, fill: _fill, ...rest } = props;
    return <img alt={typeof alt === 'string' ? alt : ''} {...rest} />;
  },
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, type = 'button', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type={type} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({
    checked,
    onCheckedChange,
    ...props
  }: {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onCheckedChange?.(event.target.checked)}
      {...props}
    />
  ),
}));

vi.mock('@/components/ui/select', async () => {
  const React = await import('react');

  type SelectItemData = {
    value: string;
    label: string;
  };

  const SelectContext = React.createContext<{
    value?: string;
    onValueChange?: (value: string) => void;
    items: SelectItemData[];
    placeholder?: string;
  }>({ items: [] });

  const ITEM_TYPE = Symbol('SelectItem');
  const VALUE_TYPE = Symbol('SelectValue');

  const SelectItem = ({ children }: { children: ReactNode }) => <>{children}</>;
  (SelectItem as unknown as { __type?: symbol }).__type = ITEM_TYPE;

  const SelectValue = () => null;
  (SelectValue as unknown as { __type?: symbol }).__type = VALUE_TYPE;

  function flattenText(node: ReactNode): string {
    if (typeof node === 'string' || typeof node === 'number') {
      return String(node);
    }

    if (Array.isArray(node)) {
      return node.map(flattenText).join('');
    }

    if (React.isValidElement(node)) {
      return flattenText(node.props.children);
    }

    return '';
  }

  function collectItems(children: ReactNode): SelectItemData[] {
    const items: SelectItemData[] = [];

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) {
        return;
      }

      const childType = child.type as { __type?: symbol };
      if (childType.__type === ITEM_TYPE) {
        items.push({
          value: child.props.value,
          label: flattenText(child.props.children),
        });
        return;
      }

      if (child.props?.children) {
        items.push(...collectItems(child.props.children));
      }
    });

    return items;
  }

  function findPlaceholder(children: ReactNode): string | undefined {
    let placeholder: string | undefined;

    React.Children.forEach(children, (child) => {
      if (placeholder || !React.isValidElement(child)) {
        return;
      }

      const childType = child.type as { __type?: symbol };
      if (childType.__type === VALUE_TYPE) {
        placeholder = child.props.placeholder;
        return;
      }

      if (child.props?.children) {
        placeholder = findPlaceholder(child.props.children);
      }
    });

    return placeholder;
  }

  const Select = ({
    value,
    onValueChange,
    children,
  }: {
    value?: string;
    onValueChange?: (value: string) => void;
    children: ReactNode;
  }) => (
    <SelectContext.Provider
      value={{
        value,
        onValueChange,
        items: collectItems(children),
        placeholder: findPlaceholder(children),
      }}
    >
      {children}
    </SelectContext.Provider>
  );

  const SelectTrigger = React.forwardRef<
    HTMLSelectElement,
    React.SelectHTMLAttributes<HTMLSelectElement>
  >(({ id, className, ...props }, ref) => {
    const context = React.useContext(SelectContext);

    return (
      <select
        ref={ref}
        id={id}
        className={className}
        value={context.value ?? ''}
        onChange={(event) => context.onValueChange?.(event.target.value)}
        {...props}
      >
        <option value="">{context.placeholder ?? ''}</option>
        {context.items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    );
  });
  SelectTrigger.displayName = 'MockSelectTrigger';

  const SelectContent = ({ children }: { children: ReactNode }) => <>{children}</>;
  SelectContent.displayName = 'MockSelectContent';

  return {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  };
});

vi.mock('framer-motion', () => {
  const createTag = (tag: keyof JSX.IntrinsicElements) => {
    const MockMotionTag = ({
      children,
      whileTap: _whileTap,
      whileHover: _whileHover,
      transition: _transition,
      ...props
    }: JSX.IntrinsicElements[typeof tag] & Record<string, unknown>) => {
      const Component = tag;
      return <Component {...props}>{children}</Component>;
    };
    MockMotionTag.displayName = `MockMotion${tag}`;
    return MockMotionTag;
  };

  return {
    AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
    motion: {
      div: createTag('div'),
      button: createTag('button'),
      create: () => createTag('div'),
    },
    useReducedMotion: () => true,
  };
});

vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    language: 'en',
    t: (key: string) =>
      (
        {
          'club_profile.modal.title': 'Apply to Join',
          'club_profile.modal.first_name': 'First Name',
          'club_profile.modal.last_name': 'Last Name',
          'club_profile.modal.email': 'Email',
          'club_profile.modal.city': 'City',
          'club_profile.modal.country': 'Country',
          'club_profile.modal.country_placeholder': 'Select your country...',
          'club_profile.modal.experience': 'Your cannabis journey',
          'club_profile.modal.experience_placeholder': 'Select your experience level...',
          'club_profile.modal.experience.curious': '🌱 Just curious (first time)',
          'club_profile.modal.experience.casual': '🌿 Casual enjoyer (occasional)',
          'club_profile.modal.experience.regular': '🌲 Regular member (weekly)',
          'club_profile.modal.experience.connoisseur': '🏆 Green connoisseur (daily/expert)',
          'club_profile.modal.experience.medical': '💚 Medical patient',
          'club_profile.modal.message': 'Tell us about yourself',
          'club_profile.modal.message_placeholder': 'Why do you want to join? Any context that helps our review?',
          'club_profile.modal.phone': 'Phone (optional)',
          'club_profile.modal.phone_hint': "We'll only call for urgent updates",
          'club_profile.modal.age_confirmation': 'I am 18+ and confirm cannabis is legal in my jurisdiction',
          'club_profile.modal.terms_agreement': 'I agree to the Terms of Service and Privacy Policy',
          'club_profile.modal.submit': 'Submit Application',
          'club_profile.modal.success.message': 'SocialClubsMaps received your application. We review it centrally and unlock gated club details after approval.',
          'club_profile.modal.success.create_account': 'Create an account to track your platform review',
          'club_profile.form.error_unexpected': 'Unexpected error',
          'common.close_modal': 'Close modal',
          'form.submitting': 'Submitting...',
          'form.cancel': 'Cancel',
        } as Record<string, string>
      )[key] ?? key,
  }),
}));

vi.mock('@/components/auth/AuthProvider', () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock('@/app/actions/applications', () => ({
  submitMembershipApplication: (...args: unknown[]) =>
    submitMembershipApplicationMock(...args),
  createMembershipApplicationLead: (...args: unknown[]) =>
    createMembershipApplicationLeadMock(...args),
}));

const club: Club = {
  id: 'club-1',
  slug: 'club-one',
  name: 'Club One',
  description: 'Test club',
  cityId: 'city-1',
  neighborhood: 'Center',
  addressDisplay: 'Test address',
  coordinates: {},
  contactEmail: 'club@example.com',
  isVerified: true,
  isActive: true,
  allowsPreRegistration: true,
  openingHours: {},
  amenities: [],
  vibeTags: [],
  priceRange: '$$',
  capacity: 100,
  foundedYear: 2024,
  images: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function completeRequiredFields() {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText(/first name/i), 'Ada');
  await user.type(screen.getByLabelText(/last name/i), 'Lovelace');
  await user.type(screen.getByLabelText(/^email/i), 'ada@example.com');
  await user.type(screen.getByLabelText(/^city/i), 'Barcelona');

  await user.selectOptions(screen.getByLabelText(/country/i), 'ES');

  await user.selectOptions(screen.getAllByRole('combobox')[1], 'regular');

    await user.type(screen.getByLabelText(/tell us about yourself/i), 'Interested in responsible membership.');
  await user.click(screen.getByLabelText(/i am 18\+/i));
  await user.click(screen.getByLabelText(/i agree to the terms/i));
}

describe('MembershipApplicationModal', () => {
  beforeEach(() => {
    submitMembershipApplicationMock.mockReset();
    createMembershipApplicationLeadMock.mockReset();
    sessionStorage.clear();
  });

  it('submits country label and country code for authenticated users', async () => {
    useAuthMock.mockReturnValue({ user: { id: 'user-1' } });
    submitMembershipApplicationMock.mockResolvedValue({ success: true });

    render(
      <MembershipApplicationModal
        club={club}
        isOpen
        onClose={vi.fn()}
        clubImage="/club.jpg"
      />
    );

    await completeRequiredFields();

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    expect(submitButton).toBeEnabled();

    await userEvent.setup().click(submitButton);

    await waitFor(() => {
      expect(submitMembershipApplicationMock).toHaveBeenCalledWith({
        targetClubId: 'club-1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        city: 'Barcelona',
        country: 'Spain',
        countryCode: 'ES',
        experience: 'regular',
        message: 'Interested in responsible membership.',
        phone: '',
        ageConfirmed: true,
        termsConfirmed: true,
      });
    });
  });

  it('stores country label and country code in pending guest applications', async () => {
    useAuthMock.mockReturnValue({ user: null });
    createMembershipApplicationLeadMock.mockResolvedValue({
      success: true,
      pendingLeadToken: 'pending-token',
      expiresAt: '2026-03-09T00:00:00.000Z',
    });

    render(
      <MembershipApplicationModal
        club={club}
        isOpen
        onClose={vi.fn()}
        clubImage="/club.jpg"
      />
    );

    await completeRequiredFields();
    await userEvent.setup().click(screen.getByRole('button', { name: /submit application/i }));

    await waitFor(() => {
      expect(createMembershipApplicationLeadMock).toHaveBeenCalledWith({
        targetClubId: 'club-1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        city: 'Barcelona',
        country: 'Spain',
        countryCode: 'ES',
        experience: 'regular',
        message: 'Interested in responsible membership.',
        phone: '',
        ageConfirmed: true,
        termsConfirmed: true,
      });

      const pendingLead = sessionStorage.getItem('pendingMembershipLead');
      expect(pendingLead).not.toBeNull();

      expect(JSON.parse(pendingLead as string)).toMatchObject({
        pendingLeadToken: 'pending-token',
        clubId: 'club-1',
        clubSlug: 'club-one',
        expiresAt: '2026-03-09T00:00:00.000Z',
      });
    });
  });
});
