'use server';

// Club Authentication Server Actions
// Handles club signup with Club entity creation

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { EncryptionService } from '@/lib/encryption';
import { z } from 'zod';
import type { ActionState } from './auth';

// ==========================================
// ZOD SCHEMAS
// ==========================================

const clubSignUpSchema = z.object({
  clubName: z.string().min(2, 'Club name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  address: z.string().min(5, 'Address is required'),
  phone: z.string().min(5, 'Phone number is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  cityId: z.string().optional(), // Will be assigned during verification
});

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Generate a URL-friendly slug from club name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ==========================================
// ACTIONS
// ==========================================

/**
 * Club Signup Action
 * Creates auth user, Club entity, and assigns CLUB_ADMIN role
 */
export async function clubSignUp(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();

  // Extract form data
  const data = {
    clubName: formData.get('clubName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    address: formData.get('address') as string,
    phone: formData.get('phone') as string,
    description: formData.get('description') as string,
  };

  // Validate
  const validated = clubSignUpSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors below',
    };
  }

  try {
    // Step 1: Create auth user in Supabase
    const signUpResult = await supabase.auth.signUp({
      email: validated.data.email,
      password: validated.data.password,
      options: {
        data: {
          full_name: validated.data.clubName,
          club_name: validated.data.clubName,
          user_type: 'club_admin',
        },
      },
    });

    const user = signUpResult.data.user;
    const error = signUpResult.error;

    if (error || !user) {
      return {
        success: false,
        message: error?.message || 'Signup failed. Please try again.',
      };
    }

    // Step 2: Generate slug for club
    const slug = generateSlug(validated.data.clubName);
    
    // Check if slug already exists
    const existingClub = await prisma.club.findUnique({
      where: { slug },
    });

    let uniqueSlug = slug;
    if (existingClub) {
      // Append random suffix to make it unique
      uniqueSlug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    // Step 3: Create Club entity
    // Note: Using Madrid as default city for now - admin will verify and assign proper city
    const defaultCity = await prisma.city.findFirst({
      where: { slug: 'madrid' },
    });

    const club = await prisma.club.create({
      data: {
        slug: uniqueSlug,
        name: validated.data.clubName,
        description: validated.data.description,
        shortDescription: validated.data.description.substring(0, 150) + '...',
        cityId: defaultCity?.id || '', // Admin will verify and update
        neighborhood: 'Pending Assignment',
        addressDisplay: validated.data.address,
        coordinates: {}, // Will be set during verification
        contactEmail: validated.data.email,
        phoneNumber: validated.data.phone,
        isVerified: false, // Requires admin verification
        isActive: false, // Inactive until verified
        allowsPreRegistration: false,
        openingHours: {},
        amenities: [],
        vibeTags: [],
        priceRange: '€€',
        capacity: 0, // Will be set during verification
        foundedYear: new Date().getFullYear(),
        images: [],
        socialMedia: {},
      },
    });

    // Step 4: Update profile to CLUB_ADMIN role and link to club
    await prisma.profile.update({
      where: { authId: user.id },
      data: {
        role: 'CLUB_ADMIN',
        displayName: validated.data.clubName,
        hasCompletedOnboarding: true,
        managedClub: {
          connect: { id: club.id },
        },
      },
    });

    const encryptedRegistrationSnapshot = EncryptionService.encryptPayload({
      type: 'club_registration',
      clubData: {
        name: validated.data.clubName,
        email: validated.data.email,
        phone: validated.data.phone,
        address: validated.data.address,
        description: validated.data.description,
      },
      submittedAt: new Date().toISOString(),
    });

    // Step 5: Create verification request for admin review
    // This creates a record that admin will review manually
    await prisma.membershipRequest.create({
      data: {
        userId: (await prisma.profile.findUnique({ where: { authId: user.id } }))?.id || '',
        clubId: club.id,
        status: 'PENDING',
        message: `New club registration request: ${validated.data.clubName}`,
        encryptedSnapshot: {
          encryptedData: encryptedRegistrationSnapshot,
        },
      },
    });

    revalidatePath('/', 'layout');
    
    // Check if email confirmation is required
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return {
        success: true,
        message: 'Please check your email to confirm your account. Your club registration will be reviewed by our team.',
      };
    }

    // If no email confirmation needed, redirect to club dashboard
    redirect('/club-panel/dashboard');

  } catch (error) {
    console.error('Club signup error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}
