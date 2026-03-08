'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ImageGallery, type CircularGalleryImage } from '@/components/ui/carousel-circular-image-gallery';
import VerificationBadge from '@/components/VerificationBadge';
import { useLanguage } from '@/hooks/useLanguage';
import { Club } from '@/lib/types';
import { useAuth } from '@/components/auth/AuthProvider';
import { getClubImageGallery } from '@/lib/image-fallbacks';
import { getClubPrimaryMediaImage, type ClubMediaItem, type ClubVideoMediaItem } from '@/lib/club-media';
import {
  Lock,
  Star,
  Mail,
  Globe,
  Clock,
  ArrowLeft,
  Check,
  Shield,
  Cannabis,
} from '@/lib/icons';

import { EditorialHeading } from '@/components/landing/editorial-concierge/typography/EditorialHeading';
import { ConciergeLabel } from '@/components/landing/editorial-concierge/typography/ConciergeLabel';
import { FADE_UP, STAGGER_CONTAINER } from '@/components/landing/editorial-concierge/motion/config';
import MembershipApplicationModal from '@/components/clubs/MembershipApplicationModal';
import ClubVideoTour from '@/components/clubs/ClubVideoTour';

/* ------------------------------------------------------------------ */
/* MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */
interface ClubProfileContentProps {
  club: Club;
  mediaItems?: ClubMediaItem[];
}

