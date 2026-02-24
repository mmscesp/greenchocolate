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
import {
  MapPin,
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
} from 'lucide-react';

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
    <div className="min-h-screen bg-zinc-950 relative">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href={`/${language}/clubs`}>
            <Button 
              variant="ghost" 
              className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('nav.back_to_clubs')}
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Hero Image Gallery */}
      <section className="relative h-[400px] lg:h-[500px] overflow-hidden mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={club.images[currentImageIndex]}
              alt={club.name}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/60 to-transparent" />

        {/* Image Navigation */}
        {club.images.length > 1 && (
          <>
            <motion.button
              onClick={prevImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-zinc-900/80 backdrop-blur-sm text-white p-3 rounded-full hover:bg-zinc-800 transition-colors border border-zinc-700 z-10"
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>
            <motion.button
              onClick={nextImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-zinc-900/80 backdrop-blur-sm text-white p-3 rounded-full hover:bg-zinc-800 transition-colors border border-zinc-700 z-10"
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>

            {/* Image Counter */}
            <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/10 z-10">
              {currentImageIndex + 1} / {club.images.length}
            </div>

            {/* Image Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {club.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-green-400 w-8' 
                      : 'bg-white/30 w-2 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Overlay Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="flex items-center gap-3 mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white">{club.name}</h1>
              <VerificationBadge isVerified={club.isVerified} size="lg" />
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 bg-zinc-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-700">
                <MapPin className="h-4 w-4 text-green-400" />
                <span className="text-white font-medium">{club.neighborhood}</span>
              </div>
              
              {club.rating && (
                <div className="flex items-center gap-2 bg-zinc-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-700">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-white font-bold">{club.rating}</span>
                  <span className="text-zinc-400 text-sm">({club.reviewCount})</span>
                </div>
              )}
              
              <div className="bg-green-500/20 backdrop-blur-sm text-green-400 px-4 py-2 rounded-full font-bold border border-green-500/30">
                {club.priceRange}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <motion.div 
              className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 lg:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-green-400" />
                </div>
                <H2 className="text-white">{t('club.about')}</H2>
              </div>
              <p className="text-zinc-300 leading-relaxed">{club.description}</p>
            </motion.div>

            {/* Amenities */}
            <motion.div 
              className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 lg:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-400" />
                </div>
                <H2 className="text-white">{t('club.services')}</H2>
              </div>
              <div className="flex flex-wrap gap-2">
                {club.amenities.map((amenity, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="border-zinc-700 text-zinc-300 bg-zinc-800/50"
                  >
                    {amenity}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* Vibe Tags */}
            <motion.div 
              className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 lg:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Cannabis className="h-5 w-5 text-purple-400" />
                </div>
                <H2 className="text-white">{t('club.atmosphere')}</H2>
              </div>
              <div className="flex flex-wrap gap-2">
                {club.vibeTags.map((vibe, index) => (
                  <Badge 
                    key={index} 
                    className="bg-purple-500/10 text-purple-300 border-purple-500/20"
                  >
                    {vibe}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* Opening Hours */}
            <motion.div 
              className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 lg:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
                <H2 className="text-white">{t('club.schedule')}</H2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(club.openingHours as Record<string, string>).map(([day, hours]) => (
                  <div 
                    key={day} 
                    className="flex justify-between items-center py-2 px-3 bg-zinc-800/50 rounded-lg"
                  >
                    <span className="text-zinc-400 text-sm capitalize">
                      {getDayName(day)}
                    </span>
                    <span className="text-green-400 font-medium text-sm">{hours}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pre-registration CTA */}
            {club.allowsPreRegistration && (
              <motion.div 
                className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20 p-6 sticky top-6"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center mb-4">
                  <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="h-7 w-7 text-green-400" />
                  </div>
                  <H3 className="text-white mb-1">{t('club.join_club')}</H3>
                  <Text size="sm" variant="muted">{t('club.membership_request')}</Text>
                </div>
                <Button
                  size="lg"
                  onClick={() => {
                    if (!user) {
                      router.push(`/${language}/account/login?redirect=${encodeURIComponent(window.location.pathname)}`);
                      return;
                    }
                    setShowPreRegistrationModal(true);
                  }}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300"
                >
                  {t('club.pre_register')}
                </Button>
              </motion.div>
            )}

            {/* Contact Info */}
            <motion.div 
              className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <H3 className="text-white mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
                {t('club.contact')}
              </H3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-green-400 mt-1 shrink-0" />
                  <Text size="sm" className="text-zinc-300">
                    {club.address || 'Address shown after membership approval'}
                  </Text>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-green-400 shrink-0" />
                  <Text size="sm" className="text-zinc-300">
                    {club.phoneNumber || 'Shown after membership approval'}
                  </Text>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-green-400 shrink-0" />
                  <Text size="sm" className="text-zinc-300">
                    {club.contactEmail || 'Shown after membership approval'}
                  </Text>
                </div>
                {club.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-green-400 shrink-0" />
                    <a href={`https://${club.website}`} className="text-green-400 hover:text-green-300 text-sm transition-colors">
                      {club.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Social Media */}
              {club.socialMedia && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <div className="flex gap-2">
                    {club.socialMedia.instagram && (
                      <a href={`https://instagram.com/${club.socialMedia.instagram.replace('@', '')}`} className="w-9 h-9 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 hover:bg-purple-500/20 transition-all">
                        <Instagram className="h-4 w-4" />
                      </a>
                    )}
                    {club.socialMedia.facebook && (
                      <a href={`https://facebook.com/${club.socialMedia.facebook}`} className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-all">
                        <Facebook className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Club Stats */}
            <motion.div 
              className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <H3 className="text-white mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-amber-400" />
                </div>
                {t('club.information')}
              </H3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 px-3 bg-zinc-800/50 rounded-lg">
                  <Text size="sm" className="text-zinc-400">{t('club.capacity')}</Text>
                  <span className="text-white font-bold">{club.capacity}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-zinc-800/50 rounded-lg">
                  <Text size="sm" className="text-zinc-400">{t('club.founded')}</Text>
                  <span className="text-white font-bold">{club.foundedYear}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Pre-registration Modal */}
      <AnimatePresence>
        {showPreRegistrationModal && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <H3 className="text-white">
                    {t('form.pre_registration')}
                  </H3>
                  <button
                    onClick={() => {
                      setShowPreRegistrationModal(false);
                      setFormState(null);
                    }}
                    className="text-zinc-400 hover:text-white p-1"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Club Mini Info */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-zinc-800/50 rounded-xl">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{club.name}</p>
                    <p className="text-zinc-400 text-sm">{club.neighborhood}</p>
                  </div>
                </div>

                {/* Form State Message */}
                {formState && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 p-3 rounded-lg flex items-start gap-2 ${
                      formState.success
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {formState.success ? <Check className="h-4 w-4 mt-0.5" /> : <AlertCircle className="h-4 w-4 mt-0.5" />}
                    <Text size="sm">{formState.message}</Text>
                  </motion.div>
                )}

                <form onSubmit={handlePreRegistrationSubmit} className="space-y-4">
                  <input type="hidden" name="clubId" value={club.id} />

                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">
                      {t('form.full_name')} <span className="text-green-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="message"
                      required
                      placeholder={t('form.message_placeholder')}
                      className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none text-sm"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowPreRegistrationModal(false);
                        setFormState(null);
                      }}
                      className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-lg py-3 text-sm"
                      disabled={isSubmitting}
                    >
                      {t('form.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg py-3 text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1.5 animate-spin inline" />
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
