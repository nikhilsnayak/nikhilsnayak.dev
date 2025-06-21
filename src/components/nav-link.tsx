'use client';

import type { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';

import { cn } from '~/lib/utils';

type NavLinkProps = ComponentPropsWithoutRef<typeof Link>;

export function NavLink({ className, href, ...props }: NavLinkProps) {
  const path = usePathname();
  const isActive =
    path === href || (href !== '/' && path.startsWith(href + '/'));

  return (
    <motion.div layout className='relative'>
      <Link {...props} href={href} className={cn('font-semibold', className)} />
      {isActive ? (
        <motion.div
          layoutId='active-indicator'
          className='dark:bg-theme absolute right-0 -bottom-1 left-0 h-[2px] bg-current'
        />
      ) : null}
    </motion.div>
  );
}
