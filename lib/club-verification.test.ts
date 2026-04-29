import { describe, expect, it } from 'vitest';
import {
  getClubStatusDescription,
  getClubStatusLabel,
  isPublicClubStatus,
  isVerifiedClubStatus,
} from './club-verification';

describe('club verification helpers', () => {
  it('treats only SCM_VERIFIED and FEATURED as verified profiles', () => {
    expect(isVerifiedClubStatus('SCM_VERIFIED')).toBe(true);
    expect(isVerifiedClubStatus('FEATURED')).toBe(true);
    expect(isVerifiedClubStatus('UNVERIFIED')).toBe(false);
    expect(isVerifiedClubStatus('PENDING_REVIEW')).toBe(false);
    expect(isVerifiedClubStatus('INACTIVE')).toBe(false);
    expect(isVerifiedClubStatus(null)).toBe(false);
  });

  it('keeps inactive listings out of the public status set', () => {
    expect(isPublicClubStatus('UNVERIFIED')).toBe(true);
    expect(isPublicClubStatus('PENDING_REVIEW')).toBe(true);
    expect(isPublicClubStatus('SCM_VERIFIED')).toBe(true);
    expect(isPublicClubStatus('FEATURED')).toBe(true);
    expect(isPublicClubStatus('INACTIVE')).toBe(false);
  });

  it('returns safe labels and descriptions for unknown values', () => {
    expect(getClubStatusLabel('NOT_A_REAL_STATUS')).toBe('Public Listing');
    expect(getClubStatusDescription(undefined)).toContain('public research listing');
  });
});
