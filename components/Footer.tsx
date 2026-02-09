'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSelector from './LanguageSelector';
import { Leaf, MapPin, Clock, Users } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-background border-t py-16 relative">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="h-8 w-8 text-primary animate-float" />
              <span className="text-2xl font-bold">SocialClubsMaps</span>
            </div>
            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                <span className="text-sm">📱</span>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                <span className="text-sm">📧</span>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                <span className="text-sm">🐦</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-6 uppercase tracking-wider text-foreground">{t('footer.links')}</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <Link href="/clubs" className="hover:text-primary transition-colors flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('nav.explore')}
                </Link>
              </li>
              <li>
                <Link href="/editorial" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {t('nav.blog')}
                </Link>
              </li>
              <li>
                <Link href="/club-panel/dashboard" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t('nav.dashboard')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-6 uppercase tracking-wider text-foreground">{t('footer.support')}</h3>
            <ul className="space-y-3 text-muted-foreground mb-6">
              <li><a href="#" className="hover:text-primary transition-colors">{t('footer.help_center')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('footer.contact')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('footer.terms')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('footer.privacy')}</a></li>
            </ul>
              
            <div>
              <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider text-muted-foreground">{t('footer.language')}</h4>
              <LanguageSelector variant="footer" />
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 SocialClubsMaps. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}