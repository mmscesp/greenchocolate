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
import {
  getAuthCallbackUrl,
  getLocalizedHomePath,
  getResetPasswordUrl,
  getSafeRedirectPath as getSafeLocalizedRedirectPath,
  resolveLocale,
} from '@/lib/auth-urls';
import { passwordSchema } from '@/lib/auth-password-policy';
import { logAuthAuditEvent } from '@/lib/security/auth-audit';
import { isAuthRateLimited } from '@/lib/security/auth-rate-limit';
import { ensureProfileForUser, getSessionProfile, getSessionUser } from '@/lib/session-profile';

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

const emailRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  lang: z.string().optional(),
  redirect: z.string().optional(),
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
const LOGIN_RATE_LIMIT_WINDOW_MINUTES = 15;
const LOGIN_RATE_LIMIT_MAX_ATTEMPTS = 5;
const SIGN_UP_RATE_LIMIT_WINDOW_MINUTES = 15;
const SIGN_UP_RATE_LIMIT_MAX_ATTEMPTS = 5;
const PASSWORD_RESET_RATE_LIMIT_WINDOW_MINUTES = 15;
const PASSWORD_RESET_RATE_LIMIT_MAX_ATTEMPTS = 3;
const RESEND_CONFIRMATION_RATE_LIMIT_WINDOW_MINUTES = 15;
const RESEND_CONFIRMATION_RATE_LIMIT_MAX_ATTEMPTS = 3;

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

