'use client';

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ShieldAlert, Scale, Gavel } from '@/lib/icons';

export function LegalDisclaimer() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const accepted = localStorage.getItem('legal-disclaimer-accepted');
    if (!accepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('legal-disclaimer-accepted', 'true');
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-2xl bg-neutral-950 border-brand/20 text-foreground overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-brand" />
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <AlertDialogTitle className="text-2xl font-serif">Legal Access Verification</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-muted-foreground space-y-4 text-base">
            <p className="font-medium text-foreground">
              This platform provides information regarding the legal framework of Cannabis Social Clubs in Spain.
            </p>
            <div className="grid gap-4 mt-4">
              <div className="flex gap-3">
                <Scale className="w-5 h-5 text-brand shrink-0 mt-1" />
                <p>
                  I confirm that I am <span className="text-foreground font-semibold">18 years of age or older</span> and that I am accessing this information for educational and legal compliance purposes.
                </p>
              </div>
              <div className="flex gap-3">
                <Gavel className="w-5 h-5 text-brand shrink-0 mt-1" />
                <p>
                  I understand that cannabis consumption in public spaces remains illegal in Spain and that this platform does not facilitate illegal sales or distribution.
                </p>
              </div>
            </div>
            <p className="text-sm italic mt-4">
              By proceeding, you agree to our Terms of Service and acknowledge that you are responsible for complying with local regulations.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogAction
            onClick={handleAccept}
            className="bg-brand hover:bg-brand/90 text-white font-bold px-10 py-7 text-lg rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand/20"
          >
            I Accept & Verify Eligibility
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
