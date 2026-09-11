'use client';

import { AnimatePresence, motion, useAnimationControls } from 'motion/react';
import { useEffect, useId, useState } from 'react';

import { Button } from '~/components/ui/button';
import { detailEase } from '~/lib/motion';
import { cn } from '~/lib/utils';

import type { HeartsInfo } from '../types';

const heartPath =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

export function HeartButton({ heartsInfo }: Readonly<{ heartsInfo?: HeartsInfo }>) {
  const controls = useAnimationControls();
  const clipId = useId();
  const count = Math.min(heartsInfo?.currentClientHeartsCount ?? 0, 3);
  const [pointer, setPointer] = useState(false);

  useEffect(() => {
    if (count < 3) return;
    void controls.start({
      scale: [1, 1.2, 1],
      transition: { duration: 0.5, repeat: Infinity, repeatDelay: 0.5 },
    });
    return () => controls.stop();
  }, [controls, count]);

  const release = () => {
    if (pointer)
      void controls.start({
        scale: 1,
        transition: { duration: 0.14, ease: detailEase },
      });
  };
  return (
    <Button
      type='submit'
      variant='ghost'
      className='text-muted-foreground h-11 gap-2 px-0 text-sm leading-none font-normal hover:bg-transparent active:transform-none disabled:pointer-events-auto dark:hover:bg-transparent'
      disabled={!heartsInfo || count === 3}
      onPointerDown={(event) => {
        setPointer(true);
        if (event.pointerType !== 'mouse') navigator.vibrate?.(count === 2 ? [6, 30, 12] : 6);
        void controls.start({
          scale: 0.94,
          transition: { duration: 0.1, ease: detailEase },
        });
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
      onKeyDown={() => {
        setPointer(false);
        controls.set({ scale: 1 });
      }}
    >
      <motion.svg
        animate={controls}
        className={cn('relative top-[-1.5px] size-3.5 shrink-0', count > 0 && 'text-primary')}
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        width='14'
        height='14'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
      >
        <path d={heartPath} fill='none' />
        <defs>
          <clipPath id={clipId}>
            <rect x='0' y={`${100 - (count / 3) * 100}%`} width='100%' height='100%' />
          </clipPath>
        </defs>
        <path d={heartPath} fill='currentColor' clipPath={`url(#${clipId})`} />
      </motion.svg>
      <span className='inline-grid text-left'>
        <span className='invisible col-start-1 row-start-1'>Liked</span>
        <span className='col-start-1 row-start-1'>{count === 3 ? 'Liked' : 'Like'}</span>
      </span>
      <span className='relative inline-grid min-w-[3ch] text-left tabular-nums'>
        <AnimatePresence initial={false} mode='popLayout'>
          <motion.span
            key={heartsInfo?.total ?? 0}
            initial={{
              opacity: !pointer ? 1 : 0,
              y: !pointer ? 0 : -3,
            }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: !pointer ? 0 : 3,
            }}
            transition={{ duration: !pointer ? 0 : 0.12, ease: detailEase }}
          >
            {heartsInfo?.total ?? 0}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className='sr-only'>likes</span>
    </Button>
  );
}
