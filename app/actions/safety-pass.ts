'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { EncryptionService } from '@/lib/encryption';

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

async function getCurrentProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return prisma.profile.findUnique({
    where: { authId: user.id },
    select: {
      id: true,
      email: true,
      tier: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

function buildPassNumber(userId: string): string {
  return `SMC-2026-${userId.slice(0, 8).toUpperCase()}`;
}

function mapTier(tier: string): PassTier {
  if (tier === 'elite') return 'ELITE';
  if (tier === 'premium') return 'PREMIUM';
  return 'STANDARD';
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

  const passNumber = buildPassNumber(profile.id);
  const tier = data.tier || mapTier(profile.tier);

  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      isVerified: true,
      encryptedData: EncryptionService.encryptPayload({
        passNumber,
        passTier: tier,
        eligibility: data.eligibilityAnswers,
        issuedAt: issuedAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
      }),
    },
  });

  await prisma.notification.create({
    data: {
      userId: profile.id,
      type: 'SYSTEM_ALERT',
      title: 'Safety pass generated',
      message: `Your safety pass ${passNumber} is active until ${expiresAt.toISOString().slice(0, 10)}.`,
      data: {
        passNumber,
        tier,
        expiresAt: expiresAt.toISOString(),
      },
    },
  });

  return {
    success: true,
    pass: {
      id: profile.id,
      passNumber,
      tier,
      status: 'ACTIVE',
      issuedAt,
      expiresAt,
    },
  };
}

export async function validateSafetyPass(passNumber: string): Promise<{
  valid: boolean;
  pass?: SafetyPassView;
  message: string;
}> {
  const normalizedPass = passNumber.trim().toUpperCase();
  const userIdPrefix = normalizedPass.replace('SMC-2026-', '').toLowerCase();

  const profile = await prisma.profile.findFirst({
    where: {
      id: {
        startsWith: userIdPrefix,
      },
      isVerified: true,
    },
    select: {
      id: true,
      tier: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!profile) {
    return { valid: false, message: 'Safety pass not found' };
  }

  const issuedAt = profile.createdAt;
  const expiresAt = new Date(issuedAt);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  const now = new Date();

  if (expiresAt <= now) {
    return {
      valid: false,
      pass: {
        id: profile.id,
        passNumber: buildPassNumber(profile.id),
        tier: mapTier(profile.tier),
        status: 'EXPIRED',
        issuedAt,
        expiresAt,
      },
      message: 'Safety pass expired',
    };
  }

  return {
    valid: true,
    pass: {
      id: profile.id,
      passNumber: buildPassNumber(profile.id),
      tier: mapTier(profile.tier),
      status: 'ACTIVE',
      issuedAt,
      expiresAt,
    },
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

  if (!profile.isVerified) {
    return { success: false, error: 'Cannot renew an inactive pass' };
  }

  const newExpiryDate = new Date();
  newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);

  await prisma.notification.create({
    data: {
      userId: profile.id,
      type: 'PASS_RENEWED',
      title: 'Safety Pass Renewed',
      message: `Your safety pass is now valid until ${newExpiryDate.toISOString().slice(0, 10)}`,
      data: {
        passNumber: buildPassNumber(profile.id),
        expiresAt: newExpiryDate.toISOString(),
      },
    },
  });

  return { success: true, newExpiryDate };
}
