import type { Locale } from '@/lib/i18n-config';
import { renderScmEmailShell } from '@/lib/email/templates/shared/scm-email-shell';

type MembershipTemplateInput = {
  variant: 'approved' | 'rejected';
  locale: Locale;
  clubName: string;
  requestId: string;
  decisionNote?: string | null;
  requestsUrl: string;
};

export type MembershipTemplateEmail = {
  subject: string;
  htmlContent: string;
  textContent: string;
};

const decisionCopy: Record<
  Locale,
  {
    approved: {
      title: string;
      subject: string;
      intro: string;
      outro: string;
      cta: string;
    };
    rejected: {
      title: string;
      subject: string;
      intro: string;
      outro: string;
      cta: string;
    };
  }
> = {
  en: {
    approved: {
      title: 'Application approved',
      subject: 'Your membership request was approved',
      intro: 'Your membership request has been approved.',
      outro: 'You can review the next steps from your profile requests area.',
      cta: 'Open my requests',
    },
    rejected: {
      title: 'Application update',
      subject: 'Your membership request was not approved',
      intro: 'After review, we could not approve your membership request at this time.',
      outro: 'You can review the decision details from your profile requests area.',
      cta: 'Open my requests',
    },
  },
  es: {
    approved: {
      title: 'Solicitud aprobada',
      subject: 'Tu solicitud de membresia fue aprobada',
      intro: 'Tu solicitud de membresia ha sido aprobada.',
      outro: 'Puedes revisar los siguientes pasos desde el area de solicitudes de tu perfil.',
      cta: 'Abrir mis solicitudes',
    },
    rejected: {
      title: 'Actualizacion de solicitud',
      subject: 'Tu solicitud de membresia no fue aprobada',
      intro: 'Tras la revision, no hemos podido aprobar tu solicitud de membresia por ahora.',
      outro: 'Puedes revisar los detalles de la decision desde el area de solicitudes de tu perfil.',
      cta: 'Abrir mis solicitudes',
    },
  },
  fr: {
    approved: {
      title: 'Demande approuvee',
      subject: 'Votre demande d adhesion a ete approuvee',
      intro: 'Votre demande d adhesion a ete approuvee.',
      outro: 'Vous pouvez consulter la suite depuis la section demandes de votre profil.',
      cta: 'Ouvrir mes demandes',
    },
    rejected: {
      title: 'Mise a jour de la demande',
      subject: 'Votre demande d adhesion n a pas ete approuvee',
      intro: 'Apres examen, nous ne pouvons pas approuver votre demande d adhesion pour le moment.',
      outro: 'Vous pouvez consulter le detail de la decision dans la section demandes de votre profil.',
      cta: 'Ouvrir mes demandes',
    },
  },
  de: {
    approved: {
      title: 'Anfrage genehmigt',
      subject: 'Deine Mitgliedschaftsanfrage wurde genehmigt',
      intro: 'Deine Mitgliedschaftsanfrage wurde genehmigt.',
      outro: 'Die nachsten Schritte findest du im Anfragenbereich deines Profils.',
      cta: 'Meine Anfragen offnen',
    },
    rejected: {
      title: 'Anfrage aktualisiert',
      subject: 'Deine Mitgliedschaftsanfrage wurde nicht genehmigt',
      intro: 'Nach der Prufung konnten wir deine Mitgliedschaftsanfrage derzeit nicht genehmigen.',
      outro: 'Die Entscheidungsdetails findest du im Anfragenbereich deines Profils.',
      cta: 'Meine Anfragen offnen',
    },
  },
};

export function renderMembershipSubmissionEmail(input: {
  clubName: string;
  requestId: string;
  requestsUrl: string;
}): MembershipTemplateEmail {
  const heading = 'Application received';
  const subject = `We received your membership request for ${input.clubName}`;
  const intro = `We received your request for ${input.clubName}. Our team will review it and contact you with the outcome.`;
  const outro = 'You can also track the current status from your profile requests area.';
  const footer = `Request reference: ${input.requestId}`;

  const htmlContent = renderScmEmailShell({
    eyebrow: 'SocialClubsMaps Transactional',
    heading,
    intro,
    primaryCta: {
      label: 'Open my requests',
      href: input.requestsUrl,
    },
    footer,
  });

  const textContent = [heading, '', intro, '', `Open my requests: ${input.requestsUrl}`, '', outro, '', footer].join(
    '\n'
  );

  return {
    subject,
    htmlContent,
    textContent,
  };
}

export function renderMembershipDecisionEmail(input: MembershipTemplateInput): MembershipTemplateEmail {
  const copy = decisionCopy[input.locale][input.variant];
  const heading = copy.title;
  const subject = `${copy.subject} - ${input.clubName}`;
  const decisionLine = input.decisionNote ? `Notes from our team: ${input.decisionNote}` : '';
  const footer = `Request reference: ${input.requestId}`;

  const bodyLines = [copy.intro, input.clubName, decisionLine, copy.outro].filter(Boolean) as string[];
  const htmlContent = renderScmEmailShell({
    eyebrow: 'SocialClubsMaps Transactional',
    heading,
    intro: copy.intro,
    bodyLines: [input.clubName, ...(decisionLine ? [decisionLine] : [])],
    primaryCta: {
      label: copy.cta,
      href: input.requestsUrl,
    },
    footer: `${copy.outro} ${footer}`,
  });

  const textContent = [heading, '', ...bodyLines, '', `${copy.cta}: ${input.requestsUrl}`, '', footer].join('\n');

  return {
    subject,
    htmlContent,
    textContent,
  };
}
