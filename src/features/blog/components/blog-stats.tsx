import { cacheLife } from 'next/cache';
import { Eye, Heart, MessageCircle } from 'lucide-react';

import { NumberFormatter } from '~/lib/utils';

import { getBlogStats } from '../functions/queries';

export async function BlogStats() {
  'use cache';

  cacheLife('minutes');

  const { totalComments, totalHearts, totalViews } = await getBlogStats();

  const stats = [
    {
      icon: <Eye className='size-4 text-blue-500' />,
      value: totalViews,
    },
    {
      icon: <Heart className='size-4 text-red-500' />,
      value: totalHearts,
    },
    {
      icon: <MessageCircle className='size-4 text-emerald-500' />,
      value: totalComments,
    },
  ];

  return (
    <div className='flex items-center gap-6'>
      {stats.map((stat, index) => (
        <div key={index} className='flex items-center gap-2'>
          {stat.icon}
          <span className='text-muted-foreground font-mono leading-4 font-semibold'>
            {NumberFormatter.format(stat.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
