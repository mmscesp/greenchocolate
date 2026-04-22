import { prisma } from '@/lib/prisma';

export const platformControlKeys = [
  'CONTACT_INQUIRY_INTAKE_ENABLED',
  'MARKETING_LEAD_CAPTURE_ENABLED',
  'MEMBERSHIP_INTAKE_ENABLED',
] as const;

export type PlatformControlKey = (typeof platformControlKeys)[number];

export type PlatformControlState = {
  contactInquiryIntakeEnabled: boolean;
  marketingLeadCaptureEnabled: boolean;
  membershipIntakeEnabled: boolean;
};

export const defaultPlatformControlState: PlatformControlState = {
  contactInquiryIntakeEnabled: true,
  marketingLeadCaptureEnabled: true,
  membershipIntakeEnabled: true,
};

const controlStateMap: Record<PlatformControlKey, keyof PlatformControlState> = {
  CONTACT_INQUIRY_INTAKE_ENABLED: 'contactInquiryIntakeEnabled',
  MARKETING_LEAD_CAPTURE_ENABLED: 'marketingLeadCaptureEnabled',
  MEMBERSHIP_INTAKE_ENABLED: 'membershipIntakeEnabled',
};

function coerceBooleanSetting(value: unknown, fallback: boolean) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const enabled = (value as Record<string, unknown>).enabled;
    if (typeof enabled === 'boolean') {
      return enabled;
    }
  }

  return fallback;
}

export async function getPlatformControlState(): Promise<PlatformControlState> {
  if (!('platformSetting' in prisma) || !prisma.platformSetting) {
    return { ...defaultPlatformControlState };
  }

  const rows = await prisma.platformSetting.findMany({
    where: {
      key: {
        in: [...platformControlKeys],
      },
    },
    select: {
      key: true,
      value: true,
    },
  });

  const nextState = { ...defaultPlatformControlState };

  for (const row of rows) {
    const stateKey = controlStateMap[row.key as PlatformControlKey];
    if (!stateKey) {
      continue;
    }

    nextState[stateKey] = coerceBooleanSetting(row.value, nextState[stateKey]);
  }

  return nextState;
}

export async function isPlatformControlEnabled(key: PlatformControlKey) {
  const state = await getPlatformControlState();
  return state[controlStateMap[key]];
}
