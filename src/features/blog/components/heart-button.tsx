'use client';

import { AnimatePresence, motion, useAnimationControls } from 'motion/react';
import { useEffect } from 'react';

import { Button } from '~/components/ui/button';

import type { HeartsInfo } from '../types';

export function HeartButton({ heartsInfo }: Readonly<{ heartsInfo?: HeartsInfo }>) {
  const controls = useAnimationControls();

  const fillPercentage = Math.min(((heartsInfo?.currentClientHeartsCount ?? 0) / 3) * 100, 100);

  useEffect(() => {
    if (fillPercentage === 100) {
      void controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.5, repeat: Infinity, repeatDelay: 0.5 },
      });

      return () => controls.stop();
    }
  }, [controls, fillPercentage]);

  return (
    <Button
      type='submit'
      variant='ghost'
      className='text-muted-foreground h-9 gap-2 px-0 text-sm leading-none font-normal hover:bg-transparent dark:hover:bg-transparent'
      aria-label={`Like. Current likes: ${heartsInfo?.total ?? 0}`}
      disabled={!heartsInfo || fillPercentage === 100}
    >
      <motion.svg
        animate={controls}
        className={
          fillPercentage > 0
            ? 'relative -top-0.5 size-4 shrink-0 text-red-500'
            : 'relative -top-0.5 size-4 shrink-0'
        }
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        width='16'
        height='16'
        stroke='currentColor'
        strokeWidth='1.5'
        aria-hidden='true'
      >
        <path
          d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
          fill='none'
        />
        <defs>
          <clipPath id='clip-path'>
            <rect x='0' y={`${100 - fillPercentage}%`} width='100%' height='100%' fill='red' />
          </clipPath>
        </defs>
        <path
          d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
          fill='currentColor'
          clipPath='url(#clip-path)'
        />
      </motion.svg>
      <span>{fillPercentage === 100 ? 'Liked' : 'Like'}</span>
      <AnimatePresence mode='wait' initial={false}>
        <motion.span
          key={heartsInfo?.total ?? 0}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className='tabular-nums'
        >
          {heartsInfo?.total ?? 0}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
