'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { Locale } from '@/lib/i18n-config';
import { Logo } from '@/components/ui/logo';
import { Instagram, Twitter, TikTok } from '@/lib/icons';

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();
  const withLocale = (path: string) => `/${language}${path}`;

  return (
    <footer className="bg-black text-white relative overflow-hidden border-t border-white/10">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-black to-black pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-24 right-[5%] h-[400px] w-[400px] rounded-full bg-[#E8A838]/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        {/* 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Logo href={withLocale('/')} size="md" showText={true} />
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-8 font-medium">{t('footer.new.description')}</p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com/socialclubsmaps"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-[#E8A838] hover:border-[#E8A838]/30 hover:bg-[#E8A838]/5 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://x.com/socialclubsmaps"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-[#E8A838] hover:border-[#E8A838]/30 hover:bg-[#E8A838]/5 transition-all duration-300"
                aria-label="X (Twitter)"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="https://www.tiktok.com/@socialclubsmaps"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-[#E8A838] hover:border-[#E8A838]/30 hover:bg-[#E8A838]/5 transition-all duration-300"
                aria-label="TikTok"
              >
                <TikTok className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Learn */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8A838] mb-8">
              {t('footer.new.columns.learn')}
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href={withLocale('/editorial')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {t('footer.new.learn.all_guides')}
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/safety-kit')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {t('footer.new.learn.safety_kit')}
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/editorial/legal')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {t('footer.new.learn.legal_explainer')}
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/editorial')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {t('footer.new.learn.how_clubs_work')}
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/help')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {t('footer.new.learn.faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Explore */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8A838] mb-8">
              {t('footer.new.columns.explore')}
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href={withLocale('/clubs')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {t('footer.new.explore.directory')}
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/spain/barcelona')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Barcelona
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/spain/madrid')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Madrid
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/spain/valencia')} 
                  className="group flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-500 transition-colors hover:text-zinc-400"
                >
                  {t('footer.new.explore.valencia')} <span className="ml-0 rounded border border-[#E8A838]/10 bg-[#E8A838]/5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#E8A838]/50 sm:ml-2">{t('common.coming_soon')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/spain/tenerife')} 
                  className="group flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-500 transition-colors hover:text-zinc-400"
                >
                  {t('footer.new.explore.tenerife')} <span className="ml-0 rounded border border-[#E8A838]/10 bg-[#E8A838]/5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#E8A838]/50 sm:ml-2">{t('common.coming_soon')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/events')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {t('footer.new.explore.events')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: About */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8A838] mb-8">
              {t('footer.new.columns.about')}
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href={withLocale('/mission')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {t('footer.new.about.our_story')}
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/mission#verification-standard')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {t('footer.new.about.verification_standard')}
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/contact')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {t('footer.new.about.contact')}
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/privacy')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {t('footer.new.about.privacy_policy')}
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/terms')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {t('footer.new.about.terms_of_service')}
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/cookies')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {t('footer.new.about.cookie_policy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-20 pt-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-center md:text-left">
              {t('footer.new.copyright_prefix')} {new Date().getFullYear()} SocialClubsMaps. {t('footer.new.copyright_body')}
            </p>
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
              {(['en', 'es', 'fr', 'de'] as const).map((loc, index) => (
                <div key={loc} className="flex items-center">
                  <button
                    onClick={() => setLanguage(loc as Locale)}
                    className={`px-2 py-1 rounded transition-colors ${
                      language === loc 
                        ? "text-black bg-[#E8A838]" 
                        : "text-zinc-500 hover:text-[#E8A838]"
                    }`}
                  >
                    {loc.toUpperCase()}
                  </button>
                  {index < 3 && <span className="text-zinc-800 mx-1">·</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
