export const CLUB_VERIFICATION_STATUSES = [
  'UNVERIFIED',
  'PENDING_REVIEW',
  'SCM_VERIFIED',
  'FEATURED',
  'INACTIVE',
] as const;

export type ClubVerificationStatus = (typeof CLUB_VERIFICATION_STATUSES)[number];

export const VERIFIED_CLUB_STATUSES: ClubVerificationStatus[] = ['SCM_VERIFIED', 'FEATURED'];

export function isVerifiedClubStatus(status?: string | null): boolean {
  return status === 'SCM_VERIFIED' || status === 'FEATURED';
}

export function isPublicClubStatus(status?: string | null): boolean {
  return status !== 'INACTIVE';
}

export function getClubStatusLabel(status?: string | null): string {
  switch (status) {
    case 'FEATURED':
    case 'SCM_VERIFIED':
      return 'Verified Profile';
    case 'PENDING_REVIEW':
      return 'Public Listing';
    case 'INACTIVE':
      return 'Inactive listing';
    case 'UNVERIFIED':
    default:
      return 'Public Listing';
  }
}

export function getClubStatusDescription(status?: string | null): string {
  switch (status) {
    case 'FEATURED':
    case 'SCM_VERIFIED':
      return 'A profile that has passed SCM’s current trust checks. It is a trust signal, not a legal guarantee, commercial endorsement, or promise of access.';
    case 'PENDING_REVIEW':
      return 'A public research listing that has not completed SCM’s on-site verification review. It is a starting point, not a recommendation or promise of access.';
    case 'INACTIVE':
      return 'This listing is not currently visible in public discovery surfaces.';
    case 'UNVERIFIED':
    default:
      return 'A public research listing that has not completed SCM’s on-site verification review. It is a starting point, not a recommendation or promise of access.';
  }
}
