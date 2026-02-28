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
  const [shouldRender, setShouldRender] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || shouldRender) return;

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
        rootMargin: '600px 0px',
        threshold: 0.01,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [shouldRender]);

  return (
    <div ref={sentinelRef}>
      {shouldRender ? (
        <AtmosphericCanvas>
          <EditorialConciergeFlow />
        </AtmosphericCanvas>
      ) : (
        <div className="min-h-[40vh]" aria-hidden="true" />
      )}
    </div>
  );
}
