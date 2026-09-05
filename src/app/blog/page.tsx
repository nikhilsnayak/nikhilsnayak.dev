import type { Metadata } from 'next';
import Link from 'next/link';
import { ViewTransition } from 'react';

import { BlogStats } from '~/features/blog/components/blog-stats';
import { getBlogMetadata } from '~/features/blog/functions/queries';
import { BASE_URL } from '~/lib/constants';
import { formatDate, viewTransitionName } from '~/lib/utils';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Articles on React, TypeScript and the systems I build.',
};

export default async function BlogsPage() {
  const blog = await getBlogMetadata();

  const postsByYear = blog.reduce((acc, post) => {
    const year = post.metadata.publishedAt.getFullYear();
    if (!acc.has(year)) {
      acc.set(year, []);
    }
    acc.get(year)!.push(post);
    return acc;
  }, new Map<number, typeof blog>());

  return (
    <section className='space-y-12'>
      <header className='space-y-3'>
        <div className='flex items-baseline justify-between gap-4'>
          <h1 className='font-mono text-2xl font-medium tracking-tight'>Writing</h1>
          <a
            href={`${BASE_URL}/rss.xml`}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='rss feed'
            className='text-muted-foreground hover:text-foreground focus-ring text-xs underline-offset-4 hover:underline focus-visible:underline'
          >
            RSS
          </a>
        </div>

        <BlogStats />
      </header>

      <div className='space-y-12'>
        {[...postsByYear.entries()].map(([year, posts]) => (
          <div key={year}>
            <h2 className='mb-6 font-mono text-xl font-medium tracking-tight'>{year}</h2>
            <ul className='space-y-6'>
              {posts.map((post) => (
                <li key={post.slug} className='space-y-1'>
                  <time
                    dateTime={post.metadata.publishedAt.toISOString()}
                    className='text-muted-foreground text-xs'
                  >
                    {formatDate(post.metadata.publishedAt)}
                  </time>
                  <ViewTransition name={viewTransitionName(post.slug)}>
                    <h3 className='font-medium text-pretty'>
                      <Link
                        href={`/blog/${post.slug}`}
                        className='focus-ring underline-offset-4 hover:underline focus-visible:underline'
                      >
                        {post.metadata.title}
                      </Link>
                    </h3>
                  </ViewTransition>
                  <p className='text-muted-foreground max-w-prose text-sm leading-relaxed text-pretty'>
                    {post.metadata.summary}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
