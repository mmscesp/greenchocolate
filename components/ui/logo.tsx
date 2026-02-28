'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'mega';
  showText?: boolean;
  href?: string;
  imageClassName?: string;
  priority?: boolean;
}

const sizeConfig = {
  sm: { width: 32, height: 32, iconClass: 'h-6 w-6' },
  md: { width: 40, height: 40, iconClass: 'h-8 w-8' },
  lg: { width: 48, height: 48, iconClass: 'h-10 w-10' },
  xl: { width: 64, height: 64, iconClass: 'h-16 w-16' },
  mega: { width: 96, height: 96, iconClass: 'h-24 w-24' },
};

export function Logo({ 
  className, 
  size = 'md', 
  showText = true,
  href = '/',
  imageClassName,
  priority = false,
}: LogoProps) {
  const config = sizeConfig[size];

  const logoContent = (
    <>
      <div className={cn('relative shrink-0', config.iconClass)}>
        <Image
          src="/images/SCM_Logo_OG.svg"
          alt="SocialClubsMaps Logo"
          width={config.width}
          height={config.height}
          className={cn('object-contain', imageClassName)}
          priority={priority}
        />
      </div>
      {showText && (
        <span className="text-xl font-bold text-foreground whitespace-nowrap">
          SocialClubsMaps
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link 
        href={href} 
        className={cn('flex items-center gap-2 group', className)}
      >
        {logoContent}
      </Link>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {logoContent}
    </div>
  );
}

export function LogoIcon({ 
  className, 
  size = 'md',
  priority = false,
}: { 
  className?: string; 
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'mega';
  priority?: boolean;
}) {
  const config = sizeConfig[size];

  return (
    <div className={cn('relative shrink-0', config.iconClass, className)}>
      <Image
        src="/images/SCM_Logo_OG.svg"
        alt="SocialClubsMaps Logo"
        width={config.width}
        height={config.height}
        className="object-contain"
        priority={priority}
      />
    </div>
  );
}

export default Logo;
