'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VerificationBadge from '@/components/VerificationBadge';
import { useLanguage } from '@/hooks/useLanguage';
import { Club } from '@/lib/types';
import { submitMembershipApplication } from '@/app/actions/applications';
import { useAuth } from '@/components/auth/AuthProvider';
import { Heading, H1, H2, H3, H4, Label, Text } from '@/components/typography';
import { cn } from '@/lib/utils';
import {
  MapPin,
  Lock,
  Star,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Clock,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
  Shield,
  Cannabis,
  Info
} from 'lucide-react';

// Editorial Concierge Components
import { EditorialHeading } from '@/components/landing/editorial-concierge/typography/EditorialHeading';
import { ConciergeLabel } from '@/components/landing/editorial-concierge/typography/ConciergeLabel';
import { SectionWrapper } from '@/components/landing/editorial-concierge/layout/SectionWrapper';
import { PulsingStatusDot } from '@/components/landing/editorial-concierge/interactive/PulsingStatusDot';
import { PREMIUM_SPRING, FADE_UP, STAGGER_CONTAINER } from '@/components/landing/editorial-concierge/motion/config';

function ClubTrustStrip({ isVerified, lastAudit }: { isVerified: boolean; lastAudit?: string }) {
  return (
    <div className="sticky top-0 z-50 w-full min-h-12 bg-black/80 backdrop-blur-md border-b border-white/10 flex items-center py-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <div className="flex items-center gap-2">
            {isVerified ? (
              <PulsingStatusDot />
            ) : (
              <div className="w-2 h-2 rounded-full bg-zinc-500" />
            )}
            <ConciergeLabel size="xs" emphasis="high" className="truncate">
              Status: {isVerified ? 'Verified' : 'Pending Audit'}
            </ConciergeLabel>
          </div>
          {isVerified && (
            <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-6">
              <ConciergeLabel size="xs">Last Audit: {lastAudit || 'Feb 2026'}</ConciergeLabel>
              <ConciergeLabel size="xs" className="text-emerald-500/80">• Education First</ConciergeLabel>
              <ConciergeLabel size="xs" className="text-emerald-500/80">• Privacy Always</ConciergeLabel>
            </div>
          )}
        </div>
        
        <div className="hidden sm:flex items-center gap-2 text-zinc-500">
          <ConciergeLabel size="xs">We do not broker access</ConciergeLabel>
        </div>
      </div>
    </div>
  );
}

interface ClubProfileContentProps {
  club: Club;
}

