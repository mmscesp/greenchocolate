export const MOTION_EASE_IN = [0.25, 0.1, 0.25, 1] as const;
export const MOTION_EASE_OUT = [0.4, 0, 1, 0.2] as const;

export const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: 0.4, ease: MOTION_EASE_IN },
} as const;

export const STAGGER_CONTAINER = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

export const STAGGER_ITEM = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
    },
  },
} as const;

export const SECTION_HEADING_REVEAL = {
  hidden: { opacity: 0, x: -8 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: MOTION_EASE_IN,
    },
  },
} as const;

export const DIVIDER_REVEAL = {
  hidden: { opacity: 0, scaleX: 0 },
  show: {
    opacity: 1,
    scaleX: 1,
    transition: {
      duration: 0.4,
      ease: MOTION_EASE_IN,
    },
  },
} as const;

export function getReducedMotionProps(reducedMotion: boolean) {
  if (!reducedMotion) {
    return PAGE_TRANSITION;
  }

  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: MOTION_EASE_IN },
  } as const;
}
