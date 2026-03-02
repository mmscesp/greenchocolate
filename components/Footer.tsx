'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { Logo } from '@/components/ui/logo';
import { Instagram, Twitter, TikTok } from '@/lib/icons';

export default function Footer() {
  const { language } = useLanguage();
  const withLocale = (path: string) => `/${language}${path}`;

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo href={withLocale('/')} size="md" showText={true} />
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              The independent guide to Cannabis Social Clubs in Spain.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://www.instagram.com/socialclubsmaps"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://x.com/socialclubsmaps"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="X (Twitter)"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="https://www.tiktok.com/@socialclubsmaps"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="TikTok"
              >
                <TikTok className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Learn */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
              Learn
            </h3>
            <ul className="space-y-3">
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
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
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
                  className="text-sm text-zinc-500 hover:text-zinc-400 transition-colors"
                >
                  Valencia <span className="text-[10px] uppercase tracking-wide text-zinc-600 ml-1">Soon</span>
                </Link>
              </li>
              <li>
                <Link 
                  href={withLocale('/spain/tenerife')} 
                  className="text-sm text-zinc-500 hover:text-zinc-400 transition-colors"
                >
                  Tenerife <span className="text-[10px] uppercase tracking-wide text-zinc-600 ml-1">Soon</span>
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
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
              About
            </h3>
            <ul className="space-y-3">
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
        <div className="border-t border-white/5 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-500 text-center md:text-left">
              © {new Date().getFullYear()} SocialClubsMaps. Independent. Unsponsored. No club has ever paid for placement.
            </p>
            <div className="flex items-center gap-1 text-xs font-medium">
              <span className="px-2 py-1 text-white bg-white/10 rounded">EN</span>
              <span className="text-zinc-600">·</span>
              <Link href={withLocale('/es')} className="px-2 py-1 text-zinc-500 hover:text-white transition-colors">
                ES
              </Link>
              <span className="text-zinc-600">·</span>
              <span className="px-2 py-1 text-zinc-600 cursor-not-allowed">FR</span>
              <span className="text-zinc-600">·</span>
              <span className="px-2 py-1 text-zinc-600 cursor-not-allowed">DE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
