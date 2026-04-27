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
      return 'Featured SCM verified';
    case 'SCM_VERIFIED':
      return 'SCM verified';
    case 'PENDING_REVIEW':
      return 'Pending SCM review';
    case 'INACTIVE':
      return 'Inactive listing';
    case 'UNVERIFIED':
    default:
      return 'Unverified public listing';
  }
}

export function getClubStatusDescription(status?: string | null): string {
  switch (status) {
    case 'FEATURED':
    case 'SCM_VERIFIED':
      return 'SCM has reviewed this club against its verification standard.';
    case 'PENDING_REVIEW':
      return 'SCM has a public listing for this club, but the verification review is still in progress.';
    case 'INACTIVE':
      return 'This listing is not currently visible in public discovery surfaces.';
    case 'UNVERIFIED':
    default:
      return 'This page is based on public information and has not completed the SCM verification review.';
  }
}
