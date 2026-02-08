'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VerificationBadge from '@/components/VerificationBadge';
import Footer from '@/components/Footer';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/hooks/useLanguage';
import { Club } from '@/lib/types';
import { submitMembershipRequest, ActionState } from '@/app/actions/membership';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Leaf,
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
} from 'lucide-react';

interface ClubProfileContentProps {
  club: Club;
}

export default function ClubProfileContent({ club }: ClubProfileContentProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPreRegistrationModal, setShowPreRegistrationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<ActionState | null>(null);

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
      formData.append('clubId', club.id);

      const result = await submitMembershipRequest({ success: false }, formData);
      setFormState(result);

      if (result.success) {
        setTimeout(() => {
          setShowPreRegistrationModal(false);
          router.push('/dashboard/requests');
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="text-xl font-bold text-gray-900">SocialClubsMaps</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/clubs">
                <Button variant="ghost">← {t('nav.back_to_clubs')}</Button>
              </Link>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Image Gallery */}
      <section className="relative h-96 lg:h-[500px] overflow-hidden">
        <Image
          src={club.images[currentImageIndex]}
          alt={club.name}
          fill
          className="object-cover"
        />

        {/* Image Navigation */}
        {club.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {club.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Overlay Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-white">{club.name}</h1>
              <VerificationBadge isVerified={club.isVerified} size="lg" />
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <MapPin className="h-5 w-5" />
                <span>{club.neighborhood}</span>
              </div>
              {club.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span>{club.rating}</span>
                  <span className="text-white/70">({club.reviewCount} {t('club.reviews')})</span>
                </div>
              )}
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {club.priceRange}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('club.about')}</h2>
              <p className="text-gray-700 leading-relaxed">{club.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('club.services')}</h2>
              <div className="flex flex-wrap gap-2">
                {club.amenities.map((amenity, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Vibe Tags */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('club.atmosphere')}</h2>
              <div className="flex flex-wrap gap-2">
                {club.vibeTags.map((vibe, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {vibe}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('club.schedule')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(club.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="font-medium text-gray-700 capitalize">
                      {getDayName(day)}
                    </span>
                    <span className="text-gray-600">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pre-registration CTA */}
            {club.allowsPreRegistration && (
              <div className="bg-white rounded-lg p-6 sticky top-24">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('club.join_club')}</h3>
                  <p className="text-gray-600 text-sm">{t('club.membership_request')}</p>
                </div>
                  <Button
                    variant="cannabis"
                    size="lg"
                    onClick={() => {
                      if (!user) {
                        router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
                        return;
                      }
                      setShowPreRegistrationModal(true);
                    }}
                    className="w-full"
                  >
                    {t('club.pre_register')}
                  </Button>
              </div>
            )}

            {/* Contact Info */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t('club.contact')}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="h-5 w-5 text-green-600" />
                  {user ? (
                    <span className="text-sm">{club.address}</span>
                  ) : (
                    <div className="flex flex-col items-start">
                      <span className="text-sm blur-sm select-none">Calle de la Verdad, 123</span>
                      <Link href="/login" className="text-xs text-green-600 hover:underline mt-1">
                        Log in to view address
                      </Link>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="h-5 w-5 text-green-600" />
                  <span className="text-sm">{club.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="h-5 w-5 text-green-600" />
                  <span className="text-sm">{club.contactEmail}</span>
                </div>
                {club.website && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Globe className="h-5 w-5 text-green-600" />
                    <a
                      href={`https://${club.website}`}
                      className="text-sm text-green-600 hover:underline"
                    >
                      {club.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Social Media */}
              {club.socialMedia && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex gap-3">
                    {club.socialMedia.instagram && (
                      <a
                        href={`https://instagram.com/${club.socialMedia.instagram.replace('@', '')}`}
                        className="text-pink-600 hover:text-pink-700"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {club.socialMedia.facebook && (
                      <a
                        href={`https://facebook.com/${club.socialMedia.facebook}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Club Stats */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t('club.information')}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{t('club.capacity')}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {club.capacity} {t('club.people')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{t('club.founded')}</span>
                  </div>
                  <span className="text-sm font-medium">{club.foundedYear}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-registration Modal */}
      {showPreRegistrationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {t('form.pre_registration')} - {club.name}
                </h3>
                <button
                  onClick={() => {
                    setShowPreRegistrationModal(false);
                    setFormState(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Form State Message */}
              {formState && (
                <div
                  className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
                    formState.success
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
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
                </div>
              )}

              <form onSubmit={handlePreRegistrationSubmit} className="space-y-4">
                <input type="hidden" name="clubId" value={club.id} />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('form.full_name')} {t('form.required')}
                  </label>
                  <input
                    type="text"
                    name="message"
                    required
                    placeholder={t('form.message_placeholder')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
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
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {t('form.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    variant="cannabis"
                    disabled={isSubmitting}
                    className="flex-1"
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
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
