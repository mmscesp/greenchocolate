'use server';

import { randomBytes } from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { EncryptionService } from '@/lib/encryption';
import type { ActionState } from './auth';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

const clubSignUpSchema = z.object({
  clubName: z.string().min(2, 'Club name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  address: z.string().min(5, 'Address is required'),
  phone: z.string().min(5, 'Phone number is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
});

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function suffixToken(length: number): string {
  return randomBytes(length).toString('hex').slice(0, length).toLowerCase();
}

async function ensureUniqueClubSlug(baseSlug: string): Promise<string> {
  const maxAttempts = 5;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = attempt === 0 ? baseSlug : `${baseSlug}-${suffixToken(6)}`;
    const existing = await prisma.club.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }
  }

  throw new Error('Unable to allocate unique slug for club');
}

function shortDescription(description: string): string {
  if (description.length <= 150) {
    return description;
  }

  return `${description.slice(0, 147)}...`;
}

export async function clubSignUp(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();

  const data = {
    clubName: String(formData.get('clubName') ?? ''),
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
    address: String(formData.get('address') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    description: String(formData.get('description') ?? ''),
  };

  const validated = clubSignUpSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors below',
    };
  }

  try {
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
    const signUpError = signUpResult.error;

    if (signUpError || !user) {
      return {
        success: false,
        message: signUpError?.message || 'Signup failed. Please try again.',
      };
    }

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

    const defaultCity = await prisma.city.findFirst({
      where: { slug: 'madrid' },
      select: { id: true },
    });

    if (!defaultCity) {
      return {
        success: false,
        message: 'Club signup is temporarily unavailable. Please try again later.',
      };
    }

    const slug = await ensureUniqueClubSlug(generateSlug(validated.data.clubName));

    await prisma.$transaction(async (tx) => {
      const profileRecord = await tx.profile.findUnique({
        where: { authId: user.id },
        select: { id: true },
      });

      const profile =
        profileRecord ??
        (await tx.profile.create({
          data: {
            authId: user.id,
            email: validated.data.email,
            role: 'CLUB_ADMIN',
            displayName: validated.data.clubName,
            hasCompletedOnboarding: true,
          },
          select: { id: true },
        }));

      await tx.$executeRaw`SELECT set_config('app.allow_role_change', 'on', true)`;

      await tx.profile.update({
        where: { id: profile.id },
        data: {
          role: 'CLUB_ADMIN',
          displayName: validated.data.clubName,
          hasCompletedOnboarding: true,
        },
      });

      const club = await tx.club.create({
        data: {
          slug,
          name: validated.data.clubName,
          description: validated.data.description,
          shortDescription: shortDescription(validated.data.description),
          cityId: defaultCity.id,
          neighborhood: 'Pending Assignment',
          addressDisplay: validated.data.address,
          coordinates: {},
          contactEmail: validated.data.email,
          phoneNumber: validated.data.phone,
          isVerified: false,
          isActive: false,
          allowsPreRegistration: false,
          openingHours: {},
          amenities: [],
          vibeTags: [],
          priceRange: '€€',
          capacity: 0,
          foundedYear: new Date().getFullYear(),
          images: [],
          socialMedia: {},
        },
        select: { id: true },
      });

      await tx.profile.update({
        where: { id: profile.id },
        data: {
          managedClub: {
            connect: { id: club.id },
          },
        },
      });

      await tx.membershipRequest.create({
        data: {
          userId: profile.id,
          clubId: club.id,
          status: 'PENDING',
          message: `New club registration request: ${validated.data.clubName}`,
          encryptedSnapshot: {
            encryptedData: encryptedRegistrationSnapshot,
          },
        },
      });
    });

    revalidatePath('/', 'layout');

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        success: true,
        message: 'Please check your email to confirm your account. Your club registration will be reviewed by our team.',
      };
    }

    redirect('/club-panel/dashboard');
  } catch (error) {
    console.error('Club signup error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}
