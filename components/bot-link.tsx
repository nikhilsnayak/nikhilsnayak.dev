'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { zoro } from '@/assets/images';

import { cn } from '@/lib/utils';

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
      <span className='px-2'>zoro</span>
    </Link>
  );
}
