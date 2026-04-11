import type { Metadata } from 'next';
import { buildLocalizedMetadata } from '@/lib/seo';
import { isLocale } from '@/lib/i18n-config';

interface SafetyLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: SafetyLayoutProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return {};
  }

  const byLocale: Record<string, { title: string; description: string }> = {
    es: {
      title: 'Guía de Seguridad y Reducción de Riesgos | SocialClubsMaps',
      description:
        'Buenas prácticas de seguridad, consumo responsable y reducción de riesgos para cannabis social clubs en España.',
    },
    en: {
      title: 'Safety and Harm Reduction Guide | SocialClubsMaps',
      description:
        'Safety-first guidance, responsible use practices, and harm reduction tips for cannabis social clubs in Spain.',
    },
    fr: {
      title: 'Guide Sécurité et Réduction des Risques | SocialClubsMaps',
      description:
        'Bonnes pratiques de sécurité et de réduction des risques pour un usage responsable dans les cannabis social clubs.',
    },
    de: {
      title: 'Sicherheits- und Harm-Reduction-Guide | SocialClubsMaps',
      description:
        'Sicherheitsorientierte Empfehlungen und Harm-Reduction-Tipps für verantwortungsvollen Konsum in CSC in Spanien.',
    },
  };

  const localized = byLocale[lang] ?? byLocale.en;
  return buildLocalizedMetadata({
    lang,
    path: '/safety',
    title: localized.title,
    description: localized.description,
  });
}

export default function SafetyLayout({ children }: SafetyLayoutProps) {
  return children;
}

