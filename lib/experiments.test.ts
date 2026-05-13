import { beforeEach, describe, expect, it } from 'vitest';
import { resolveExperimentArm } from '@/lib/experiments';
import { setConsentSnapshotForTesting } from '@/lib/consent';

describe('resolveExperimentArm consent gating', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setConsentSnapshotForTesting(null);
  });

  it('does not persist random experiment assignment before measurement consent', () => {
    const assignment = resolveExperimentArm({
      experimentId: 'landing_onramp_copy_v1',
      allowedArms: ['control', 'benefit'],
      searchParams: new URLSearchParams(),
    });

    expect(['control', 'benefit']).toContain(assignment.arm);
    expect(assignment.source).toBe('random');
    expect(window.localStorage.getItem('scm.exp.landing_onramp_copy_v1.arm')).toBeNull();
  });

  it('persists explicit and random assignment after measurement consent', () => {
    setConsentSnapshotForTesting({
      version: '2026-05-12',
      updatedAt: '2026-05-12T00:00:00.000Z',
      categories: {
        necessary: true,
        functional: false,
        measurement: true,
        marketing: false,
      },
    });

    const assignment = resolveExperimentArm({
      experimentId: 'landing_onramp_copy_v1',
      allowedArms: ['control', 'benefit'],
      searchParams: new URLSearchParams('landing_onramp_copy_v1_arm=benefit'),
    });

    expect(assignment).toEqual({ arm: 'benefit', source: 'query' });
    expect(window.localStorage.getItem('scm.exp.landing_onramp_copy_v1.arm')).toBe('benefit');
  });
});
