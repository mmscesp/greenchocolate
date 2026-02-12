'use server';

// Authentication Server Actions
// Supabase Auth + Prisma Profile + Encryption

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { EncryptionService, type PIIData } from '@/lib/encryption';
import { z } from 'zod';

// ==========================================
// ZOD SCHEMAS
// ==========================================

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
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

// ==========================================
// HELPER FUNCTIONS
// ==========================================

async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: { authId: user.id },
  });

  return profile;
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

    // Update profile with encrypted data (trigger should create initial profile)
    try {
      await prisma.profile.update({
        where: { authId: user.id },
        data: {
          encryptedData,
          displayName: validated.data.fullName,
          hasCompletedOnboarding: true,
        },
      });
    } catch {
      // If trigger hasn't run yet, create profile directly
      await prisma.profile.create({
        data: {
          authId: user.id,
          email: validated.data.email,
          encryptedData,
          displayName: validated.data.fullName,
          hasCompletedOnboarding: true,
        },
      });
    }

    // Record consent for GDPR
    // Get the profile ID for the consent record
    const profileForConsent = await prisma.profile.findUnique({
      where: { authId: user.id },
    });

    if (profileForConsent) {
      await prisma.consentRecord.create({
        data: {
          userId: profileForConsent.id,
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
    
    // Check if email confirmation is required
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return {
        success: true,
        message: 'Please check your email to confirm your account.',
      };
    }

    redirect('/dashboard');

  } catch (error) {
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
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const rememberMe = formData.get('rememberMe') === 'true';

  const validated = loginSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors below',
    };
  }

  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: validated.data.email,
      password: validated.data.password,
    });

    if (error) {
      return {
        success: false,
        message: error.message || 'Invalid credentials',
      };
    }

    // Update last sign in timestamp
    if (authData.user) {
      await prisma.profile.update({
        where: { authId: authData.user.id },
        data: { updatedAt: new Date() },
      });
    }

    // Handle Remember Me - extend session if requested
    if (rememberMe && authData.session) {
      // Session persistence is handled by Supabase automatically
      // The cookie will have extended expiration based on Supabase config
      // In production, you may want to set a custom cookie for longer persistence
    }

    revalidatePath('/', 'layout');
    
    // Get redirect URL from form or default to dashboard
    const redirectUrl = formData.get('redirect') as string || '/dashboard';
    redirect(redirectUrl);

  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * User Signout Action
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
    revalidatePath('/dashboard');

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
