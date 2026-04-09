'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient, type User, type Session } from '@supabase/supabase-js';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  getAuthCallbackUrl,
  getLocalizedHomePath,
  resolveLocale,
} from '@/lib/auth-urls';
import { passwordSchema } from '@/lib/auth-password-policy';

// Types for the auth context
interface Profile {
  id: string;
  authId: string;
  email: string;
  displayName: string | null;
  bio?: string | null;
  avatarUrl: string | null;
  role: 'USER' | 'ADMIN' | 'CLUB_ADMIN';
  tier?: string;
  isVerified?: boolean;
  hasCompletedOnboarding: boolean;
  managedClubId?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    lang: string,
    metadata?: Record<string, string>,
    redirectPath?: string | null
  ) => Promise<{ error: Error | null, needsEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Supabase client factory (avoids singleton issues)
function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function createSupabaseVerificationClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    }
  );
}

function getCurrentLocale() {
  if (typeof window === 'undefined') {
    return resolveLocale(null);
  }

  return resolveLocale(window.location.pathname.split('/')[1] ?? null);
}

function buildFallbackUser(profile: Profile): User {
  return {
    id: profile.authId,
    aud: 'authenticated',
    role: 'authenticated',
    email: profile.email,
    email_confirmed_at: profile.createdAt,
    phone: '',
    confirmed_at: profile.createdAt,
    last_sign_in_at: profile.updatedAt,
    app_metadata: {},
    user_metadata: {
      full_name: profile.displayName ?? undefined,
      role: profile.role,
    },
    identities: [],
    created_at: profile.createdAt,
    updated_at: profile.updatedAt,
    is_anonymous: false,
  } as User;
}

async function logAuthEvent(operation: string, status: 'success' | 'failed', metadata?: Record<string, unknown>) {
  try {
    await fetch('/api/auth/audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ operation, status, metadata }),
    });
  } catch (error) {
    console.error('Failed to log auth event:', error);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  // Fetch user profile from our API
  const fetchProfile = async (): Promise<Profile | null> => {
    try {
      const response = await fetch('/api/profile/me', {
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        return data.profile;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    return null;
  };

  const syncProfileFromServer = useCallback(async () => {
    const userProfile = await fetchProfile();

    if (userProfile) {
      setProfile(userProfile);
      setUser((currentUser) => currentUser ?? buildFallbackUser(userProfile));
      return;
    }

    const {
      data: { session: refreshedSession },
    } = await supabase.auth.getSession();

    setSession(refreshedSession);
    setUser(refreshedSession?.user ?? null);

    if (!refreshedSession?.user) {
      setProfile(null);
    }
  }, [supabase]);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          const userProfile = await fetchProfile();
          if (!isMounted) return;
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(true);

        if (currentSession?.user) {
          const userProfile = await fetchProfile();
          setProfile(userProfile);

          // Show toast on sign in
          if (event === 'SIGNED_IN') {
            toast.success('Welcome back!');
          }
        } else {
          setProfile(null);

          // Show toast on sign out
          if (event === 'SIGNED_OUT') {
            toast.info('You have been signed out');
          }
        }

        setLoading(false);

        // Handle password recovery
        if (event === 'PASSWORD_RECOVERY') {
          toast.info('Please enter your new password');
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    void syncProfileFromServer();
  }, [pathname, syncProfileFromServer]);

  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'hidden') {
        return;
      }

      void syncProfileFromServer();
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, [syncProfileFromServer]);

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        await logAuthEvent('SIGN_IN_CLIENT', 'failed');
        return { error: new Error(error.message) };
      }

      router.refresh();
      await logAuthEvent('SIGN_IN_CLIENT', 'success');
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error signing in';
      toast.error(message);
      await logAuthEvent('SIGN_IN_CLIENT', 'failed');
      return { error: new Error(message) };
    }
  };

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    lang: string,
    metadata?: Record<string, string>,
    redirectPath?: string | null
  ): Promise<{ error: Error | null, needsEmailConfirmation?: boolean }> => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            ...metadata,
          },
          emailRedirectTo: getAuthCallbackUrl(lang, redirectPath, window.location.origin),
        },
      });

      if (error) {
        toast.error(error.message);
        await logAuthEvent('SIGN_UP_CLIENT', 'failed');
        return { error: new Error(error.message) };
      }

      // Check if email confirmation is required
      if (!data.session) {
        toast.success('Please check your email for verification');
        await logAuthEvent('SIGN_UP_CLIENT', 'success', { emailConfirmationRequired: true });
        return { error: null, needsEmailConfirmation: true };
      }

      router.refresh();
      await logAuthEvent('SIGN_UP_CLIENT', 'success', { emailConfirmationRequired: false });
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating account';
      toast.error(message);
      await logAuthEvent('SIGN_UP_CLIENT', 'failed');
      return { error: new Error(message) };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.refresh();
      router.push(getLocalizedHomePath(getCurrentLocale()));
      await logAuthEvent('SIGN_OUT_CLIENT', 'success');
    } catch (error) {
      console.error('Error signing out:', error);
      await logAuthEvent('SIGN_OUT_CLIENT', 'failed');
    }
  };

  // Update password (after reset)
  const updatePassword = async (newPassword: string): Promise<{ error: Error | null }> => {
    try {
      const validation = passwordSchema.safeParse(newPassword);
      if (!validation.success) {
        const message = validation.error.errors[0]?.message || 'Password does not meet security requirements';
        toast.error(message);
        await logAuthEvent('UPDATE_PASSWORD_CLIENT', 'failed', { reason: 'policy_validation' });
        return { error: new Error(message) };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error(error.message);
        await logAuthEvent('UPDATE_PASSWORD_CLIENT', 'failed');
        return { error: new Error(error.message) };
      }

      toast.success('Password updated successfully');
      await logAuthEvent('UPDATE_PASSWORD_CLIENT', 'success');
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error updating password';
      toast.error(message);
      await logAuthEvent('UPDATE_PASSWORD_CLIENT', 'failed');
      return { error: new Error(message) };
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ error: Error | null }> => {
    try {
      if (!user?.email) {
        return { error: new Error('You must be signed in to change your password') };
      }

      const validation = passwordSchema.safeParse(newPassword);
      if (!validation.success) {
        const message = validation.error.errors[0]?.message || 'Password does not meet security requirements';
        toast.error(message);
        await logAuthEvent('CHANGE_PASSWORD_CLIENT', 'failed', { reason: 'policy_validation' });
        return { error: new Error(message) };
      }

      const verificationClient = createSupabaseVerificationClient();
      const { error: verifyError } = await verificationClient.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      await verificationClient.auth.signOut();

      if (verifyError) {
        toast.error(verifyError.message);
        await logAuthEvent('CHANGE_PASSWORD_CLIENT', 'failed', { reason: 'invalid_current_password' });
        return { error: new Error(verifyError.message) };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error(error.message);
        await logAuthEvent('CHANGE_PASSWORD_CLIENT', 'failed', { reason: 'update_failed' });
        return { error: new Error(error.message) };
      }

      toast.success('Password updated successfully');
      await logAuthEvent('CHANGE_PASSWORD_CLIENT', 'success');
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error updating password';
      toast.error(message);
      await logAuthEvent('CHANGE_PASSWORD_CLIENT', 'failed', { reason: 'exception' });
      return { error: new Error(message) };
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      const userProfile = await fetchProfile();
      setProfile(userProfile);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updatePassword,
    changePassword,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
