'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { getReducedMotionProps } from '@/lib/motion';

interface RouteTransitionProps {
  children: React.ReactNode;
}

export default function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const transition = getReducedMotionProps(shouldReduceMotion);

  return (
    // [motion]
    <AnimatePresence mode="wait" initial={false}>
      {/* [motion] */}
      <motion.div
        key={pathname}
        initial={transition.initial}
        animate={transition.animate}
        exit={transition.exit}
        transition={transition.transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
