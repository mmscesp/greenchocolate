import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, CheckCircle, Eye, Lock, ArrowRight, Info, Compass, Target } from '@/lib/icons';
import { H1, H2, H3, H4, Text, Lead, Eyebrow } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string) => dictionary[key] || key;

  const title = t('mission.meta.title');
  const description = t('mission.meta.description');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: lang === 'es' ? 'es_ES' : lang === 'en' ? 'en_US' : `${lang}_${lang.toUpperCase()}`,
      url: `https://socialclubsmaps.com/${lang}/mission`,
    },
    alternates: {
      canonical: `https://socialclubsmaps.com/${lang}/mission`,
    },
  };
}

interface MissionPageProps {
  params: Promise<{ lang: string }>;
}

export default async function MissionPage({ params }: MissionPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string) => dictionary[key] || key;

  const missionStandards = [
    { titleKey: 'mission.standards.legal.title', descriptionKey: 'mission.standards.legal.description', icon: Shield },
    { titleKey: 'mission.standards.privacy.title', descriptionKey: 'mission.standards.privacy.description', icon: Lock },
    { titleKey: 'mission.standards.vetting.title', descriptionKey: 'mission.standards.vetting.description', icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 via-black to-black pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-[10%] w-[500px] h-[500px] bg-[#E8A838]/5 blur-[130px] rounded-full" />
        <div className="absolute top-[40%] right-0 w-[450px] h-[450px] bg-[#E8A838]/5 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-4 pt-32 pb-24 md:pt-40 md:pb-32">
        {/* Hero Section */}
        <div className="text-center mb-16 md:mb-24 max-w-4xl mx-auto">
          <Eyebrow variant="muted" className="mb-6 justify-center flex items-center gap-2 text-[#E8A838]">
            <Compass className="w-4 h-4" />
            {t('about.lead')}
          </Eyebrow>
          <H1 size="lg" className="mb-6 text-white font-serif tracking-tight lg:text-6xl">
            {t('mission.hero.title')}
          </H1>
          <Lead className="text-zinc-400 max-w-2xl mx-auto">
            {t('mission.hero.subtitle')}
          </Lead>
        </div>

        <div className="grid gap-20">
          {/* Why We Exist Section */}
          <section className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#E8A838]/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-zinc-900/40 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/10 hover:border-[#E8A838]/30 transition-all duration-500">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-16 h-16 bg-[#E8A838]/10 rounded-2xl flex items-center justify-center border border-[#E8A838]/20 shrink-0">
                  <Target className="h-8 w-8 text-[#E8A838]" />
                </div>
                <div>
                  <H2 size="md" className="mb-4 text-white font-serif tracking-tight">{t('mission.why.title')}</H2>
                  <Text className="leading-relaxed text-zinc-300">
                    {t('mission.why.description')}
                  </Text>
                </div>
              </div>
            </div>
          </section>

          {/* Standards Grid */}
          <section>
            <div className="flex items-center justify-between mb-10">
              <H2 size="md" className="text-white font-serif tracking-tight">{t('mission.standards.title')}</H2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {missionStandards.map((item) => (
                <div key={item.titleKey} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-sm p-6 md:p-8 hover:border-[#E8A838]/50 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E8A838]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <item.icon className="h-6 w-6 text-[#E8A838] mb-5 group-hover:scale-110 transition-transform duration-500" />
                    <H4 size="xs" className="mb-3 text-white font-serif group-hover:text-[#E8A838] transition-colors">{t(item.titleKey)}</H4>
                    <Text variant="muted" size="sm" className="text-zinc-400 leading-relaxed">
                      {t(item.descriptionKey)}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Core Values / The Standard Section */}
          <section id="verification-standard" className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 p-6 md:p-12 lg:p-16 backdrop-blur-md shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Shield className="h-64 w-64 text-[#E8A838]" />
            </div>
            
            <div className="max-w-3xl relative z-10">
              <H2 size="md" className="mb-6 text-white font-serif tracking-tight">We Got Tired of the Scams. So We Built the Standard.</H2>
              <div className="space-y-4 mb-10">
                <Text className="leading-relaxed text-zinc-300">
                  As locals living in Barcelona, we constantly saw visitors misled by street promoters, confused by gray-area laws, and
                  scammed into unsafe situations. We built this platform to fix that.
                </Text>
                <Text className="leading-relaxed text-zinc-300">
                  Every club listed here is personally vetted. Every guide is written from firsthand experience. We are not brokers or
                  promoters. We are a community-driven trust layer, dedicated to keeping you safe, informed, and on the right side of the rules.
                </Text>
                <div className="flex items-center gap-3 pt-4">
                  <div className="w-8 h-[1px] bg-[#E8A838]" />
                  <Text variant="muted" className="italic text-[#E8A838] font-serif uppercase tracking-widest text-[10px] font-bold">The SCM Team, Barcelona</Text>
                </div>
              </div>

              <H3 size="sm" className="mb-8 text-white font-serif tracking-tight pt-8 border-t border-white/10 uppercase tracking-wider">Our Three Pillars</H3>
              <div className="grid gap-4">
                <div className="group p-6 md:p-8 bg-black/40 border border-white/5 rounded-2xl hover:border-[#E8A838]/30 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-[10px] font-bold text-[#E8A838] border border-[#E8A838]/30 px-2 py-0.5 rounded uppercase tracking-tighter">01</div>
                    <H4 size="xs" className="text-white font-serif group-hover:text-[#E8A838] transition-colors">EDUCATE</H4>
                  </div>
                  <Text size="sm" className="mb-2 text-white font-medium">Before you travel</Text>
                  <Text variant="muted" size="sm" className="text-zinc-400 leading-relaxed">
                    How CSCs actually work - city by city, rule by rule. Legal explainers. Etiquette guides. Scam checklists. Free. Always.
                  </Text>
                </div>

                <div className="group p-6 md:p-8 bg-black/40 border border-white/5 rounded-2xl hover:border-[#E8A838]/30 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-[10px] font-bold text-[#E8A838] border border-[#E8A838]/30 px-2 py-0.5 rounded uppercase tracking-tighter">02</div>
                    <H4 size="xs" className="text-white font-serif group-hover:text-[#E8A838] transition-colors">VERIFY</H4>
                  </div>
                  <Text size="sm" className="mb-2 text-white font-medium">Before you visit</Text>
                  <Text variant="muted" size="sm" className="text-zinc-400 leading-relaxed">
                    Every listed club is personally vetted, so you do not have to guess. No paid placements. No sponsorships. No scraped listings. One at a time, because speed and trust do not live in the same sentence.
                  </Text>
                </div>

                <div className="group p-6 md:p-8 bg-black/40 border border-white/5 rounded-2xl hover:border-[#E8A838]/30 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-[10px] font-bold text-[#E8A838] border border-[#E8A838]/30 px-2 py-0.5 rounded uppercase tracking-tighter">03</div>
                    <H4 size="xs" className="text-white font-serif group-hover:text-[#E8A838] transition-colors">PROTECT</H4>
                  </div>
                  <Text size="sm" className="mb-2 text-white font-medium">Before anything goes wrong</Text>
                  <Text variant="muted" size="sm" className="text-zinc-400 leading-relaxed">
                    The Safety Kit covers what to say, what never to say, how to spot a scam, and what to do when things go sideways. Free. Always. Over 2,500 distributed across Europe.
                  </Text>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="text-center py-20 md:py-24 relative overflow-hidden rounded-3xl border border-[#E8A838]/20 bg-[#E8A838]/5 p-8 md:p-12">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#E8A838]/5 pointer-events-none" />
            <div className="relative z-10">
              <H2 size="md" className="mb-6 text-white font-serif tracking-tight">{t('mission.cta.title')}</H2>
              <Text variant="muted" size="sm" className="mb-10 text-zinc-400 max-w-lg mx-auto md:text-lg">
                {t('mission.cta.subtitle')}
              </Text>
              <Button asChild className="min-h-14 px-10 bg-[#E8A838] hover:bg-[#d4962e] text-black font-bold rounded-full text-sm uppercase tracking-widest shadow-xl shadow-[#E8A838]/20">
                <Link href={`/${lang}/clubs`}>
                  {t('mission.cta.button')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
