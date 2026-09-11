import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ViewTransition } from 'react';

import { getPostConnectionsBySlug } from '../functions/queries';

export async function SeriesNavigation({ slug }: { slug: string }) {
  const { previousPost, nextPost, currentPart, totalParts } = await getPostConnectionsBySlug(slug);

  if (!previousPost && !nextPost) return null;

  return (
    <ViewTransition
      key={slug}
      name='series-navigation'
      default='none'
      share={{
        'series-next': 'series-controls',
        'series-prev': 'series-controls',
        default: 'none',
      }}
    >
      <nav
        aria-label='Series navigation'
        className='border-border/60 text-muted-foreground mb-10 flex flex-wrap items-center justify-between gap-x-6 border-y py-1 font-mono text-[11px] sm:mb-12'
      >
        <p className='flex min-h-11 items-center gap-2.5 tabular-nums'>
          <span className='bg-primary size-1 shrink-0' aria-hidden='true' />
          <span className='sr-only'>
            Part {currentPart} of {totalParts}
          </span>
          <span aria-hidden='true'>
            part <span className='text-foreground'>{String(currentPart).padStart(2, '0')}</span>
            <span className='text-muted-foreground/50 mx-1.5'>/</span>
            <span>{String(totalParts).padStart(2, '0')}</span>
          </span>
        </p>
        <div className='ml-auto flex items-center gap-6'>
          {previousPost ? (
            <Link
              href={`/blog/${previousPost.slug}`}
              rel='prev'
              transitionTypes={['series-prev']}
              aria-label={`Previous in series: ${previousPost.metadata.title}`}
              title={previousPost.metadata.title}
              className='text-link group inline-flex min-h-11 items-center gap-2'
            >
              <ArrowLeft
                className='ease-detail size-3 transition-transform duration-150 group-hover:-translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none'
                aria-hidden='true'
              />
              previous
            </Link>
          ) : null}
          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              rel='next'
              transitionTypes={['series-next']}
              aria-label={`Next in series: ${nextPost.metadata.title}`}
              title={nextPost.metadata.title}
              className='text-link group inline-flex min-h-11 items-center gap-2'
            >
              next
              <ArrowRight
                className='ease-detail size-3 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none'
                aria-hidden='true'
              />
            </Link>
          ) : null}
        </div>
      </nav>
    </ViewTransition>
  );
}
