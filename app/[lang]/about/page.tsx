import React from 'react';
import { Metadata } from 'next';
import { Heading, H1, H2, H3, H4, Label, Eyebrow, Text, Lead } from '@/components/typography';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<string, string> = {
    es: 'Sobre Nosotros | Metodología y Estándares de Verificación | SocialClubsMaps',
    en: 'About Us | Methodology & Verification Standards | SocialClubsMaps',
    fr: 'À Propos | Méthodologie et Normes de Vérification | SocialClubsMaps',
    de: 'Über Uns | Methodik und Verifizierungsstandards | SocialClubsMaps',
    it: 'Chi Siamo | Metodologia e Standard di Verifica | SocialClubsMaps',
  };

  const descriptions: Record<string, string> = {
    es: 'Conoce nuestra metodología de verificación de clubs sociales de cannabis en España. Estándares rigurosos para una comunidad segura.',
    en: 'Learn about our verification methodology for cannabis social clubs in Spain. Rigorous standards for a safe community.',
    fr: 'Découvrez notre méthodologie de vérification des clubs sociaux cannabis en Espagne. Normes rigoureuses pour une communauté sûre.',
    de: 'Erfahren Sie mehr über unsere Verifizierungsmethodik für Cannabis-Social-Clubs in Spanien. Strenge Standards für eine sichere Gemeinschaft.',
    it: 'Scopri la nostra metodologia di verifica per i club sociali cannabis in Spagna. Standard rigorosi per una comunità sicura.',
  };

  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    openGraph: {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      type: 'website',
      locale: lang === 'es' ? 'es_ES' : lang === 'en' ? 'en_US' : `${lang}_${lang.toUpperCase()}`,
      url: `https://socialclubsmaps.com/${lang}/about`,
    },
    alternates: {
      canonical: `https://socialclubsmaps.com/${lang}/about`,
    },
  };
}

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <H1 className="mb-4">About Us</H1>
      <Lead>Methodology & Verification Standards</Lead>
    </div>
  );
}
