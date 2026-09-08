import { ExternalLink } from '~/components/external-link';

import { getContributions } from '../functions/queries';

export async function Contributions() {
  const contributions = await getContributions();

  if (contributions.length === 0) return null;

  return (
    <ul className='space-y-1'>
      {contributions.map((contribution) => (
        <li key={contribution.url}>
          <ExternalLink
            href={contribution.url}
            className='focus-ring group [&>.external-arrow]:text-muted-foreground relative block py-3 pr-6 [&>.external-arrow]:absolute [&>.external-arrow]:top-4.5 [&>.external-arrow]:right-0'
          >
            <div className='flex items-baseline justify-between gap-4'>
              <span className='min-w-0 text-sm leading-6 wrap-anywhere underline-offset-4 group-hover:underline'>
                {contribution.title}
              </span>
            </div>
            <div className='text-muted-foreground mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-[11px]'>
              <span className='wrap-anywhere'>{contribution.repository}</span>
              <span>
                {contribution.kind}
                {' · '}
                <time dateTime={contribution.date}>
                  {new Date(contribution.date).toLocaleDateString('en', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    timeZone: 'UTC',
                  })}
                </time>
              </span>
            </div>
          </ExternalLink>
        </li>
      ))}
    </ul>
  );
}
