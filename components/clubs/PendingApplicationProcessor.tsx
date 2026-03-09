'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { finalizeMembershipApplicationLead } from '@/app/actions/applications';
import { useLanguage } from '@/hooks/useLanguage';
import { Loader2 } from '@/lib/icons';
import { toast } from 'sonner';

const pendingMembershipLeadStorageKey = 'pendingMembershipLead';
const legacyPendingApplicationStorageKey = 'pendingApplication';

type PendingMembershipLead = {
  pendingLeadToken: string;
  clubId?: string;
  clubSlug?: string;
  expiresAt?: string;
};

export default function PendingApplicationProcessor() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) return;

    const pendingLeadStr =
      sessionStorage.getItem(pendingMembershipLeadStorageKey) ||
      localStorage.getItem(pendingMembershipLeadStorageKey);
    if (!pendingLeadStr) {
      sessionStorage.removeItem(legacyPendingApplicationStorageKey);
      localStorage.removeItem(pendingMembershipLeadStorageKey);
      return;
    }

    let pendingLead: PendingMembershipLead;
    try {
      pendingLead = JSON.parse(pendingLeadStr) as PendingMembershipLead;
    } catch (error) {
      console.error('Failed to parse pending membership lead', error);
      sessionStorage.removeItem(pendingMembershipLeadStorageKey);
      sessionStorage.removeItem(legacyPendingApplicationStorageKey);
      localStorage.removeItem(pendingMembershipLeadStorageKey);
      return;
    }

    if (!pendingLead.pendingLeadToken) {
      sessionStorage.removeItem(pendingMembershipLeadStorageKey);
      sessionStorage.removeItem(legacyPendingApplicationStorageKey);
      localStorage.removeItem(pendingMembershipLeadStorageKey);
      return;
    }

    const processLead = async () => {
      setIsProcessing(true);

      try {
        const result = await finalizeMembershipApplicationLead({
          pendingLeadToken: pendingLead.pendingLeadToken,
        });

        sessionStorage.removeItem(pendingMembershipLeadStorageKey);
        sessionStorage.removeItem(legacyPendingApplicationStorageKey);
        localStorage.removeItem(pendingMembershipLeadStorageKey);

        if (result.success) {
          toast.success(t('club_profile.modal.success.message') || 'Application submitted successfully');
          router.push(`/${language}/profile/requests`);
        } else {
          toast.error(result.error || 'Failed to submit application');
        }
      } catch (error) {
        console.error('Auto-finalize membership lead error:', error);
        toast.error('An unexpected error occurred while submitting your application');
        sessionStorage.removeItem(pendingMembershipLeadStorageKey);
        sessionStorage.removeItem(legacyPendingApplicationStorageKey);
        localStorage.removeItem(pendingMembershipLeadStorageKey);
      } finally {
        setIsProcessing(false);
      }
    };

    processLead();
  }, [language, router, t, user]);

  if (!isProcessing) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-bg-base/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-bg-surface p-6 shadow-2xl">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
        <p className="text-sm font-medium text-white">
          {t('form.submitting') || 'Submitting application...'}
        </p>
      </div>
    </div>
  );
}
