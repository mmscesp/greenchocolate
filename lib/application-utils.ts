/**
 * Application status and stage mapping utilities.
 * These are pure functions that can be used in both client and server code.
 */

export type ApplicationStage = 'INTAKE' | 'DOCUMENT_VERIFICATION' | 'BACKGROUND_CHECK' | 'FINAL_APPROVAL';
export type ApplicationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'BACKGROUND_CHECK' | 'APPROVED' | 'REJECTED';

export function mapRequestStatus(status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SCHEDULED'): ApplicationStatus {
  if (status === 'APPROVED') return 'APPROVED';
  if (status === 'REJECTED') return 'REJECTED';
  if (status === 'SCHEDULED') return 'BACKGROUND_CHECK';
  return 'UNDER_REVIEW';
}

export function mapStatusToStage(status: ApplicationStatus): ApplicationStage {
  if (status === 'BACKGROUND_CHECK') return 'BACKGROUND_CHECK';
  if (status === 'APPROVED') return 'FINAL_APPROVAL';
  return 'DOCUMENT_VERIFICATION';
}
