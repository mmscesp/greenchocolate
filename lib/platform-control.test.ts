import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    platformSetting: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';
import {
  defaultPlatformControlState,
  getPlatformControlState,
  isPlatformControlEnabled,
} from '@/lib/platform-control';

describe('platform control state', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.platformSetting.findMany).mockResolvedValue([]);
  });

  it('returns default controls when no persisted settings exist', async () => {
    const state = await getPlatformControlState();

    expect(state).toEqual(defaultPlatformControlState);
  });

  it('applies persisted boolean overrides from platform settings', async () => {
    vi.mocked(prisma.platformSetting.findMany).mockResolvedValue([
      {
        key: 'CONTACT_INQUIRY_INTAKE_ENABLED',
        value: { enabled: false },
      },
      {
        key: 'MEMBERSHIP_INTAKE_ENABLED',
        value: true,
      },
    ] as never);

    const state = await getPlatformControlState();

    expect(state).toEqual({
      contactInquiryIntakeEnabled: false,
      marketingLeadCaptureEnabled: true,
      membershipIntakeEnabled: true,
    });
  });

  it('falls back to defaults when the prisma client does not expose platform settings', async () => {
    const originalPlatformSetting = (prisma as { platformSetting?: unknown }).platformSetting;
    (prisma as { platformSetting?: unknown }).platformSetting = undefined;

    const state = await getPlatformControlState();

    expect(state).toEqual(defaultPlatformControlState);

    (prisma as { platformSetting?: unknown }).platformSetting = originalPlatformSetting;
  });

  it('resolves individual control keys through the shared state map', async () => {
    vi.mocked(prisma.platformSetting.findMany).mockResolvedValue([
      {
        key: 'MARKETING_LEAD_CAPTURE_ENABLED',
        value: { enabled: false },
      },
    ] as never);

    await expect(isPlatformControlEnabled('MARKETING_LEAD_CAPTURE_ENABLED')).resolves.toBe(false);
    await expect(isPlatformControlEnabled('CONTACT_INQUIRY_INTAKE_ENABLED')).resolves.toBe(true);
  });
});
