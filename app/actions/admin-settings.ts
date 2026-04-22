'use server';

import { getServerEnv } from '@/lib/env';
import { prisma } from '@/lib/prisma';
import { getMembershipSecurityConfig } from '@/lib/security/membership-application';
import { logAdminAuditEvent } from '@/lib/security/admin-audit';
import { getAdminSessionProfile } from '@/lib/security/admin-guard';
import {
  getSafeAdminReturnPath,
  revalidateAdminPortalPaths,
  withAdminActionStatus,
} from '@/lib/security/admin-portal';
import {
  getPlatformControlState,
  platformControlKeys,
  type PlatformControlKey,
} from '@/lib/platform-control';
import { redirect } from 'next/navigation';

type SettingsSummary = {
  adminCount: number;
  auditEvents: number;
  pendingVerifications: number;
  pendingRequests: number;
  pendingBookings: number;
  expiringSafetyPasses: number;
  openContactInquiries: number;
  newLeads7d: number;
};

const platformControlMeta: Record<
  PlatformControlKey,
  {
    label: string;
    description: string;
  }
> = {
  CONTACT_INQUIRY_INTAKE_ENABLED: {
    label: 'Contact inquiry intake',
    description: 'Allows the public contact form to create tracked inquiries in the admin inbox.',
  },
  MARKETING_LEAD_CAPTURE_ENABLED: {
    label: 'Marketing lead capture',
    description: 'Controls Safety Kit, newsletter, and concierge email capture before outbound marketing delivery.',
  },
  MEMBERSHIP_INTAKE_ENABLED: {
    label: 'Membership intake',
    description: 'Controls both guest lead capture and authenticated membership request submission.',
  },
};

function parseBooleanInput(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') {
    return null;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return null;
}

async function getSettingsSummary(): Promise<SettingsSummary> {
  const now = new Date();
  const next14Days = new Date(now);
  next14Days.setDate(next14Days.getDate() + 14);
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    adminCount,
    auditEvents,
    pendingVerifications,
    pendingRequests,
    pendingBookings,
    expiringSafetyPasses,
    openContactInquiries,
    newLeads7d,
  ] = await Promise.all([
    prisma.profile.count({ where: { role: 'ADMIN' } }),
    prisma.auditLog.count(),
    prisma.club.count({ where: { isVerified: false } }),
    prisma.membershipRequest.count({ where: { status: 'PENDING' } }),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.safetyPass.count({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          gt: now,
          lte: next14Days,
        },
      },
    }),
    prisma.contactInquiry.count({
      where: {
        status: {
          in: ['NEW', 'IN_PROGRESS'],
        },
      },
    }),
    prisma.emailSubscription.count({
      where: {
        marketingConsentAt: {
          gte: last7Days,
        },
      },
    }),
  ]);

  return {
    adminCount,
    auditEvents,
    pendingVerifications,
    pendingRequests,
    pendingBookings,
    expiringSafetyPasses,
    openContactInquiries,
    newLeads7d,
  };
}

export async function getAdminSettingsOverview() {
  const admin = await getAdminSessionProfile();
  if (!admin) {
    return null;
  }

  const env = getServerEnv();
  const membershipSecurity = getMembershipSecurityConfig();
  const [summary, controlState] = await Promise.all([
    getSettingsSummary(),
    getPlatformControlState(),
  ]);

  await logAdminAuditEvent({
    tableName: 'PlatformSetting',
    operation: 'ADMIN_VIEW_SETTINGS',
    changedBy: admin.authId,
    recordId: 'overview',
    changeData: {
      controlState,
      summary,
    },
  });

  return {
    summary,
    controls: platformControlKeys.map((key) => ({
      key,
      label: platformControlMeta[key].label,
      description: platformControlMeta[key].description,
      enabled:
        key === 'CONTACT_INQUIRY_INTAKE_ENABLED'
          ? controlState.contactInquiryIntakeEnabled
          : key === 'MARKETING_LEAD_CAPTURE_ENABLED'
            ? controlState.marketingLeadCaptureEnabled
            : controlState.membershipIntakeEnabled,
    })),
    readiness: {
      resendApi: Boolean(env.RESEND_API_KEY && env.RESEND_SENDER_EMAIL),
      resendWebhook: Boolean(env.RESEND_WEBHOOK_SECRET),
      brevoApi: Boolean(env.BREVO_API_KEY && env.BREVO_SENDER_EMAIL),
      brevoWebhook: Boolean(env.BREVO_WEBHOOK_SECRET),
      cronSecret: Boolean(env.COMMUNICATIONS_CRON_SECRET),
      turnstile: Boolean(env.TURNSTILE_SECRET_KEY && env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
      bootstrapSecret: Boolean(env.ADMIN_BOOTSTRAP_SECRET),
    },
    membershipSecurity: {
      guestSoftLimit: membershipSecurity.guestSoftLimit,
      guestHardLimit: membershipSecurity.guestHardLimit,
      authSoftLimit: membershipSecurity.authSoftLimit,
      authHardLimit: membershipSecurity.authHardLimit,
      windowMinutes: membershipSecurity.windowMinutes,
      leadTtlHours: membershipSecurity.leadTtlHours,
    },
  };
}

export async function updatePlatformControlSettingAction(formData: FormData): Promise<void> {
  const admin = await getAdminSessionProfile();
  const returnPath = getSafeAdminReturnPath(formData.get('returnPath'), '/en/admin/settings');

  if (!admin) {
    redirect(withAdminActionStatus(returnPath, 'error', 'Admin session is required.'));
    return;
  }

  const key = String(formData.get('key') || '').trim() as PlatformControlKey;
  const enabled = parseBooleanInput(formData.get('enabled'));

  if (!platformControlKeys.includes(key) || enabled === null) {
    redirect(withAdminActionStatus(returnPath, 'error', 'Invalid control update payload.'));
    return;
  }

  await prisma.platformSetting.upsert({
    where: { key },
    update: {
      value: { enabled },
      updatedBy: admin.authId,
    },
    create: {
      key,
      value: { enabled },
      updatedBy: admin.authId,
    },
  });

  await logAdminAuditEvent({
    tableName: 'PlatformSetting',
    operation: 'ADMIN_UPDATE_PLATFORM_CONTROL',
    changedBy: admin.authId,
    recordId: key,
    changeData: {
      enabled,
    },
  });

  revalidateAdminPortalPaths(['/settings', '/communications']);
  redirect(
    withAdminActionStatus(
      returnPath,
      'success',
      `${platformControlMeta[key].label} ${enabled ? 'enabled' : 'disabled'}.`
    )
  );
}
