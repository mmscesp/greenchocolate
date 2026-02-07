'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  User,
  Settings,
  Heart,
  Star,
  Calendar,
  LogOut,
  ChevronDown,
  Shield,
  Bell,
  CreditCard,
  Loader2,
} from 'lucide-react';

interface UserProfileDropdownProps {
  className?: string;
}

export default function UserProfileDropdown({ className = '' }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    setIsOpen(false);
    await signOut();
    router.push('/');
    router.refresh();
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className={`relative ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="flex items-center gap-2"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      </div>
    );
  }

  // If not logged in, show login button
  if (!user) {
    return (
      <div className={`relative ${className}`}>
        <Link href="/club-panel/login">
          <Button variant="ghost" size="sm" className="hover:bg-green-50 transition-colors">
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Iniciar Sesión</span>
          </Button>
        </Link>
      </div>
    );
  }

  // Get user display info
  const displayName = profile?.displayName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario';
  const userEmail = profile?.email || user.email || '';
  const isPremium = profile?.role === 'ADMIN' || profile?.role === 'CLUB_ADMIN';
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).getFullYear().toString()
    : new Date().getFullYear().toString();

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-green-50 transition-colors"
      >
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <User className="h-4 w-4 text-green-600" />
          )}
        </div>
        <span className="hidden sm:inline font-medium text-gray-700">
          {displayName.split(' ')[0]}
        </span>
        <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-4 z-50 animate-in slide-in-from-top-2 duration-200">
            {/* User Info Header */}
            <div className="px-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{displayName}</h3>
                  <p className="text-sm text-gray-500 truncate">{userEmail}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {t('user.member_since')} {memberSince}
                    </Badge>
                    {isPremium && (
                      <Badge variant="premium" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">3</div>
                  <div className="text-xs text-gray-500">{t('user.favorite_clubs')}</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">12</div>
                  <div className="text-xs text-gray-500">{t('user.reviews')}</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">4.8</div>
                  <div className="text-xs text-gray-500">{t('user.rating')}</div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">{t('user.my_profile')}</div>
                  <div className="text-xs text-gray-500">{t('user.profile_desc')}</div>
                </div>
              </Link>

              <Link
                href="/profile/favorites"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <div className="font-medium">{t('user.favorites')}</div>
                  <div className="text-xs text-gray-500">3 clubs guardados</div>
                </div>
              </Link>

              <Link
                href="/profile/reviews"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <div className="font-medium">{t('user.my_reviews')}</div>
                  <div className="text-xs text-gray-500">12 reseñas escritas</div>
                </div>
              </Link>

              <Link
                href="/profile/bookings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">{t('user.bookings')}</div>
                  <div className="text-xs text-gray-500">{t('user.bookings_desc')}</div>
                </div>
              </Link>

              <Link
                href="/profile/notifications"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Bell className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium">{t('user.notifications')}</div>
                  <div className="text-xs text-gray-500">3 nuevas notificaciones</div>
                </div>
              </Link>

              <Link
                href="/profile/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Settings className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium">{t('user.settings')}</div>
                  <div className="text-xs text-gray-500">{t('user.settings_desc')}</div>
                </div>
              </Link>

              {!isPremium && (
                <Link
                  href="/profile/premium"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-orange-600">{t('user.upgrade_premium')}</div>
                    <div className="text-xs text-gray-500">{t('user.premium_desc')}</div>
                  </div>
                </Link>
              )}
            </div>

            {/* Logout */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="font-medium">{t('nav.logout')}</div>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}