'use client';

import type { ComponentPropsWithoutRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { zoro } from '~/assets/images';

import { cn } from '~/lib/utils';

type NavLinkProps = ComponentPropsWithoutRef<typeof Link>;

export function NavLink({ className, href, ...props }: NavLinkProps) {
  const path = usePathname();

  return (
    <Link
      {...props}
      href={href}
      className={cn(
        'font-semibold transition-all after:block after:h-[2px] after:w-full after:bg-transparent after:transition-all',
        path === href && 'dark:after:bg-theme after:bg-current',
        className
      )}
    />
  );
}

export function BotLink() {
  const path = usePathname();

  return (
    <Link href='/bot'>
      <Image
        src={zoro}
        alt='bot-icon'
        className={cn(
          'inline-block w-6 rounded-full ring-2 ring-green-200 transition-all',
          path === '/bot' && 'ring-green-500'
        )}
        priority
      />
    </Link>
  );
}
