import { ViewTransition } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Rss } from 'lucide-react';
import * as motion from 'motion/react-client';

import { formatDate } from '~/lib/utils';
import { BlogStats } from '~/features/blog/components/blog-stats';
import { getBlogMetadata } from '~/features/blog/functions/queries';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'A list of blog posts where I document my learnings',
};

export default async function BlogsPage() {
  const blog = await getBlogMetadata();

  // Group posts by year
  const postsByYear = blog.reduce((acc, post) => {
    const year = post.metadata.publishedAt.getFullYear();
    if (!acc.has(year)) {
      acc.set(year, []);
    }
    acc.get(year)!.push(post);
    return acc;
  }, new Map<number, typeof blog>());

  return (
    <section className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='font-mono text-2xl font-medium tracking-tighter'>
          Blog
        </h1>
        <motion.a
          href='/rss.xml'
          target='_blank'
          rel='noopener noreferrer'
          aria-label='rss feed'
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <Rss />
        </motion.a>
      </div>

      <BlogStats />

      <div className='space-y-12'>
        {[...postsByYear.entries()].map(([year, posts]) => (
          <div key={year}>
            <h2 className='mb-6 font-mono text-xl font-medium tracking-tighter'>
              {year}
            </h2>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className='group border-border block h-full transform space-y-2 overflow-hidden border p-4 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md'
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
          </div>
        ))}
      </div>
    </section>
  );
}
