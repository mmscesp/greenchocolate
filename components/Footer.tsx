'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSelector from './LanguageSelector';
import { Leaf, MapPin, Clock, Users } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="h-8 w-8 text-green-400 animate-float" />
              <span className="text-2xl font-bold">SocialClubsMaps</span>
            </div>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors cursor-pointer">
                <span className="text-xl">📱</span>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors cursor-pointer">
                <span className="text-xl">📧</span>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors cursor-pointer">
                <span className="text-xl">🐦</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6 text-green-400">{t('footer.links')}</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link href="/clubs" className="hover:text-green-400 transition-colors flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('nav.explore')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-green-400 transition-colors flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {t('nav.blog')}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-green-400 transition-colors flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t('nav.dashboard')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6 text-green-400">{t('footer.support')}</h3>
            <ul className="space-y-3 text-gray-300 mb-6">
              <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.help_center')}</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.contact')}</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.terms')}</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.privacy')}</a></li>
            </ul>
            
            <div>
              <h4 className="text-sm font-semibold mb-3 text-green-400">{t('footer.language')}</h4>
              <LanguageSelector variant="footer" />
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 SocialClubsMaps. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}