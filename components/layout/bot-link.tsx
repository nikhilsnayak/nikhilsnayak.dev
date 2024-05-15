'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { zoro } from '@/assets/images';
import { cn } from '@/lib/utils';

export function BotLink() {
  const path = usePathname();

  return (
    <Link
      href='/bot'
      className={cn(
        'hover inline-block rounded-full ring ring-transparent transition-all',
        path === '/bot' && 'ring-green-500'
      )}
    >
      <Image src={zoro} alt='bot-icon' className='h-10 w-auto' priority />
    </Link>
  );
}
