import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Eye } from 'lucide-react';

import { BASE_URL } from '~/lib/constants';
import { formatDate } from '~/lib/utils';
import { ErrorBoundary } from '~/components/error-boundary';
import { Spinner } from '~/components/spinner';
import { SummarizeButton } from '~/features/ai/components/summarize-button';
import { CommentsSection } from '~/features/blog/components/comments-section';
import { HeartButton } from '~/features/blog/components/heart-button';
import { Hearts } from '~/features/blog/components/hearts';
import { SocialShare } from '~/features/blog/components/social-share';
import { BlogViewsCount } from '~/features/blog/components/views';
import {
  getBlogMetadataBySlug,
  getBlogsMetadata,
} from '~/features/blog/functions/queries';

interface BlogProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogsMetadata();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogProps): Promise<Metadata> {
  const { slug } = await params;
  const metadata = await getBlogMetadataBySlug(slug);
  if (!metadata) {
    return {};
  }

  const { title, publishedAt: publishedTime, summary: description } = metadata;

  const ogImage = `${BASE_URL}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'Nikhil S - Blog',
      publishedTime,
      url: `${BASE_URL}/blogs/${slug}`,
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

export const dynamicParams = false;

export default async function BlogPage({ params }: Readonly<BlogProps>) {
  const { slug } = await params;

  const { default: Blog, frontmatter: metadata } = await import(
    `~/content/${slug}/post.mdx`
  );

  const { publishedAt, summary, title } = metadata;

  return (
    <section>
      <script
        type='application/ld+json'
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: title,
            datePublished: publishedAt,
            dateModified: publishedAt,
            description: summary,
            image: `/api/og?title=${encodeURIComponent(title)}`,
            url: `${BASE_URL}/blogs/${slug}`,
            author: {
              '@type': 'Person',
              name: 'Nikhil S',
            },
          }),
        }}
      />
      <h1
        className='font-mono text-2xl font-semibold tracking-tighter'
        style={{
          viewTransitionName: slug,
        }}
      >
        {title}
      </h1>
      <div className='mt-4 mb-8 flex flex-col justify-between gap-3 text-sm sm:flex-row sm:items-center'>
        <div className='flex items-center gap-3'>
          <p className='text-sm text-neutral-600 dark:text-neutral-400'>
            {formatDate(publishedAt)}
          </p>
          <SummarizeButton blogTitle={title} />
        </div>
        <ErrorBoundary fallback={<span>{"Couldn't load views"}</span>}>
          <Suspense fallback={<Spinner variant='ellipsis' />}>
            <BlogViewsCount slug={slug} update>
              {(count) => (
                <span className='flex items-center gap-2'>
                  <Eye /> {count}
                </span>
              )}
            </BlogViewsCount>
          </Suspense>
        </ErrorBoundary>
      </div>
      <article className='prose dark:prose-invert min-w-full'>
        <Blog />
      </article>
      <div className='mt-8 space-y-4'>
        <p className='dark:text-fluorescent'>
          If you enjoyed this blog, share it on social media to help others find
          it too
          <SocialShare title={title} slug={slug} />
        </p>
        <ErrorBoundary fallback={<span>{"Couldn't load hearts"}</span>}>
          <Suspense fallback={<HeartButton />}>
            <Hearts slug={slug} />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className='mt-8'>
        <h2
          className='mb-4 font-mono text-xl font-bold sm:text-2xl'
          id='comments'
        >
          Comments
        </h2>
        <ErrorBoundary fallback={<span>{"Couldn't load comments"}</span>}>
          <Suspense fallback={<Spinner variant='ellipsis' />}>
            <CommentsSection slug={slug} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
}
