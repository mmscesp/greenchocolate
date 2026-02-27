'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
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

const messages = {
  en: {
    title: 'Legal Access Verification',
    intro: 'This platform provides information regarding the legal framework of Cannabis Social Clubs in Spain.',
    confirmPrefix: 'I confirm that I am',
    confirmAge: '18 years of age or older',
    confirmSuffix: 'and that I am accessing this information for educational and legal compliance purposes.',
    warning: 'I understand that cannabis consumption in public spaces remains illegal in Spain and that this platform does not facilitate illegal sales or distribution.',
    acknowledgement: 'By proceeding, you agree to our Terms of Service and acknowledge that you are responsible for complying with local regulations.',
    accept: 'I Accept & Verify Eligibility',
  },
  es: {
    title: 'Verificacion de Acceso Legal',
    intro: 'Esta plataforma proporciona informacion sobre el marco legal de los Clubs Sociales de Cannabis en Espana.',
    confirmPrefix: 'Confirmo que tengo',
    confirmAge: '18 anos o mas',
    confirmSuffix: 'y que accedo a esta informacion con fines educativos y de cumplimiento legal.',
    warning: 'Entiendo que el consumo de cannabis en espacios publicos sigue siendo ilegal en Espana y que esta plataforma no facilita ventas o distribucion ilegal.',
    acknowledgement: 'Al continuar, aceptas nuestros Terminos de Servicio y reconoces que eres responsable de cumplir la normativa local.',
    accept: 'Acepto y Verifico Elegibilidad',
  },
  fr: {
    title: 'Verification d\'Acces Legal',
    intro: 'Cette plateforme fournit des informations sur le cadre legal des Cannabis Social Clubs en Espagne.',
    confirmPrefix: 'Je confirme avoir',
    confirmAge: '18 ans ou plus',
    confirmSuffix: 'et acceder a ces informations a des fins educatives et de conformite legale.',
    warning: 'Je comprends que la consommation de cannabis dans les espaces publics reste illegale en Espagne et que cette plateforme ne facilite pas la vente ou la distribution illegale.',
    acknowledgement: 'En continuant, vous acceptez nos Conditions d\'Utilisation et reconnaissez etre responsable du respect des reglementations locales.',
    accept: 'J\'Accepte et Verifie mon Eligibilite',
  },
  de: {
    title: 'Rechtliche Zugangsverifikation',
    intro: 'Diese Plattform bietet Informationen zum rechtlichen Rahmen von Cannabis Social Clubs in Spanien.',
    confirmPrefix: 'Ich bestatige, dass ich',
    confirmAge: '18 Jahre oder alter',
    confirmSuffix: 'bin und diese Informationen zu Bildungs- und Compliance-Zwecken abrufe.',
    warning: 'Ich verstehe, dass Cannabiskonsum in offentlichen Raumen in Spanien weiterhin illegal ist und diese Plattform keinen illegalen Verkauf oder Vertrieb erleichtert.',
    acknowledgement: 'Mit dem Fortfahren stimmen Sie unseren Nutzungsbedingungen zu und erkennen an, dass Sie fur die Einhaltung lokaler Vorschriften verantwortlich sind.',
    accept: 'Ich Akzeptiere und Verifiziere die Eignung',
  },
} as const;

export function LegalDisclaimer() {
  const pathname = usePathname();
  const hasLocaleModal = pathname ? /^\/(en|es|fr|de)(\/|$)/.test(pathname) : false;
  const localeSegment = pathname?.split('/')[1];
  const locale = localeSegment === 'es' || localeSegment === 'en' || localeSegment === 'fr' || localeSegment === 'de'
    ? localeSegment
    : 'en';
  const t = messages[locale];
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    if (hasLocaleModal) {
      return false;
    }

    return !localStorage.getItem('legal-disclaimer-accepted');
  });

  if (hasLocaleModal) {
    return null;
  }

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
            <AlertDialogTitle className="text-2xl font-serif">{t.title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-muted-foreground space-y-4 text-base">
            <p className="font-medium text-foreground">
              {t.intro}
            </p>
            <div className="grid gap-4 mt-4">
              <div className="flex gap-3">
                <Scale className="w-5 h-5 text-brand shrink-0 mt-1" />
                <p>
                  {t.confirmPrefix} <span className="text-foreground font-semibold">{t.confirmAge}</span> {t.confirmSuffix}
                </p>
              </div>
              <div className="flex gap-3">
                <Gavel className="w-5 h-5 text-brand shrink-0 mt-1" />
                <p>
                  {t.warning}
                </p>
              </div>
            </div>
            <p className="text-sm italic mt-4">
              {t.acknowledgement}
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogAction
            onClick={handleAccept}
            className="bg-brand hover:bg-brand/90 text-white font-bold px-10 py-7 text-lg rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand/20"
          >
            {t.accept}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
