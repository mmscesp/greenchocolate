'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const AtmosphericCanvas = dynamic(
  () => import('@/components/AtmosphericCanvas').then((module) => module.AtmosphericCanvas),
  { ssr: false }
);

export default function EditorialConciergeEnhancements() {
  const [shouldRenderCanvas, setShouldRenderCanvas] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || shouldRenderCanvas) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setShouldRenderCanvas(true);
          observer.disconnect();
          break;
        }
      },
      {
        root: null,
        rootMargin: '800px 0px',
        threshold: 0.01,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [shouldRenderCanvas]);

  return (
    <div ref={sentinelRef} className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      {shouldRenderCanvas ? <AtmosphericCanvas className="h-full" /> : null}
    </div>
  );
}
