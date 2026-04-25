import { buildUnsubscribeUrl } from '@/lib/communications/unsubscribe';
import {
  getSafetyKitAssetPaths,
  normalizeSafetyKitLocale,
  type SafetyKitLocale,
} from '@/lib/safety-kit';
import {
  EDITORIAL_SPRINT_PACKAGES,
  getEditorialSprintLocaleFields,
  getWeeklyDigestSupport,
} from '@/lib/editorial-sprint';
import { renderScmEmailShell } from '@/lib/email/templates/shared/scm-email-shell';

export type LeadTemplateEmail = {
  subject: string;
  htmlContent: string;
  textContent: string;
};

type SupportedLocale = SafetyKitLocale;

type SafetyKitLeadInput = {
  locale: SupportedLocale;
  recipientEmail: string;
};

type ConciergePlanInput = {
  locale: SupportedLocale;
  recipientEmail: string;
  planName: string;
  summary: string;
  steps: Array<{ title: string; href: string }>;
};

type EditorialDigestInput = {
  locale: SupportedLocale;
  recipientEmail: string;
  primaryHref: string;
  primaryLabel: string;
};

type SprintEditorialDigestInput = {
  locale: SupportedLocale;
  recipientEmail: string;
};

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || 'https://socialclubsmaps.com').replace(/\/$/, '');
}

