'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { Locale } from '@/lib/i18n-config';
import { Logo } from '@/components/ui/logo';
import { Instagram, Twitter, TikTok } from '@/lib/icons';

export default function Footer() {
  const { language, setLanguage } = useLanguage();
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
            <p className="text-sm text-zinc-400 leading-relaxed mb-8 font-medium">
              The independent guide to Cannabis Social Clubs in Spain.
            </p>
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
              Learn
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href={withLocale('/editorial')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  All Guides
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/safety-kit')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  The Safety Kit
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/editorial/legal')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Legal Explainer
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/editorial')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  How Clubs Work
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/help')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Explore */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8A838] mb-8">
              Explore
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href={withLocale('/clubs')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  The Directory
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
                  className="text-sm text-zinc-500 hover:text-zinc-400 transition-colors group flex items-center"
                >
                  Valencia <span className="text-[9px] font-bold uppercase tracking-widest text-[#E8A838]/50 ml-2 py-0.5 px-1.5 rounded bg-[#E8A838]/5 border border-[#E8A838]/10">Soon</span>
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/spain/tenerife')} 
                  className="text-sm text-zinc-500 hover:text-zinc-400 transition-colors group flex items-center"
                >
                  Tenerife <span className="text-[9px] font-bold uppercase tracking-widest text-[#E8A838]/50 ml-2 py-0.5 px-1.5 rounded bg-[#E8A838]/5 border border-[#E8A838]/10">Soon</span>
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/events')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Events Calendar
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: About */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8A838] mb-8">
              About
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href={withLocale('/mission')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/clubs')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Verification Standard
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/contact')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/privacy')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/terms')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/cookies')} 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-20 pt-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-center md:text-left">
              © {new Date().getFullYear()} SocialClubsMaps. Independent. Unsponsored. No club has ever paid for placement.
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
