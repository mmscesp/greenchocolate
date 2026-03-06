'use client';

import { useEffect, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';

const STORAGE_PREFIX = 'scm:scroll:';

export default function ScrollRestoration() {
  const pathname = usePathname();
  const restoreOnNextRouteRef = useRef(false);

  const routeKey = useMemo(() => pathname, [pathname]);

  useEffect(() => {
    const previousMode = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    const onPopState = () => {
      restoreOnNextRouteRef.current = true;
    };

    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
      window.history.scrollRestoration = previousMode;
    };
  }, []);

  useEffect(() => {
    const query = typeof window !== 'undefined' ? window.location.search : '';
    const storageKey = `${STORAGE_PREFIX}${routeKey}${query}`;

    const savePosition = () => {
      window.sessionStorage.setItem(storageKey, String(window.scrollY));
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(() => {
        savePosition();
        ticking = false;
      });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        savePosition();
      }
    };

    let firstFrame = 0;
    let secondFrame = 0;
    const shouldRestore = restoreOnNextRouteRef.current;
    restoreOnNextRouteRef.current = false;

    if (shouldRestore && !window.location.hash) {
      const savedValue = window.sessionStorage.getItem(storageKey);
      const savedY = Number(savedValue);

      if (Number.isFinite(savedY)) {
        firstFrame = window.requestAnimationFrame(() => {
          secondFrame = window.requestAnimationFrame(() => {
            window.scrollTo({ top: savedY, left: 0, behavior: 'auto' });
          });
        });
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pagehide', savePosition);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pagehide', savePosition);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      savePosition();
    };
  }, [routeKey]);

  return null;
}
