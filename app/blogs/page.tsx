import type { Metadata } from 'next';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { getBlogPosts } from '@/lib/utils/server';

export const metadata: Metadata = {
  title: 'Blogs',
  description: 'A list of blog posts where I document my learnings',
};

export default function BlogsPage() {
  const allBlogs = getBlogPosts();
  return (
    <section>
      <h1 className='mb-8 text-2xl font-semibold tracking-tighter'>My Blogs</h1>
      <div>
        {allBlogs
          .sort((a, b) => {
            if (
              new Date(a.metadata.publishedAt) >
              new Date(b.metadata.publishedAt)
            ) {
              return -1;
            }
            return 1;
          })
          .map((post) => (
            <Link
              key={post.slug}
              className='mb-4 flex flex-col space-y-1'
              href={`/blogs/${post.slug}`}
            >
              <div className='flex w-full flex-col space-x-0 md:flex-row md:space-x-2'>
                <p className='w-[100px] tabular-nums text-neutral-600 dark:text-neutral-400'>
                  {formatDate(post.metadata.publishedAt)}
                </p>
                <p className='tracking-tight text-neutral-900 dark:text-neutral-100'>
                  {post.metadata.title}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}
