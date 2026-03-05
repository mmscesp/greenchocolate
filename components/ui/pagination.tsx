import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from '@/lib/icons';

import { cn } from '@/lib/utils';
import { type ButtonProps, buttonVariants } from '@/components/ui/button';

interface PaginationLabels {
  navAriaLabel?: string;
  previousAriaLabel?: string;
  previousLabel?: string;
  nextAriaLabel?: string;
  nextLabel?: string;
  morePagesSr?: string;
}

const defaultPaginationLabels: Required<PaginationLabels> = {
  navAriaLabel: 'pagination',
  previousAriaLabel: 'Go to previous page',
  previousLabel: 'Previous',
  nextAriaLabel: 'Go to next page',
  nextLabel: 'Next',
  morePagesSr: 'More pages',
};

const Pagination = ({ className, ariaLabel, ...props }: React.ComponentProps<'nav'> & { ariaLabel?: string }) => (
  <nav
    role="navigation"
    aria-label={ariaLabel || defaultPaginationLabels.navAriaLabel}
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>;

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'secondary' : 'ghost',
        size,
      }),
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  className,
  labels,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { labels?: PaginationLabels }) => (
  <PaginationLink
    aria-label={labels?.previousAriaLabel || defaultPaginationLabels.previousAriaLabel}
    size="md"
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>{labels?.previousLabel || defaultPaginationLabels.previousLabel}</span>
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
  className,
  labels,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { labels?: PaginationLabels }) => (
  <PaginationLink
    aria-label={labels?.nextAriaLabel || defaultPaginationLabels.nextAriaLabel}
    size="md"
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>{labels?.nextLabel || defaultPaginationLabels.nextLabel}</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
  className,
  srText,
  ...props
}: React.ComponentProps<'span'> & { srText?: string }) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">{srText || defaultPaginationLabels.morePagesSr}</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
