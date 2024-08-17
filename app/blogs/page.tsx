import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { formatDate } from '@/lib/utils';
import { getBlogPosts } from '@/lib/utils/server';
import { Div, H1, Section } from '@/components/framer-motion';

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
    <Section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <H1
        //@ts-ignore -- props issue due to improper peer dependency (react 19-rc)
        className='mb-6 font-mono text-2xl font-medium tracking-tighter'
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        My Blogs
      </H1>
      <Div
        //@ts-ignore -- props issue due to improper peer dependency (react 19-rc)
        className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        {allBlogs.map((post) => (
          <Link
            key={post.slug}
            href={`/blogs/${post.slug}`}
            className='group block'
          >
            <Div
              //@ts-ignore -- props issue due to improper peer dependency (react 19-rc)
              className='h-full rounded-lg'
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
              }}
              transition={{ type: 'spring', stiffness: 100, duration: 0.5 }}
            >
              <div className='space-y-2  p-4 h-full rounded-lg border border-border shadow-lg'>
                <p className='flex items-center justify-between text-xs text-muted-foreground'>
                  <span>{formatDate(post.metadata.publishedAt)}</span>
                  <ArrowUpRight className='w-4 transition-transform duration-300 group-hover:rotate-45' />
                </p>
                <h2 className='font-mono text-lg font-semibold'>
                  {post.metadata.title}
                </h2>
                <p className='text-sm'>{post.metadata.summary}</p>
              </div>
            </Div>
          </Link>
        ))}
      </Div>
    </Section>
  );
}
