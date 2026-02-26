'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { languages, Language } from '@/lib/i18n';
import { ChevronDown, Globe } from '@/lib/icons';

interface LanguageSelectorProps {
  variant?: 'header' | 'footer';
  direction?: 'up' | 'down';
}

export default function LanguageSelector({
  variant = 'header',
  direction = 'down',
}: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Fallback to 'en' if language key doesn't exist in languages object
  const currentLanguage = languages[language] || languages['en'];
  const menuPositionClassName =
    direction === 'up'
      ? 'absolute bottom-full right-0 mb-2 glass-dropdown py-2 min-w-[160px] z-50 animate-in fade-in zoom-in-95 duration-200'
      : 'absolute top-full right-0 mt-2 glass-dropdown py-2 min-w-[160px] z-50 animate-in fade-in zoom-in-95 duration-200';

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  if (variant === 'footer') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm">{currentLanguage.name}</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 min-w-[160px] z-50">
            {Object.entries(languages).map(([code, lang]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code as Language)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                  language === code ? 'text-green-400 bg-gray-700' : 'text-gray-300'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-white/10 text-white transition-colors"
      >
        <Globe className="h-5 w-5" />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className={menuPositionClassName}>
            {Object.entries(languages).map(([code, lang]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code as Language)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors flex items-center gap-3 ${
                  language === code ? 'text-brand-light bg-white/5' : 'text-white/70'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
