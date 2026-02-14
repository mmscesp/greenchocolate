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

export type OAuthProvider = 'google' | 'apple';

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

    // Upsert profile with encrypted data
    // Uses atomic upsert to handle race conditions between trigger and app code
    const maxRetries = 3;
    let profile;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        profile = await prisma.profile.upsert({
          where: { authId: user.id },
          update: {
            encryptedData,
            displayName: validated.data.fullName,
            hasCompletedOnboarding: true,
          },
          create: {
            authId: user.id,
            email: validated.data.email,
            encryptedData,
            displayName: validated.data.fullName,
            hasCompletedOnboarding: true,
          },
        });
        break;
      } catch (error) {
        // If unique constraint violation on last retry, give up
        if (attempt === maxRetries) {
          console.error('Profile upsert failed after retries:', error);
          throw new Error('Failed to create user profile. Please try again.');
        }
        // Otherwise retry (race condition between trigger and upsert)
        await new Promise(resolve => setTimeout(resolve, 100 * attempt));
      }
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
    
    // Determine landing page after signup
    const landingPage = getLandingPageByRole('USER', 'en');
    
    // Check if email confirmation is required
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return {
        success: true,
        message: 'Please check your email to confirm your account.',
      };
    }
    
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
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const validated = loginSchema.safeParse(data);

  if (!validated.success) {
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
      return {
        success: false,
        message: error.message || 'Invalid credentials',
      };
    }

    // Update lastActive timestamp and get profile
    if (authData.user) {
      profile = await prisma.profile.update({
        where: { authId: authData.user.id },
        data: { lastActiveAt: new Date() },
      });
    }

    revalidatePath('/', 'layout');
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }

  // Get the user's role to determine redirect
  const userRole = profile?.role || 'USER';
  
  // Get redirect URL from form or default based on role
  const formDataRedirect = formData.get('redirect') as string;
  const redirectUrl = formDataRedirect && formDataRedirect !== '/dashboard' 
    ? formDataRedirect 
    : getLandingPageByRole(userRole, 'en');

  redirect(redirectUrl);
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
    return { success: false, message: error.message };
  }

  // Return the URL to redirect to
  return { success: true, data: data.url };
}

/**
 * Update lastActive timestamp
 */
async function updateLastActive(authId: string) {
  await prisma.profile.update({
    where: { authId },
    data: { lastActiveAt: new Date() },
  });
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

// ==========================================
// CLUB ADMIN ACTIONS
// ==========================================

/**
 * Assign a club to a user (make them a CLUB_ADMIN)
 * Only admins can perform this action
 */
export async function assignClubAdmin(userId: string, clubId: string): Promise<ActionState> {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return {
      success: false,
      message: 'Unauthorized: Only admins can assign club admins',
    };
  }

  try {
    // Verify club exists
    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      return {
        success: false,
        message: 'Club not found',
      };
    }

    // Update profile with managedClubId and set role to CLUB_ADMIN
    await prisma.profile.update({
      where: { id: userId },
      data: {
        managedClubId: clubId,
        role: 'CLUB_ADMIN',
      },
    });

    revalidatePath('/admin/clubs');

    return {
      success: true,
      message: `Successfully assigned ${club.name} to user`,
    };
  } catch (error) {
    console.error('assignClubAdmin error:', error);
    return {
      success: false,
      message: 'Failed to assign club admin',
    };
  }
}

/**
 * Remove club admin from a user
 */
export async function removeClubAdmin(userId: string): Promise<ActionState> {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return {
      success: false,
      message: 'Unauthorized: Only admins can remove club admins',
    };
  }

  try {
    await prisma.profile.update({
      where: { id: userId },
      data: {
        managedClubId: null,
        role: 'USER',
      },
    });

    revalidatePath('/admin/clubs');

    return {
      success: true,
      message: 'Successfully removed club admin',
    };
  } catch (error) {
    console.error('removeClubAdmin error:', error);
    return {
      success: false,
      message: 'Failed to remove club admin',
    };
  }
}
