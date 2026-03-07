"use client"

import { useState, useEffect, useRef, useCallback } from "react"

type MotionPathWindow = Window &
  typeof globalThis & {
    gsap?: {
      registerPlugin: (plugin: unknown) => void
      timeline: (config?: Record<string, unknown>) => {
        set: (target: SVGCircleElement, vars: Record<string, unknown>) => {
          to: (target: SVGCircleElement, vars: Record<string, unknown>) => unknown
        }
        to: (target: SVGCircleElement, vars: Record<string, unknown>) => unknown
      }
    }
    MotionPathPlugin?: unknown
  }

const GALLERY_GAP = 10
const GALLERY_CIRCLE_RADIUS = 7
const GALLERY_DEFAULTS = { transformOrigin: "center center" }
const GALLERY_DURATION = 0.4
const GALLERY_WIDTH = 400
const GALLERY_HEIGHT = 400
const GALLERY_SCALE = 700
const GALLERY_BIG_SIZE = GALLERY_CIRCLE_RADIUS * GALLERY_SCALE
const GALLERY_OVERLAP = 0

function getPosSmall(id: number, total: number) {
  return {
    cx:
      GALLERY_WIDTH / 2 -
      (total * (GALLERY_CIRCLE_RADIUS * 2 + GALLERY_GAP) - GALLERY_GAP) / 2 +
      id * (GALLERY_CIRCLE_RADIUS * 2 + GALLERY_GAP),
    cy: GALLERY_HEIGHT - 30,
    r: GALLERY_CIRCLE_RADIUS,
  }
}

function getPosSmallAbove(id: number, total: number) {
  return {
    cx:
      GALLERY_WIDTH / 2 -
      (total * (GALLERY_CIRCLE_RADIUS * 2 + GALLERY_GAP) - GALLERY_GAP) / 2 +
      id * (GALLERY_CIRCLE_RADIUS * 2 + GALLERY_GAP),
    cy: GALLERY_HEIGHT / 2,
    r: GALLERY_CIRCLE_RADIUS * 2,
  }
}

function getPosCenter() {
  return { cx: GALLERY_WIDTH / 2, cy: GALLERY_HEIGHT / 2, r: GALLERY_CIRCLE_RADIUS * 7 }
}

function getPosEnd() {
  return { cx: GALLERY_WIDTH / 2 - GALLERY_BIG_SIZE + GALLERY_OVERLAP, cy: GALLERY_HEIGHT / 2, r: GALLERY_BIG_SIZE }
}

function getPosStart() {
  return { cx: GALLERY_WIDTH / 2 + GALLERY_BIG_SIZE - GALLERY_OVERLAP, cy: GALLERY_HEIGHT / 2, r: GALLERY_BIG_SIZE }
}

export interface CircularGalleryImage {
  title: string
  url: string
}

interface ImageGalleryProps {
  images: CircularGalleryImage[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [opened, setOpened] = useState(0)
  const [inPlace, setInPlace] = useState(0)
  const [disabled, setDisabled] = useState(false)
  const [gsapReady, setGsapReady] = useState(false)
  const autoplayTimer = useRef<number | null>(null)

  useEffect(() => {
    const motionWindow = window as MotionPathWindow

    const loadScripts = () => {
      if (motionWindow.gsap && motionWindow.MotionPathPlugin) {
        motionWindow.gsap.registerPlugin(motionWindow.MotionPathPlugin)
        setGsapReady(true)
        return
      }
      const gsapScript = document.createElement("script")
      gsapScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
      gsapScript.onload = () => {
        const motionPathScript = document.createElement("script")
        motionPathScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/MotionPathPlugin.min.js"
        motionPathScript.onload = () => {
          if (motionWindow.gsap && motionWindow.MotionPathPlugin) {
            motionWindow.gsap.registerPlugin(motionWindow.MotionPathPlugin)
            setGsapReady(true)
          }
        }
        document.body.appendChild(motionPathScript)
      }
      document.body.appendChild(gsapScript)
    }
    loadScripts()
  }, [])

  const onClick = (index: number) => {
    if (!disabled && index !== opened) {
      setDisabled(true)
      setOpened(index)
    }
  }

  const onInPlace = (index: number) => {
    setInPlace(index)
    setDisabled(false)
  }

  const next = useCallback(() => {
    if (images.length <= 1) return
    setDisabled(true)
    setOpened((currentOpened) => {
      let nextIndex = currentOpened + 1
      if (nextIndex >= images.length) nextIndex = 0
      return nextIndex
    })
  }, [images.length])

  const prev = useCallback(() => {
    if (images.length <= 1) return
    setDisabled(true)
    setOpened((currentOpened) => {
      let prevIndex = currentOpened - 1
      if (prevIndex < 0) prevIndex = images.length - 1
      return prevIndex
    })
  }, [images.length])

  useEffect(() => {
    if (!gsapReady || images.length <= 1) return
    if (autoplayTimer.current) clearInterval(autoplayTimer.current)
    autoplayTimer.current = window.setInterval(next, 4500)
    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current)
    }
  }, [opened, gsapReady, next, images.length])

  if (!images || images.length === 0) return null;

  return (
    <div className="relative flex w-full items-center justify-center py-6 sm:py-8">
      <div className="relative aspect-square w-full max-w-[min(88vw,640px)] overflow-hidden rounded-[2rem] border border-white/5 bg-bg-surface/70 shadow-2xl sm:max-w-[min(82vw,720px)]">
        {gsapReady &&
          images.map((image, i) => (
            <div
              key={image.url + i}
              className="absolute left-0 top-0 h-full w-full"
              style={{ zIndex: inPlace === i ? i : images.length + 1 }}
            >
              <GalleryImage
                total={images.length}
                id={i}
                url={image.url}
                title={image.title}
                open={opened === i}
                inPlace={inPlace === i}
                onInPlace={onInPlace}
              />
            </div>
          ))}
        <div className="absolute left-0 top-0 z-[100] h-full w-full pointer-events-none">
          <Tabs images={images} onSelect={onClick} />
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 z-[101] flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-bg-base/75 text-white shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:border-brand/40 hover:bg-bg-surface disabled:opacity-40 sm:left-3 sm:h-14 sm:w-14 lg:-left-3"
            onClick={prev}
            disabled={disabled}
            aria-label="Previous Image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            className="absolute right-2 top-1/2 z-[101] flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-bg-base/75 text-white shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:border-brand/40 hover:bg-bg-surface disabled:opacity-40 sm:right-3 sm:h-14 sm:w-14 lg:-right-3"
            onClick={next}
            disabled={disabled}
            aria-label="Next Image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </>
      )}
    </div>
  )
}

