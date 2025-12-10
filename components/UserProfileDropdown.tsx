'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
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
  CreditCard
} from 'lucide-react';

interface UserProfileDropdownProps {
  className?: string;
}

export default function UserProfileDropdown({ className = '' }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  // Mock user data - in real app this would come from auth context
  const user = {
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    avatar: null,
    memberSince: '2023',
    favoriteClubs: 3,
    reviews: 12,
    isPremium: false
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-green-50 transition-colors"
      >
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-green-600" />
        </div>
        <span className="hidden sm:inline font-medium text-gray-700">
          {user.name.split(' ')[0]}
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
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {t('user.member_since')} {user.memberSince}
                    </Badge>
                    {user.isPremium && (
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
                  <div className="text-lg font-bold text-green-600">{user.favoriteClubs}</div>
                  <div className="text-xs text-gray-500">{t('user.favorite_clubs')}</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">{user.reviews}</div>
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
                  <div className="text-xs text-gray-500">{user.favoriteClubs} clubs guardados</div>
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
                  <div className="text-xs text-gray-500">{user.reviews} reseñas escritas</div>
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

              {!user.isPremium && (
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
                className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <LogOut className="h-4 w-4 text-red-600" />
                </div>
                <div className="font-medium">{t('nav.logout')}</div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}