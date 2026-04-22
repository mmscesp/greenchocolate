'use server';

import { ContactInquiryCategory, ContactInquiryStatus } from '@prisma/client';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { subscribeMarketingEmail } from '@/lib/communications/subscriptions';
import {
  contactInquiryCategoryOptions,
  type ContactInquiryFormState,
} from '@/lib/contact-inquiries';
import { sendContactInquiryReceivedEmail } from '@/lib/email/contact';
import { prisma } from '@/lib/prisma';
import { logAdminAuditEvent } from '@/lib/security/admin-audit';
import { getAdminSessionProfile } from '@/lib/security/admin-guard';
import {
  getSafeAdminReturnPath,
  revalidateAdminPortalPaths,
  withAdminActionStatus,
} from '@/lib/security/admin-portal';
import { getPlatformControlState } from '@/lib/platform-control';

const createContactInquirySchema = z.object({
  name: z.string().trim().min(2, 'Please share your name.').max(120),
  email: z.string().trim().email('Please use a valid email address.'),
  category: z.nativeEnum(ContactInquiryCategory),
  subject: z.string().trim().min(4, 'Please add a short subject.').max(160),
  message: z.string().trim().min(20, 'Please add a bit more detail.').max(4000),
  locale: z.string().trim().optional(),
  source: z.string().trim().max(120).optional(),
  subscribeToUpdates: z.boolean().default(false),
});

const updateContactInquirySchema = z.object({
  inquiryId: z.string().uuid(),
  status: z.nativeEnum(ContactInquiryStatus),
  adminNotes: z.string().trim().max(4000).optional(),
});

function normalizeBooleanField(value: FormDataEntryValue | null) {
  return value === 'true' || value === 'on';
}

function getCategoryLabel(category: ContactInquiryCategory) {
  return contactInquiryCategoryOptions.find((option) => option.value === category)?.label ?? category;
}

async function createAdminNotificationsForInquiry(input: {
  inquiryId: string;
  email: string;
  subject: string;
  category: ContactInquiryCategory;
}) {
  const admins = await prisma.profile.findMany({
    where: { role: 'ADMIN' },
    select: { id: true },
  });

  if (admins.length === 0) {
    return;
  }

  await prisma.notification.createMany({
    data: admins.map((admin) => ({
      userId: admin.id,
      type: 'CONTACT_INQUIRY_NEW',
      title: 'New contact inquiry',
      message: `${getCategoryLabel(input.category)} from ${input.email}: ${input.subject}`,
      data: {
        inquiryId: input.inquiryId,
        category: input.category,
      },
    })),
  });
}

export async function submitContactInquiryAction(
  _previousState: ContactInquiryFormState,
  formData: FormData
): Promise<ContactInquiryFormState> {
  const controls = await getPlatformControlState();
  if (!controls.contactInquiryIntakeEnabled) {
    return {
      status: 'error',
      message: 'Contact intake is temporarily paused. Please try again shortly.',
    };
  }

  const parsed = createContactInquirySchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    category: formData.get('category'),
    subject: formData.get('subject'),
    message: formData.get('message'),
    locale: formData.get('locale'),
    source: formData.get('source'),
    subscribeToUpdates: normalizeBooleanField(formData.get('subscribeToUpdates')),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.errors[0]?.message || 'Please review the form and try again.',
    };
  }

  try {
    const inquiry = await prisma.contactInquiry.create({
      data: {
        locale: parsed.data.locale || null,
        source: parsed.data.source || 'contact_page',
        category: parsed.data.category,
        name: parsed.data.name,
        email: parsed.data.email.trim().toLowerCase(),
        subject: parsed.data.subject,
        message: parsed.data.message,
        metadata: {
          subscribeToUpdates: parsed.data.subscribeToUpdates,
        },
      },
      select: {
        id: true,
      },
    });

    await Promise.allSettled([
      createAdminNotificationsForInquiry({
        inquiryId: inquiry.id,
        email: parsed.data.email,
        subject: parsed.data.subject,
        category: parsed.data.category,
      }),
      sendContactInquiryReceivedEmail({
        inquiryId: inquiry.id,
        email: parsed.data.email,
        name: parsed.data.name,
        locale: parsed.data.locale,
        categoryLabel: getCategoryLabel(parsed.data.category),
      }),
      parsed.data.subscribeToUpdates
        ? subscribeMarketingEmail({
            email: parsed.data.email,
            locale: parsed.data.locale || null,
            source: 'contact_inquiry_opt_in',
            metadata: {
              inquiryId: inquiry.id,
              category: parsed.data.category,
            },
          })
        : Promise.resolve(null),
    ]);

    return {
      status: 'success',
      message: 'Your message is now in the SCM operations inbox. We also sent a confirmation email.',
      inquiryId: inquiry.id,
    };
  } catch (error) {
    console.error('submitContactInquiryAction error:', error);
    return {
      status: 'error',
      message: 'We could not submit your message. Please try again in a moment.',
    };
  }
}

export async function updateContactInquiryStatusAction(formData: FormData): Promise<void> {
  const admin = await getAdminSessionProfile();
  const returnPath = getSafeAdminReturnPath(formData.get('returnPath'), '/en/admin/communications');

  if (!admin) {
    redirect(withAdminActionStatus(returnPath, 'error', 'Admin session is required.'));
    return;
  }

  const parsed = updateContactInquirySchema.safeParse({
    inquiryId: formData.get('inquiryId'),
    status: formData.get('status'),
    adminNotes: formData.get('adminNotes'),
  });

  if (!parsed.success) {
    redirect(withAdminActionStatus(returnPath, 'error', parsed.error.errors[0]?.message || 'Invalid inquiry update.'));
    return;
  }

  const existing = await prisma.contactInquiry.findUnique({
    where: { id: parsed.data.inquiryId },
    select: {
      status: true,
      assignedAdminProfileId: true,
      resolvedAt: true,
      adminNotes: true,
    },
  });

  if (!existing) {
    redirect(withAdminActionStatus(returnPath, 'error', 'Inquiry not found.'));
    return;
  }

  const nextStatus = parsed.data.status;
  const nextNotes = parsed.data.adminNotes || null;

  await prisma.contactInquiry.update({
    where: { id: parsed.data.inquiryId },
    data: {
      status: nextStatus,
      adminNotes: nextNotes,
      assignedAdminProfileId: nextStatus === ContactInquiryStatus.NEW ? null : admin.id,
      resolvedAt:
        nextStatus === ContactInquiryStatus.RESOLVED || nextStatus === ContactInquiryStatus.SPAM
          ? new Date()
          : null,
    },
  });

  await logAdminAuditEvent({
    tableName: 'ContactInquiry',
    operation: 'ADMIN_UPDATE_CONTACT_INQUIRY',
    changedBy: admin.authId,
    recordId: parsed.data.inquiryId,
    changeData: {
      previousState: existing,
      nextState: {
        status: nextStatus,
        adminNotes: nextNotes,
        assignedAdminProfileId: nextStatus === ContactInquiryStatus.NEW ? null : admin.id,
      },
    },
  });

  revalidateAdminPortalPaths(['/communications', '/settings']);
  redirect(withAdminActionStatus(returnPath, 'success', 'Inquiry triage updated.'));
}
