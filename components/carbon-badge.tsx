'use client';

import Script from 'next/script';
import { useTheme } from 'next-themes';

import { cn } from '~/lib/utils';

export function CarbonBadge() {
  const { resolvedTheme } = useTheme();
  return (
    <>
      <div
        id='wcb'
        className={cn('carbonbadge', {
          'wcb-d': resolvedTheme === 'dark',
        })}
      ></div>
      <Script src='https://unpkg.com/website-carbon-badges@1.1.3/b.min.js' />
    </>
  );
}
