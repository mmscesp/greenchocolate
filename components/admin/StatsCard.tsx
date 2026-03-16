import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ComponentType } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  trend?: string;
  color?: 'green' | 'blue' | 'purple' | 'orange' | 'default';
  className?: string;
}

const colorStyles = {
  green: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400',
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
  },
  orange: {
    bg: 'bg-brand/10 dark:bg-brand/20',
    text: 'text-brand dark:text-brand-light',
  },
  default: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
  }
};

export function StatsCard({ title, value, icon: Icon, trend, color = 'default', className }: StatsCardProps) {
  const styles = colorStyles[color];

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex items-start justify-between gap-3 space-y-0 pb-2 sm:flex-row sm:items-center">
        <CardTitle className="pr-2 text-sm font-medium leading-snug text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("rounded-full p-2", styles.bg, styles.text)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="break-words text-2xl font-bold">{value}</div>
        {trend && (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
