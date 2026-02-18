'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSelector from './LanguageSelector';
import { Leaf, MapPin, BookOpen, Users, Shield, Mail, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-background border-t border-border">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand/10">
                <Leaf className="h-5 w-5 text-brand" />
              </div>
              <span className="text-lg font-semibold text-foreground">SocialClubsMaps</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="#" 
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-100 hover:bg-brand/10 text-neutral-500 hover:text-brand transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-100 hover:bg-brand/10 text-neutral-500 hover:text-brand transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-100 hover:bg-brand/10 text-neutral-500 hover:text-brand transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          {/* Navigation Column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">{t('footer.links')}</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/clubs" 
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MapPin className="h-4 w-4 text-neutral-400 group-hover:text-brand transition-colors" />
                  {t('nav.explore')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/editorial" 
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <BookOpen className="h-4 w-4 text-neutral-400 group-hover:text-brand transition-colors" />
                  {t('nav.blog')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/club-panel/dashboard" 
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Users className="h-4 w-4 text-neutral-400 group-hover:text-brand transition-colors" />
                  {t('nav.dashboard')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support Column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">{t('footer.support')}</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.help_center')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.contact')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.terms')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.privacy')}
                </a>
              </li>
            </ul>
          </div>
          
          {/* Language & Trust Column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">{t('footer.language')}</h3>
            <div className="mb-6">
              <LanguageSelector variant="footer" />
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
              <Shield className="h-4 w-4 text-gold" />
              <span className="text-xs text-muted-foreground">
                Verified & Secure Platform
              </span>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SocialClubsMaps. {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}