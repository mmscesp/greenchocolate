'use server';

import {
  cancelMembershipRequest as cancelApplicationRequest,
  getUserMembershipRequests as getCanonicalUserMembershipRequests,
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
  _formData: FormData
): Promise<ActionState> {
  return {
    success: false,
    message: 'Use the club membership application modal. Legacy membership form submission is disabled.',
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
