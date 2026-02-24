import Link from 'next/link';
import SafetyKitForm from '@/components/marketing/SafetyKitForm';
import { ShieldCheck, Lock, AlertTriangle, ArrowRight } from '@/lib/icons';

interface SafetyKitLandingPageProps {
  params: Promise<{ lang: string }>;
}

export default async function SafetyKitLandingPage({ params }: SafetyKitLandingPageProps) {
  const { lang } = await params;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 right-0 w-[520px] h-[520px] bg-emerald-500/20 blur-[130px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[460px] h-[460px] bg-teal-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-24">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6">
                <ShieldCheck className="h-4 w-4" />
                2026 Visitor Intelligence
              </div>

              <h1 className="text-4xl md:text-6xl font-serif font-black leading-tight mb-6">
                The Spain Safety Kit
                <span className="block text-emerald-400 italic">Before You Step Outside</span>
              </h1>

              <p className="text-zinc-300 text-lg leading-relaxed max-w-2xl mb-10">
                A compliance-first field guide for travelers navigating Spain's cannabis social club culture:
                legal boundaries, etiquette, scam red flags, and harm-reduction essentials in one concise briefing.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-emerald-300 font-bold uppercase tracking-widest text-[10px] mb-2">No hype</p>
                  <p className="text-zinc-300">Education-first, not brokering.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-emerald-300 font-bold uppercase tracking-widest text-[10px] mb-2">Updated</p>
                  <p className="text-zinc-300">Current legal and safety context.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-emerald-300 font-bold uppercase tracking-widest text-[10px] mb-2">Private</p>
                  <p className="text-zinc-300">Data-minimized and trust-first.</p>
                </div>
              </div>
            </div>

            <div>
              <SafetyKitForm source="safety_kit_landing" />
              <p className="mt-5 text-xs text-zinc-500 leading-relaxed">
                By requesting the kit, you agree to receive educational emails. You can unsubscribe at any time.
                Read our{' '}
                <Link href={`/${lang}/privacy`} className="text-emerald-400 hover:text-emerald-300">
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link href={`/${lang}/terms`} className="text-emerald-400 hover:text-emerald-300">
                  Terms
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <AlertTriangle className="h-5 w-5 text-amber-400 mb-3" />
            <h2 className="text-lg font-bold mb-2">Avoid Expensive Mistakes</h2>
            <p className="text-zinc-400 text-sm">Public-consumption and possession risk context, practical do/don't checklists, and tourist trap warnings.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <ShieldCheck className="h-5 w-5 text-emerald-400 mb-3" />
            <h2 className="text-lg font-bold mb-2">Respect Club Culture</h2>
            <p className="text-zinc-400 text-sm">First-visit etiquette, privacy rules, and how to avoid behavior that gets people rejected.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <Lock className="h-5 w-5 text-cyan-400 mb-3" />
            <h2 className="text-lg font-bold mb-2">Protect Yourself</h2>
            <p className="text-zinc-400 text-sm">Scam pattern detection, safer communication behavior, and personal-risk minimization basics.</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-zinc-300">Need deeper context before downloading?</p>
          <Link href={`/${lang}/editorial/legal`} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-widest text-xs">
            Read Legal Basics <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
