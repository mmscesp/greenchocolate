'use client';

import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

interface LinkCardProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description: string;
  imageUrl: string;
  href?: string;
}

const cardVariants = {
  initial: { scale: 1, y: 0 },
  hover: {
    scale: 1.03,
    y: -5,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15,
    },
  },
} as const;

const LinkCard = React.forwardRef<HTMLElement, LinkCardProps>(
  ({ className, title, description, imageUrl, href, ...props }, ref) => {
    const sharedClassName = cn(
      'group relative flex h-80 w-full flex-col justify-between overflow-hidden rounded-[28px]',
      'border border-white/10 bg-bg-card/80 p-6 text-white shadow-[0_24px_80px_-32px_rgba(0,0,0,0.65)] backdrop-blur-md',
      'transition-colors duration-300 hover:border-brand/40',
      href && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
      className
    );

    const content = (
      <>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(199,244,76,0.14),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_46%)] opacity-100 transition-opacity duration-300 group-hover:opacity-90" />

        <div className="relative z-10 max-w-[72%]">
          <h3 className="mb-3 font-serif text-[1.9rem] font-medium leading-[1.02] tracking-tight text-white md:text-[2.1rem]">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-zinc-300">
            {description}
          </p>
        </div>

        <div className="pointer-events-none absolute -bottom-4 -right-4 h-52 w-52 translate-x-1/4 translate-y-1/4 transform md:h-56 md:w-56">
          <motion.div
            className="relative h-full w-full transition-transform duration-300 ease-out group-hover:scale-110"
            whileHover={{ rotate: -3 }}
          >
            <Image
              src={imageUrl}
              alt={`${title} illustration`}
              fill
              sizes="(min-width: 1024px) 224px, (min-width: 768px) 208px, 192px"
              className="object-contain object-bottom-right"
            />
          </motion.div>
        </div>
      </>
    );

    if (href) {
      return (
        <motion.a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={sharedClassName}
          variants={cardVariants}
          initial="initial"
          whileHover="hover"
          aria-label={`Link to ${title}`}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.article
        ref={ref as React.Ref<HTMLElement>}
        className={sharedClassName}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        aria-label={title}
        {...props}
      >
        {content}
      </motion.article>
    );
  }
);

LinkCard.displayName = 'LinkCard';

export { LinkCard };
