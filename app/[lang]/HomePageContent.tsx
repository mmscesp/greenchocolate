'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ClubCardComponent from '@/components/ClubCard';
import HeroSection from '@/components/HeroSection';
import SafetyKitForm from '@/components/marketing/SafetyKitForm';
import TrustBadge from '@/components/trust/TrustBadge';
import { useLanguage } from '@/hooks/useLanguage';
import { TrendingUp, Award, ShieldCheck, Map, BookOpen, Scale, ArrowRight } from 'lucide-react';
import { OrganizationStructuredData, WebSiteStructuredData } from '@/components/StructuredData';
import type { ClubCard } from '@/app/actions/clubs';
import type { Club } from '@/lib/types';

interface HomePageContentProps {
  featuredClubs: ClubCard[];
  allClubs: ClubCard[];
}

// Map ClubCard (from server) to Club (expected by component)
function mapToClub(card: ClubCard): Club {
  return {
    id: card.id,
    name: card.name,
    slug: card.slug,
    isVerified: card.isVerified,
    neighborhood: card.neighborhood,
    images: card.images,
    description: card.description,
    amenities: card.amenities,
    vibeTags: card.vibeTags,
    openingHours: {},
    allowsPreRegistration: true,
    coordinates: { lat: 0, lng: 0 },
    address: '',
    contactEmail: '',
    phoneNumber: '',
    rating: card.rating || undefined,
    reviewCount: card.reviewCount || undefined,
    priceRange: card.priceRange as '$' | '$$' | '$$$',
    capacity: card.capacity,
    foundedYear: card.foundedYear,
  };
}

export default function HomePageContent({ featuredClubs, allClubs }: HomePageContentProps) {
  const { t } = useLanguage();
  
  const monthPicks = useMemo(() => {
    return allClubs.slice(0, 4);
  }, [allClubs]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <OrganizationStructuredData
        schema={{
          name: 'SocialClubsMaps',
          url: 'https://socialclubsmaps.com',
          logo: 'https://socialclubsmaps.com/logo.png',
          description: 'Directorio de clubs sociales de cannabis en España. Encuentra y únete a los mejores CSCs.',
          sameAs: [
            'https://www.instagram.com/socialclubsmaps',
            'https://www.twitter.com/socialclubsmaps',
            'https://www.facebook.com/socialclubsmaps',
          ],
        }}
      />
      <WebSiteStructuredData name="SocialClubsMaps" url="https://socialclubsmaps.com" />

      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Hero Section */}
        <HeroSection />

        {/* Safety & Etiquette - The Lead Magnet */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex gap-2 mb-6">
                  <TrustBadge variant="expert" />
                  <TrustBadge variant="privacy" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                  Spain is not Amsterdam. <br />
                  <span className="text-green-600">Know the Rules.</span>
                </h2>
                <div className="space-y-6 mb-10">
                  {[
                    { title: 'Avoid Fines', desc: 'Public possession can cost you €601–€30,000. Learn how to stay safe.', icon: Scale },
                    { title: 'Etiquette First', desc: 'Social clubs are private associations, not coffee shops. Respect is the currency.', icon: BookOpen },
                    { title: 'Verified Only', desc: 'We only list clubs that meet our strict safety and legal standards.', icon: ShieldCheck },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                        <item.icon className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-green-100/50 rounded-3xl blur-2xl"></div>
                <div className="relative">
                  <SafetyKitForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted Nav Layer - Why Us */}
        <section className="py-24 bg-zinc-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-16">The Verified Navigation Layer</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="p-8 border border-white/10 rounded-2xl bg-white/5">
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-400 text-3xl">
                  📍
                </div>
                <h3 className="text-xl font-bold mb-4">Regulatory Wiki</h3>
                <p className="text-zinc-400 leading-relaxed">Permanent, expert-reviewed knowledge nodes on laws, rights, and etiquette.</p>
              </div>
              <div className="p-8 border border-white/10 rounded-2xl bg-white/5">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400 text-3xl">
                  🛡️
                </div>
                <h3 className="text-xl font-bold mb-4">Confidence UI</h3>
                <p className="text-zinc-400 leading-relaxed">Visual status indicators showing the reliability and safety level of every club.</p>
              </div>
              <div className="p-8 border border-white/10 rounded-2xl bg-white/5">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-400 text-3xl">
                  🎟️
                </div>
                <h3 className="text-xl font-bold mb-4">Verified Access</h3>
                <p className="text-zinc-400 leading-relaxed">Standardized membership request workflows that prioritize your privacy.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Clubs Preview (Trust proof) */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
              <div className="max-w-2xl">
                <Badge variant="outline" className="mb-4 border-green-200 text-green-700">Vetted Clubs</Badge>
                <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                  Transparent standards for <br />
                  <span className="text-green-600">Peace of Mind.</span>
                </h2>
              </div>
              <Link href="/learn">
                <Button variant="outline" className="rounded-full px-8">
                  Learn Vetting Process <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredClubs.slice(0, 3).map(club => (
                  <div key={club.id} className="opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                    <ClubCardComponent club={mapToClub(club)} />
                  </div>
                ))}
              </div>
            
            <div className="mt-16 text-center">
              <p className="text-zinc-500 font-medium mb-8">Access to club details requires a Verified Visitor Pass.</p>
              <Link href="/mission">
                <Button className="bg-zinc-900 text-white hover:bg-zinc-800 px-10 py-6 rounded-2xl font-bold">
                  Start Verification Process
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
