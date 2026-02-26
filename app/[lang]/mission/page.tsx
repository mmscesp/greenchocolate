import { Metadata } from 'next';
import { Shield, CheckCircle, Eye, Lock } from '@/lib/icons';
import { Heading, H1, H2, H3, H4, Label, Eyebrow, Text, Lead } from '@/components/typography';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<string, string> = {
    es: 'Nuestra Misión | Confianza y Transparencia | SocialClubsMaps',
    en: 'Our Mission | Trust & Transparency | SocialClubsMaps',
    fr: 'Notre Mission | Confiance et Transparence | SocialClubsMaps',
    de: 'Unsere Mission | Vertrauen und Transparenz | SocialClubsMaps',
    it: 'La Nostra Missione | Fiducia e Trasparenza | SocialClubsMaps',
  };

  const descriptions: Record<string, string> = {
    es: 'Nuestra misión es proporcionar una capa de navegación segura y cumplimiento normativo para la cultura de clubs sociales de cannabis en España.',
    en: 'Our mission is to provide a safe, compliance-first navigation layer for Spain\'s cannabis social club culture.',
    fr: 'Notre mission est de fournir une couche de navigation sécurisée et conforme pour la culture des clubs sociaux cannabis en Espagne.',
    de: 'Unsere Mission ist es, eine sichere, compliance-first Navigationsschicht für Spaniens Cannabis-Social-Club-Kultur zu bieten.',
    it: 'La nostra missione è fornire uno strato di navigazione sicuro e conforme per la cultura dei club sociali cannabis in Spagna.',
  };

  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    openGraph: {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      type: 'website',
      locale: lang === 'es' ? 'es_ES' : lang === 'en' ? 'en_US' : `${lang}_${lang.toUpperCase()}`,
      url: `https://socialclubsmaps.com/${lang}/mission`,
    },
    alternates: {
      canonical: `https://socialclubsmaps.com/${lang}/mission`,
    },
  };
}

export default function MissionPage() {
  // Use a simple t function or wait for translation update
  // For now, hardcoding key sections while keeping i18n structure in mind
  
  return (
    <div className="min-h-screen bg-background">
      
      <main className="max-w-4xl mx-auto px-4 pt-28 pb-20">
        <div className="text-center mb-16">
          <H1 className="mb-4">Our Mission: Trust & Transparency</H1>
          <Lead>We are building the verified navigation layer for Spain's cannabis social club culture.</Lead>
        </div>

        <div className="grid gap-12">
          <section className="bg-green-50 p-8 rounded-2xl border border-green-100">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="h-8 w-8 text-green-600" />
              <H2>Why We Exist</H2>
            </div>
            <Text className="leading-relaxed">
              Navigating the cannabis landscape in Spain can be complex and risky for visitors. Our mission is to provide a safe, compliance-first layer that prioritizes education, harm reduction, and privacy.
            </Text>
          </section>

          <section>
            <H2 className="mb-6">Our Verification Standards</H2>
            <div className="space-y-6">
              {[
                {
                  title: 'Legal Compliance',
                  desc: 'We verify that every club is a registered non-profit association in accordance with Spanish law.',
                  icon: CheckCircle
                },
                {
                  title: 'Privacy First',
                  desc: 'Sensitive club details are never public. We use gated access to protect both clubs and members.',
                  icon: Lock
                },
                {
                  title: 'On-Site Vetting',
                  desc: 'Our team personally visits clubs to ensure they meet our high standards for safety and atmosphere.',
                  icon: Eye
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-6 bg-card border rounded-xl shadow-sm">
                  <item.icon className="h-6 w-6 text-green-600 shrink-0" />
                  <div>
                    <H4 className="mb-1">{item.title}</H4>
                    <Text variant="muted">{item.desc}</Text>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center py-12 border-t">
            <H2 className="mb-4">Join the Trust Network</H2>
            <Text variant="muted" className="mb-8">Ready to navigate the culture safely?</Text>
            <button className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-colors">
              Join the Waitlist
            </button>
          </section>
        </div>
      </main>

    </div>
  );
}
