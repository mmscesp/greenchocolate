'use server';

import { z } from 'zod';
import { CommunicationAudience, EmailProviderRoute } from '@prisma/client';
import { enqueueAndProcessEmailOutbox } from '@/lib/communications/outbox';
import { subscribeMarketingEmail } from '@/lib/communications/subscriptions';
import { getPlatformControlState } from '@/lib/platform-control';
import {
  getSafetyKitAssetPaths,
  normalizeSafetyKitLocale,
  type SafetyKitLocale,
} from '@/lib/safety-kit';
import {
  renderConciergePlanEmail,
  renderEditorialDigestEmail,
  renderSafetyKitLeadEmail,
} from '@/lib/email/templates/brevo/lead-capture';

type SupportedLocale = SafetyKitLocale;

type LeadCaptureResult = {
  success: boolean;
  deliveryMode: 'email' | 'direct';
  fallbackPath: string;
  downloadPath?: string;
  error?: string;
};

type ConciergeStepInput = {
  title: string;
  href: string;
};

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
  return normalizeSafetyKitLocale(locale);
}

function normalizeBrevoTagPart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

function buildBrevoTags(input: { type: string; locale: SupportedLocale; source?: string }) {
  const tags = [`scm-${normalizeBrevoTagPart(input.type)}`, `locale-${input.locale}`];

  const normalizedSource = input.source ? normalizeBrevoTagPart(input.source) : '';
  if (normalizedSource) {
    tags.push(`source-${normalizedSource}`);
  }

  return tags.slice(0, 10);
}

function buildBrevoHeaders(input: { type: string; locale: SupportedLocale; source?: string }) {
  return {
    'X-Scm-Lead-Type': input.type,
    'X-Scm-Locale': input.locale,
    ...(input.source ? { 'X-Scm-Lead-Source': input.source } : {}),
  };
}

async function sendMarketingLeadEmail(input: {
  type: string;
  email: string;
  locale: SupportedLocale;
  source?: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  fallbackPath: string;
}) {
  await subscribeMarketingEmail({
    email: input.email,
    locale: input.locale,
    source: input.source ?? input.type.toLowerCase(),
    metadata: {
      fallbackPath: input.fallbackPath,
      type: input.type,
    },
  });

  const result = await enqueueAndProcessEmailOutbox({
    type: input.type,
    audience: CommunicationAudience.MARKETING,
    route: EmailProviderRoute.MARKETING,
    recipientEmail: input.email,
    locale: input.locale,
    subject: input.subject,
    payload: {
      route: EmailProviderRoute.MARKETING,
      input: {
        to: [{ email: input.email }],
        subject: input.subject,
        htmlContent: input.htmlContent,
        textContent: input.textContent,
        tags: buildBrevoTags(input),
        headers: buildBrevoHeaders(input),
      },
    },
  });

  return result;
}

export async function deliverSafetyKitLead(input: {
  email: string;
  locale?: string;
  source?: string;
}): Promise<LeadCaptureResult> {
  const parsed = safetyKitSchema.safeParse(input);
  const locale = normalizeLocale(parsed.success ? parsed.data.locale : input.locale);
  const assetPaths = getSafetyKitAssetPaths(locale);
  const fallbackPath = assetPaths.guidePath;

  if (!parsed.success) {
    return {
      success: false,
      deliveryMode: 'direct',
      fallbackPath,
      downloadPath: assetPaths.pdfPath,
      error: parsed.error.errors[0]?.message || 'Invalid email address',
    };
  }

  const controls = await getPlatformControlState();
  if (!controls.marketingLeadCaptureEnabled) {
    return {
      success: true,
      deliveryMode: 'direct',
      fallbackPath,
      downloadPath: assetPaths.pdfPath,
      error: 'Lead capture is temporarily paused.',
    };
  }

  const template = renderSafetyKitLeadEmail({
    locale,
    recipientEmail: parsed.data.email,
  });

  const delivery = await sendMarketingLeadEmail({
    type: 'SAFETY_KIT_LEAD_EMAIL',
    email: parsed.data.email,
    locale,
    source: parsed.data.source,
    subject: template.subject,
    htmlContent: template.htmlContent,
    textContent: template.textContent,
    fallbackPath,
  });

  if (!delivery.success) {
    return {
      success: true,
      deliveryMode: 'direct',
      fallbackPath,
      downloadPath: assetPaths.pdfPath,
      error: delivery.error,
    };
  }

  return {
    success: true,
    deliveryMode: 'email',
    fallbackPath,
    downloadPath: assetPaths.pdfPath,
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

  const controls = await getPlatformControlState();
  if (!controls.marketingLeadCaptureEnabled) {
    return {
      success: true,
      deliveryMode: 'direct',
      fallbackPath,
      error: 'Lead capture is temporarily paused.',
    };
  }

  const template = renderConciergePlanEmail({
    locale,
    recipientEmail: parsed.data.email,
    planName: parsed.data.planName,
    summary: parsed.data.summary,
    steps: parsed.data.steps,
  });

  const delivery = await sendMarketingLeadEmail({
    type: 'CONCIERGE_PLAN_EMAIL',
    email: parsed.data.email,
    locale,
    source: parsed.data.planName,
    subject: template.subject,
    htmlContent: template.htmlContent,
    textContent: template.textContent,
    fallbackPath,
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

  const controls = await getPlatformControlState();
  if (!controls.marketingLeadCaptureEnabled) {
    return {
      success: true,
      deliveryMode: 'direct',
      fallbackPath,
      error: 'Lead capture is temporarily paused.',
    };
  }

  const template = renderEditorialDigestEmail({
    locale,
    recipientEmail: parsed.data.email,
    primaryHref: parsed.data.primaryHref,
    primaryLabel: parsed.data.primaryLabel,
  });

  const delivery = await sendMarketingLeadEmail({
    type: 'EDITORIAL_DIGEST_EMAIL',
    email: parsed.data.email,
    locale,
    source: parsed.data.source,
    subject: template.subject,
    htmlContent: template.htmlContent,
    textContent: template.textContent,
    fallbackPath,
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
