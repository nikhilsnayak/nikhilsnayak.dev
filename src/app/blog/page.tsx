import { ViewTransition } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Rss } from 'lucide-react';

import { formatDate } from '~/lib/utils';
import { BlogStats } from '~/features/blog/components/blog-stats';
import { getBlogMetadata } from '~/features/blog/functions/queries';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'A list of blog posts where I document my learnings',
};

export default async function BlogsPage() {
  const blog = await getBlogMetadata();

  return (
    <section className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='font-mono text-2xl font-medium tracking-tighter'>
          Blog
        </h1>
        <a
          href='/rss.xml'
          target='_blank'
          rel='noopener noreferrer'
          className='hover:opacity-70'
          aria-label='rss feed'
        >
          <Rss />
        </a>
      </div>

      <BlogStats />

      <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
        {blog.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className='group border-border block h-full transform space-y-2 overflow-hidden rounded-lg border p-4 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md'
          >
            <p className='text-muted-foreground flex items-center justify-between text-xs'>
              <span>{formatDate(post.metadata.publishedAt)}</span>
              <ArrowUpRight className='w-4 transition-transform duration-300 group-hover:rotate-45' />
            </p>
            <ViewTransition name={post.slug}>
              <h2 className='font-mono text-lg font-semibold text-balance'>
                {post.metadata.title}
              </h2>
            </ViewTransition>
            <p className='text-sm'>{post.metadata.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
