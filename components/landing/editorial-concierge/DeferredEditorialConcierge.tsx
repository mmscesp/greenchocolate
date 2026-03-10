'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const AtmosphericCanvas = dynamic(
  () => import('@/components/AtmosphericCanvas').then((module) => module.AtmosphericCanvas),
  { ssr: false }
);

const EditorialConciergeFlow = dynamic(
  () => import('@/components/landing/editorial-concierge/EditorialConciergeFlow'),
  { ssr: false }
);

export default function DeferredEditorialConcierge() {
  const [canHydrate, setCanHydrate] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const enableHydration = () => {
      setCanHydrate((current) => (current ? current : true));
    };

    const handleScrollIntent = () => {
      if (window.scrollY > Math.max(120, window.innerHeight * 0.12)) {
        enableHydration();
      }
    };

    const handlePointerIntent = () => {
      enableHydration();
    };

    window.addEventListener('scroll', handleScrollIntent, { passive: true });
    window.addEventListener('wheel', handlePointerIntent, { passive: true, once: true });
    window.addEventListener('touchstart', handlePointerIntent, { passive: true, once: true });

    handleScrollIntent();

    return () => {
      window.removeEventListener('scroll', handleScrollIntent);
      window.removeEventListener('wheel', handlePointerIntent);
      window.removeEventListener('touchstart', handlePointerIntent);
    };
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!canHydrate || !sentinel || shouldRender) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setShouldRender(true);
          observer.disconnect();
          break;
        }
      },
      {
        root: null,
        rootMargin: '80px 0px',
        threshold: 0.01,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [canHydrate, shouldRender]);

  return (
    <div ref={sentinelRef}>
      {shouldRender ? (
        <AtmosphericCanvas>
          <EditorialConciergeFlow />
        </AtmosphericCanvas>
      ) : (
        <div className="min-h-[28vh] md:min-h-[40vh]" aria-hidden="true" />
      )}
    </div>
  );
}
