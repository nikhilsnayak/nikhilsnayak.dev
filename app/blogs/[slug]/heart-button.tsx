'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';

import { HeartsInfo } from './types';

export function HeartButton({ heartsInfo }: { heartsInfo?: HeartsInfo }) {
  const controls = useAnimationControls();

  const fillPercentage = Math.min(
    ((heartsInfo?.currentClientHeartsCount ?? 0) / 3) * 100,
    100
  );

  useEffect(() => {
    if (fillPercentage === 100) {
      controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.5, repeat: Infinity, repeatDelay: 0.5 },
      });
    }
  }, [fillPercentage, controls]);

  return (
    <button
      className='flex cursor-pointer items-center gap-1 rounded-full bg-red-100 p-2 text-[red] transition-colors hover:bg-red-200'
      aria-label={`Like. Current likes: ${heartsInfo?.total ?? 0}`}
      disabled={!heartsInfo || fillPercentage === 100}
    >
      <motion.svg
        animate={controls}
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        width='24'
        height='24'
        stroke='red'
        strokeWidth='1'
      >
        <path
          d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
          fill='none'
        />
        <defs>
          <clipPath id='clip-path'>
            <rect
              x='0'
              y={`${100 - fillPercentage}%`}
              width='100%'
              height='100%'
              fill='red'
            />
          </clipPath>
        </defs>
        <path
          d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
          fill='red'
          clipPath='url(#clip-path)'
        />
      </motion.svg>
      <AnimatePresence mode='wait' initial={false}>
        <motion.span
          key={heartsInfo?.total ?? 0}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className='font-semibold tabular-nums'
        >
          {heartsInfo?.total ?? 0}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
