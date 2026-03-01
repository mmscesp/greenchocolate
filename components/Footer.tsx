'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSelector from './LanguageSelector';
import { Logo, LogoIcon } from '@/components/ui/logo';
import { MapPin, BookOpen, Users, Shield, Mail, Instagram, Twitter } from '@/lib/icons';

export default function Footer() {
  const { t, language } = useLanguage();
  const withLocale = (path: string) => `/${language}${path}`;

  return (
    <footer className="relative bg-gradient-to-b from-background to-emerald-50/20 dark:to-emerald-950/10 border-t border-border overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-[10%] h-56 w-56 rounded-full bg-emerald-500/8 blur-3xl" />
        <div className="absolute -bottom-24 right-[10%] h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      </div>
      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand/10">
                <LogoIcon size="sm" />
              </div>
              <span className="text-lg font-semibold text-foreground">{t('brand.name')}</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://www.instagram.com/socialclubsmaps"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-card border border-border/60 hover:bg-brand/10 text-neutral-500 hover:text-brand transition-colors"
                aria-label={t('footer.social.instagram_aria')}
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://x.com/socialclubsmaps"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-card border border-border/60 hover:bg-brand/10 text-neutral-500 hover:text-brand transition-colors"
                aria-label={t('footer.social.twitter_aria')}
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="mailto:hello@socialclubsmaps.com"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-card border border-border/60 hover:bg-brand/10 text-neutral-500 hover:text-brand transition-colors"
                aria-label={t('footer.social.email_aria')}
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
                  href={withLocale('/clubs')} 
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MapPin className="h-4 w-4 text-neutral-400 group-hover:text-brand transition-colors" />
                  {t('nav.explore')}
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/editorial')} 
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <BookOpen className="h-4 w-4 text-neutral-400 group-hover:text-brand transition-colors" />
                  {t('nav.blog')}
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/club-panel')} 
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
                <Link href={withLocale('/help')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.help_center')}
                </Link>
              </li>
              <li>
                <Link href={withLocale('/contact')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link href={withLocale('/terms')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href={withLocale('/privacy')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Language & Trust Column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">{t('footer.language')}</h3>
            <div className="mb-6">
              <LanguageSelector variant="footer" />
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted border border-neutral-100">
              <Shield className="h-4 w-4 text-gold" />
              <span className="text-xs text-muted-foreground">
                {t('footer.trust.verified_secure')}
              </span>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} SocialClubsMaps. {t('footer.copyright')}
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2">
            <Link href={withLocale('/terms')} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t('footer.terms_short')}
            </Link>
            <Link href={withLocale('/privacy')} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t('footer.privacy_short')}
            </Link>
            <Link href={withLocale('/cookies')} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t('footer.cookies')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
