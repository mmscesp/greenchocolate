import { CheckCircle, Shield, Award } from '@/lib/icons';
import { Badge } from './ui/badge';

interface VerificationBadgeProps {
  isVerified: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'premium';
}

export default function VerificationBadge({ 
  isVerified, 
  size = 'md', 
  showText = true,
  variant = 'default'
}: VerificationBadgeProps) {
  if (!isVerified) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1', 
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  };

  const Icon = variant === 'premium' ? Award : Shield;
  const badgeVariant = variant === 'premium' ? 'premium' : 'verified';

  return (
    <Badge 
      variant={badgeVariant} 
      className={`flex items-center gap-1 ${sizeClasses[size]} shadow-lg animate-pulse hover:animate-none transition-all duration-300 hover:scale-105`}
      style={{ animationDuration: '6s' }}
    >
      <Icon className={`${iconSizes[size]} animate-pulse`} style={{ animationDuration: '6s' }} />
      {showText && (variant === 'premium' ? 'Club Premium' : 'Verificado')}
    </Badge>
  );
}