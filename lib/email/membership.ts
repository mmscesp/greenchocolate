import { sendBrevoEmail, type BrevoSendResult } from '@/lib/email/brevo';
import { getServerEnv, publicEnv } from '@/lib/env';
import { isLocale, type Locale } from '@/lib/i18n-config';

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

export type MembershipApprovalEmailResult = BrevoSendResult & {
  locale: Locale;
  templateId?: number;
  fallbackUsed: boolean;
  requestsUrl: string;
};

function wrapHtml(title: string, body: string, requestId: string): string {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:640px;margin:0 auto;padding:24px;">
      <div style="margin-bottom:24px;">
        <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">SocialClubsMaps</div>
        <h1 style="margin:8px 0 0;font-size:28px;">${title}</h1>
      </div>
      ${body}
      <p style="margin-top:32px;color:#4b5563;">Request reference: <strong>${requestId}</strong></p>
    </div>
  `;
}

function notesBlock(notes?: string | null): string {
  if (!notes) {
    return '';
  }

  return `<p><strong>Notes from our team:</strong><br/>${notes.replace(/\n/g, '<br/>')}</p>`;
}

async function sendMembershipEmail(
  context: MembershipEmailContext,
  title: string,
  subject: string,
  body: string
) {
  return sendBrevoEmail({
    to: [
      {
        email: context.applicantEmail,
        name: context.applicantName || undefined,
      },
    ],
    subject,
    htmlContent: wrapHtml(title, body, context.requestId),
    textContent: `${title}\n\n${body.replace(/<br\/>/g, '\n').replace(/<[^>]+>/g, '')}\n\nRequest reference: ${context.requestId}`,
  });
}

function resolveMembershipApprovalTemplate(requestLocale?: string | null): {
  locale: Locale;
  templateId?: number;
  fallbackUsed: boolean;
} {
  const env = getServerEnv();
  const locale = requestLocale && isLocale(requestLocale) ? requestLocale : 'en';
  const englishTemplateId = env.BREVO_TEMPLATE_MEMBERSHIP_APPROVED_EN;

  const localizedTemplateId =
    locale === 'es'
      ? env.BREVO_TEMPLATE_MEMBERSHIP_APPROVED_ES
      : locale === 'fr'
        ? env.BREVO_TEMPLATE_MEMBERSHIP_APPROVED_FR
        : locale === 'de'
          ? env.BREVO_TEMPLATE_MEMBERSHIP_APPROVED_DE
          : englishTemplateId;

  return {
    locale,
    templateId: localizedTemplateId ?? englishTemplateId,
    fallbackUsed: locale !== 'en' && !localizedTemplateId,
  };
}

function getMembershipRequestsUrl(locale: Locale): string {
  const appUrl = publicEnv.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  const path = `/${locale}/profile/requests`;
  return appUrl ? `${appUrl}${path}` : path;
}

export async function sendMembershipSubmissionEmail(context: MembershipEmailContext) {
  return sendMembershipEmail(
    context,
    'Application received',
    `We received your membership request for ${context.clubName}`,
    `<p>We received your request for <strong>${context.clubName}</strong>. Our team will review it and contact you with the outcome.</p>
     <p>You can also track the current status from your profile requests area.</p>`
  );
}

export async function sendMembershipStageUpdateEmail(
  context: MembershipEmailContext,
  stageLabel: string
) {
  return sendMembershipEmail(
    context,
    'Application update',
    `Your membership request for ${context.clubName} moved to ${stageLabel}`,
    `<p>Your request for <strong>${context.clubName}</strong> is now in the <strong>${stageLabel}</strong> stage.</p>
     ${notesBlock(context.notes)}
     <p>We will email you again when a final decision is made.</p>`
  );
}

export async function sendMembershipApprovalEmail(
  context: MembershipApprovalEmailContext
): Promise<MembershipApprovalEmailResult> {
  const { locale, templateId, fallbackUsed } = resolveMembershipApprovalTemplate(context.locale);
  const requestsUrl = getMembershipRequestsUrl(locale);

  if (!templateId) {
    return {
      success: false,
      skipped: true,
      error: 'Membership approval Brevo template is not configured.',
      locale,
      fallbackUsed,
      requestsUrl,
    };
  }

  const result = await sendBrevoEmail({
    to: [
      {
        email: context.applicantEmail,
        name: context.applicantName || undefined,
      },
    ],
    templateId,
    params: {
      applicantName: context.applicantName || context.applicantEmail,
      clubName: context.clubName,
      requestId: context.requestId,
      decisionNote: context.decisionNote || '',
      requestsUrl,
    },
    tags: ['membership_approved'],
  }).catch((error) => ({
    success: false,
    error: error instanceof Error ? error.message : 'Unknown email error',
  }));

  return {
    ...result,
    locale,
    templateId,
    fallbackUsed,
    requestsUrl,
  };
}

export async function sendMembershipRejectionEmail(context: MembershipEmailContext) {
  return sendMembershipEmail(
    context,
    'Application update',
    `Your membership request for ${context.clubName} was not approved`,
    `<p>After review, we could not approve your request for <strong>${context.clubName}</strong> at this time.</p>
     ${notesBlock(context.notes)}
     <p>If you believe this was a mistake, reply to the original contact channel or reach out to support.</p>`
  );
}
