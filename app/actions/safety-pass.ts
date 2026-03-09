'use server';

import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
import { getSessionProfile } from '@/lib/session-profile';

export type PassTier = 'STANDARD' | 'PREMIUM' | 'ELITE';
export type PassStatus = 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';

export interface SafetyPassView {
  id: string;
  passNumber: string;
  tier: PassTier;
  status: PassStatus;
  issuedAt: Date;
  expiresAt: Date;
}

type CurrentProfile = {
  id: string;
  email: string;
  tier: string;
  isVerified: boolean;
};

type SafetyPassRecord = {
  id: string;
  passNumber: string;
  tier: PassTier;
  status: PassStatus;
  issuedAt: Date;
  expiresAt: Date;
};

async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const profile = await getSessionProfile({ ensure: true });
  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    email: profile.email,
    tier: profile.tier,
    isVerified: profile.isVerified,
  };
}

function createPassNumber(): string {
  return `SMC-2026-${randomBytes(6).toString('hex').toUpperCase()}`;
}

function mapProfileTier(tier: string): PassTier {
  if (tier === 'elite') {
    return 'ELITE';
  }

  if (tier === 'premium') {
    return 'PREMIUM';
  }

  return 'STANDARD';
}

function toSafetyPassView(pass: SafetyPassRecord): SafetyPassView {
  return {
    id: pass.id,
    passNumber: pass.passNumber,
    tier: pass.tier,
    status: pass.status,
    issuedAt: pass.issuedAt,
    expiresAt: pass.expiresAt,
  };
}

async function generateUniquePassNumber(tx: Parameters<typeof prisma.$transaction>[0] extends (arg: infer T) => Promise<unknown> ? T : never): Promise<string> {
  const maxAttempts = 5;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = createPassNumber();
    const existing = await tx.safetyPass.findUnique({
      where: { passNumber: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }
  }

  throw new Error('Unable to generate a unique safety pass number');
}

function computePassStatus(pass: {
  status: PassStatus;
  expiresAt: Date;
}): PassStatus {
  if (pass.status === 'SUSPENDED') {
    return 'SUSPENDED';
  }

  if (pass.expiresAt <= new Date()) {
    return 'EXPIRED';
  }

  return 'ACTIVE';
}

export async function generateSafetyPass(data: {
  eligibilityAnswers: Record<string, boolean>;
  tier?: PassTier;
}): Promise<{ success: boolean; pass?: SafetyPassView; error?: string }> {
  const profile = await getCurrentProfile();

  if (!profile) {
    return { success: false, error: 'Unauthorized' };
  }

  const isEligible = Object.values(data.eligibilityAnswers).every(Boolean);
  if (!isEligible) {
    return { success: false, error: 'Eligibility requirements not met' };
  }

  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  const tier = data.tier ?? mapProfileTier(profile.tier);

  const pass = await prisma.$transaction(async (tx) => {
    const existingPass = await tx.safetyPass.findUnique({
      where: { userId: profile.id },
      select: { passNumber: true },
    });

    const passNumber = existingPass?.passNumber ?? (await generateUniquePassNumber(tx));

    return tx.safetyPass.upsert({
      where: { userId: profile.id },
      update: {
        tier,
        status: 'ACTIVE',
        issuedAt,
        expiresAt,
        metadata: {
          eligibilityAnswers: data.eligibilityAnswers,
          lastGeneratedAt: new Date().toISOString(),
        },
      },
      create: {
        userId: profile.id,
        passNumber,
        tier,
        status: 'ACTIVE',
        issuedAt,
        expiresAt,
        metadata: {
          eligibilityAnswers: data.eligibilityAnswers,
          lastGeneratedAt: new Date().toISOString(),
        },
      },
      select: {
        id: true,
        passNumber: true,
        tier: true,
        status: true,
        issuedAt: true,
        expiresAt: true,
      },
    });
  });

  await prisma.notification.create({
    data: {
      userId: profile.id,
      type: 'SYSTEM_ALERT',
      title: 'Safety pass generated',
      message: `Your safety pass ${pass.passNumber} is active until ${pass.expiresAt.toISOString().slice(0, 10)}.`,
      data: {
        passNumber: pass.passNumber,
        tier: pass.tier,
        expiresAt: pass.expiresAt.toISOString(),
      },
    },
  });

  return {
    success: true,
    pass: toSafetyPassView(pass),
  };
}

export async function validateSafetyPass(passNumber: string): Promise<{
  valid: boolean;
  pass?: SafetyPassView;
  message: string;
}> {
  const normalizedPass = passNumber.trim().toUpperCase();

  const pass = await prisma.safetyPass.findUnique({
    where: { passNumber: normalizedPass },
    select: {
      id: true,
      passNumber: true,
      tier: true,
      status: true,
      issuedAt: true,
      expiresAt: true,
    },
  });

  if (!pass) {
    return { valid: false, message: 'Safety pass not found' };
  }

  const computedStatus = computePassStatus({
    status: pass.status,
    expiresAt: pass.expiresAt,
  });

  const passView = toSafetyPassView({
    ...pass,
    status: computedStatus,
  });

  if (computedStatus === 'EXPIRED') {
    return {
      valid: false,
      pass: passView,
      message: 'Safety pass expired',
    };
  }

  if (computedStatus === 'SUSPENDED') {
    return {
      valid: false,
      pass: passView,
      message: 'Safety pass suspended',
    };
  }

  return {
    valid: true,
    pass: passView,
    message: 'Safety pass is valid',
  };
}

export async function renewSafetyPass(): Promise<{
  success: boolean;
  newExpiryDate?: Date;
  error?: string;
}> {
  const profile = await getCurrentProfile();

  if (!profile) {
    return { success: false, error: 'Unauthorized' };
  }

  const existingPass = await prisma.safetyPass.findUnique({
    where: { userId: profile.id },
    select: {
      id: true,
      passNumber: true,
      status: true,
      expiresAt: true,
    },
  });

  if (!existingPass || existingPass.status === 'SUSPENDED') {
    return { success: false, error: 'Cannot renew an inactive pass' };
  }

  const now = new Date();
  const renewalBase = existingPass.expiresAt > now ? existingPass.expiresAt : now;
  const newExpiryDate = new Date(renewalBase);
  newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);

  const renewedPass = await prisma.safetyPass.update({
    where: { id: existingPass.id },
    data: {
      status: 'ACTIVE',
      renewedAt: now,
      expiresAt: newExpiryDate,
    },
    select: { passNumber: true },
  });

  await prisma.notification.create({
    data: {
      userId: profile.id,
      type: 'PASS_RENEWED',
      title: 'Safety Pass Renewed',
      message: `Your safety pass is now valid until ${newExpiryDate.toISOString().slice(0, 10)}`,
      data: {
        passNumber: renewedPass.passNumber,
        expiresAt: newExpiryDate.toISOString(),
      },
    },
  });

  return { success: true, newExpiryDate };
}
