'use client';

import { Shield, FileCheck, MapPin } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';

export default function RealityCheckSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-28">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('home.reality_check.title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('home.reality_check.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-card border rounded-xl p-8 flex flex-col items-center text-center hover:border-primary/50 transition-colors">
            <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-xl mb-3">{t('home.reality_check.cards.private.title')}</h3>
            <p className="text-muted-foreground">{t('home.reality_check.cards.private.description')}</p>
          </div>
          <div className="bg-card border rounded-xl p-8 flex flex-col items-center text-center hover:border-primary/50 transition-colors">
             <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
              <FileCheck className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-xl mb-3">{t('home.reality_check.cards.id.title')}</h3>
            <p className="text-muted-foreground">{t('home.reality_check.cards.id.description')}</p>
          </div>
          <div className="bg-card border rounded-xl p-8 flex flex-col items-center text-center hover:border-primary/50 transition-colors">
             <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
              <MapPin className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-xl mb-3">{t('home.reality_check.cards.fines.title')}</h3>
            <p className="text-muted-foreground">{t('home.reality_check.cards.fines.description')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
