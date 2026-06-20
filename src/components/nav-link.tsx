'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ViewTransition, type ComponentPropsWithoutRef } from 'react';

import { cn } from '~/lib/utils';

type NavLinkProps = ComponentPropsWithoutRef<typeof Link>;

export function NavLink({ className, href, ...props }: NavLinkProps) {
  const path = usePathname();
  const hrefStr = typeof href === 'string' ? href : href.href || '';
  const isActive = path === hrefStr || (hrefStr !== '/' && path.startsWith(hrefStr + '/'));

  return (
    <div className='relative'>
      <Link {...props} href={href} className={cn('font-semibold', className)} />
      {isActive ? (
        <ViewTransition name='active-indicator'>
          <div className='dark:bg-accent absolute right-0 -bottom-1 left-0 h-[2px] bg-current' />
        </ViewTransition>
      ) : null}
    </div>
  );
}
