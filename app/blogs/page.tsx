import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { formatDate } from '~/lib/utils';
import { getBlogPosts } from '~/lib/utils/server';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Blogs',
  description: 'A list of blog posts where I document my learnings',
};

export default function BlogsPage() {
  const allBlogs = getBlogPosts().toSorted((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });

  return (
    <section>
      <h1 className='mb-6 font-mono text-2xl font-medium tracking-tighter'>
        My Blogs
      </h1>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
        {allBlogs.map((post) => (
          <Link
            key={post.slug}
            href={`/blogs/${post.slug}`}
            className='group block'
          >
            <div className='h-full transform space-y-2 overflow-hidden rounded-lg border border-border p-4 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'>
              <p className='flex items-center justify-between text-xs text-muted-foreground'>
                <span>{formatDate(post.metadata.publishedAt)}</span>
                <ArrowUpRight className='w-4 transition-transform duration-300 group-hover:rotate-45' />
              </p>
              <h2 className='font-mono text-lg font-semibold'>
                {post.metadata.title}
              </h2>
              <p className='text-sm'>{post.metadata.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
