'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { User, Session } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

// Types for the auth context
interface Profile {
  id: string;
  authId: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: 'USER' | 'ADMIN' | 'CLUB_ADMIN';
  hasCompletedOnboarding: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, metadata?: Record<string, string>) => Promise<{ error: Error | null, needsEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  resendEmailConfirmation: (email: string) => Promise<{ error: Error | null }>;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createSupabaseBrowserClient();

  // Fetch user profile from our API
  const fetchProfile = async (authId: string): Promise<Profile | null> => {
    try {
      const response = await fetch('/api/profile/me');
      if (response.ok) {
        const data = await response.json();
        return data.profile;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    return null;
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          const userProfile = await fetchProfile(initialSession.user.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
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
          const userProfile = await fetchProfile(currentSession.user.id);
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
      subscription.unsubscribe();
    };
  }, [supabase, router, pathname]);

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error: new Error(error.message) };
      }

      router.refresh();
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error signing in';
      toast.error(message);
      return { error: new Error(message) };
    }
  };

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    metadata?: Record<string, string>
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
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        return { error: new Error(error.message) };
      }

      // Check if email confirmation is required
      if (!data.session) {
        toast.success('Please check your email for verification');
        return { error: null, needsEmailConfirmation: true };
      }

      router.refresh();
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating account';
      toast.error(message);
      return { error: new Error(message) };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.refresh();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Reset password (send email)
  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return { error: new Error(error.message) };
      }

      toast.success('Password reset email sent');
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error sending email';
      toast.error(message);
      return { error: new Error(message) };
    }
  };

  // Update password (after reset)
  const updatePassword = async (newPassword: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error(error.message);
        return { error: new Error(error.message) };
      }

      toast.success('Password updated successfully');
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error updating password';
      toast.error(message);
      return { error: new Error(message) };
    }
  };

  // Resend email confirmation
  const resendEmailConfirmation = async (email: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        return { error: new Error(error.message) };
      }

      toast.success('Verification email sent');
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error sending email';
      toast.error(message);
      return { error: new Error(message) };
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      const userProfile = await fetchProfile(user.id);
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
    resetPassword,
    updatePassword,
    resendEmailConfirmation,
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
