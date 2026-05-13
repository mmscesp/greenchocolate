'use client';

import type { ReactNode } from 'react';
import { CONSENT_PREFERENCES_OPEN_EVENT_NAME } from '@/lib/consent';

interface CookieSettingsButtonProps {
  children: ReactNode;
  className?: string;
}

export default function CookieSettingsButton({ children, className }: CookieSettingsButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(CONSENT_PREFERENCES_OPEN_EVENT_NAME))}
    >
      {children}
    </button>
  );
}
