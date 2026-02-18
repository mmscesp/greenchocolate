import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export interface AdminSessionProfile {
  id: string;
  authId: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: 'ADMIN';
}

export async function getAdminSessionProfile(): Promise<AdminSessionProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: { authId: user.id },
    select: {
      id: true,
      authId: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      role: true,
    },
  });

  if (!profile || profile.role !== 'ADMIN') {
    return null;
  }

  return {
    ...profile,
    role: 'ADMIN',
  };
}

export async function requireAdminSession(lang: string): Promise<AdminSessionProfile> {
  const profile = await getAdminSessionProfile();
  if (!profile) {
    redirect(`/${lang}/admin/login`);
  }
  return profile;
}
