'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { languages, Language } from '@/lib/i18n';
import { ChevronDown, Globe } from '@/lib/icons';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  variant?: 'header' | 'footer';
  direction?: 'up' | 'down';
  tone?: 'light' | 'dark';
}

export default function LanguageSelector({
  variant = 'header',
  direction = 'down',
  tone = 'light',
}: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Fallback to 'en' if language key doesn't exist in languages object
  const currentLanguage = languages[language] || languages['en'];
  const isLightTone = tone === 'light';
  const menuPositionClassName = cn(
    direction === 'up' ? 'absolute bottom-full right-0 mb-2' : 'absolute top-full right-0 mt-2',
    'py-2 min-w-[160px] z-50 animate-in fade-in zoom-in-95 duration-200 rounded-xl overflow-hidden',
    isLightTone
      ? 'glass-dropdown'
      : 'bg-white/95 backdrop-blur-xl border border-black/10 shadow-2xl'
  );

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  if (variant === 'footer') {
    return (
      <div className="relative">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl"
        >
          <Globe className="h-4 w-4" />
          <span>{currentLanguage.name}</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 min-w-[160px] z-50">
            {Object.entries(languages).map(([code, lang]) => (
              <Button
                key={code}
                type="button"
                variant={language === code ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleLanguageChange(code as Language)}
                className="w-full justify-start rounded-none px-4"
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Select language"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 rounded-full"
      >
        <Globe className="h-5 w-5" />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className={menuPositionClassName}>
            {Object.entries(languages).map(([code, lang]) => (
              <Button
                key={code}
                type="button"
                variant={language === code ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleLanguageChange(code as Language)}
                className="w-full justify-start rounded-none px-4"
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
