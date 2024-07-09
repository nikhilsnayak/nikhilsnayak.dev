import { notFound } from 'next/navigation';
import { CustomMDX } from '@/components/mdx';
import { BASE_URL } from '@/config/constants';
import { formatDate } from '@/lib/utils';
import { getBlogPosts } from '@/lib/utils/server';
import { Views } from '@/components/views';
import { CommentsSection } from '@/components/comments';
import { Suspense } from 'react';
import { FunkoPopZoro } from './funko-pop-zoro';
import { SummarizeButton } from './summarize-button';

interface BlogProps {
  params: { slug: string };
}

export function generateMetadata({ params }: BlogProps) {
  const post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return {};
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  const ogImage = image
    ? image
    : `${BASE_URL}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${BASE_URL}/blogs/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function Blog({ params }: BlogProps) {
  const post = getBlogPosts().find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }
  const blogTitle = post.metadata.title;
  return (
    <section>
      <FunkoPopZoro blogTitle={blogTitle} />
      <script
        type='application/ld+json'
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${BASE_URL}${post.metadata.image}`
              : `/api/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${BASE_URL}/blogs/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'Nikhil S',
            },
          }),
        }}
      />
      <h1 className='title font-mono text-2xl font-semibold tracking-tighter'>
        {post.metadata.title}
      </h1>
      <div className='mb-8 mt-4 flex flex-col justify-between gap-3 text-sm sm:flex-row'>
        <div className='flex items-center gap-3'>
          <p className='text-sm text-neutral-600 dark:text-neutral-400'>
            {formatDate(post.metadata.publishedAt)}
          </p>
          <SummarizeButton blogTitle={blogTitle} />
        </div>
        <Views slug={post.slug} />
      </div>
      <article className='prose min-w-full dark:prose-invert'>
        <CustomMDX source={post.content} />
      </article>
      <div className='mt-8'>
        <h2 className='mb-4 font-mono text-xl font-bold sm:text-2xl'>
          Comments
        </h2>
        <Suspense fallback={<p>Loading...</p>}>
          <CommentsSection slug={post.slug} />
        </Suspense>
      </div>
    </section>
  );
}
