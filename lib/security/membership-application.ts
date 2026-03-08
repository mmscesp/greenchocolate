import 'server-only';

import { headers } from 'next/headers';
import { z } from 'zod';
import { EncryptionService } from '@/lib/encryption';
import { getServerEnv, publicEnv } from '@/lib/env';

export const MEMBERSHIP_EXPERIENCE_VALUES = [
  'curious',
  'casual',
  'regular',
  'connoisseur',
  'medical',
] as const;

const phonePattern = /^[0-9+()\-\s]{7,32}$/;

const normalizedString = (min: number, max: number) =>
  z.string().trim().min(min).max(max).transform((value) => value.replace(/\s+/g, ' '));

const optionalNormalizedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value.replace(/\s+/g, ' '))
    .optional()
    .or(z.literal(''))
    .transform((value) => {
      if (typeof value !== 'string') {
        return undefined;
      }

      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed.replace(/\s+/g, ' ') : undefined;
    });

export const membershipApplicationInputSchema = z
  .object({
    targetClubId: z.string().uuid(),
    firstName: normalizedString(1, 80),
    lastName: normalizedString(1, 80),
    email: z.string().trim().email().max(320).transform((value) => value.toLowerCase()),
    city: normalizedString(1, 120),
    country: normalizedString(1, 120),
    countryCode: z.string().trim().toUpperCase().regex(/^[A-Z]{2}$/),
    experience: z.enum(MEMBERSHIP_EXPERIENCE_VALUES),
    phone: optionalNormalizedString(32).refine(
      (value) => !value || phonePattern.test(value),
      'Phone number must use a valid format'
    ),
    message: normalizedString(20, 500),
    ageConfirmed: z.literal(true),
    termsConfirmed: z.literal(true),
    challengeToken: z.string().trim().min(1).optional(),
    pendingLeadToken: z.string().trim().min(1).optional(),
  })
  .strict();

export type MembershipApplicationInput = z.infer<typeof membershipApplicationInputSchema>;

export type LeadDecision = 'ALLOW' | 'CHALLENGE' | 'BLOCK';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ChallengeStatus = 'NOT_REQUIRED' | 'PASSED' | 'FAILED' | 'REQUIRED' | 'SKIPPED';

export type MembershipSecurityConfig = {
  guestSoftLimit: number;
  guestHardLimit: number;
  authSoftLimit: number;
  authHardLimit: number;
  windowMinutes: number;
  leadTtlHours: number;
};

export type MembershipSecurityContext = {
  ip: string | null;
  ipHash: string | null;
  fingerprint: string;
  fingerprintHash: string;
  userAgent: string | null;
  acceptLanguage: string | null;
};

export type LeadTokenPayload = {
  leadId: string;
  payloadHash: string;
  expiresAt: string;
};

export function getMembershipSecurityConfig(): MembershipSecurityConfig {
  const env = getServerEnv();

  return {
    guestSoftLimit: env.MEMBERSHIP_GUEST_SOFT_LIMIT,
    guestHardLimit: env.MEMBERSHIP_GUEST_HARD_LIMIT,
    authSoftLimit: env.MEMBERSHIP_AUTH_SOFT_LIMIT,
    authHardLimit: env.MEMBERSHIP_AUTH_HARD_LIMIT,
    windowMinutes: env.MEMBERSHIP_RATE_LIMIT_WINDOW_MINUTES,
    leadTtlHours: env.MEMBERSHIP_LEAD_TTL_HOURS,
  };
}

export async function getMembershipSecurityContext(): Promise<MembershipSecurityContext> {
  const headerStore = await headers();
  const forwardedFor = headerStore.get('x-forwarded-for');
  const realIp = headerStore.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0]?.trim() || realIp?.trim() || null;
  const userAgent = headerStore.get('user-agent');
  const acceptLanguage = headerStore.get('accept-language');
  const secChUa = headerStore.get('sec-ch-ua');
  const secFetchSite = headerStore.get('sec-fetch-site');

  const fingerprint = [
    ip || 'unknown-ip',
    userAgent || 'unknown-ua',
    acceptLanguage || 'unknown-lang',
    secChUa || 'unknown-client',
    secFetchSite || 'unknown-site',
  ].join('|');

  return {
    ip,
    ipHash: ip ? EncryptionService.hash(ip) : null,
    fingerprint,
    fingerprintHash: EncryptionService.hash(fingerprint),
    userAgent,
    acceptLanguage,
  };
}

