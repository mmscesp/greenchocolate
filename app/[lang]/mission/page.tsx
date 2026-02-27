import { Metadata } from 'next';
import { Shield, CheckCircle, Eye, Lock } from '@/lib/icons';
import { H1, H2, H4, Text, Lead } from '@/components/typography';
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

const missionStandards = [
  { titleKey: 'mission.standards.legal.title', descriptionKey: 'mission.standards.legal.description', icon: CheckCircle },
  { titleKey: 'mission.standards.privacy.title', descriptionKey: 'mission.standards.privacy.description', icon: Lock },
  { titleKey: 'mission.standards.vetting.title', descriptionKey: 'mission.standards.vetting.description', icon: Eye },
];

export default async function MissionPage({ params }: MissionPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string) => dictionary[key] || key;

  return (
    <div className="min-h-screen bg-background">
      
      <main className="max-w-4xl mx-auto px-4 pt-28 pb-20">
        <div className="text-center mb-16">
          <H1 className="mb-4">{t('mission.hero.title')}</H1>
          <Lead>{t('mission.hero.subtitle')}</Lead>
        </div>

        <div className="grid gap-12">
          <section className="bg-green-50 p-8 rounded-2xl border border-green-100">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="h-8 w-8 text-green-600" />
              <H2>{t('mission.why.title')}</H2>
            </div>
            <Text className="leading-relaxed">
              {t('mission.why.description')}
            </Text>
          </section>

          <section>
            <H2 className="mb-6">{t('mission.standards.title')}</H2>
            <div className="space-y-6">
              {missionStandards.map((item) => (
                <div key={item.titleKey} className="flex gap-4 p-6 bg-card border rounded-xl shadow-sm">
                  <item.icon className="h-6 w-6 text-green-600 shrink-0" />
                  <div>
                    <H4 className="mb-1">{t(item.titleKey)}</H4>
                    <Text variant="muted">{t(item.descriptionKey)}</Text>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center py-12 border-t">
            <H2 className="mb-4">{t('mission.cta.title')}</H2>
            <Text variant="muted" className="mb-8">{t('mission.cta.subtitle')}</Text>
            <button className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-colors">
              {t('mission.cta.button')}
            </button>
          </section>
        </div>
      </main>

    </div>
  );
}
