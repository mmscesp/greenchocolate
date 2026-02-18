'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  href?: string;
  imageClassName?: string;
}

const sizeConfig = {
  sm: { width: 32, height: 32, iconClass: 'h-6 w-6' },
  md: { width: 40, height: 40, iconClass: 'h-8 w-8' },
  lg: { width: 48, height: 48, iconClass: 'h-10 w-10' },
  xl: { width: 64, height: 64, iconClass: 'h-12 w-12' },
};

export function Logo({ 
  className, 
  size = 'md', 
  showText = true,
  href = '/',
  imageClassName
}: LogoProps) {
  const config = sizeConfig[size];

  const logoContent = (
    <>
      <div className={cn('relative shrink-0', config.iconClass)}>
        <Image
          src="/images/SCM_Logo_OG.jpeg"
          alt="SocialClubsMaps Logo"
          width={config.width}
          height={config.height}
          className={cn('object-contain rounded-lg', imageClassName)}
          priority
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
  size = 'md' 
}: { 
  className?: string; 
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const config = sizeConfig[size];

  return (
    <div className={cn('relative shrink-0', config.iconClass, className)}>
      <Image
        src="/images/SCM_Logo_OG.jpeg"
        alt="SocialClubsMaps Logo"
        width={config.width}
        height={config.height}
        className="object-contain rounded-lg"
        priority
      />
    </div>
  );
}

export default Logo;
