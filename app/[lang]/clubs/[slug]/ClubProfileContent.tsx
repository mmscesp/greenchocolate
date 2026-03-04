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
import { MapPin,
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
Info } from '@/lib/icons';

// Editorial Concierge Components
import { EditorialHeading } from '@/components/landing/editorial-concierge/typography/EditorialHeading';
import { ConciergeLabel } from '@/components/landing/editorial-concierge/typography/ConciergeLabel';
import { SectionWrapper } from '@/components/landing/editorial-concierge/layout/SectionWrapper';
import { PulsingStatusDot } from '@/components/landing/editorial-concierge/interactive/PulsingStatusDot';
import { PREMIUM_SPRING, FADE_UP, STAGGER_CONTAINER } from '@/components/landing/editorial-concierge/motion/config';

function ClubTrustStrip({ isVerified, lastAudit }: { isVerified: boolean; lastAudit?: string }) {
  const { t } = useLanguage();

  return (
    <div className="sticky top-16 md:top-20 z-50 w-full min-h-12 bg-bg-base/90 backdrop-blur-md border-b border-white/5 flex items-center py-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <div className="flex items-center gap-2">
            {isVerified ? (
              <PulsingStatusDot color="hsl(var(--gold))" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-zinc-600" />
            )}
            <ConciergeLabel size="xs" emphasis="high" className="truncate text-white">
              {t('club_profile.trust_strip.status')}: {isVerified ? t('club_profile.trust_strip.verified') : t('club_profile.trust_strip.pending_audit')}
            </ConciergeLabel>
          </div>
          {isVerified && (
            <div className="hidden md:flex items-center gap-4 border-l border-white/5 pl-6">
              <ConciergeLabel size="xs" className="text-zinc-400">{t('club_profile.trust_strip.last_audit')}: {lastAudit || t('club_profile.trust_strip.last_audit_fallback')}</ConciergeLabel>
              <ConciergeLabel size="xs" className="text-gold/80">• {t('club_profile.trust_strip.education_first')}</ConciergeLabel>
              <ConciergeLabel size="xs" className="text-gold/80">• {t('club_profile.trust_strip.privacy_always')}</ConciergeLabel>
              <ConciergeLabel size="xs" className="text-gold/80">• {t('club_profile.trust_strip.privacy_always')}</ConciergeLabel>
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-zinc-600">
          <ConciergeLabel size="xs">{t('club_profile.trust_strip.no_brokering')}</ConciergeLabel>
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

      setFormState({ success: result.success, message: result.error ?? t('club_profile.form.success') });

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
        message: t('club_profile.form.error_unexpected'),
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
    <div className="min-h-screen bg-bg-base relative font-sans selection:bg-brand/30 selection:text-white">
      <ClubTrustStrip isVerified={club.isVerified} />
      
      {/* Navigation */}
      <div className="absolute top-24 md:top-32 left-0 z-20 w-full px-4 sm:px-6 lg:px-8 pointer-events-none">
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
      <SectionWrapper dark className="pt-40 md:pt-48 pb-24 min-h-[80vh] flex items-end relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: PREMIUM_SPRING.ease }}
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
            <motion.div variants={FADE_UP} className="flex flex-wrap items-center gap-3 mb-6">
              <VerificationBadge isVerified={club.isVerified} size="lg" />
              <ConciergeLabel className="text-gold border border-gold/30 px-3 py-1 rounded-full bg-gold/10 text-[10px] font-bold uppercase tracking-widest">
                {club.neighborhood}
              </ConciergeLabel>
              {club.rating && (
                <ConciergeLabel className="text-white border border-white/10 px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Star className="h-3 w-3 fill-gold text-gold" /> {club.rating} ({club.reviewCount})
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
                  className="bg-gold hover:bg-gold-dark text-black font-black min-h-11 h-auto py-3 sm:py-5 px-8 sm:px-10 rounded-full text-sm sm:text-base shadow-[0_10px_30px_-10px_hsl(var(--gold)/0.4)] transition-all hover:scale-105 uppercase tracking-[0.2em]"
                >
                  {t('club.pre_register')}
                </Button>
              )}
              
              {/* Image Navigation Dots */}
              {club.images.length > 1 && (
                <div className="flex items-center gap-2 sm:ml-4 bg-bg-base/70 backdrop-blur-md px-3 sm:px-4 rounded-full border border-white/10">
                  <button onClick={prevImage} className="min-h-11 min-w-11 p-2 hover:text-gold transition-colors text-white">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-[10px] font-bold tracking-widest text-white/80">
                    {currentImageIndex + 1} / {club.images.length}
                  </span>
                  <button onClick={nextImage} className="min-h-11 min-w-11 p-2 hover:text-gold transition-colors text-white">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Main Content - Bento Grid */}
      <SectionWrapper className="bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
          
          {/* About Card - Large */}
          <div className="md:col-span-2 bg-bg-base rounded-[2rem] p-6 sm:p-8 border border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center border border-gold/20">
                <Sparkles className="h-5 w-5 text-gold" />
                <Sparkles className="h-5 w-5 text-gold" />
              </div>
              <EditorialHeading size="md" className="text-white">{t('club_profile.experience')}</EditorialHeading>
            </div>
            <p className="text-zinc-400 leading-relaxed text-lg font-serif italic">
              {club.description}
            </p>
            
            <div className="mt-8 flex flex-wrap gap-2">
              {club.vibeTags.map((vibe, i) => (
                <span key={i} className="px-3 py-1 bg-white/5 text-zinc-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/5">
                  #{vibe}
                </span>
              ))}
            </div>
          </div>

          {/* Info Column */}
          <div className="space-y-6">
            {/* Location Card (Blurred) */}
            <div className="relative bg-bg-base rounded-[2rem] p-6 sm:p-8 border border-white/5 shadow-2xl overflow-hidden group">
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <MapPin className="h-5 w-5 text-gold" />
                <h3 className="font-bold text-white uppercase tracking-widest text-xs">{t('club_profile.location')}</h3>
              </div>
              
              {/* Blurred Content Background */}
              <div className="space-y-4 opacity-10 filter blur-[8px] select-none pointer-events-none grayscale">
                <div className="flex gap-2 w-full">
                  <div className="h-4 bg-white/20 rounded w-1/3" />
                  <div className="h-4 bg-white/10 rounded w-1/4" />
                </div>
                <div className="h-4 bg-white/10 rounded w-1/2" />
                <div className="h-32 bg-white/5 rounded-xl mt-4 w-full border border-white/5" />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-bg-base/70 backdrop-blur-md p-6 text-center">
                <div className="w-12 h-12 bg-bg-base rounded-full flex items-center justify-center mb-4 shadow-2xl border border-white/10">
                  <Lock className="h-5 w-5 text-brand" />
                </div>
                <h4 className="font-bold text-white mb-2 uppercase tracking-widest text-[10px]">{t('club_profile.private_location')}</h4>
                <p className="text-zinc-500 text-xs mb-6 max-w-[200px] leading-relaxed font-serif italic">
                  {t('club_profile.private_location_description')}
                </p>
                
                <div className="flex flex-col gap-2 w-full max-w-[240px]">
                  {club.allowsPreRegistration && (
                    <Button 
                      onClick={() => setShowPreRegistrationModal(true)}
                      className="w-full bg-gold hover:bg-gold-dark text-black rounded-full shadow-lg shadow-gold/20 font-black uppercase tracking-widest text-[10px] py-6"
                    >
                      {t('club_profile.pre_register_with_club')}
                    </Button>
                  )}
                  <Link href={`/${language}/app`} className="w-full">
                    <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-full uppercase tracking-widest text-[10px] py-6">
                      {t('club_profile.register_on_app')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-bg-base rounded-[2rem] p-6 sm:p-8 border border-white/5 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-5 w-5 text-gold" />
                <h3 className="font-bold text-white uppercase tracking-widest text-xs">{t('club_profile.opening_hours')}</h3>
              </div>
              <div className="space-y-3">
                {Object.entries(club.openingHours as Record<string, string>).map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-xs border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-zinc-500 uppercase tracking-wider font-bold text-[10px]">{getDayName(day)}</span>
                    <span className="font-mono font-medium text-white">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-bg-surface text-white rounded-[2rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-white/5">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                <Cannabis className="h-32 w-32" />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-zinc-500 mb-6 uppercase tracking-widest text-xs">{t('club_profile.club_details')}</h3>
                <div className="space-y-6">
                  <div>
                    <div className="text-gold text-[9px] font-bold uppercase tracking-widest mb-1">{t('club_profile.capacity')}</div>
                    <div className="text-2xl font-serif">{club.capacity} <span className="text-xs text-zinc-500 font-sans">{t('club_profile.members')}</span></div>
                  </div>
                  <div>
                    <div className="text-gold text-[9px] font-bold uppercase tracking-widest mb-1">{t('club_profile.founded')}</div>
                    <div className="text-2xl font-serif">{club.foundedYear}</div>
                  </div>
                  <div>
                    <div className="text-gold text-[9px] font-bold uppercase tracking-widest mb-1">{t('club_profile.price_range')}</div>
                    <div className="text-2xl font-mono text-white tracking-widest">{club.priceRange}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities - Full Width */}
          <div className="md:col-span-3 bg-bg-base rounded-[2rem] p-6 sm:p-8 border border-white/5 shadow-2xl mt-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-5 w-5 text-gold" />
              <EditorialHeading size="md" className="text-white">{t('club_profile.services')}</EditorialHeading>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {club.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                  <Check className="h-4 w-4 text-gold" />
                  <span className="text-zinc-300 text-sm sm:text-base font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="md:col-span-3 mt-12 border-t border-white/5 pt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <EditorialHeading size="lg" className="mb-6 text-white">{t('club_profile.get_in_touch')}</EditorialHeading>
                <p className="text-zinc-500 mb-8 max-w-md font-serif italic leading-relaxed">
                  {t('club_profile.contact_description')}
                </p>
                <div className="space-y-4">
                  {club.website && (
                    <a href={`https://${club.website}`} className="flex items-center gap-3 text-white hover:text-gold transition-colors group">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors border border-white/5 group-hover:border-gold/20">
                        <Globe className="h-5 w-5" />
                      </div>
                      <span className="font-bold underline decoration-gold/30 underline-offset-4 group-hover:decoration-gold uppercase tracking-widest text-[10px]">{club.website}</span>
                    </a>
                  )}
                  <div className="flex items-center gap-3 text-zinc-500">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                      <Mail className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{club.contactEmail || t('club_profile.email_hidden')}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-bg-surface rounded-[2rem] p-6 sm:p-8 flex flex-col justify-center items-center text-center border border-white/5 shadow-2xl">
                <ConciergeLabel className="mb-4 text-zinc-500 uppercase tracking-[0.2em] text-[10px]">{t('club_profile.ready_to_join')}</ConciergeLabel>
                <EditorialHeading size="md" className="mb-8 text-white">{t('club_profile.apply_for_membership')}</EditorialHeading>
                <Button
                  size="lg"
                  onClick={() => setShowPreRegistrationModal(true)}
                  className="bg-gold text-black hover:bg-gold-dark rounded-full min-h-11 px-10 font-black uppercase tracking-widest text-[11px] py-6 shadow-lg shadow-gold/20"
                >
                  {t('club_profile.start_application')}
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
            className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-bg-base border border-white/10 rounded-[2rem] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative overflow-hidden"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
            >
              {/* Modal Header */}
              <div className="relative h-40 bg-bg-surface overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-base z-10" />
                <Image src={club.images[0]} alt="Header" fill className="object-cover opacity-40" />
                <div className="absolute bottom-0 left-0 p-8 z-20">
                  <ConciergeLabel className="text-gold mb-2 uppercase tracking-[0.2em] text-[9px] font-bold">{t('club_profile.membership_application')}</ConciergeLabel>
                  <h3 className="text-3xl font-serif text-white">{club.name}</h3>
                </div>
                <button
                  onClick={() => {
                    setShowPreRegistrationModal(false);
                    setFormState(null);
                  }}
                  className="absolute top-6 right-6 min-h-11 min-w-11 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all z-30 border border-white/10"
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
                        ? 'bg-gold/10 text-gold border border-gold/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {formState.success ? <Check className="h-5 w-5 mt-0.5" /> : <AlertCircle className="h-5 w-5 mt-0.5" />}
                    <p className="text-sm font-medium">{formState.message}</p>
                  </motion.div>
                )}

                <form onSubmit={handlePreRegistrationSubmit} className="space-y-8">
                  <input type="hidden" name="clubId" value={club.id} />

                  <div className="space-y-4">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                      {t('club_profile.form.personal_message')} <span className="text-gold">*</span>
                      {t('club_profile.form.personal_message')} <span className="text-gold">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder={t('form.message_placeholder')}
                      className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-zinc-700 focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all outline-none resize-none font-serif italic"
                    />
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                      {t('club_profile.form.personal_message_help')}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:gap-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowPreRegistrationModal(false);
                        setFormState(null);
                      }}
                      className="flex-1 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full py-7 uppercase tracking-widest text-[10px] font-bold"
                      disabled={isSubmitting}
                    >
                      {t('form.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gold hover:bg-gold-dark text-black font-black rounded-full py-7 shadow-lg shadow-gold/20 uppercase tracking-widest text-[10px]"
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
