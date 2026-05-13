'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/hooks/useLanguage';
import {
  CONSENT_CATEGORIES,
  CONSENT_EVENT_NAME,
  CONSENT_PREFERENCES_OPEN_EVENT_NAME,
  type ConsentCategory,
  type ConsentCategoryState,
  getConsentSnapshot,
  flushPendingConsentAudits,
  recordConsentAudit,
  saveConsentSnapshot,
} from '@/lib/consent';

type ConsentSaveAction = 'accept_all' | 'reject_all' | 'save_preferences';

const OPTIONAL_CATEGORIES: Array<Exclude<ConsentCategory, 'necessary'>> = [
  'functional',
  'measurement',
  'marketing',
];

const DENIED_OPTIONAL_CATEGORIES: ConsentCategoryState = {
  necessary: true,
  functional: false,
  measurement: false,
  marketing: false,
};

const ACCEPTED_CATEGORIES: ConsentCategoryState = {
  necessary: true,
  functional: true,
  measurement: true,
  marketing: true,
};

export default function CookieConsentManager() {
  const { language, t } = useLanguage();
  const bannerRef = useRef<HTMLElement | null>(null);
  const [hasDecision, setHasDecision] = useState(true);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [draft, setDraft] = useState<ConsentCategoryState>(DENIED_OPTIONAL_CATEGORIES);

  const cookiePolicyHref = `/${language}/cookies`;

  useEffect(() => {
    const syncFromStorage = () => {
      const snapshot = getConsentSnapshot();
      setHasDecision(Boolean(snapshot));
      setDraft(snapshot?.categories ?? DENIED_OPTIONAL_CATEGORIES);
    };

    const openPreferences = () => {
      syncFromStorage();
      setIsPreferencesOpen(true);
    };

    syncFromStorage();
    void flushPendingConsentAudits();
    window.addEventListener(CONSENT_EVENT_NAME, syncFromStorage);
    window.addEventListener(CONSENT_PREFERENCES_OPEN_EVENT_NAME, openPreferences);

    return () => {
      window.removeEventListener(CONSENT_EVENT_NAME, syncFromStorage);
      window.removeEventListener(CONSENT_PREFERENCES_OPEN_EVENT_NAME, openPreferences);
    };
  }, []);

  useEffect(() => {
    if (hasDecision || !bannerRef.current) {
      document.documentElement.style.removeProperty('--site-consent-offset');
      return;
    }

    const banner = bannerRef.current;
    const updateConsentOffset = () => {
      document.documentElement.style.setProperty('--site-consent-offset', `${banner.offsetHeight}px`);
    };

    updateConsentOffset();
    const resizeObserver = new ResizeObserver(updateConsentOffset);
    resizeObserver.observe(banner);
    window.addEventListener('resize', updateConsentOffset);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateConsentOffset);
      document.documentElement.style.removeProperty('--site-consent-offset');
    };
  }, [hasDecision]);

  const categoryLabels = useMemo(
    () =>
      Object.fromEntries(
        CONSENT_CATEGORIES.map((category) => [
          category,
          {
            title: t(`cookie_consent.categories.${category}.title`),
            body: t(`cookie_consent.categories.${category}.body`),
          },
        ])
      ) as Record<ConsentCategory, { title: string; body: string }>,
    [t]
  );

  const saveDecision = async (categories: ConsentCategoryState, action: ConsentSaveAction) => {
    const previousCategories = getConsentSnapshot()?.categories;
    const snapshot = saveConsentSnapshot(categories);
    const auditAction =
      previousCategories &&
      OPTIONAL_CATEGORIES.some((category) => previousCategories[category] && !snapshot.categories[category])
        ? 'withdraw'
        : action;

    setDraft(snapshot.categories);
    setHasDecision(true);
    setIsPreferencesOpen(false);
    await recordConsentAudit({ snapshot, action: auditAction, locale: language });
  };

  const updateDraft = (category: Exclude<ConsentCategory, 'necessary'>, checked: boolean) => {
    setDraft((current) => ({
      ...current,
      [category]: checked,
    }));
  };

  return (
    <>
      {!hasDecision && (
        <section
          ref={bannerRef}
          aria-label={t('cookie_consent.banner.aria')}
          className="fixed inset-x-0 bottom-0 z-[var(--z-consent)] border-t border-white/10 bg-bg-base/95 px-4 py-4 text-white shadow-[0_-24px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:px-6"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-brand">{t('cookie_consent.banner.title')}</p>
              <p className="mt-1 text-sm leading-6 text-zinc-300">
                {t('cookie_consent.banner.body')}{' '}
                <Link href={cookiePolicyHref} className="font-semibold text-brand underline-offset-4 hover:underline">
                  {t('cookie_consent.banner.policy_link')}
                </Link>
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[520px]">
              <Button
                type="button"
                variant="secondary"
                className="h-11 rounded-lg border border-white/15 bg-transparent text-white hover:bg-white/10"
                onClick={() => void saveDecision(DENIED_OPTIONAL_CATEGORIES, 'reject_all')}
              >
                {t('cookie_consent.actions.reject_all')}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-11 rounded-lg border border-white/15 bg-transparent text-white hover:bg-white/10"
                onClick={() => setIsPreferencesOpen(true)}
              >
                {t('cookie_consent.actions.manage')}
              </Button>
              <Button
                type="button"
                className="h-11 rounded-lg bg-brand text-bg-base hover:bg-brand/90"
                onClick={() => void saveDecision(ACCEPTED_CATEGORIES, 'accept_all')}
              >
                {t('cookie_consent.actions.accept_all')}
              </Button>
            </div>
          </div>
        </section>
      )}

      <Dialog open={isPreferencesOpen} onOpenChange={setIsPreferencesOpen}>
        <DialogContent className="border-white/10 bg-bg-base text-white sm:max-w-2xl" closeLabel={t('common.close')}>
          <DialogHeader>
            <DialogTitle>{t('cookie_consent.dialog.title')}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {t('cookie_consent.dialog.body')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">{categoryLabels.necessary.title}</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">{categoryLabels.necessary.body}</p>
                </div>
                <span className="rounded border border-brand/30 bg-brand/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand">
                  {t('cookie_consent.categories.required')}
                </span>
              </div>
            </div>

            {OPTIONAL_CATEGORIES.map((category) => (
              <div key={category} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">{categoryLabels[category].title}</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-400">{categoryLabels[category].body}</p>
                  </div>
                  <Switch
                    checked={draft[category]}
                    onCheckedChange={(checked) => updateDraft(category, checked)}
                    aria-label={categoryLabels[category].title}
                  />
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="gap-2 sm:space-x-0">
            <Button
              type="button"
              variant="secondary"
              className="rounded-lg border border-white/15 bg-transparent text-white hover:bg-white/10"
              onClick={() => void saveDecision(DENIED_OPTIONAL_CATEGORIES, 'reject_all')}
            >
              {t('cookie_consent.actions.reject_all')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="rounded-lg border border-white/15 bg-transparent text-white hover:bg-white/10"
              onClick={() => void saveDecision(draft, 'save_preferences')}
            >
              {t('cookie_consent.actions.save')}
            </Button>
            <Button
              type="button"
              className="rounded-lg bg-brand text-bg-base hover:bg-brand/90"
              onClick={() => void saveDecision(ACCEPTED_CATEGORIES, 'accept_all')}
            >
              {t('cookie_consent.actions.accept_all')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
