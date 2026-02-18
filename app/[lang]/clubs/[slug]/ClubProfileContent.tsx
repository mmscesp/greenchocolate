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
    <div className="min-h-screen bg-background relative">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link href={`/${language}/clubs`}>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
        </Link>
      </div>

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
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('nav.back_to_clubs')}
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Hero Image Gallery */}
      <section className="relative h-[500px] lg:h-[600px] overflow-hidden mt-4">
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
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />

        {/* Image Navigation */}
        {club.images.length > 1 && (
          <>
            <motion.button
              onClick={prevImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground p-3 rounded-full hover:bg-muted transition-colors border border-border"
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>
            <motion.button
              onClick={nextImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground p-3 rounded-full hover:bg-muted transition-colors border border-border"
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>

            {/* Image Counter */}
            <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/10">
              {currentImageIndex + 1} / {club.images.length}
            </div>

            {/* Image Dots */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
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
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="flex items-center gap-3 mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl lg:text-6xl font-black text-white">{club.name}</h1>
              <VerificationBadge isVerified={club.isVerified} size="lg" />
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap items-center gap-4 text-white/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <MapPin className="h-5 w-5 text-green-400" />
                <span className="font-medium">{club.neighborhood}</span>
              </div>
              
              {club.rating && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{club.rating}</span>
                  <span className="text-white/60">({club.reviewCount} {t('club.reviews')})</span>
                </div>
              )}
              
              <div className="bg-green-500/20 backdrop-blur-sm text-green-400 px-4 py-2 rounded-full font-bold border border-green-500/30">
                {club.priceRange}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 hover:border-green-500/30 transition-colors duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">{t('club.about')}</h2>
              </div>
              <p className="text-zinc-300 leading-relaxed text-lg">{club.description}</p>
            </motion.div>

            {/* Amenities */}
            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 hover:border-green-500/30 transition-colors duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">{t('club.services')}</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {club.amenities.map((amenity, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-sm px-4 py-2 border-white/10 text-zinc-300 hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400 transition-all bg-white/5"
                  >
                    {amenity}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* Vibe Tags */}
            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 hover:border-purple-500/30 transition-colors duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Cannabis className="h-6 w-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">{t('club.atmosphere')}</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {club.vibeTags.map((vibe, index) => (
                  <Badge 
                    key={index} 
                    className="text-sm px-4 py-2 bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-300 border border-purple-500/30 hover:from-purple-500/30 hover:to-violet-500/30 transition-all"
                  >
                    {vibe}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* Opening Hours */}
            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 hover:border-green-500/30 transition-colors duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">{t('club.schedule')}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(club.openingHours as Record<string, string>).map(([day, hours]) => (
                  <div 
                    key={day} 
                    className="flex justify-between items-center py-3 px-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <span className="font-medium text-zinc-300 capitalize">
                      {getDayName(day)}
                    </span>
                    <span className="text-green-400 font-bold">{hours}</span>
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
                className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-3xl border border-green-500/30 p-8 sticky top-24"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{t('club.join_club')}</h3>
                  <p className="text-zinc-400">{t('club.membership_request')}</p>
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
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-6 rounded-xl shadow-lg shadow-green-500/25 transition-all duration-300"
                >
                  {t('club.pre_register')}
                </Button>
              </motion.div>
            )}

            {/* Contact Info */}
            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
                {t('club.contact')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-zinc-400">
                  <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
                    <MapPin className="h-5 w-5 text-green-400" />
                  </div>
                  {club.address ? (
                    <span className="text-sm">{club.address}</span>
                  ) : (
                    <div className="flex flex-col items-start">
                      <span className="text-sm blur-sm select-none">Address hidden</span>
                      <Link href={`/${language}/profile/requests`} className="text-xs text-green-400 hover:text-green-300 mt-1">
                        Request membership to unlock details
                      </Link>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
                    <Phone className="h-5 w-5 text-green-400" />
                  </div>
                  <span className="text-sm">{club.phoneNumber || 'Hidden until approved membership'}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
                    <Mail className="h-5 w-5 text-green-400" />
                  </div>
                  <span className="text-sm">{club.contactEmail || 'Hidden until approved membership'}</span>
                </div>
                {club.website && (
                  <div className="flex items-center gap-3 text-zinc-400">
                    <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
                      <Globe className="h-5 w-5 text-green-400" />
                    </div>
                    <a
                      href={`https://${club.website}`}
                      className="text-sm text-green-400 hover:text-green-300 transition-colors"
                    >
                      {club.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Social Media */}
              {club.socialMedia && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex gap-3">
                    {club.socialMedia.instagram && (
                      <a
                        href={`https://instagram.com/${club.socialMedia.instagram.replace('@', '')}`}
                        className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center text-pink-400 hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {club.socialMedia.facebook && (
                      <a
                        href={`https://facebook.com/${club.socialMedia.facebook}`}
                        className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-all"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Club Stats */}
            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-amber-400" />
                </div>
                {t('club.information')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Users className="h-5 w-5" />
                    <span className="text-sm">{t('club.capacity')}</span>
                  </div>
                  <span className="text-white font-bold">
                    {club.capacity} {t('club.people')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Calendar className="h-5 w-5" />
                    <span className="text-sm">{t('club.founded')}</span>
                  </div>
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-zinc-900 border border-white/10 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {t('form.pre_registration')}
                  </h3>
                  <button
                    onClick={() => {
                      setShowPreRegistrationModal(false);
                      setFormState(null);
                    }}
                    className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Club Mini Info */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-2xl">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold">{club.name}</p>
                    <p className="text-zinc-400 text-sm">{club.neighborhood}</p>
                  </div>
                </div>

                {/* Form State Message */}
                {formState && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                      formState.success
                        ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                        : 'bg-red-500/10 border border-red-500/30 text-red-400'
                    }`}
                  >
                    {formState.success ? (
                      <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">{formState.message}</p>
                      {formState.errors && (
                        <ul className="mt-2 text-sm list-disc list-inside">
                          {Object.entries(formState.errors).map(([field, errors]) =>
                            errors.map((error, idx) => <li key={`${field}-${idx}`}>{error}</li>)
                          )}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handlePreRegistrationSubmit} className="space-y-5">
                  <input type="hidden" name="clubId" value={club.id} />

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      {t('form.full_name')} <span className="text-green-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="message"
                      required
                      placeholder={t('form.message_placeholder')}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowPreRegistrationModal(false);
                        setFormState(null);
                      }}
                      className="flex-1 border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white rounded-xl py-6"
                      disabled={isSubmitting}
                    >
                      {t('form.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl py-6 shadow-lg shadow-green-500/25"
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