function toAbsoluteUrl(path: string) {
  return `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

function safetyKitCopy(locale: SupportedLocale) {
  const assetPaths = getSafetyKitAssetPaths(locale);

  switch (locale) {
    case 'es':
      return {
        subject: 'Tu Safety Kit de Espana',
        heading: 'Tu Safety Kit ya esta listo.',
        intro:
          'Ya tienes acceso inmediato al PDF y a la guia web para entender mejor los limites legales, evitar estafas y prepararte antes de cualquier visita.',
        primaryCta: { label: 'Descargar el PDF', href: toAbsoluteUrl(assetPaths.downloadPath) },
        secondaryCta: { label: 'Abrir la guia web', href: toAbsoluteUrl(assetPaths.guidePath) },
        links: [
          {
            label: 'Como funcionan realmente los clubes',
            href: toAbsoluteUrl(`/${locale}/editorial/what-are-cannabis-social-clubs-spain`),
          },
          {
            label: 'Leyes en Espana para visitantes',
            href: toAbsoluteUrl(`/${locale}/editorial/spain-cannabis-laws-tourists`),
          },
        ],
        footer:
          'SocialClubsMaps no vende acceso ni facilita compras. Esta guia existe para ayudarte a moverte con mas claridad y menos riesgo.',
      };
    case 'fr':
      return {
        subject: 'Votre Safety Kit Espagne',
        heading: 'Votre Safety Kit est pret.',
        intro:
          'Vous avez maintenant un acces immediat au PDF et a la version web pour comprendre les limites legales, eviter les arnaques et preparer votre visite avec plus de clarte.',
        primaryCta: { label: 'Telecharger le PDF', href: toAbsoluteUrl(assetPaths.downloadPath) },
        secondaryCta: { label: 'Ouvrir le guide web', href: toAbsoluteUrl(assetPaths.guidePath) },
        links: [
          {
            label: 'Comment fonctionnent vraiment les clubs',
            href: toAbsoluteUrl(`/${locale}/editorial/what-are-cannabis-social-clubs-spain`),
          },
          {
            label: 'Le cadre legal en Espagne',
            href: toAbsoluteUrl(`/${locale}/editorial/spain-cannabis-laws-tourists`),
          },
        ],
        footer:
          'SocialClubsMaps ne vend pas d acces et ne facilite aucun achat. Ce guide existe pour vous aider a avancer avec plus de clarte et moins de risque.',
      };
    case 'de':
      return {
        subject: 'Dein Spanien Safety Kit',
        heading: 'Dein Safety Kit ist bereit.',
        intro:
          'Du hast jetzt direkten Zugriff auf das PDF und die Webversion, damit du rechtliche Grenzen, Betrugswarnzeichen und die wichtigsten Vorbereitungen vor dem ersten Besuch verstehen kannst.',
        primaryCta: { label: 'PDF herunterladen', href: toAbsoluteUrl(assetPaths.downloadPath) },
        secondaryCta: { label: 'Webguide offnen', href: toAbsoluteUrl(assetPaths.guidePath) },
        links: [
          {
            label: 'Wie Clubs in Spanien wirklich funktionieren',
            href: toAbsoluteUrl(`/${locale}/editorial/what-are-cannabis-social-clubs-spain`),
          },
          {
            label: 'Spanische Regeln fur Besucher',
            href: toAbsoluteUrl(`/${locale}/editorial/spain-cannabis-laws-tourists`),
          },
        ],
        footer:
          'SocialClubsMaps verkauft keinen Zugang und vermittelt keine Kaufe. Dieser Leitfaden soll dir mehr Klarheit und weniger Risiko geben.',
      };
    case 'en':
    default:
      return {
        subject: 'Your Spain Safety Kit',
        heading: 'Your Safety Kit is ready.',
        intro:
          'You now have immediate access to the PDF and the web guide covering legal lines, scam red flags, and the basics worth understanding before any club visit.',
        primaryCta: { label: 'Download the PDF', href: toAbsoluteUrl(assetPaths.downloadPath) },
        secondaryCta: { label: 'Open the web guide', href: toAbsoluteUrl(assetPaths.guidePath) },
        links: [
          {
            label: 'How clubs actually work in Spain',
            href: toAbsoluteUrl(`/${locale}/editorial/what-are-cannabis-social-clubs-spain`),
          },
          {
            label: "Spain's legal lines for visitors",
            href: toAbsoluteUrl(`/${locale}/editorial/spain-cannabis-laws-tourists`),
          },
        ],
        footer:
          'SocialClubsMaps does not sell access or facilitate purchases. This guide exists to help you move with more clarity and less risk.',
      };
  }
}

function conciergeCopy(locale: SupportedLocale, planName: string, summary: string) {
  switch (locale) {
    case 'es':
      return {
        subject: `Tu plan SCM: ${planName}`,
        heading: `${planName} ya esta listo.`,
        intro: summary,
        stepsLabel: 'Tus siguientes pasos',
        footer:
          'Usa este plan como guia editorial y de seguridad. SocialClubsMaps no vende acceso ni garantiza aprobaciones.',
      };
    case 'fr':
      return {
        subject: `Votre plan SCM : ${planName}`,
        heading: `${planName} est pret.`,
        intro: summary,
        stepsLabel: 'Vos prochaines etapes',
        footer:
          'Utilisez ce plan comme guide editorial et securitaire. SocialClubsMaps ne vend pas d acces et ne garantit aucune approbation.',
      };
    case 'de':
      return {
        subject: `Dein SCM-Plan: ${planName}`,
        heading: `${planName} ist bereit.`,
        intro: summary,
        stepsLabel: 'Deine nachsten Schritte',
        footer:
          'Nutze diesen Plan als redaktionelle und sicherheitsorientierte Orientierung. SocialClubsMaps verkauft keinen Zugang und garantiert keine Zusagen.',
      };
    case 'en':
    default:
      return {
        subject: `Your SCM plan: ${planName}`,
        heading: `${planName} is ready.`,
        intro: summary,
        stepsLabel: 'Your next steps',
        footer:
          'Use this plan as an editorial and safety guide. SocialClubsMaps does not sell access or guarantee approvals.',
      };
  }
}

function editorialDigestCopy(locale: SupportedLocale, primaryLabel: string) {
  switch (locale) {
    case 'es':
      return {
        subject: 'Tu actualizacion de SocialClubsMaps',
        heading: 'Ya estas en la lista.',
        intro:
          'Te enviaremos nuevas guias, drops verificados y contexto de seguridad. Mientras tanto, empieza por estos recursos base.',
        primaryLabel,
        secondaryLinks: [
          {
            label: 'Como funcionan realmente los clubs en Espana',
            href: toAbsoluteUrl(`/${locale}/editorial/what-are-cannabis-social-clubs-spain`),
          },
          {
            label: 'Abrir el Safety Kit de Espana',
            href: toAbsoluteUrl(`/${locale}/editorial/safety-kit-visitors-spain`),
          },
        ],
        footer:
          'SocialClubsMaps es educacion primero. No vendemos acceso ni garantizamos aprobaciones.',
      };
    case 'fr':
      return {
        subject: 'Votre mise a jour SocialClubsMaps',
        heading: 'Vous etes sur la liste.',
        intro:
          'Nous vous enverrons de nouveaux guides, des mises a jour verifiees et du contexte securitaire. En attendant, commencez par ces ressources de base.',
        primaryLabel,
        secondaryLinks: [
          {
            label: 'Comment fonctionnent vraiment les clubs en Espagne',
            href: toAbsoluteUrl(`/${locale}/editorial/what-are-cannabis-social-clubs-spain`),
          },
          {
            label: 'Ouvrir le Safety Kit Espagne',
            href: toAbsoluteUrl(`/${locale}/editorial/safety-kit-visitors-spain`),
          },
        ],
        footer:
          'SocialClubsMaps reste centre sur l education. Nous ne vendons pas d acces et ne garantissons aucune approbation.',
      };
    case 'de':
      return {
        subject: 'Dein SocialClubsMaps Update',
        heading: 'Du stehst auf der Liste.',
        intro:
          'Wir schicken dir verifizierte Updates, neue Guides und Sicherheitskontext. Starte bis dahin mit diesen Kernressourcen.',
        primaryLabel,
        secondaryLinks: [
          {
            label: 'Wie Clubs in Spanien wirklich funktionieren',
            href: toAbsoluteUrl(`/${locale}/editorial/what-are-cannabis-social-clubs-spain`),
          },
          {
            label: 'Das Spanien Safety Kit offnen',
            href: toAbsoluteUrl(`/${locale}/editorial/safety-kit-visitors-spain`),
          },
        ],
        footer:
          'SocialClubsMaps ist education-first. Wir verkaufen keinen Zugang und garantieren keine Zusagen.',
      };
    case 'en':
    default:
      return {
        subject: 'Your SocialClubsMaps update',
        heading: "You're on the list.",
        intro:
          'We will send verified updates, new guides, and safety context. Until then, start with these core resources.',
        primaryLabel,
        secondaryLinks: [
          {
            label: 'How clubs actually work in Spain',
            href: toAbsoluteUrl(`/${locale}/editorial/what-are-cannabis-social-clubs-spain`),
          },
          {
            label: 'Open the Spain Safety Kit',
            href: toAbsoluteUrl(`/${locale}/editorial/safety-kit-visitors-spain`),
          },
        ],
        footer:
          'SocialClubsMaps is education-first. We do not sell access or guarantee approvals.',
      };
  }
}

export function renderSafetyKitLeadEmail(input: SafetyKitLeadInput): LeadTemplateEmail {
  const locale = normalizeSafetyKitLocale(input.locale);
  const copy = safetyKitCopy(locale);
  const unsubscribeUrl = buildUnsubscribeUrl({ email: input.recipientEmail, locale });
  const htmlContent = renderScmEmailShell({
    eyebrow: 'SocialClubsMaps Safety Kit',
    heading: copy.heading,
    intro: copy.intro,
    primaryCta: copy.primaryCta,
    secondaryCta: copy.secondaryCta,
    supportLinks: copy.links,
    footer: `${copy.footer} Unsubscribe: ${unsubscribeUrl}`,
  });

  const textContent = [
    copy.heading,
    '',
    copy.intro,
    '',
    `${copy.primaryCta.label}: ${copy.primaryCta.href}`,
    `${copy.secondaryCta.label}: ${copy.secondaryCta.href}`,
    ...copy.links.map((link) => `${link.label}: ${link.href}`),
    '',
    copy.footer,
    '',
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join('\n');

  return {
    subject: copy.subject,
    htmlContent,
    textContent,
  };
}

export function renderConciergePlanEmail(input: ConciergePlanInput): LeadTemplateEmail {
  const locale = normalizeSafetyKitLocale(input.locale);
  const copy = conciergeCopy(locale, input.planName, input.summary);
  const unsubscribeUrl = buildUnsubscribeUrl({ email: input.recipientEmail, locale });
  const stepLines = input.steps.map((step, index) => `${index + 1}. ${step.title}: ${toAbsoluteUrl(step.href)}`);

  const htmlContent = renderScmEmailShell({
    eyebrow: 'SocialClubsMaps Concierge Plan',
    heading: copy.heading,
    intro: copy.intro,
    bodyLines: [copy.stepsLabel, ...stepLines],
    footer: `${copy.footer} Unsubscribe: ${unsubscribeUrl}`,
  });

  const textContent = [
    copy.heading,
    '',
    copy.intro,
    '',
    copy.stepsLabel,
    ...stepLines,
    '',
    copy.footer,
    '',
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join('\n');

  return {
    subject: copy.subject,
    htmlContent,
    textContent,
  };
}

export function renderEditorialDigestEmail(input: EditorialDigestInput): LeadTemplateEmail {
  const locale = normalizeSafetyKitLocale(input.locale);
  const copy = editorialDigestCopy(locale, input.primaryLabel);
  const unsubscribeUrl = buildUnsubscribeUrl({ email: input.recipientEmail, locale });
  const primaryHref = toAbsoluteUrl(input.primaryHref);

  const htmlContent = renderScmEmailShell({
    eyebrow: 'SocialClubsMaps Editorial Updates',
    heading: copy.heading,
    intro: copy.intro,
    primaryCta: { label: copy.primaryLabel, href: primaryHref },
    supportLinks: copy.secondaryLinks,
    footer: `${copy.footer} Unsubscribe: ${unsubscribeUrl}`,
  });

  const textContent = [
    copy.heading,
    '',
    copy.intro,
    '',
    `${copy.primaryLabel}: ${primaryHref}`,
    ...copy.secondaryLinks.map((link) => `${link.label}: ${link.href}`),
    '',
    copy.footer,
    '',
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join('\n');

  return {
    subject: copy.subject,
    htmlContent,
    textContent,
  };
}

export function renderSprintEditorialDigestEmail(input: SprintEditorialDigestInput): LeadTemplateEmail {
  const locale = normalizeSafetyKitLocale(input.locale);
  const copy = getWeeklyDigestSupport(locale);
  const unsubscribeUrl = buildUnsubscribeUrl({ email: input.recipientEmail, locale });
  const digestPackages = EDITORIAL_SPRINT_PACKAGES.map((pkg) => {
    const fields = getEditorialSprintLocaleFields(pkg, locale);
    return {
      title: fields.title,
      body: pkg.digest[locale].body,
      href: toAbsoluteUrl(`/${locale}/editorial/${pkg.slug}`),
    };
  });
  const htmlContent = renderScmEmailShell({
    eyebrow: copy.eyebrow,
    heading: copy.headline,
    intro: copy.intro,
    bodyLines: [
      copy.sectionIntro,
      ...digestPackages.map((pkg, index) => `${index + 1}. ${pkg.title} — ${pkg.body}`),
      '',
      copy.closingTitle,
      copy.closingBody,
    ],
    primaryCta: {
      label: copy.primaryCtaLabel,
      href: toAbsoluteUrl(copy.primaryCtaHref),
    },
    secondaryCta: {
      label: copy.secondaryCtaLabel,
      href: toAbsoluteUrl(copy.secondaryCtaHref),
    },
    supportLinks: digestPackages.map((pkg) => ({
      label: pkg.title,
      href: pkg.href,
    })),
    footer: `SocialClubsMaps Weekly Intelligence. Unsubscribe: ${unsubscribeUrl}`,
  });

  const textContent = [
    copy.headline,
    '',
    copy.intro,
    '',
    copy.sectionIntro,
    ...digestPackages.map((pkg, index) => `${index + 1}. ${pkg.title}: ${pkg.href}`),
    '',
    copy.closingTitle,
    copy.closingBody,
    '',
    `${copy.primaryCtaLabel}: ${toAbsoluteUrl(copy.primaryCtaHref)}`,
    `${copy.secondaryCtaLabel}: ${toAbsoluteUrl(copy.secondaryCtaHref)}`,
    '',
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join('\n');

  return {
    subject: copy.subjectLine,
    htmlContent,
    textContent,
  };
}
