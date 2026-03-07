'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { submitMembershipApplication } from '@/app/actions/applications';
import { useLanguage } from '@/hooks/useLanguage';
import { Loader2 } from '@/lib/icons';
import { toast } from 'sonner';

export default function PendingApplicationProcessor() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Only run if user is logged in
    if (!user) return;

    // Check for pending application
    const pendingAppStr = sessionStorage.getItem('pendingApplication');
    if (!pendingAppStr) return;

    let pendingApp;
    try {
      pendingApp = JSON.parse(pendingAppStr);
    } catch (e) {
      console.error('Failed to parse pending application', e);
      sessionStorage.removeItem('pendingApplication');
      return;
    }

    const processApplication = async () => {
      setIsProcessing(true);
      
      try {
        const result = await submitMembershipApplication({
          targetClubId: pendingApp.clubId,
          message: pendingApp.message,
          eligibilityAnswers: pendingApp.eligibilityAnswers || {},
        });

        // Clear storage regardless of result to prevent loops
        sessionStorage.removeItem('pendingApplication');

        if (result.success) {
          toast.success(t('club_profile.modal.success.message') || 'Application submitted successfully');
          // Redirect to requests page
          router.push(`/${language}/profile/requests`);
        } else {
          // If duplicate or error, still show message but clear storage
          toast.error(result.error || 'Failed to submit application');
        }
      } catch (error) {
        console.error('Auto-submit error:', error);
        toast.error('An unexpected error occurred while submitting your application');
        sessionStorage.removeItem('pendingApplication');
      } finally {
        setIsProcessing(false);
      }
    };

    processApplication();
  }, [user, router, language, t]);

  if (!isProcessing) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-bg-base/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4 p-6 bg-bg-surface rounded-2xl border border-white/10 shadow-2xl">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
        <p className="text-sm font-medium text-white">
          {t('form.submitting') || 'Submitting application...'}
        </p>
      </div>
    </div>
  );
}
