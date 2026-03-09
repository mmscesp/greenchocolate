import { NextResponse } from 'next/server';
import { getSessionProfile, toPublicSessionProfile } from '@/lib/session-profile';

// GET /api/profile/me - Get current user's profile
export async function GET() {
  try {
    const profile = await getSessionProfile({ ensure: true });
    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ profile: toPublicSessionProfile(profile) });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
