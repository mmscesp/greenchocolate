import Link from 'next/link';
import { EligibilityFlow } from '@/components/landing/editorial-concierge/interactive/EligibilityFlow';
import { ShieldCheck, Lock, AlertTriangle, ArrowRight } from '@/lib/icons';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

interface SafetyKitLandingPageProps {
  params: Promise<{ lang: string }>;
}

export default async function SafetyKitLandingPage({ params }: SafetyKitLandingPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string) => dictionary[key] || key;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 right-0 w-[520px] h-[520px] bg-emerald-500/20 blur-[130px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[460px] h-[460px] bg-teal-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 md:pt-32 md:pb-24">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6">
                <ShieldCheck className="h-4 w-4" />
                {t('safety_kit.badge')}
              </div>

              <h1 className="text-4xl md:text-6xl font-serif font-black leading-tight mb-6">
                {t('safety_kit.title')}
                <span className="block text-emerald-400 italic">{t('safety_kit.title_highlight')}</span>
              </h1>

              <p className="text-zinc-300 text-lg leading-relaxed max-w-2xl mb-10">
                {t('safety_kit.subtitle')}
              </p>

              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/8 p-4">
                  <p className="text-emerald-300 font-bold uppercase tracking-widest text-[10px] mb-2">{t('safety_kit.pillars.no_hype_label')}</p>
                  <p className="text-zinc-300">{t('safety_kit.pillars.no_hype')}</p>
                </div>
                <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/8 p-4">
                  <p className="text-emerald-300 font-bold uppercase tracking-widest text-[10px] mb-2">{t('safety_kit.pillars.updated_label')}</p>
                  <p className="text-zinc-300">{t('safety_kit.pillars.updated')}</p>
                </div>
                <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/8 p-4">
                  <p className="text-emerald-300 font-bold uppercase tracking-widest text-[10px] mb-2">{t('safety_kit.pillars.private_label')}</p>
                  <p className="text-zinc-300">{t('safety_kit.pillars.private')}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-3xl border border-emerald-500/20 bg-zinc-900/60 backdrop-blur-md p-4">
                <EligibilityFlow />
                <div className="mt-4 flex justify-center">
                  <Link
                    href={`/${lang}/safety`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-widest text-xs"
                  >
                    {t('safety_kit.open_guide')} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/8 p-6">
            <AlertTriangle className="h-5 w-5 text-amber-400 mb-3" />
            <h2 className="text-lg font-bold mb-2">{t('safety_kit.cards.mistakes.title')}</h2>
            <p className="text-zinc-400 text-sm">{t('safety_kit.cards.mistakes.description')}</p>
          </div>

                <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/8 p-6">
            <ShieldCheck className="h-5 w-5 text-emerald-400 mb-3" />
            <h2 className="text-lg font-bold mb-2">{t('safety_kit.cards.culture.title')}</h2>
            <p className="text-zinc-400 text-sm">{t('safety_kit.cards.culture.description')}</p>
          </div>

                <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/8 p-6">
            <Lock className="h-5 w-5 text-cyan-400 mb-3" />
            <h2 className="text-lg font-bold mb-2">{t('safety_kit.cards.protect.title')}</h2>
            <p className="text-zinc-400 text-sm">{t('safety_kit.cards.protect.description')}</p>
          </div>
        </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between rounded-2xl border border-emerald-500/15 bg-emerald-500/8 p-6">
          <p className="text-zinc-300">{t('safety_kit.footer_prompt')}</p>
          <Link href={`/${lang}/editorial/legal`} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-widest text-xs">
            {t('safety_kit.read_legal_basics')} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
