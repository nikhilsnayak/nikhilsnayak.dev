import { Suspense, ViewTransition } from 'react';
import type { Metadata } from 'next';

import { BASE_URL } from '~/lib/constants';
import { formatDate } from '~/lib/utils';
import { ErrorBoundary } from '~/components/error-boundary';
import { Spinner } from '~/components/spinner';
import { CommentsSection } from '~/features/blog/components/comments-section';
import { HeartButton } from '~/features/blog/components/heart-button';
import { Hearts } from '~/features/blog/components/hearts';
import { SocialShare } from '~/features/blog/components/social-share';
import { ViewsCount } from '~/features/blog/components/views';
import {
  getBlogMetadata,
  getPostMetadataBySlug,
} from '~/features/blog/functions/queries';

export async function generateStaticParams() {
  const posts = await getBlogMetadata();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const metadata = await getPostMetadataBySlug(slug);
  if (!metadata) {
    return {};
  }

  const { title, publishedAt, summary: description } = metadata;

  const ogImage = `${BASE_URL}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'Nikhil S - Blog',
      publishedTime: publishedAt.toDateString(),
      url: `${BASE_URL}/blog/${slug}`,
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

export default async function BlogPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;

  const { default: Post, frontmatter: metadata } = await import(
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
            url: `${BASE_URL}/blog/${slug}`,
            author: {
              '@type': 'Person',
              name: 'Nikhil S',
            },
          }),
        }}
      />
      <ViewTransition
        name={
          slug === '2-years-into-software-engineering'
            ? 'two-years-into-software-engineering' // view-transition in not getting trigged if the name starts with number
            : slug
        }
      >
        <h1 className='font-mono text-2xl font-semibold tracking-tighter text-balance'>
          {title}
        </h1>
      </ViewTransition>
      <div className='mt-4 mb-8 flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400'>
        <p>{formatDate(publishedAt)}</p>
        <ErrorBoundary
          fallback={
            <ViewTransition enter='slide-up'>
              <p className='w-max'>{"Couldn't load views"}</p>
            </ViewTransition>
          }
        >
          <Suspense
            fallback={
              <ViewTransition exit='slide-down'>
                <p className='animate-pulse blur-xs'>100 views</p>
              </ViewTransition>
            }
          >
            <ViewTransition enter='slide-up'>
              <ViewsCount slug={slug} update />
            </ViewTransition>
          </Suspense>
        </ErrorBoundary>
      </div>
      <article className='prose dark:prose-invert min-w-full'>
        <Post />
      </article>
      <div className='mt-8 space-y-4'>
        <p className='dark:text-theme'>
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
        <ErrorBoundary fallback={<span>{"Couldn't load comments"}</span>}>
          <Suspense fallback={<Spinner variant='ellipsis' />}>
            <h2
              className='mb-4 font-mono text-xl font-bold sm:text-2xl'
              id='comments'
            >
              Comments
            </h2>
            <CommentsSection slug={slug} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
}
