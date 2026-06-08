"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';
import { ChevronLeft, ChevronRight, Maximize } from '@/lib/icons';
import { cn } from '@/lib/utils';

export interface CircularGalleryImage {
  title: string
  url: string
}

interface ImageGalleryProps {
  images: CircularGalleryImage[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const { t } = useLanguage()
  const shouldReduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const autoplayTimer = useRef<number | null>(null)
  const hasMultipleImages = images.length > 1
  const translate = (key: string, fallback: string) => {
    const value = t(key)
    return value === key ? fallback : value
  }

  const goTo = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const next = useCallback(() => {
    if (!hasMultipleImages) return
    setActiveIndex((currentIndex) => (currentIndex + 1) % images.length)
  }, [hasMultipleImages, images.length])

  const prev = useCallback(() => {
    if (!hasMultipleImages) return
    setActiveIndex((currentIndex) => (currentIndex - 1 + images.length) % images.length)
  }, [hasMultipleImages, images.length])

  useEffect(() => {
    if (!hasMultipleImages) return
    if (autoplayTimer.current) clearInterval(autoplayTimer.current)
    autoplayTimer.current = window.setInterval(next, 5500)
    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current)
    }
  }, [activeIndex, hasMultipleImages, next])

  if (!images || images.length === 0) return null

  const activeImage = images[activeIndex] ?? images[0]

  return (
    <div className="relative flex w-full items-center justify-center py-6 sm:py-8">
      <div className="relative aspect-[4/3] w-full max-w-[min(92vw,760px)] overflow-hidden rounded-[1.5rem] border border-white/8 bg-bg-surface/70 shadow-2xl sm:aspect-[16/11] sm:rounded-[2rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeImage.url}
            className="absolute inset-0"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Image
              src={activeImage.url}
              alt={activeImage.title}
              fill
              sizes="(max-width: 768px) 92vw, 760px"
              className="object-cover"
              priority={activeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />

        <button
          type="button"
          onClick={() => setFullscreenOpen(true)}
          aria-label={translate('gallery.open_fullscreen', 'Open fullscreen gallery')}
          className="absolute right-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-black/70 text-white shadow-xl backdrop-blur-md transition hover:border-brand/45 hover:bg-black/85 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Maximize className="h-5 w-5" />
        </button>

        {hasMultipleImages ? (
          <>
            <button
              type="button"
              className="absolute left-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/14 bg-black/70 text-white shadow-xl backdrop-blur-md transition hover:border-brand/45 hover:bg-black/85 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:h-12 sm:w-12"
              onClick={prev}
              aria-label={translate('gallery.previous_image', 'Previous image')}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/14 bg-black/70 text-white shadow-xl backdrop-blur-md transition hover:border-brand/45 hover:bg-black/85 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:h-12 sm:w-12"
              onClick={next}
              aria-label={translate('gallery.next_image', 'Next image')}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-center gap-2">
              {images.map((image, index) => (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  aria-label={`${translate('gallery.image', 'Image')} ${index + 1}`}
                  onClick={() => goTo(index)}
                  className={cn(
                    'h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                    index === activeIndex ? 'w-8 bg-brand' : 'w-2.5 bg-white/55 hover:bg-white/80'
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <DialogContent
          closeLabel={translate('common.close', 'Close')}
          className="h-[calc(100dvh-1rem)] max-h-none w-[calc(100vw-1rem)] max-w-none overflow-hidden rounded-[1.5rem] border-white/10 bg-[#05070b] p-0 text-white shadow-[0_30px_100px_rgba(0,0,0,0.82)] sm:h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)] sm:rounded-[2rem] [&>button]:right-4 [&>button]:top-4 [&>button]:z-[80] [&>button]:inline-flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border [&>button]:border-white/14 [&>button]:bg-black/72 [&>button]:text-white [&>button]:opacity-100 [&>button]:shadow-xl [&>button]:backdrop-blur-md [&>button]:hover:border-brand/45 [&>button]:hover:bg-black/88 [&>button]:hover:text-brand [&>button]:focus:ring-brand [&>button_svg]:h-5 [&>button_svg]:w-5 sm:[&>button]:right-6 sm:[&>button]:top-6"
        >
          <DialogTitle className="sr-only">
            {translate('gallery.fullscreen_title', 'Image gallery')}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {activeImage.title}
          </DialogDescription>

          <div className="relative h-full w-full overflow-hidden bg-black">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`fullscreen-${activeImage.url}`}
                className="absolute inset-0"
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.995 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Image
                  src={activeImage.url}
                  alt={activeImage.title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />

            {hasMultipleImages ? (
              <>
                <button
                  type="button"
                  className="absolute left-4 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/14 bg-black/70 text-white shadow-xl backdrop-blur-md transition hover:border-brand/45 hover:bg-black/85 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:left-6 sm:h-14 sm:w-14"
                  onClick={prev}
                  aria-label={translate('gallery.previous_image', 'Previous image')}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/14 bg-black/70 text-white shadow-xl backdrop-blur-md transition hover:border-brand/45 hover:bg-black/85 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:right-6 sm:h-14 sm:w-14"
                  onClick={next}
                  aria-label={translate('gallery.next_image', 'Next image')}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            ) : null}

            <div className="absolute inset-x-4 bottom-5 z-20 flex flex-col items-center gap-3">
              {hasMultipleImages ? (
                <div className="flex items-center justify-center gap-2">
                  {images.map((image, index) => (
                    <button
                      key={`fullscreen-${image.url}-${index}`}
                      type="button"
                      aria-label={`${translate('gallery.image', 'Image')} ${index + 1}`}
                      onClick={() => goTo(index)}
                      className={cn(
                        'h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                        index === activeIndex ? 'w-10 bg-brand' : 'w-3 bg-white/45 hover:bg-white/80'
                      )}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
