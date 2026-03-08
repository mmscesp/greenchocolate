'use server';

import {
  cancelMembershipRequest as cancelApplicationRequest,
  getUserMembershipRequests as getCanonicalUserMembershipRequests,
  submitMembershipApplication,
  type ActionState,
  type MembershipRequestCard,
} from '@/app/actions/applications';

export type { ActionState, MembershipRequestCard };

export interface ClubRequest {
  id: string;
  status: string;
  message: string | null;
  createdAt: string;
  user: {
    id: string;
    displayName: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

export async function submitMembershipRequest(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const clubId = String(formData.get('clubId') || '');
  const message = String(formData.get('message') || '');

  const result = await submitMembershipApplication({
    targetClubId: clubId,
    message: message || undefined,
    eligibilityAnswers: {},
  });

  return {
    success: result.success,
    message: result.success ? 'Request submitted successfully' : result.error,
  };
}

export async function getUserMembershipRequests() {
  return getCanonicalUserMembershipRequests();
}

export async function cancelMembershipRequest(requestId: string): Promise<ActionState> {
  return cancelApplicationRequest(requestId);
}

export async function getClubMembershipRequests(): Promise<ClubRequest[]> {
  return [];
}

export async function approveClubMembershipRequest(): Promise<ActionState> {
  return {
    success: false,
    message: 'Club-side approvals are disabled. Use the admin queue.',
  };
}

export async function rejectClubMembershipRequest(): Promise<ActionState> {
  return {
    success: false,
    message: 'Club-side approvals are disabled. Use the admin queue.',
  };
}
