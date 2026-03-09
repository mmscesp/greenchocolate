'use server';

// Authentication Server Actions
// Supabase Auth + Prisma Profile + Encryption

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { EncryptionService, type PIIData } from '@/lib/encryption';
import { z } from 'zod';
import { getLandingPageByRole } from '@/lib/auth-utils';
import { logAuthAuditEvent } from '@/lib/security/auth-audit';
import { ensureProfileForUser, getSessionProfile, getSessionUser } from '@/lib/session-profile';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

// ==========================================
// ZOD SCHEMAS
// ==========================================

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  nationality: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
});

// ==========================================
// TYPES
// ==========================================

export type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: unknown;
};

export type OAuthProvider = 'google' | 'apple';

const AUTH_FAILURE_MIN_DELAY_MS = 600;

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

function getSafeRedirectPath(rawRedirect: string | null, role: string): string {
  if (!rawRedirect) {
    return getLandingPageByRole(role, 'en');
  }

  const normalized = rawRedirect.trim();

  if (!normalized.startsWith('/') || normalized.startsWith('//')) {
    return getLandingPageByRole(role, 'en');
  }

  if (normalized.includes('://')) {
    return getLandingPageByRole(role, 'en');
  }

  return normalized;
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

async function getCurrentUser() {
  return getSessionProfile();
}

// ==========================================
// ACTIONS
// ==========================================

/**
 * User Signup Action
 */
export async function signUp(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();

  // Extract form data
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    fullName: formData.get('fullName') as string,
    phone: formData.get('phone') as string || undefined,
    birthDate: formData.get('birthDate') as string || undefined,
    nationality: formData.get('nationality') as string || undefined,
    consent: formData.get('consent') === 'on' ? true : false,
  };

  // Validate
  const validated = signUpSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors below',
    };
  }

  try {
    // Create auth user in Supabase
    const signUpResult = await supabase.auth.signUp({
      email: validated.data.email,
      password: validated.data.password,
    });

    const user = signUpResult.data.user;
    const error = signUpResult.error;

    if (error || !user) {
      await logAuthAuditEvent({
        operation: 'SIGN_UP',
        changedBy: 'anonymous',
        recordId: validated.data.email,
        changeData: { status: 'failed', reason: error?.message ?? 'unknown' },
      });
      return {
        success: false,
        message: error?.message || 'Signup failed. Please try again.',
      };
    }

    // Encrypt PII data
    const piiData: PIIData = {
      fullName: validated.data.fullName,
      phone: validated.data.phone || undefined,
      birthDate: validated.data.birthDate || undefined,
      nationality: validated.data.nationality || undefined,
    };

    const encryptedData = EncryptionService.encrypt(piiData);

    const profile = await ensureProfileForUser(user);

    if (!profile) {
      throw new Error('Failed to create user profile. Please try again.');
    }

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        email: validated.data.email.toLowerCase(),
        encryptedData,
        displayName: validated.data.fullName,
        hasCompletedOnboarding: true,
      },
    });

    // Record consent for GDPR
    // Get the profile ID for the consent record
    if (profile) {
      await prisma.consentRecord.create({
        data: {
          userId: profile.id,
          purpose: 'registration',
          granted: true,
          version: '1.0',
          metadata: {
            timestamp: new Date().toISOString(),
          },
        },
      });
    }

    revalidatePath('/', 'layout');
    
    // Determine landing page after signup
    const landingPage = getLandingPageByRole('USER', 'en');
    
    // Check if email confirmation is required
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      await logAuthAuditEvent({
        operation: 'SIGN_UP',
        changedBy: user.id,
        recordId: user.id,
        changeData: { status: 'success', emailConfirmationRequired: true },
      });
      return {
        success: true,
        message: 'Please check your email to confirm your account.',
      };
    }

    await logAuthAuditEvent({
      operation: 'SIGN_UP',
      changedBy: user.id,
      recordId: user.id,
      changeData: { status: 'success', emailConfirmationRequired: false },
    });
    
    redirect(landingPage);
  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('Signup error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * User Login Action
 * Handles authentication with optional "Remember Me" functionality
 */
export async function login(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const failureStartTime = Date.now();
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const validated = loginSchema.safeParse(data);

  if (!validated.success) {
    await enforceFailureDelay(failureStartTime);
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors below',
    };
  }

  let profile;
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: validated.data.email,
      password: validated.data.password,
    });

    if (error) {
      await enforceFailureDelay(failureStartTime);
      await logAuthAuditEvent({
        operation: 'LOGIN',
        changedBy: 'anonymous',
        recordId: validated.data.email,
        changeData: { status: 'failed' },
      });
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    // Update lastActive timestamp and get profile
    if (authData.user) {
      profile = await getSessionProfile({
        ensure: true,
        touchLastActive: true,
      });

      await logAuthAuditEvent({
        operation: 'LOGIN',
        changedBy: authData.user.id,
        recordId: authData.user.id,
        changeData: { status: 'success' },
      });
    }

    revalidatePath('/', 'layout');
  } catch (error) {
    console.error('Login error:', error);
    await enforceFailureDelay(failureStartTime);
    await logAuthAuditEvent({
      operation: 'LOGIN',
      changedBy: 'anonymous',
      recordId: validated.data.email,
      changeData: { status: 'failed', reason: 'exception' },
    });
    return {
      success: false,
      message: 'Invalid email or password',
    };
  }

  // Get the user's role to determine redirect
  const userRole = profile?.role || 'USER';
  
  // Get redirect URL from form or default based on role
  const formDataRedirect = formData.get('redirect') as string | null;
  const redirectUrl = getSafeRedirectPath(formDataRedirect, userRole);

  redirect(redirectUrl);
}