interface GalleryImageProps {
  url: string; title: string; open: boolean; inPlace: boolean; id: number; onInPlace: (id: number) => void; total: number;
}

function GalleryImage({ url, title, open, inPlace, id, onInPlace, total }: GalleryImageProps) {
  const firstLoadRef = useRef(true)
  const clip = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const motionWindow = window as MotionPathWindow
    const gsap = motionWindow.gsap
    if (!gsap || !clip.current) return
    const isFirstLoad = firstLoadRef.current
    const flipDuration = isFirstLoad ? 0 : GALLERY_DURATION
    const upDuration = isFirstLoad ? 0 : 0.2
    const bounceDuration = isFirstLoad ? 0.01 : 1
    const delay = isFirstLoad ? 0 : flipDuration + upDuration

    if (open) {
      gsap.timeline().set(clip.current, { ...GALLERY_DEFAULTS, ...getPosSmall(id, total) })
        .to(clip.current, { ...GALLERY_DEFAULTS, ...getPosCenter(), duration: upDuration, ease: "power3.inOut" })
        .to(clip.current, { ...GALLERY_DEFAULTS, ...getPosEnd(), duration: flipDuration, ease: "power4.in", onComplete: () => onInPlace(id) })
    } else {
      gsap.timeline({ overwrite: true }).set(clip.current, { ...GALLERY_DEFAULTS, ...getPosStart() })
        .to(clip.current, { ...GALLERY_DEFAULTS, ...getPosCenter(), delay: delay, duration: flipDuration, ease: "power4.out" })
        .to(clip.current, { ...GALLERY_DEFAULTS, motionPath: { path: [getPosSmallAbove(id, total), getPosSmall(id, total)], curviness: 1 }, duration: bounceDuration, ease: "bounce.out" })
    }

    firstLoadRef.current = false
  }, [open, id, onInPlace, total])

  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox={`0 0 ${GALLERY_WIDTH} ${GALLERY_HEIGHT}`} preserveAspectRatio="xMidYMid meet" className="h-full w-full">
      <defs>
        <clipPath id={`${id}_circleClip`}><circle className="clip" cx="0" cy="0" r={GALLERY_CIRCLE_RADIUS} ref={clip}></circle></clipPath>
        <clipPath id={`${id}_squareClip`}><rect className="clip" width={GALLERY_WIDTH} height={GALLERY_HEIGHT}></rect></clipPath>
      </defs>
      <g clipPath={`url(#${id}${inPlace ? "_squareClip" : "_circleClip"})`}><image width={GALLERY_WIDTH} height={GALLERY_HEIGHT} href={url} className="pointer-events-none object-cover" preserveAspectRatio="xMidYMid meet"></image></g>
    </svg>
  )
}

function Tabs({ images, onSelect }: { images: CircularGalleryImage[], onSelect: (index: number) => void }) {
  const getPosX = (i: number) => GALLERY_WIDTH / 2 - (images.length * (GALLERY_CIRCLE_RADIUS * 2 + GALLERY_GAP) - GALLERY_GAP) / 2 + i * (GALLERY_CIRCLE_RADIUS * 2 + GALLERY_GAP)
  const getPosY = () => GALLERY_HEIGHT - 30
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox={`0 0 ${GALLERY_WIDTH} ${GALLERY_HEIGHT}`} preserveAspectRatio="xMidYMid meet" className="h-full w-full">
      {images.map((image, i) => (
        <g key={image.url + i} className="pointer-events-auto">
          <defs><clipPath id={`tab_${i}_clip`}><circle cx={getPosX(i)} cy={getPosY()} r={GALLERY_CIRCLE_RADIUS} /></clipPath></defs>
          <image x={getPosX(i) - GALLERY_CIRCLE_RADIUS} y={getPosY() - GALLERY_CIRCLE_RADIUS} width={GALLERY_CIRCLE_RADIUS * 2} height={GALLERY_CIRCLE_RADIUS * 2} href={image.url} clipPath={`url(#tab_${i}_clip)`} className="pointer-events-none object-cover" preserveAspectRatio="xMidYMid meet" />
          <circle onClick={() => onSelect(i)} className="cursor-pointer fill-white/0 stroke-white/70 hover:stroke-white/100 transition-all" strokeWidth="2" cx={getPosX(i)} cy={getPosY()} r={GALLERY_CIRCLE_RADIUS + 2} />
        </g>
      ))}
    </svg>
  )
}
