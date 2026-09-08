import { cacheLife } from 'next/cache';

import { NumberFormatter } from '~/lib/utils';

import { getBlogStats } from '../functions/queries';

export async function BlogStats() {
  'use cache';
  cacheLife('minutes');

  const { totalComments, totalHearts, totalViews } = await getBlogStats();

  return (
    <p className='text-muted-foreground font-mono text-xs leading-6 tabular-nums'>
      {NumberFormatter.format(totalViews)} views · {NumberFormatter.format(totalHearts)} hearts ·{' '}
      {NumberFormatter.format(totalComments)} comments
    </p>
  );
}
