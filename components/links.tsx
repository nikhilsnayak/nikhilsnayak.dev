'use client';

import type { ComponentPropsWithoutRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { zoro } from '~/assets/images';
import { Link } from 'next-view-transitions';

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
        path === href && 'after:bg-current after:dark:bg-fluorescent',
        className
      )}
    />
  );
}

export function BotLink() {
  const path = usePathname();

  return (
    <Link href='/bot' className='space-x-1 rounded-full border'>
      <Image
        src={zoro}
        alt='bot-icon'
        className={cn(
          'inline-block h-6 w-auto rounded-full ring-2 transition-all',
          path === '/bot' && 'ring-green-500'
        )}
        priority
      />
    </Link>
  );
}

export function SourceLink() {
  const path = usePathname();
  const parts = path.split('/').slice(1);

  const isBlogPage = parts.at(-2) === 'blogs';

  let href = 'https://github.com/nikhilsnayak/nikhilsnayak.dev';

  if (isBlogPage) {
    href = `${href}/blob/main/content/${parts.at(-1)}.mdx`;
  } else {
    const combinedParts = parts.join('/');
    href = `${href}/blob/main/app/${combinedParts ? `${combinedParts}/` : ''}page.tsx`;
  }

  return (
    <a
      href={href}
      className='block tracking-tighter underline dark:text-fluorescent'
      target='_blank'
      rel='noopener noreferrer'
      aria-label='source code'
    >
      view source
    </a>
  );
}