export default function ClubProfileContent({ club }: ClubProfileContentProps) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPreRegistrationModal, setShowPreRegistrationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<{ success: boolean; message?: string; errors?: Record<string, string[]> } | null>(null);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % club.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + club.images.length) % club.images.length);
  };

  const handlePreRegistrationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormState(null);

    try {
      const formData = new FormData(e.currentTarget);
      const message = (formData.get('message') as string | null) || undefined;

      const result = await submitMembershipApplication({
        targetClubId: club.id,
        message,
        eligibilityAnswers: {},
      });

      setFormState({ success: result.success, message: result.error ?? 'Application submitted successfully.' });

      if (result.success) {
        setTimeout(() => {
          setShowPreRegistrationModal(false);
          router.push(`/${language}/profile/requests`);
        }, 1500);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setFormState({
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDayName = (day: string) => {
    const dayMap: Record<string, string> = {
      monday: t('days.monday'),
      tuesday: t('days.tuesday'),
      wednesday: t('days.wednesday'),
      thursday: t('days.thursday'),
      friday: t('days.friday'),
      saturday: t('days.saturday'),
      sunday: t('days.sunday'),
    };
    return dayMap[day] || day;
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <ClubTrustStrip isVerified={club.isVerified} />
      
      {/* Navigation */}
      <div className="absolute top-16 left-0 z-20 w-full px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className="max-w-7xl mx-auto pointer-events-auto">
          <Link href={`/${language}/clubs`}>
            <Button 
              variant="ghost" 
              className="text-white/80 hover:text-white hover:bg-black/40 backdrop-blur-sm rounded-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('nav.back_to_clubs')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <SectionWrapper dark className="pt-32 pb-24 min-h-[80vh] flex items-end relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={club.images[currentImageIndex]}
                alt={club.name}
                fill
                className="object-cover opacity-60"
                priority
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div 
            variants={STAGGER_CONTAINER}
            initial="initial"
            animate="animate"
            className="max-w-4xl"
          >
            <motion.div variants={FADE_UP} className="flex items-center gap-3 mb-6">
              <VerificationBadge isVerified={club.isVerified} size="lg" />
              <ConciergeLabel className="text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full bg-emerald-500/10">
                {club.neighborhood}
              </ConciergeLabel>
              {club.rating && (
                <ConciergeLabel className="text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full bg-amber-500/10">
                  ★ {club.rating} ({club.reviewCount})
                </ConciergeLabel>
              )}
            </motion.div>
            
            <motion.div variants={FADE_UP}>
              <EditorialHeading as="h1" size="hero" className="text-white mb-8">
                {club.name}
              </EditorialHeading>
            </motion.div>

            <motion.div variants={FADE_UP} className="flex flex-wrap gap-3 sm:gap-4">
              {club.allowsPreRegistration && (
                <Button
                  size="xl"
                  onClick={() => {
                    if (!user) {
                      router.push(`/${language}/account/login?redirect=${encodeURIComponent(window.location.pathname)}`);
                      return;
                    }
                    setShowPreRegistrationModal(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold min-h-11 h-auto py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all hover:scale-105"
                >
                  {t('club.pre_register')}
                </Button>
              )}
              
              {/* Image Navigation Dots */}
              {club.images.length > 1 && (
                <div className="flex items-center gap-2 sm:ml-4 bg-black/40 backdrop-blur-md px-3 sm:px-4 rounded-full border border-white/10">
                  <button onClick={prevImage} className="min-h-11 min-w-11 p-2 hover:text-emerald-400 transition-colors text-white">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm font-mono text-white/80">
                    {currentImageIndex + 1} / {club.images.length}
                  </span>
                  <button onClick={nextImage} className="min-h-11 min-w-11 p-2 hover:text-emerald-400 transition-colors text-white">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Main Content - Bento Grid */}
      <SectionWrapper className="bg-zinc-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
          
          {/* About Card - Large */}
          <div className="md:col-span-2 bg-white rounded-[2rem] p-6 sm:p-8 border border-zinc-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-emerald-600" />
              </div>
              <EditorialHeading size="md" className="text-zinc-900">The Experience</EditorialHeading>
            </div>
            <p className="text-zinc-600 leading-relaxed text-lg font-serif">
              {club.description}
            </p>
            
            <div className="mt-8 flex flex-wrap gap-2">
              {club.vibeTags.map((vibe, i) => (
                <span key={i} className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-sm font-medium border border-zinc-200">
                  #{vibe}
                </span>
              ))}
            </div>
          </div>

          {/* Info Column */}
          <div className="space-y-6">
            {/* Location Card (Blurred) */}
            <div className="relative bg-white rounded-[2rem] p-6 sm:p-8 border border-zinc-200 shadow-sm overflow-hidden group">
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <MapPin className="h-5 w-5 text-zinc-400" />
                <h3 className="font-bold text-zinc-900">Location</h3>
              </div>
              
              {/* Blurred Content Background */}
              <div className="space-y-4 opacity-30 filter blur-[6px] select-none pointer-events-none grayscale">
                <div className="flex gap-2 w-full">
                  <div className="h-4 bg-zinc-800 rounded w-1/3" />
                  <div className="h-4 bg-zinc-300 rounded w-1/4" />
                </div>
                <div className="h-4 bg-zinc-300 rounded w-1/2" />
                <div className="h-32 bg-zinc-100 rounded-xl mt-4 w-full border border-zinc-200" />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-zinc-100">
                  <Lock className="h-5 w-5 text-zinc-400" />
                </div>
                <h4 className="font-bold text-zinc-900 mb-2">Private Location</h4>
                <p className="text-zinc-500 text-sm mb-6 max-w-[200px] leading-relaxed">
                  Address revealed after membership approval.
                </p>
                
                <div className="flex flex-col gap-2 w-full max-w-[240px]">
                  {club.allowsPreRegistration && (
                    <Button 
                      onClick={() => setShowPreRegistrationModal(true)}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 font-bold"
                    >
                      Pre-register with Club
                    </Button>
                  )}
                  <Link href={`/${language}/app`} className="w-full">
                    <Button variant="outline" className="w-full bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-900 rounded-xl">
                      Register on App
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-5 w-5 text-zinc-400" />
                <h3 className="font-bold text-zinc-900">Opening Hours</h3>
              </div>
              <div className="space-y-3">
                {Object.entries(club.openingHours as Record<string, string>).map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="text-zinc-500 capitalize">{getDayName(day)}</span>
                    <span className="font-mono font-medium text-zinc-900">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-zinc-900 text-white rounded-[2rem] p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Cannabis className="h-32 w-32" />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-zinc-400 mb-6">Club Details</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Capacity</div>
                    <div className="text-2xl font-serif">{club.capacity} Members</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Founded</div>
                    <div className="text-2xl font-serif">{club.foundedYear}</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Price Range</div>
                    <div className="text-emerald-400 font-mono">{club.priceRange}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities - Full Width */}
          <div className="md:col-span-3 bg-white rounded-[2rem] p-6 sm:p-8 border border-zinc-200 shadow-sm mt-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-5 w-5 text-zinc-400" />
              <EditorialHeading size="md" className="text-zinc-900">Services & Amenities</EditorialHeading>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {club.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-zinc-700 text-sm sm:text-base font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="md:col-span-3 mt-12 border-t border-zinc-200 pt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <EditorialHeading size="lg" className="mb-6">Get in Touch</EditorialHeading>
                <p className="text-zinc-500 mb-8 max-w-md">
                  Have questions before applying? Contact the club directly. Please respect their privacy and do not visit without an appointment.
                </p>
                <div className="space-y-4">
                  {club.website && (
                    <a href={`https://${club.website}`} className="flex items-center gap-3 text-zinc-900 hover:text-emerald-600 transition-colors group">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                        <Globe className="h-5 w-5" />
                      </div>
                      <span className="font-medium underline decoration-zinc-300 underline-offset-4 group-hover:decoration-emerald-500">{club.website}</span>
                    </a>
                  )}
                  <div className="flex items-center gap-3 text-zinc-500">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                      <Mail className="h-5 w-5" />
                    </div>
                    <span>{club.contactEmail || 'Email hidden'}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-100 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-center items-center text-center">
                <ConciergeLabel className="mb-4 text-zinc-500">Ready to join?</ConciergeLabel>
                <EditorialHeading size="md" className="mb-6">Apply for Membership</EditorialHeading>
                <Button
                  size="lg"
                  onClick={() => setShowPreRegistrationModal(true)}
                  className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-full min-h-11 px-6 sm:px-8"
                >
                  Start Application
                </Button>
              </div>
            </div>
          </div>

        </div>
      </SectionWrapper>

      {/* Pre-registration Modal */}
      <AnimatePresence>
        {showPreRegistrationModal && (
          <motion.div 
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-zinc-900 border border-zinc-800 rounded-[2rem] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative overflow-hidden"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
            >
              {/* Modal Header */}
              <div className="relative h-32 bg-zinc-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900" />
                <Image src={club.images[0]} alt="Header" fill className="object-cover opacity-40" />
                <div className="absolute bottom-0 left-0 p-6">
                  <ConciergeLabel className="text-emerald-400 mb-2">Membership Application</ConciergeLabel>
                  <h3 className="text-2xl font-serif text-white">{club.name}</h3>
                </div>
                <button
                  onClick={() => {
                    setShowPreRegistrationModal(false);
                    setFormState(null);
                  }}
                  className="absolute top-4 right-4 min-h-11 min-w-11 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-8">
                {/* Form State Message */}
                {formState && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                      formState.success
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {formState.success ? <Check className="h-5 w-5 mt-0.5" /> : <AlertCircle className="h-5 w-5 mt-0.5" />}
                    <p className="text-sm font-medium">{formState.message}</p>
                  </motion.div>
                )}

                <form onSubmit={handlePreRegistrationSubmit} className="space-y-6">
                  <input type="hidden" name="clubId" value={club.id} />

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Personal Message <span className="text-emerald-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder={t('form.message_placeholder')}
                      className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none resize-none"
                    />
                    <p className="mt-2 text-xs text-zinc-500">
                      Introduce yourself and explain why you want to join.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowPreRegistrationModal(false);
                        setFormState(null);
                      }}
                      className="flex-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl py-6"
                      disabled={isSubmitting}
                    >
                      {t('form.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl py-6 shadow-lg shadow-emerald-900/20"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t('form.submitting')}
                        </>
                      ) : (
                        t('form.submit')
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