/**
 * User Signout Action
 */
export async function signOut() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.auth.signOut();

  await logAuthAuditEvent({
    operation: 'SIGN_OUT',
    changedBy: user?.id ?? 'anonymous',
    recordId: user?.id ?? 'anonymous',
    changeData: { status: 'success' },
  });

  redirect('/');
}

/**
 * Get Current User Action
 */
export async function getCurrentUserAction() {
  const profile = await getCurrentUser();
  return { user: profile };
}

/**
 * Update Profile Action
 */
export async function updateProfile(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getSessionUser();

  if (!user) {
    return {
      success: false,
      message: 'You must be logged in to update your profile',
    };
  }

  const data = {
    displayName: formData.get('displayName') as string || undefined,
    bio: formData.get('bio') as string || undefined,
    avatarUrl: formData.get('avatarUrl') as string || undefined,
  };

  const validated = updateProfileSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors below',
    };
  }

  try {
    await prisma.profile.update({
      where: { authId: user.id },
      data: {
        displayName: validated.data.displayName,
        bio: validated.data.bio,
        avatarUrl: validated.data.avatarUrl,
      },
    });

    revalidatePath('/profile');

    return {
      success: true,
      message: 'Profile updated successfully',
    };

  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      message: 'Failed to update profile. Please try again.',
    };
  }
}

/**
 * OAuth Sign In Action
 * Initiates OAuth flow for Google or Apple
 */
export async function signInWithOAuth(provider: OAuthProvider) {
  const supabase = await createClient();

  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (error) {
    await logAuthAuditEvent({
      operation: 'OAUTH_START',
      changedBy: 'anonymous',
      recordId: provider,
      changeData: { status: 'failed', provider },
    });
    return { success: false, message: error.message };
  }

  await logAuthAuditEvent({
    operation: 'OAUTH_START',
    changedBy: 'anonymous',
    recordId: provider,
    changeData: { status: 'success', provider },
  });

  // Return the URL to redirect to
  return { success: true, data: data.url };
}

/**
 * Decrypt User PII (for admin viewing)
 */
export async function decryptUserPII(userId: string): Promise<ActionState> {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return {
      success: false,
      message: 'Unauthorized',
    };
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
    });

    if (!profile || !profile.encryptedData) {
      return {
        success: false,
        message: 'User not found or no encrypted data',
      };
    }

    const pii = EncryptionService.decrypt(profile.encryptedData);

    return {
      success: true,
      data: pii,
    };

  } catch (error) {
    console.error('Decrypt PII error:', error);
    return {
      success: false,
      message: 'Failed to decrypt user data',
    };
  }
}
