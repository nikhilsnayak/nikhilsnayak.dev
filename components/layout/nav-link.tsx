'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentPropsWithoutRef } from 'react';

interface NavLinkProps extends ComponentPropsWithoutRef<typeof Link> {}

export function NavLink({ className, href, ...props }: NavLinkProps) {
  const path = usePathname();

  return (
    <Link
      {...props}
      href={href}
      className={cn(
        'font-semibold transition-all after:block after:h-[2px] after:w-full after:bg-transparent after:transition-all hover:text-foreground/50',
        path === href && 'after:bg-current after:dark:bg-fluorescent',
        className
      )}
    />
  );
}