export function hashEmail(email: string): string {
  return EncryptionService.hash(email.trim().toLowerCase());
}

export function hashPayload(payload: Record<string, unknown>): string {
  return EncryptionService.hash(JSON.stringify(payload));
}

export function getLeadExpiry(config: MembershipSecurityConfig): Date {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + config.leadTtlHours);
  return expiresAt;
}

export function buildLeadToken(payload: LeadTokenPayload): string {
  return EncryptionService.encryptPayload(payload as unknown as Record<string, unknown>);
}

export function readLeadToken(token: string): LeadTokenPayload | null {
  try {
    const payload = EncryptionService.decryptPayload(token);

    if (
      typeof payload.leadId !== 'string' ||
      typeof payload.payloadHash !== 'string' ||
      typeof payload.expiresAt !== 'string'
    ) {
      return null;
    }

    return {
      leadId: payload.leadId,
      payloadHash: payload.payloadHash,
      expiresAt: payload.expiresAt,
    };
  } catch {
    return null;
  }
}

export function classifyDecision(decision: LeadDecision): RiskLevel {
  if (decision === 'BLOCK') {
    return 'HIGH';
  }

  if (decision === 'CHALLENGE') {
    return 'MEDIUM';
  }

  return 'LOW';
}

export function resolveDecision(input: {
  attempts: number;
  softLimit: number;
  hardLimit: number;
  challengePassed: boolean;
}): LeadDecision {
  if (input.attempts >= input.hardLimit) {
    return 'BLOCK';
  }

  if (input.attempts >= input.softLimit && !input.challengePassed) {
    return 'CHALLENGE';
  }

  return 'ALLOW';
}

export function getWindowStart(config: MembershipSecurityConfig): Date {
  const windowStart = new Date();
  windowStart.setMinutes(windowStart.getMinutes() - config.windowMinutes);
  return windowStart;
}

export function getChallengeStatus(challengePassed: boolean, challengeProvided: boolean): ChallengeStatus {
  if (challengePassed) {
    return 'PASSED';
  }

  if (challengeProvided) {
    return 'FAILED';
  }

  return 'NOT_REQUIRED';
}

export function buildApplicantPayload(input: MembershipApplicationInput, authoritativeEmail?: string) {
  return {
    firstName: input.firstName,
    lastName: input.lastName,
    email: authoritativeEmail ?? input.email,
    city: input.city,
    country: input.country,
    countryCode: input.countryCode,
    experience: input.experience,
    phone: input.phone ?? null,
    message: input.message,
    ageConfirmed: input.ageConfirmed,
    termsConfirmed: input.termsConfirmed,
  };
}

export function buildRequestMeta(input: {
  source: 'direct' | 'lead';
  countryCode: string;
  experience: string;
  riskLevel: RiskLevel;
  challengeStatus: ChallengeStatus;
  emailHash: string;
  fingerprintHash: string;
  leadId?: string | null;
}): Record<string, unknown> {
  return {
    source: input.source,
    countryCode: input.countryCode,
    experience: input.experience,
    riskLevel: input.riskLevel,
    challengeStatus: input.challengeStatus,
    emailHash: input.emailHash,
    fingerprintHash: input.fingerprintHash,
    leadId: input.leadId ?? null,
  };
}

export async function verifyTurnstileToken(input: {
  token?: string;
  ip?: string | null;
}): Promise<boolean> {
  const env = getServerEnv();

  if (!input.token) {
    return false;
  }

  if (!env.TURNSTILE_SECRET_KEY) {
    return false;
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: input.token,
      ...(input.ip ? { remoteip: input.ip } : {}),
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    return false;
  }

  const payload = (await response.json()) as { success?: boolean };
  return payload.success === true;
}

export function isTurnstileEnabled(): boolean {
  const env = getServerEnv();
  return Boolean(env.TURNSTILE_SECRET_KEY && publicEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}
