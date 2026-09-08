'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export function InteractiveName({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [glint, setGlint] = useState(false);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <span
      className='relative block w-full max-w-101'
      onPointerEnter={(event) => {
        if (
          reduced ||
          event.pointerType !== 'mouse' ||
          !window.matchMedia('(hover: hover) and (pointer: fine)').matches
        )
          return;
        timer.current = setTimeout(() => {
          setGlint(true);
        }, 250);
      }}
      onPointerLeave={() => clearTimeout(timer.current)}
    >
      <span className='block opacity-85'>{children}</span>
      {glint && !reduced && (
        <motion.span
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 motion-reduce:hidden'
          initial={{ clipPath: 'polygon(-20% 0, 0% 0, 0% 100%, -20% 100%)' }}
          animate={{ clipPath: 'polygon(100% 0, 120% 0, 120% 100%, 100% 100%)' }}
          transition={{ duration: 0.45, ease: 'linear' }}
          onAnimationComplete={() => setGlint(false)}
        >
          {children}
        </motion.span>
      )}
    </span>
  );
}
