'use server';

import { z } from 'zod';
import { sendBrevoEmail } from '@/lib/email/brevo';

type SupportedLocale = 'en' | 'es' | 'fr' | 'de';

type LeadCaptureResult = {
  success: boolean;
  deliveryMode: 'email' | 'direct';
  fallbackPath: string;
  error?: string;
};

type ConciergeStepInput = {
  title: string;
  href: string;
};

const supportedLocales = new Set<SupportedLocale>(['en', 'es', 'fr', 'de']);

const safetyKitSchema = z.object({
  email: z.string().trim().email(),
  locale: z.string().trim().optional(),
  source: z.string().trim().max(120).optional(),
});

const conciergePlanSchema = z.object({
  email: z.string().trim().email(),
  locale: z.string().trim().optional(),
  planName: z.string().trim().min(1).max(160),
  summary: z.string().trim().min(1).max(600),
  primaryHref: z.string().trim().startsWith('/'),
  steps: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(160),
        href: z.string().trim().startsWith('/'),
      })
    )
    .min(1)
    .max(3),
});

const editorialDigestSchema = z.object({
  email: z.string().trim().email(),
  locale: z.string().trim().optional(),
  primaryHref: z.string().trim().startsWith('/'),
  primaryLabel: z.string().trim().min(1).max(120),
  source: z.string().trim().max(120).optional(),
});

function normalizeLocale(locale?: string): SupportedLocale {
  if (locale && supportedLocales.has(locale as SupportedLocale)) {
    return locale as SupportedLocale;
  }

  return 'en';
}

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || 'https://socialclubsmaps.com').replace(/\/$/, '');
}