function getSafeRedirectPath(rawRedirect: string | null, role: string, lang: string): string {
  return getSafeLocalizedRedirectPath(rawRedirect, lang, getLandingPageByRole(role, lang));
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
  const lang = resolveLocale(formData.get('lang') as string | null);
  const normalizedEmail = String(formData.get('email') ?? '').trim().toLowerCase();
  const redirectPath = getSafeRedirectPath(formData.get('redirect') as string | null, 'USER', lang);

  // Extract form data
  const data = {
    email: normalizedEmail,
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

  const signUpRateLimited = await isAuthRateLimited({
    operation: 'SIGN_UP',
    recordId: normalizedEmail,
    maxAttempts: SIGN_UP_RATE_LIMIT_MAX_ATTEMPTS,
    windowMinutes: SIGN_UP_RATE_LIMIT_WINDOW_MINUTES,
    status: 'failed',
  });

  if (signUpRateLimited) {
    await logAuthAuditEvent({
      operation: 'SIGN_UP_RATE_LIMITED',
      changedBy: 'anonymous',
      recordId: normalizedEmail,
      changeData: { status: 'failed' },
    });

    return {
      success: false,
      message: 'Too many signup attempts. Please try again later.',
    };
  }

  try {
    // Create auth user in Supabase
    const signUpResult = await supabase.auth.signUp({
      email: validated.data.email,
      password: validated.data.password,
      options: {
        data: {
          full_name: validated.data.fullName,
        },
        emailRedirectTo: getAuthCallbackUrl(lang, redirectPath),
      },
    });

    const user = signUpResult.data.user;
    const error = signUpResult.error;

    if (error || !user) {
      await logAuthAuditEvent({
        operation: 'SIGN_UP',
        changedBy: 'anonymous',
        recordId: normalizedEmail,
        changeData: { status: 'failed', reason: error?.message ?? 'unknown' },
      });
      return {
        success: false,
        message: 'Unable to create account. Please try again.',
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
    const landingPage = redirectPath || getLandingPageByRole('USER', lang);
    
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
  const lang = resolveLocale(formData.get('lang') as string | null);

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

  const normalizedEmail = validated.data.email.trim().toLowerCase();
  const loginRateLimited = await isAuthRateLimited({
    operation: 'LOGIN',
    recordId: normalizedEmail,
    maxAttempts: LOGIN_RATE_LIMIT_MAX_ATTEMPTS,
    windowMinutes: LOGIN_RATE_LIMIT_WINDOW_MINUTES,
    status: 'failed',
  });

  if (loginRateLimited) {
    await enforceFailureDelay(failureStartTime);
    await logAuthAuditEvent({
      operation: 'LOGIN_RATE_LIMITED',
      changedBy: 'anonymous',
      recordId: normalizedEmail,
      changeData: { status: 'failed' },
    });
    return {
      success: false,
      message: 'Too many login attempts. Please try again later.',
    };
  }

  let profile;
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: validated.data.password,
    });

    if (error) {
      await enforceFailureDelay(failureStartTime);
      await logAuthAuditEvent({
        operation: 'LOGIN',
        changedBy: 'anonymous',
        recordId: normalizedEmail,
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
      recordId: normalizedEmail,
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
  const redirectUrl = getSafeRedirectPath(formDataRedirect, userRole, lang);

  redirect(redirectUrl);
}


/**
 * User Signout Action
 */
export async function signOut(langInput?: string | null) {
  const supabase = await createClient();
  const lang = resolveLocale(langInput);
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.auth.signOut();

  await logAuthAuditEvent({
    operation: 'SIGN_OUT',
    changedBy: user?.id ?? 'anonymous',
    recordId: user?.id ?? 'anonymous',
    changeData: { status: 'success' },
  });

  redirect(getLocalizedHomePath(lang));
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
export async function signInWithOAuth(
  provider: OAuthProvider,
  lang: string,
  redirectPath?: string | null
) {
  const supabase = await createClient();
  const redirectUrl = getAuthCallbackUrl(
    lang,
    redirectPath ? getSafeLocalizedRedirectPath(redirectPath, lang) : null
  );

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

export async function requestPasswordReset(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const lang = resolveLocale(formData.get('lang') as string | null);
  const validated = emailRequestSchema.safeParse({
    email: String(formData.get('email') ?? '').trim().toLowerCase(),
    lang,
  });

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors below',
    };
  }

  const normalizedEmail = validated.data.email;
  const rateLimited = await isAuthRateLimited({
    operation: 'PASSWORD_RESET_REQUEST',
    recordId: normalizedEmail,
    maxAttempts: PASSWORD_RESET_RATE_LIMIT_MAX_ATTEMPTS,
    windowMinutes: PASSWORD_RESET_RATE_LIMIT_WINDOW_MINUTES,
  });

  if (rateLimited) {
    await logAuthAuditEvent({
      operation: 'PASSWORD_RESET_REQUEST_RATE_LIMITED',
      changedBy: 'anonymous',
      recordId: normalizedEmail,
      changeData: { status: 'failed' },
    });

    return {
      success: false,
      message: 'Too many reset requests. Please try again later.',
    };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: getResetPasswordUrl(lang),
    });

    await logAuthAuditEvent({
      operation: 'PASSWORD_RESET_REQUEST',
      changedBy: 'anonymous',
      recordId: normalizedEmail,
      changeData: {
        status: error ? 'failed' : 'success',
        reason: error?.message ?? null,
      },
    });

    if (error) {
      return {
        success: false,
        message: 'Unable to send reset email right now. Please try again later.',
      };
    }

    return {
      success: true,
      message: 'If an account exists for that email, a reset link has been sent.',
    };
  } catch (error) {
    console.error('Password reset request error:', error);
    await logAuthAuditEvent({
      operation: 'PASSWORD_RESET_REQUEST',
      changedBy: 'anonymous',
      recordId: normalizedEmail,
      changeData: { status: 'failed', reason: 'exception' },
    });
    return {
      success: false,
      message: 'Unable to send reset email right now. Please try again later.',
    };
  }
}

export async function resendConfirmationEmail(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const lang = resolveLocale(formData.get('lang') as string | null);
  const validated = emailRequestSchema.safeParse({
    email: String(formData.get('email') ?? '').trim().toLowerCase(),
    lang,
    redirect: String(formData.get('redirect') ?? ''),
  });

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors below',
    };
  }

  const normalizedEmail = validated.data.email;
  const redirectPath = validated.data.redirect
    ? getSafeLocalizedRedirectPath(validated.data.redirect, lang)
    : null;

  const rateLimited = await isAuthRateLimited({
    operation: 'RESEND_CONFIRMATION_REQUEST',
    recordId: normalizedEmail,
    maxAttempts: RESEND_CONFIRMATION_RATE_LIMIT_MAX_ATTEMPTS,
    windowMinutes: RESEND_CONFIRMATION_RATE_LIMIT_WINDOW_MINUTES,
  });

  if (rateLimited) {
    await logAuthAuditEvent({
      operation: 'RESEND_CONFIRMATION_RATE_LIMITED',
      changedBy: 'anonymous',
      recordId: normalizedEmail,
      changeData: { status: 'failed' },
    });

    return {
      success: false,
      message: 'Too many confirmation requests. Please try again later.',
    };
  }

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: normalizedEmail,
      options: {
        emailRedirectTo: getAuthCallbackUrl(lang, redirectPath),
      },
    });

    await logAuthAuditEvent({
      operation: 'RESEND_CONFIRMATION_REQUEST',
      changedBy: 'anonymous',
      recordId: normalizedEmail,
      changeData: {
        status: error ? 'failed' : 'success',
        reason: error?.message ?? null,
      },
    });

    if (error) {
      return {
        success: false,
        message: 'Unable to resend confirmation right now. Please try again later.',
      };
    }

    return {
      success: true,
      message: 'If an account exists and still needs confirmation, we have sent a new email.',
    };
  } catch (error) {
    console.error('Resend confirmation error:', error);
    await logAuthAuditEvent({
      operation: 'RESEND_CONFIRMATION_REQUEST',
      changedBy: 'anonymous',
      recordId: normalizedEmail,
      changeData: { status: 'failed', reason: 'exception' },
    });
    return {
      success: false,
      message: 'Unable to resend confirmation right now. Please try again later.',
    };
  }
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
