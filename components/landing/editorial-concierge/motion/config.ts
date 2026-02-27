import { type Variants, type Transition } from 'framer-motion';

export const PREMIUM_SPRING: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
  mass: 1,
  restDelta: 0.001
};

export const SMOOTH_SPRING: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 30,
  restDelta: 0.001
};

export const FADE_UP: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.21, 0.45, 0.32, 0.9]
    }
  }
};

export const STAGGER_CONTAINER: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const BENTO_HOVER = {
  whileHover: { scale: 0.985 },
  whileTap: { scale: 0.97 },
  transition: PREMIUM_SPRING
};

export const IMAGE_ZOOM: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] }
  }
};