export default function ClubProfileContent({ club, mediaItems }: ClubProfileContentProps) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [showPreRegistrationModal, setShowPreRegistrationModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(e => console.log('Autoplay blocked', e));
    }
  }, []);

  const fallbackImages = getClubImageGallery(club.images);
  const galleryItems =
    mediaItems && mediaItems.length > 0
      ? mediaItems
      : fallbackImages.map((src, index) => ({
          kind: 'image' as const,
          src,
          alt: `${club.name} gallery image ${index + 1}`,
        }));

  const primaryStaticImage = getClubPrimaryMediaImage(galleryItems);
  const videoItem = galleryItems.find((item) => item.kind === 'video') as ClubVideoMediaItem | undefined;
  const imagesOnly = galleryItems.filter((item) => item.kind === 'image');
  const primaryActionLabel = t('club_profile.apply_for_membership');
  
  // Format images for the new circular GSAP carousel - ONLY IMAGES
  const carouselImages: CircularGalleryImage[] = imagesOnly.map((item, index) => ({
    title: item.alt || `${club.name} ${index + 1}`,
    url: item.src,
  }));

  const openMembershipFlow = () => {
    setShowPreRegistrationModal(true);
  };

  const closeMembershipModal = () => {
    setShowPreRegistrationModal(false);
  };

  const getDayName = (day: string) => {
    const dayMap: Record<string, string> = {
      monday: t('days.monday'), tuesday: t('days.tuesday'), wednesday: t('days.wednesday'),
      thursday: t('days.thursday'), friday: t('days.friday'), saturday: t('days.saturday'), sunday: t('days.sunday'),
    };
    return dayMap[day] || day;
  };

  /* Premium Liquid Glass Reusable Class */
  const glassCardClass = "relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-bg-surface/70 supports-[backdrop-filter]:bg-bg-surface/55 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl [transform:translateZ(0)]";

  return (
    <div className="relative min-h-screen bg-bg-base font-sans selection:bg-brand/30 selection:text-white pb-20">
      
      {/* ========================================================= */}
      {/* CINEMATIC HERO                                            */}
      {/* ========================================================= */}
      <section className="relative h-[60vh] min-h-[500px] w-full lg:h-[75vh]">
        <div className="absolute inset-0">
          {videoItem ? (
            <video
              ref={videoRef}
              poster={videoItem.poster}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            >
              <source src={videoItem.src} type="video/webm" />
              {videoItem.mp4Fallback && <source src={videoItem.mp4Fallback} type="video/mp4" />}
            </video>
          ) : (
            <Image src={primaryStaticImage} alt={`${club.name} hero image`} fill priority sizes="100vw" className="object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/45 to-bg-base/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-base/85 via-bg-base/25 to-transparent" />
        </div>

        {/* Back Button pushed down to clear top navbar completely */}
        <div className="absolute left-4 top-24 sm:left-8 z-20">
          <Button asChild variant="ghost" className="rounded-full border border-white/10 bg-bg-base/40 text-white/90 backdrop-blur-md transition-all hover:bg-bg-surface hover:text-white">
            <Link href={`/${language}/clubs`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('nav.back_to_clubs')}
            </Link>
          </Button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* ASYMMETRICAL CONTENT LAYOUT                               */}
      {/* ========================================================= */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 -mt-32 lg:-mt-48">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: The Story, Gallery, & Deep Dive */}
          <div className="lg:col-span-8 space-y-8 lg:space-y-12">
            
            {/* 1. The Liquid Glass Hero Title Card */}
            <motion.div variants={STAGGER_CONTAINER} initial="initial" animate="animate">
              <motion.div variants={FADE_UP} className={`${glassCardClass} p-8 lg:p-12`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="mb-6 flex flex-wrap items-center gap-3">
                    <VerificationBadge isVerified={club.isVerified} size="lg" />
                    <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand">
                      {club.neighborhood}
                    </span>
                    {club.rating && (
                      <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                        <Star className="h-3 w-3 fill-brand text-brand" />
                        {club.rating} ({club.reviewCount})
                      </span>
                    )}
                  </div>

                  <EditorialHeading as="h1" size="hero" className="mb-8 text-white drop-shadow-lg leading-tight">
                    {club.name}
                  </EditorialHeading>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t border-white/10 pt-8">
                    <Button
                      type="button"
                      variant="primary"
                      size="xl"
                      onClick={openMembershipFlow}
                      className="w-full rounded-full bg-brand px-10 py-6 text-base font-bold text-bg-base shadow-[0_4px_20px_hsl(var(--brand)/0.25)] transition-all hover:scale-[1.02] hover:bg-brand-dark active:scale-[0.98] sm:w-auto"
                    >
                      {primaryActionLabel}
                    </Button>
                    <span className="text-zinc-400 uppercase tracking-[0.15em] text-[11px] font-medium max-w-[200px] text-center sm:text-left">
                      {t('club_profile.membership_application')}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* 2. The Experience (Description) */}
            <div className="px-2">
                <div className="mb-6 flex items-center gap-4">
                  <div className="h-[1px] flex-grow bg-white/10" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-brand font-bold">
                  {t('club_profile.experience')}
                </span>
                <div className="h-[1px] w-12 bg-white/10" />
              </div>
              
              <p className="text-lg md:text-xl leading-relaxed text-zinc-300 font-serif italic text-pretty whitespace-pre-line">
                "{t(`clubs.${club.slug}.description`) !== `clubs.${club.slug}.description` ? t(`clubs.${club.slug}.description`) : club.description}"
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {club.vibeTags.map((vibe, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    #{vibe}
                  </span>
                ))}
              </div>
            </div>

            {/* 2.5 The Virtual Tour (Video) */}
            {videoItem && (
              <ClubVideoTour video={videoItem} clubName={club.name} />
            )}

            {/* 3. The New Circular Image Gallery */}
            {carouselImages.length > 1 && (
              <div className={`${glassCardClass} p-2 md:p-6 flex flex-col items-center justify-center`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <div className="relative z-10 w-full flex flex-col items-center justify-center">
                  <div className="mx-auto w-full max-w-[760px]">
                    <ImageGallery images={carouselImages} />
                  </div>
                </div>
              </div>
            )}

            {/* 4. Amenities Grid */}
            <div className={`${glassCardClass} p-8`}>
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <div className="mb-8 flex items-center gap-3">
                  <Shield className="h-5 w-5 text-brand" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                    {t('club_profile.services')}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {club.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/5">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-medium text-zinc-300">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Dossier */}
          <div className="lg:col-span-4 relative">
            {/* Sticks exactly below the Navbar */}
            <div className="sticky top-[72px] md:top-[80px] space-y-6 flex flex-col pb-10">

              {/* Box 1: Club Stats */}
              <div className={`${glassCardClass} p-8 overflow-hidden group`}>
                <div className="absolute -right-6 -top-6 p-8 opacity-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110 pointer-events-none">
                  <Cannabis className="h-40 w-40" />
                </div>
                <div className="relative z-10">
                  <h3 className="mb-8 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    {t('club_profile.club_details')}
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-brand">{t('club_profile.capacity')}</div>
                      <div className="text-3xl font-serif text-white">
                        {club.capacity} <span className="text-xs font-sans text-zinc-500 tracking-widest uppercase ml-1">{t('club_profile.members')}</span>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-brand">{t('club_profile.founded')}</div>
                      <div className="text-2xl font-serif text-white">{club.foundedYear}</div>
                    </div>
                    <div>
                      <div className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-brand">{t('club_profile.price_range')}</div>
                      <div className="text-xl tracking-[0.2em] text-white font-mono">{club.priceRange}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 2: Opening Hours */}
              <div className={`${glassCardClass} p-8`}>
                <div className="relative z-10">
                  <div className="mb-6 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-brand" />
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">{t('club_profile.opening_hours')}</h3>
                  </div>
                  <div className="space-y-3.5">
                    {Object.entries(club.openingHours as Record<string, string>).map(([day, hours]) => (
                      <div key={day} className="flex justify-between items-center border-b border-white/5 pb-3 text-xs last:border-0 last:pb-0">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">{getDayName(day)}</span>
                        <span className="font-mono text-sm text-white/90">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Box 3: The Vault (Private Location) */}
              <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.05] bg-bg-surface shadow-2xl p-1">
                <div className="absolute inset-0 opacity-[0.15] mix-blend-screen pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                
                <div className="relative z-10 flex flex-col items-center justify-center rounded-[1.8rem] border border-white/[0.02] bg-bg-base/70 p-8 text-center backdrop-blur-md">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full bg-brand blur-xl opacity-20 animate-pulse" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-bg-base shadow-xl">
                      <Lock className="h-6 w-6 text-brand" />
                    </div>
                  </div>

                  <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                    {t('club_profile.private_location')}
                  </h4>
                  <p className="mb-8 max-w-[220px] text-[13px] leading-relaxed text-zinc-400 font-serif italic">
                    {t('club_profile.private_location_description')}
                  </p>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={openMembershipFlow}
                    className="w-full rounded-full border-white/20 bg-brand/10 py-5 text-[11px] font-bold tracking-widest uppercase text-white transition-all hover:border-brand/40 hover:bg-brand/20"
                  >
                    {primaryActionLabel}
                  </Button>
                </div>
              </div>

              {/* Contact Mini-Footer */}
              <div className="px-2 pt-4 flex flex-col items-center gap-4">
                <ConciergeLabel className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                  {t('club_profile.get_in_touch')}
                </ConciergeLabel>
                <div className="flex flex-wrap items-center justify-center gap-6">
                  {club.website && (
                    <a href={`https://${club.website}`} className="group flex items-center gap-2 text-zinc-400 transition-colors hover:text-brand">
                      <Globe className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{t('club_profile.website')}</span>
                    </a>
                  )}
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="text-[10px] uppercase tracking-widest">{club.contactEmail ? t('club_profile.email') : t('club_profile.email_hidden')}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* MEMBERSHIP APPLICATION MODAL */}
      <MembershipApplicationModal
        club={club}
        isOpen={showPreRegistrationModal}
        onClose={closeMembershipModal}
        clubImage={primaryStaticImage}
      />
    </div>
  );
}
