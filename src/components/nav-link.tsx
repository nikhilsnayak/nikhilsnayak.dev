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
    <div className='relative'>
      <Link
        {...props}
        href={href}
        className={cn(
          'press focus-ring inline-block font-semibold transition-transform',
          className,
        )}
      />
      {isActive ? (
        <ViewTransition name='active-indicator'>
          <div className='bg-primary absolute right-0 -bottom-1 left-0 h-[2px]' />
        </ViewTransition>
      ) : null}
    </div>
  );
}
