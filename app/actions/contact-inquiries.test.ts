import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    contactInquiry: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    profile: {
      findMany: vi.fn(),
    },
    notification: {
      createMany: vi.fn(),
    },
  },
}));

vi.mock('@/lib/platform-control', () => ({
  getPlatformControlState: vi.fn(),
}));

vi.mock('@/lib/communications/subscriptions', () => ({
  subscribeMarketingEmail: vi.fn(),
}));

vi.mock('@/lib/email/contact', () => ({
  sendContactInquiryReceivedEmail: vi.fn(),
}));

vi.mock('@/lib/security/admin-audit', () => ({
  logAdminAuditEvent: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/security/admin-guard', () => ({
  getAdminSessionProfile: vi.fn(),
}));

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getPlatformControlState } from '@/lib/platform-control';
import { subscribeMarketingEmail } from '@/lib/communications/subscriptions';
import { sendContactInquiryReceivedEmail } from '@/lib/email/contact';
import { getAdminSessionProfile } from '@/lib/security/admin-guard';
import { logAdminAuditEvent } from '@/lib/security/admin-audit';
import { initialContactInquiryState } from '@/lib/contact-inquiries';
import {
  submitContactInquiryAction,
  updateContactInquiryStatusAction,
} from '@/app/actions/contact-inquiries';

const mockAdmin = {
  id: '550e8400-e29b-41d4-a716-446655440120',
  authId: '550e8400-e29b-41d4-a716-446655440121',
  email: 'founder@example.com',
  displayName: 'Founder',
  avatarUrl: null,
  role: 'ADMIN' as const,
};

function buildContactInquiryFormData(overrides?: {
  subscribeToUpdates?: boolean;
  category?: string;
}) {
  const formData = new FormData();
  formData.append('name', 'Ada Lovelace');
  formData.append('email', 'ADA@Example.com');
  formData.append('category', overrides?.category ?? 'PARTNERSHIP');
  formData.append('subject', 'Potential operator partnership');
  formData.append(
    'message',
    'I would like to discuss a potential operator partnership and platform collaboration with more detail.'
  );
  formData.append('locale', 'en');
  formData.append('source', 'contact_page');

  if (overrides?.subscribeToUpdates ?? true) {
    formData.append('subscribeToUpdates', 'on');
  }

  return formData;
}

function buildInquiryUpdateFormData() {
  const formData = new FormData();
  formData.append('returnPath', '/en/admin/communications');
  formData.append('inquiryId', '550e8400-e29b-41d4-a716-446655440122');
  formData.append('status', 'RESOLVED');
  formData.append('adminNotes', 'Founder reviewed the inquiry and sent a follow-up.');
  return formData;
}

describe('contact inquiries actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getPlatformControlState).mockResolvedValue({
      contactInquiryIntakeEnabled: true,
      marketingLeadCaptureEnabled: true,
      membershipIntakeEnabled: true,
    });

    vi.mocked(prisma.contactInquiry.create).mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440122',
    } as never);
    vi.mocked(prisma.profile.findMany).mockResolvedValue([
      { id: '550e8400-e29b-41d4-a716-446655440123' },
      { id: '550e8400-e29b-41d4-a716-446655440124' },
    ] as never);
    vi.mocked(prisma.notification.createMany).mockResolvedValue({ count: 2 } as never);
    vi.mocked(sendContactInquiryReceivedEmail).mockResolvedValue({
      success: true,
      provider: 'RESEND',
      messageId: 'msg_contact_1',
    });
    vi.mocked(subscribeMarketingEmail).mockResolvedValue({
      success: true,
      subscription: null,
      event: null,
    } as never);
    vi.mocked(getAdminSessionProfile).mockResolvedValue(mockAdmin);
    vi.mocked(prisma.contactInquiry.findUnique).mockResolvedValue({
      status: 'NEW',
      assignedAdminProfileId: null,
      resolvedAt: null,
      adminNotes: null,
    } as never);
    vi.mocked(prisma.contactInquiry.update).mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440122',
    } as never);
  });

  it('blocks public inquiry submission when the intake control is paused', async () => {
    vi.mocked(getPlatformControlState).mockResolvedValue({
      contactInquiryIntakeEnabled: false,
      marketingLeadCaptureEnabled: true,
      membershipIntakeEnabled: true,
    });

    const result = await submitContactInquiryAction(initialContactInquiryState, buildContactInquiryFormData());

    expect(result).toEqual({
      status: 'error',
      message: 'Contact intake is temporarily paused. Please try again shortly.',
    });
    expect(prisma.contactInquiry.create).not.toHaveBeenCalled();
    expect(sendContactInquiryReceivedEmail).not.toHaveBeenCalled();
  });

  it('captures a public inquiry, notifies admins, and optionally subscribes the sender', async () => {
    const result = await submitContactInquiryAction(initialContactInquiryState, buildContactInquiryFormData());

    expect(result).toEqual({
      status: 'success',
      message: 'Your message is now in the SCM operations inbox. We also sent a confirmation email.',
      inquiryId: '550e8400-e29b-41d4-a716-446655440122',
    });
    expect(prisma.contactInquiry.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'ada@example.com',
        category: 'PARTNERSHIP',
        source: 'contact_page',
        metadata: {
          subscribeToUpdates: true,
        },
      }),
      select: {
        id: true,
      },
    });
    expect(prisma.notification.createMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          userId: '550e8400-e29b-41d4-a716-446655440123',
          type: 'CONTACT_INQUIRY_NEW',
        }),
        expect.objectContaining({
          userId: '550e8400-e29b-41d4-a716-446655440124',
          type: 'CONTACT_INQUIRY_NEW',
        }),
      ],
    });
    expect(sendContactInquiryReceivedEmail).toHaveBeenCalledWith({
      inquiryId: '550e8400-e29b-41d4-a716-446655440122',
      email: 'ADA@Example.com',
      name: 'Ada Lovelace',
      locale: 'en',
      categoryLabel: 'Partnership',
    });
    expect(subscribeMarketingEmail).toHaveBeenCalledWith({
      email: 'ADA@Example.com',
      locale: 'en',
      source: 'contact_inquiry_opt_in',
      metadata: {
        inquiryId: '550e8400-e29b-41d4-a716-446655440122',
        category: 'PARTNERSHIP',
      },
    });
  });

  it('updates inquiry triage state, assigns the acting admin, and redirects with success status', async () => {
    await updateContactInquiryStatusAction(buildInquiryUpdateFormData());

    expect(prisma.contactInquiry.update).toHaveBeenCalledWith({
      where: { id: '550e8400-e29b-41d4-a716-446655440122' },
      data: expect.objectContaining({
        status: 'RESOLVED',
        adminNotes: 'Founder reviewed the inquiry and sent a follow-up.',
        assignedAdminProfileId: mockAdmin.id,
        resolvedAt: expect.any(Date),
      }),
    });
    expect(logAdminAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: 'ADMIN_UPDATE_CONTACT_INQUIRY',
        recordId: '550e8400-e29b-41d4-a716-446655440122',
      })
    );
    expect(redirect).toHaveBeenCalledWith(
      '/en/admin/communications?status=success&message=Inquiry+triage+updated.'
    );
  });
});