function toAbsoluteUrl(path: string) {
  return `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

function getSafetyKitFallbackPath(locale: SupportedLocale) {
  return `/${locale}/editorial/safety-kit-visitors-spain`;
}

function buildSafetyKitCopy(locale: SupportedLocale) {
  switch (locale) {
    case 'es':
      return {
        subject: 'Tu Safety Kit de Espana',
        heading: 'Tu Safety Kit ya esta listo.',
        intro:
          'Aqui tienes la guia base para entender las lineas legales, evitar estafas y prepararte antes de cualquier visita.',
        primaryCta: 'Abrir el Safety Kit',
        primaryPath: getSafetyKitFallbackPath(locale),
        secondaryLinks: [
          {
            label: 'Como funcionan realmente los clubes',
            path: `/${locale}/editorial/what-are-cannabis-social-clubs-spain`,
          },
          {
            label: 'Leyes en Espana para visitantes',
            path: `/${locale}/editorial/spain-cannabis-laws-tourists`,
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
          'Voici le guide de base pour comprendre les limites legales, eviter les arnaques et preparer votre visite avec plus de clarte.',
        primaryCta: 'Ouvrir le Safety Kit',
        primaryPath: getSafetyKitFallbackPath(locale),
        secondaryLinks: [
          {
            label: 'Comment fonctionnent vraiment les clubs',
            path: `/${locale}/editorial/what-are-cannabis-social-clubs-spain`,
          },
          {
            label: 'Le cadre legal en Espagne',
            path: `/${locale}/editorial/spain-cannabis-laws-tourists`,
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
          'Hier ist dein Basisleitfaden zu rechtlichen Grenzen, Betrugswarnzeichen und den wichtigsten Vorbereitungen vor dem ersten Besuch.',
        primaryCta: 'Safety Kit offnen',
        primaryPath: getSafetyKitFallbackPath(locale),
        secondaryLinks: [
          {
            label: 'Wie Clubs in Spanien wirklich funktionieren',
            path: `/${locale}/editorial/what-are-cannabis-social-clubs-spain`,
          },
          {
            label: 'Spanische Regeln fur Besucher',
            path: `/${locale}/editorial/spain-cannabis-laws-tourists`,
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
          'Here is the core guide to legal lines, scam red flags, and the basics you should understand before any club visit.',
        primaryCta: 'Open the Safety Kit',
        primaryPath: getSafetyKitFallbackPath(locale),
        secondaryLinks: [
          {
            label: 'How clubs actually work in Spain',
            path: `/${locale}/editorial/what-are-cannabis-social-clubs-spain`,
          },
          {
            label: "Spain's legal lines for visitors",
            path: `/${locale}/editorial/spain-cannabis-laws-tourists`,
          },
        ],
        footer:
          'SocialClubsMaps does not sell access or facilitate purchases. This guide exists to help you move with more clarity and less risk.',
      };
  }
}

function buildSafetyKitHtml(locale: SupportedLocale) {
  const copy = buildSafetyKitCopy(locale);
  const primaryUrl = toAbsoluteUrl(copy.primaryPath);

  return [
    `<h1>${copy.heading}</h1>`,
    `<p>${copy.intro}</p>`,
    `<p><a href="${primaryUrl}">${copy.primaryCta}</a></p>`,
    '<ul>',
    ...copy.secondaryLinks.map(
      (link) => `<li><a href="${toAbsoluteUrl(link.path)}">${link.label}</a></li>`
    ),
    '</ul>',
    `<p>${copy.footer}</p>`,
  ].join('');
}

function buildSafetyKitText(locale: SupportedLocale) {
  const copy = buildSafetyKitCopy(locale);

  return [
    copy.heading,
    '',
    copy.intro,
    '',
    `${copy.primaryCta}: ${toAbsoluteUrl(copy.primaryPath)}`,
    ...copy.secondaryLinks.map((link) => `${link.label}: ${toAbsoluteUrl(link.path)}`),
    '',
    copy.footer,
  ].join('\n');
}

function buildConciergeCopy(locale: SupportedLocale, planName: string, summary: string, steps: ConciergeStepInput[]) {
  const stepLines = steps.map((step, index) => ({
    title: `${index + 1}. ${step.title}`,
    url: toAbsoluteUrl(step.href),
  }));

  switch (locale) {
    case 'es':
      return {
        subject: `Tu plan SCM: ${planName}`,
        heading: `${planName} ya esta listo.`,
        intro: summary,
        stepLabel: 'Tus siguientes pasos',
        footer:
          'Usa este plan como guia editorial y de seguridad. SocialClubsMaps no vende acceso ni garantiza aprobaciones.',
        stepLines,
      };
    case 'fr':
      return {
        subject: `Votre plan SCM : ${planName}`,
        heading: `${planName} est pret.`,
        intro: summary,
        stepLabel: 'Vos prochaines etapes',
        footer:
          'Utilisez ce plan comme guide editorial et securitaire. SocialClubsMaps ne vend pas d acces et ne garantit aucune approbation.',
        stepLines,
      };
    case 'de':
      return {
        subject: `Dein SCM-Plan: ${planName}`,
        heading: `${planName} ist bereit.`,
        intro: summary,
        stepLabel: 'Deine nachsten Schritte',
        footer:
          'Nutze diesen Plan als redaktionelle und sicherheitsorientierte Orientierung. SocialClubsMaps verkauft keinen Zugang und garantiert keine Zusagen.',
        stepLines,
      };
    case 'en':
    default:
      return {
        subject: `Your SCM plan: ${planName}`,
        heading: `${planName} is ready.`,
        intro: summary,
        stepLabel: 'Your next steps',
        footer:
          'Use this plan as an editorial and safety guide. SocialClubsMaps does not sell access or guarantee approvals.',
        stepLines,
      };
  }
}

function buildConciergeHtml(
  locale: SupportedLocale,
  planName: string,
  summary: string,
  steps: ConciergeStepInput[]
) {
  const copy = buildConciergeCopy(locale, planName, summary, steps);

  return [
    `<h1>${copy.heading}</h1>`,
    `<p>${copy.intro}</p>`,
    `<h2>${copy.stepLabel}</h2>`,
    '<ol>',
    ...copy.stepLines.map((step) => `<li><a href="${step.url}">${step.title}</a></li>`),
    '</ol>',
    `<p>${copy.footer}</p>`,
  ].join('');
}

function buildConciergeText(
  locale: SupportedLocale,
  planName: string,
  summary: string,
  steps: ConciergeStepInput[]
) {
  const copy = buildConciergeCopy(locale, planName, summary, steps);

  return [
    copy.heading,
    '',
    copy.intro,
    '',
    copy.stepLabel,
    ...copy.stepLines.map((step) => `${step.title}: ${step.url}`),
    '',
    copy.footer,
  ].join('\n');
}

function buildEditorialDigestCopy(locale: SupportedLocale, primaryLabel: string, primaryHref: string) {
  const sharedLinks = [
    {
      labelByLocale: {
        en: 'How clubs actually work in Spain',
        es: 'Como funcionan realmente los clubs en Espana',
        fr: 'Comment fonctionnent vraiment les clubs en Espagne',
        de: 'Wie Clubs in Spanien wirklich funktionieren',
      },
      path: `/${locale}/editorial/what-are-cannabis-social-clubs-spain`,
    },
    {
      labelByLocale: {
        en: 'Open the Spain Safety Kit',
        es: 'Abrir el Safety Kit de Espana',
        fr: 'Ouvrir le Safety Kit Espagne',
        de: 'Das Spanien Safety Kit offnen',
      },
      path: `/${locale}/editorial/safety-kit-visitors-spain`,
    },
  ].map((link) => ({
    label: link.labelByLocale[locale],
    path: link.path,
  }));

  switch (locale) {
    case 'es':
      return {
        subject: 'Tu actualizacion de SocialClubsMaps',
        heading: 'Ya estas en la lista.',
        intro:
          'Te enviaremos nuevas guias, drops verificados y contexto de seguridad. Mientras tanto, empieza por estos recursos base.',
        primaryCta: primaryLabel,
        primaryPath: primaryHref,
        secondaryLinks: sharedLinks,
        footer:
          'SocialClubsMaps es educacion primero. No vendemos acceso ni garantizamos aprobaciones.',
      };
    case 'fr':
      return {
        subject: 'Votre mise a jour SocialClubsMaps',
        heading: 'Vous etes sur la liste.',
        intro:
          'Nous vous enverrons de nouveaux guides, des mises a jour verifiees et du contexte securitaire. En attendant, commencez par ces ressources de base.',
        primaryCta: primaryLabel,
        primaryPath: primaryHref,
        secondaryLinks: sharedLinks,
        footer:
          'SocialClubsMaps reste centre sur l education. Nous ne vendons pas d acces et ne garantissons aucune approbation.',
      };
    case 'de':
      return {
        subject: 'Dein SocialClubsMaps Update',
        heading: 'Du stehst auf der Liste.',
        intro:
          'Wir schicken dir verifizierte Updates, neue Guides und Sicherheitskontext. Starte bis dahin mit diesen Kernressourcen.',
        primaryCta: primaryLabel,
        primaryPath: primaryHref,
        secondaryLinks: sharedLinks,
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
        primaryCta: primaryLabel,
        primaryPath: primaryHref,
        secondaryLinks: sharedLinks,
        footer:
          'SocialClubsMaps is education-first. We do not sell access or guarantee approvals.',
      };
  }
}

function buildEditorialDigestHtml(locale: SupportedLocale, primaryLabel: string, primaryHref: string) {
  const copy = buildEditorialDigestCopy(locale, primaryLabel, primaryHref);

  return [
    `<h1>${copy.heading}</h1>`,
    `<p>${copy.intro}</p>`,
    `<p><a href="${toAbsoluteUrl(copy.primaryPath)}">${copy.primaryCta}</a></p>`,
    '<ul>',
    ...copy.secondaryLinks.map(
      (link) => `<li><a href="${toAbsoluteUrl(link.path)}">${link.label}</a></li>`
    ),
    '</ul>',
    `<p>${copy.footer}</p>`,
  ].join('');
}

function buildEditorialDigestText(locale: SupportedLocale, primaryLabel: string, primaryHref: string) {
  const copy = buildEditorialDigestCopy(locale, primaryLabel, primaryHref);

  return [
    copy.heading,
    '',
    copy.intro,
    '',
    `${copy.primaryCta}: ${toAbsoluteUrl(copy.primaryPath)}`,
    ...copy.secondaryLinks.map((link) => `${link.label}: ${toAbsoluteUrl(link.path)}`),
    '',
    copy.footer,
  ].join('\n');
}

export async function deliverSafetyKitLead(input: {
  email: string;
  locale?: string;
  source?: string;
}): Promise<LeadCaptureResult> {
  const parsed = safetyKitSchema.safeParse(input);
  const locale = normalizeLocale(parsed.success ? parsed.data.locale : input.locale);
  const fallbackPath = getSafetyKitFallbackPath(locale);

  if (!parsed.success) {
    return {
      success: false,
      deliveryMode: 'direct',
      fallbackPath,
      error: parsed.error.errors[0]?.message || 'Invalid email address',
    };
  }

  const delivery = await sendBrevoEmail({
    to: [{ email: parsed.data.email }],
    subject: buildSafetyKitCopy(locale).subject,
    htmlContent: buildSafetyKitHtml(locale),
    textContent: buildSafetyKitText(locale),
  });

  if (!delivery.success) {
    return {
      success: true,
      deliveryMode: 'direct',
      fallbackPath,
      error: delivery.error,
    };
  }

  return {
    success: true,
    deliveryMode: 'email',
    fallbackPath,
  };
}

export async function deliverConciergePlan(input: {
  email: string;
  locale?: string;
  planName: string;
  summary: string;
  primaryHref: string;
  steps: ConciergeStepInput[];
}): Promise<LeadCaptureResult> {
  const parsed = conciergePlanSchema.safeParse(input);
  const locale = normalizeLocale(parsed.success ? parsed.data.locale : input.locale);
  const fallbackPath = parsed.success ? parsed.data.primaryHref : `/${locale}`;

  if (!parsed.success) {
    return {
      success: false,
      deliveryMode: 'direct',
      fallbackPath,
      error: parsed.error.errors[0]?.message || 'Invalid plan payload',
    };
  }

  const delivery = await sendBrevoEmail({
    to: [{ email: parsed.data.email }],
    subject: buildConciergeCopy(locale, parsed.data.planName, parsed.data.summary, parsed.data.steps).subject,
    htmlContent: buildConciergeHtml(locale, parsed.data.planName, parsed.data.summary, parsed.data.steps),
    textContent: buildConciergeText(locale, parsed.data.planName, parsed.data.summary, parsed.data.steps),
  });

  if (!delivery.success) {
    return {
      success: true,
      deliveryMode: 'direct',
      fallbackPath,
      error: delivery.error,
    };
  }

  return {
    success: true,
    deliveryMode: 'email',
    fallbackPath,
  };
}

export async function deliverEditorialDigestLead(input: {
  email: string;
  locale?: string;
  primaryHref: string;
  primaryLabel: string;
  source?: string;
}): Promise<LeadCaptureResult> {
  const parsed = editorialDigestSchema.safeParse(input);
  const locale = normalizeLocale(parsed.success ? parsed.data.locale : input.locale);
  const fallbackPath = parsed.success ? parsed.data.primaryHref : `/${locale}/editorial`;

  if (!parsed.success) {
    return {
      success: false,
      deliveryMode: 'direct',
      fallbackPath,
      error: parsed.error.errors[0]?.message || 'Invalid email address',
    };
  }

  const delivery = await sendBrevoEmail({
    to: [{ email: parsed.data.email }],
    subject: buildEditorialDigestCopy(locale, parsed.data.primaryLabel, parsed.data.primaryHref).subject,
    htmlContent: buildEditorialDigestHtml(locale, parsed.data.primaryLabel, parsed.data.primaryHref),
    textContent: buildEditorialDigestText(locale, parsed.data.primaryLabel, parsed.data.primaryHref),
  });

  if (!delivery.success) {
    return {
      success: true,
      deliveryMode: 'direct',
      fallbackPath,
      error: delivery.error,
    };
  }

  return {
    success: true,
    deliveryMode: 'email',
    fallbackPath,
  };
}
