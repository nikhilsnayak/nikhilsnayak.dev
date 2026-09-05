import { ArrowUpRight } from 'lucide-react';

import { getContributions } from '../functions/queries';

export async function Contributions() {
  const contributions = await getContributions();

  if (contributions.length === 0) return null;

  return (
    <ul className='space-y-4'>
      {contributions.map((contribution) => (
        <li key={contribution.id}>
          <p className='text-muted-foreground mb-1 text-xs'>{contribution.repository}</p>
          <a
            href={contribution.url}
            target='_blank'
            rel='noopener noreferrer'
            className='focus-ring inline-flex items-baseline gap-2 text-sm underline-offset-4 hover:underline focus-visible:underline'
          >
            <span className='text-pretty'>{contribution.title}</span>
            <ArrowUpRight className='text-muted-foreground size-3 shrink-0' aria-hidden='true' />
          </a>
        </li>
      ))}
    </ul>
  );
}
