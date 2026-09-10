'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { ViewTransition, type ComponentPropsWithoutRef } from 'react';

import { cn } from '~/lib/utils';

type NavLinkProps = ComponentPropsWithoutRef<typeof Link>;

export function NavLink({ className, href, ...props }: NavLinkProps) {
  const segment = useSelectedLayoutSegment();
  const hrefStr = typeof href === 'string' ? href : href.href || '';
  const isActive = hrefStr === (segment === null ? '/' : `/${segment}`);

  return (
    <Link
      {...props}
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'focus-ring inline-flex min-h-10 items-center gap-2 font-mono text-xs transition-colors hover:text-foreground',
        isActive ? 'text-foreground' : 'text-muted-foreground',
        className,
      )}
    >
      <span className='relative size-1 shrink-0' aria-hidden='true'>
        {isActive && (
          <ViewTransition name='nav-dot' share='nav-dot' default='none'>
            <span className='bg-primary absolute inset-0 rounded-full' />
          </ViewTransition>
        )}
      </span>
      {props.children}
    </Link>
  );
}
