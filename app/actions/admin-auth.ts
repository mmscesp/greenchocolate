'use server';

// Admin Authentication Server Actions
// Separate from user auth - ADMIN role required

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { logAuthAuditEvent } from '@/lib/security/auth-audit';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// ==========================================
// SCHEMAS
// ==========================================

const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ==========================================
// TYPES
// ==========================================

export type AdminActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const AUTH_FAILURE_MIN_DELAY_MS = 800; // Longer delay for admin

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function enforceFailureDelay(startTime: number): Promise<void> {
  const elapsed = Date.now() - startTime;
  const remaining = AUTH_FAILURE_MIN_DELAY_MS - elapsed;
  if (remaining > 0) {
    await sleep(remaining);
  }
}

// ==========================================
// ACTIONS
// ==========================================

/**
 * Admin Login Action
 * Only allows ADMIN role users to authenticate
 */
export async function adminLogin(prevState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const failureStartTime = Date.now();
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    lang: (formData.get('lang') as string) || 'en',
  };

  const validated = adminLoginSchema.safeParse(data);

  if (!validated.success) {
    await enforceFailureDelay(failureStartTime);
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors below',
    };
  }

  try {
    // First authenticate with Supabase
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: validated.data.email,
      password: validated.data.password,
    });

    if (error || !authData.user) {
      await enforceFailureDelay(failureStartTime);
      await logAuthAuditEvent({
        operation: 'ADMIN_LOGIN',
        changedBy: 'anonymous',
        recordId: validated.data.email,
        changeData: { status: 'failed', reason: 'auth_error' },
      });
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }

    // Check if user has ADMIN role
    const profile = await prisma.profile.findUnique({
      where: { authId: authData.user.id },
      select: { id: true, role: true, email: true, displayName: true },
    });

    if (!profile || profile.role !== 'ADMIN') {
      // Sign out immediately if not admin
      await supabase.auth.signOut();
      await enforceFailureDelay(failureStartTime);
      await logAuthAuditEvent({
        operation: 'ADMIN_LOGIN',
        changedBy: authData.user.id,
        recordId: authData.user.id,
        changeData: { status: 'failed', reason: 'not_admin', attemptedEmail: validated.data.email },
      });
      return {
        success: false,
        message: 'Access denied. Admin privileges required.',
      };
    }

    // Update last active
    await prisma.profile.update({
      where: { id: profile.id },
      data: { lastActiveAt: new Date() },
    });

    await logAuthAuditEvent({
      operation: 'ADMIN_LOGIN',
      changedBy: authData.user.id,
      recordId: authData.user.id,
      changeData: { status: 'success', adminEmail: profile.email },
    });

    revalidatePath('/', 'layout');
    redirect(`/${data.lang}/admin`);
  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('Admin login error:', error);
    await enforceFailureDelay(failureStartTime);
    return {
      success: false,
      message: 'Authentication failed. Please try again.',
    };
  }
}

/**
 * Check if current user is admin
 */
export async function checkAdminAuth(): Promise<{ isAdmin: boolean; profile: { id: string; email: string; displayName: string | null } | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { isAdmin: false, profile: null };
  }

  const profile = await prisma.profile.findUnique({
    where: { authId: user.id },
    select: { id: true, role: true, email: true, displayName: true },
  });

  if (!profile || profile.role !== 'ADMIN') {
    return { isAdmin: false, profile: null };
  }

  return { 
    isAdmin: true, 
    profile: { id: profile.id, email: profile.email, displayName: profile.displayName } 
  };
}

/**
 * Admin Sign Out
 */
export async function adminSignOut(lang = 'en') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  await logAuthAuditEvent({
    operation: 'ADMIN_SIGN_OUT',
    changedBy: user?.id ?? 'anonymous',
    recordId: user?.id ?? 'anonymous',
    changeData: { status: 'success' },
  });

  await supabase.auth.signOut();
  redirect(`/${lang}/admin/login`);
}
