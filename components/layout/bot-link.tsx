'use client';
import { zoro } from '@/assets/images';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BotLink() {
  const path = usePathname();

  return (
    <Link
      href='/bot'
      className={cn(
        'hover inline-block rounded-full ring ring-transparent transition-all hover:ring-green-200',
        path === '/bot' && 'ring-green-500'
      )}
    >
      <Image src={zoro} alt='bot-icon' className='h-10 w-auto' priority />
    </Link>
  );
}
