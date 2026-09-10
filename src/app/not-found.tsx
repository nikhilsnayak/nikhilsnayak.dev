import Link from 'next/link';

import { DotMatrix, type DotProps } from '~/components/dot-matrix';
import { NOT_FOUND_GLYPHS } from '~/lib/constants';

const fall = (delay: number): DotProps => ({
  initial: { y: 0, opacity: 1 },
  animate: { y: 54, opacity: 0 },
  transition: { delay, duration: 0.9, ease: [0.55, 0, 1, 0.45] },
});

const fallingDots = new Map([
  ['0-0-3', fall(0.38)],
  ['1-3-2', fall(0.47)],
  ['2-4-4', fall(0.56)],
  ['1-1-4', fall(0.66)],
  ['0-1-2', fall(0.75)],
  ['2-2-1', fall(0.87)],
  ['1-0-1', fall(0.96)],
  ['0-4-4', fall(1.08)],
  ['2-6-3', fall(1.19)],
  ['1-6-3', fall(1.31)],
  ['0-6-3', fall(1.44)],
]);

export default function NotFound() {
  return (
    <section className='py-6 sm:py-10'>
      <h1>
        <span className='sr-only'>Page not found</span>
        <svg
          viewBox='0 0 136 56'
          fill='currentColor'
          aria-hidden='true'
          className='h-auto w-full max-w-52 overflow-visible opacity-85'
        >
          <DotMatrix glyphs={NOT_FOUND_GLYPHS} dotProps={fallingDots} />
        </svg>
      </h1>
      <p className='text-muted-foreground mt-8 max-w-prose text-sm leading-relaxed'>
        This page may have moved or no longer exists.
      </p>
      <Link href='/' className='text-link mt-6 inline-block font-mono text-xs'>
        back to home
      </Link>
    </section>
  );
}
