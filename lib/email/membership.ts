import { CommunicationAudience, EmailProviderRoute } from '@prisma/client';
import { enqueueAndProcessEmailOutbox } from '@/lib/communications/outbox';
import type { TransactionalEmailSendResult } from '@/lib/email/service';
import { publicEnv } from '@/lib/env';
import { isLocale, type Locale } from '@/lib/i18n-config';
import {
  renderMembershipDecisionEmail,
  renderMembershipSubmissionEmail,
} from '@/lib/email/templates/resend/membership';

type MembershipEmailContext = {
  applicantEmail: string;
  applicantName?: string | null;
  clubName: string;
  requestId: string;
  notes?: string | null;
};

type MembershipApprovalEmailContext = {
  applicantEmail: string;
  applicantName?: string | null;
  clubName: string;
  requestId: string;
  locale?: string | null;
  decisionNote?: string | null;
};

export type MembershipApprovalEmailResult = TransactionalEmailSendResult & {
  locale: Locale;
  fallbackUsed: boolean;
  requestsUrl: string;
};

export type MembershipRejectionEmailResult = MembershipApprovalEmailResult;

function resolveLocaleOrDefault(input?: string | null): Locale {
  return input && isLocale(input) ? input : 'en';
}

function resolveMembershipDecisionLocale(requestLocale?: string | null): {
  locale: Locale;
  fallbackUsed: boolean;
} {
  const locale = resolveLocaleOrDefault(requestLocale);

  return {
    locale,
    fallbackUsed: Boolean(requestLocale && requestLocale !== locale),
  };
}

function getMembershipRequestsUrl(locale: Locale): string {
  const appUrl = publicEnv.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  const path = `/${locale}/profile/requests`;
  return appUrl ? `${appUrl}${path}` : path;
}

export async function sendMembershipSubmissionEmail(context: MembershipEmailContext) {
  const requestsUrl = getMembershipRequestsUrl('en');
  const template = renderMembershipSubmissionEmail({
    clubName: context.clubName,
    requestId: context.requestId,
    requestsUrl,
  });

  return enqueueAndProcessEmailOutbox({
    type: 'MEMBERSHIP_SUBMISSION_EMAIL',
    audience: CommunicationAudience.TRANSACTIONAL,
    route: EmailProviderRoute.TRANSACTIONAL,
    relatedRequestId: context.requestId,
    recipientEmail: context.applicantEmail,
    subject: template.subject,
    idempotencyKey: `membership-submission:${context.requestId}`,
    payload: {
      route: EmailProviderRoute.TRANSACTIONAL,
      input: {
        to: [
          {
            email: context.applicantEmail,
            name: context.applicantName || undefined,
          },
        ],
        subject: template.subject,
        htmlContent: template.htmlContent,
        textContent: template.textContent,
        idempotencyKey: `membership-submission:${context.requestId}`,
        tags: [
          {
            name: 'category',
            value: 'membership',
          },
        ],
      },
    },
  });
}

export async function sendMembershipApprovalEmail(
  context: MembershipApprovalEmailContext
): Promise<MembershipApprovalEmailResult> {
  const { locale, fallbackUsed } = resolveMembershipDecisionLocale(context.locale);
  const requestsUrl = getMembershipRequestsUrl(locale);
  const template = renderMembershipDecisionEmail({
    variant: 'approved',
    locale,
    clubName: context.clubName,
    requestId: context.requestId,
    decisionNote: context.decisionNote,
    requestsUrl,
  });

  const result = await enqueueAndProcessEmailOutbox({
    type: 'MEMBERSHIP_APPROVAL_EMAIL',
    audience: CommunicationAudience.TRANSACTIONAL,
    route: EmailProviderRoute.TRANSACTIONAL,
    relatedRequestId: context.requestId,
    recipientEmail: context.applicantEmail,
    locale,
    subject: template.subject,
    idempotencyKey: `membership-approved:${context.requestId}`,
    payload: {
      route: EmailProviderRoute.TRANSACTIONAL,
      input: {
        to: [
          {
            email: context.applicantEmail,
            name: context.applicantName || undefined,
          },
        ],
        subject: template.subject,
        htmlContent: template.htmlContent,
        textContent: template.textContent,
        idempotencyKey: `membership-approved:${context.requestId}`,
        tags: [
          {
            name: 'category',
            value: 'membership',
          },
          {
            name: 'status',
            value: 'approved',
          },
        ],
      },
    },
  }).catch((error) => ({
    success: false,
    provider: 'RESEND' as const,
    error: error instanceof Error ? error.message : 'Unknown email error',
  })) as TransactionalEmailSendResult;

  return {
    ...result,
    locale,
    fallbackUsed,
    requestsUrl,
  };
}

export async function sendMembershipRejectionEmail(
  context: MembershipApprovalEmailContext
): Promise<MembershipRejectionEmailResult> {
  const { locale, fallbackUsed } = resolveMembershipDecisionLocale(context.locale);
  const requestsUrl = getMembershipRequestsUrl(locale);
  const template = renderMembershipDecisionEmail({
    variant: 'rejected',
    locale,
    clubName: context.clubName,
    requestId: context.requestId,
    decisionNote: context.decisionNote,
    requestsUrl,
  });

  const result = await enqueueAndProcessEmailOutbox({
    type: 'MEMBERSHIP_REJECTION_EMAIL',
    audience: CommunicationAudience.TRANSACTIONAL,
    route: EmailProviderRoute.TRANSACTIONAL,
    relatedRequestId: context.requestId,
    recipientEmail: context.applicantEmail,
    locale,
    subject: template.subject,
    idempotencyKey: `membership-rejected:${context.requestId}`,
    payload: {
      route: EmailProviderRoute.TRANSACTIONAL,
      input: {
        to: [
          {
            email: context.applicantEmail,
            name: context.applicantName || undefined,
          },
        ],
        subject: template.subject,
        htmlContent: template.htmlContent,
        textContent: template.textContent,
        idempotencyKey: `membership-rejected:${context.requestId}`,
        tags: [
          {
            name: 'category',
            value: 'membership',
          },
          {
            name: 'status',
            value: 'rejected',
          },
        ],
      },
    },
  }).catch((error) => ({
    success: false,
    provider: 'RESEND' as const,
    error: error instanceof Error ? error.message : 'Unknown email error',
  })) as TransactionalEmailSendResult;

  return {
    ...result,
    locale,
    fallbackUsed,
    requestsUrl,
  };
}
