import { CommunicationAudience, EmailProviderRoute } from '@prisma/client';
import { enqueueAndProcessEmailOutbox } from '@/lib/communications/outbox';
import type { TransactionalEmailSendResult } from '@/lib/email/service';
import { publicEnv } from '@/lib/env';
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

export type MembershipApprovalEmailResult = TransactionalEmailSendResult & {
  locale: Locale;
  fallbackUsed: boolean;
  requestsUrl: string;
};

export type MembershipRejectionEmailResult = MembershipApprovalEmailResult;

const membershipDecisionCopy: Record<
  Locale,
  {
    approved: {
      title: string;
      subject: string;
      intro: string;
      outro: string;
    };
    rejected: {
      title: string;
      subject: string;
      intro: string;
      outro: string;
    };
    requestsCta: string;
  }
> = {
  en: {
    approved: {
      title: 'Application approved',
      subject: 'Your membership request was approved',
      intro: 'Your membership request has been approved.',
      outro: 'You can review the next steps from your profile requests area.',
    },
    rejected: {
      title: 'Application update',
      subject: 'Your membership request was not approved',
      intro: 'After review, we could not approve your membership request at this time.',
      outro: 'You can review the decision details from your profile requests area.',
    },
    requestsCta: 'Open my requests',
  },
  es: {
    approved: {
      title: 'Solicitud aprobada',
      subject: 'Tu solicitud de membresia fue aprobada',
      intro: 'Tu solicitud de membresia ha sido aprobada.',
      outro: 'Puedes revisar los siguientes pasos desde el area de solicitudes de tu perfil.',
    },
    rejected: {
      title: 'Actualizacion de solicitud',
      subject: 'Tu solicitud de membresia no fue aprobada',
      intro: 'Tras la revision, no hemos podido aprobar tu solicitud de membresia por ahora.',
      outro: 'Puedes revisar los detalles de la decision desde el area de solicitudes de tu perfil.',
    },
    requestsCta: 'Abrir mis solicitudes',
  },
  fr: {
    approved: {
      title: 'Demande approuvee',
      subject: 'Votre demande d adhesion a ete approuvee',
      intro: 'Votre demande d adhesion a ete approuvee.',
      outro: 'Vous pouvez consulter la suite depuis la section demandes de votre profil.',
    },
    rejected: {
      title: 'Mise a jour de la demande',
      subject: 'Votre demande d adhesion n a pas ete approuvee',
      intro: 'Apres examen, nous ne pouvons pas approuver votre demande d adhesion pour le moment.',
      outro: 'Vous pouvez consulter le detail de la decision dans la section demandes de votre profil.',
    },
    requestsCta: 'Ouvrir mes demandes',
  },
  de: {
    approved: {
      title: 'Anfrage genehmigt',
      subject: 'Deine Mitgliedschaftsanfrage wurde genehmigt',
      intro: 'Deine Mitgliedschaftsanfrage wurde genehmigt.',
      outro: 'Die nachsten Schritte findest du im Anfragenbereich deines Profils.',
    },
    rejected: {
      title: 'Anfrage aktualisiert',
      subject: 'Deine Mitgliedschaftsanfrage wurde nicht genehmigt',
      intro: 'Nach der Prufung konnten wir deine Mitgliedschaftsanfrage derzeit nicht genehmigen.',
      outro: 'Die Entscheidungsdetails findest du im Anfragenbereich deines Profils.',
    },
    requestsCta: 'Meine Anfragen offnen',
  },
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

function resolveLocaleOrDefault(input?: string | null): Locale {
  return input && isLocale(input) ? input : 'en';
}

async function sendMembershipEmail(
  context: MembershipEmailContext,
  title: string,
  subject: string,
  body: string,
  idempotencyKey: string,
  type: string
) {
  return enqueueAndProcessEmailOutbox({
    type,
    audience: CommunicationAudience.TRANSACTIONAL,
    route: EmailProviderRoute.TRANSACTIONAL,
    relatedRequestId: context.requestId,
    recipientEmail: context.applicantEmail,
    subject,
    idempotencyKey,
    payload: {
      route: EmailProviderRoute.TRANSACTIONAL,
      input: {
        to: [
          {
            email: context.applicantEmail,
            name: context.applicantName || undefined,
          },
        ],
        subject,
        htmlContent: wrapHtml(title, body, context.requestId),
        textContent: `${title}\n\n${body.replace(/<br\/>/g, '\n').replace(/<[^>]+>/g, '')}\n\nRequest reference: ${context.requestId}`,
        idempotencyKey,
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
  return sendMembershipEmail(
    context,
    'Application received',
    `We received your membership request for ${context.clubName}`,
    `<p>We received your request for <strong>${context.clubName}</strong>. Our team will review it and contact you with the outcome.</p>
     <p>You can also track the current status from your profile requests area.</p>`,
    `membership-submission:${context.requestId}`,
    'MEMBERSHIP_SUBMISSION_EMAIL'
  );
}

export async function sendMembershipApprovalEmail(
  context: MembershipApprovalEmailContext
): Promise<MembershipApprovalEmailResult> {
  const { locale, fallbackUsed } = resolveMembershipDecisionLocale(context.locale);
  const requestsUrl = getMembershipRequestsUrl(locale);
  const copy = membershipDecisionCopy[locale].approved;

  const subject = `${copy.subject} - ${context.clubName}`;
  const idempotencyKey = `membership-approved:${context.requestId}`;

  const result = await enqueueAndProcessEmailOutbox({
    type: 'MEMBERSHIP_APPROVAL_EMAIL',
    audience: CommunicationAudience.TRANSACTIONAL,
    route: EmailProviderRoute.TRANSACTIONAL,
    relatedRequestId: context.requestId,
    recipientEmail: context.applicantEmail,
    locale,
    subject,
    idempotencyKey,
    payload: {
      route: EmailProviderRoute.TRANSACTIONAL,
      input: {
        to: [
          {
            email: context.applicantEmail,
            name: context.applicantName || undefined,
          },
        ],
        subject,
        htmlContent: wrapHtml(
          copy.title,
          `<p>${copy.intro}</p>
           <p><strong>${context.clubName}</strong></p>
           ${notesBlock(context.decisionNote)}
           <p><a href="${requestsUrl}">${membershipDecisionCopy[locale].requestsCta}</a></p>
           <p>${copy.outro}</p>`,
          context.requestId
        ),
        textContent: `${copy.title}\n\n${copy.intro}\n${context.clubName}\n${
          context.decisionNote ? `\n${context.decisionNote}\n` : ''
        }\n${requestsUrl}\n\n${copy.outro}\n\nRequest reference: ${context.requestId}`,
        idempotencyKey,
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
  }));

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
  const copy = membershipDecisionCopy[locale].rejected;

  const subject = `${copy.subject} - ${context.clubName}`;
  const idempotencyKey = `membership-rejected:${context.requestId}`;

  const result = await enqueueAndProcessEmailOutbox({
    type: 'MEMBERSHIP_REJECTION_EMAIL',
    audience: CommunicationAudience.TRANSACTIONAL,
    route: EmailProviderRoute.TRANSACTIONAL,
    relatedRequestId: context.requestId,
    recipientEmail: context.applicantEmail,
    locale,
    subject,
    idempotencyKey,
    payload: {
      route: EmailProviderRoute.TRANSACTIONAL,
      input: {
        to: [
          {
            email: context.applicantEmail,
            name: context.applicantName || undefined,
          },
        ],
        subject,
        htmlContent: wrapHtml(
          copy.title,
          `<p>${copy.intro}</p>
           <p><strong>${context.clubName}</strong></p>
           ${notesBlock(context.decisionNote)}
           <p><a href="${requestsUrl}">${membershipDecisionCopy[locale].requestsCta}</a></p>
           <p>${copy.outro}</p>`,
          context.requestId
        ),
        textContent: `${copy.title}\n\n${copy.intro}\n${context.clubName}\n${
          context.decisionNote ? `\n${context.decisionNote}\n` : ''
        }\n${requestsUrl}\n\n${copy.outro}\n\nRequest reference: ${context.requestId}`,
        idempotencyKey,
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
  }));

  return {
    ...result,
    locale,
    fallbackUsed,
    requestsUrl,
  };
}
