import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense, ViewTransition } from 'react';

import { ErrorBoundary } from '~/components/error-boundary';
import { BlogStats } from '~/features/blog/components/blog-stats';
import { getBlogMetadata } from '~/features/blog/functions/queries';
import { BASE_URL, WRITING_INTRO } from '~/lib/constants';
import { formatDate, viewTransitionName } from '~/lib/utils';

const socialImage = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'Nikhil S — things I build and what I learn along the way.',
};

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Things I figured out, things I built, and a few questions along the way.',
  openGraph: {
    title: 'Writing | Nikhil S',
    description: 'Things I figured out, things I built, and a few questions along the way.',
    url: '/blog',
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Writing | Nikhil S',
    description: 'Things I figured out, things I built, and a few questions along the way.',
    images: [socialImage],
  },
};

export default async function BlogsPage() {
  const blog = await getBlogMetadata();
  const postsByYear = Map.groupBy(blog, (post) => post.metadata.publishedAt.getFullYear());

  return (
    <section className='space-y-16'>
      <header>
        <div className='mb-5 flex items-baseline justify-between gap-4'>
          <h1 className='text-4xl font-medium tracking-tight sm:text-5xl'>
            writing<span className='text-primary'>.</span>
          </h1>
          <a
            href={`${BASE_URL}/rss.xml`}
            className='text-link font-mono text-xs'
            aria-label='RSS feed'
          >
            rss
          </a>
        </div>
        <p className='text-muted-foreground max-w-lg leading-7 text-pretty'>{WRITING_INTRO}</p>
        <div className='mt-5'>
          <ErrorBoundary
            fallback={
              <p className='text-muted-foreground text-xs'>Stats are unavailable right now.</p>
            }
          >
            <Suspense
              fallback={
                <p className='text-muted-foreground font-mono text-xs leading-6'>loading stats…</p>
              }
            >
              <BlogStats />
            </Suspense>
          </ErrorBoundary>
        </div>
      </header>
      <div className='space-y-12'>
        {[...postsByYear.entries()].map(([year, posts]) => (
          <section
            key={year}
            aria-labelledby={`year-${year}`}
            className='grid gap-4 sm:grid-cols-[64px_1fr] sm:gap-8'
          >
            <h2 id={`year-${year}`} className='section-label pt-1 tabular-nums'>
              {year}
            </h2>
            <ul className='space-y-8'>
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className='focus-ring group block'>
                    <ViewTransition
                      name={viewTransitionName(post.slug)}
                      default='none'
                      share='article-title'
                    >
                      <h3 className='leading-7 text-pretty underline-offset-4 group-hover:underline'>
                        {post.metadata.title}
                      </h3>
                    </ViewTransition>
                    <p className='text-muted-foreground mt-2 text-sm leading-6 text-pretty'>
                      {post.metadata.summary}
                    </p>
                    <time
                      dateTime={post.metadata.publishedAt.toISOString()}
                      className='text-muted-foreground mt-3 block font-mono text-[11px]'
                    >
                      {formatDate(post.metadata.publishedAt)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
