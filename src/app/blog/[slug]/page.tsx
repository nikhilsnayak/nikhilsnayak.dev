import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense, ViewTransition } from 'react';

import { ErrorBoundary } from '~/components/error-boundary';
import { ScrollToHash } from '~/components/scroll-to-hash';
import { Spinner } from '~/components/spinner';
import { CommentsSection } from '~/features/blog/components/comments-section';
import { HeartButton } from '~/features/blog/components/heart-button';
import { Hearts } from '~/features/blog/components/hearts';
import { SocialShare } from '~/features/blog/components/social-share';
import { ViewsCount } from '~/features/blog/components/views';
import { getBlogMetadata, getPostMetadataBySlug } from '~/features/blog/functions/queries';
import { BASE_URL } from '~/lib/constants';
import { formatDate, viewTransitionName } from '~/lib/utils';

export async function generateStaticParams() {
  const posts = await getBlogMetadata();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
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
      siteName: 'Nikhil S - Writing',
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

  const { default: Post, frontmatter: metadata } = await import(`~/content/${slug}/post.mdx`);

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
      <Link
        href='/blog'
        className='text-muted-foreground hover:text-foreground focus-ring mb-6 inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline focus-visible:underline'
      >
        <ArrowLeft className='size-4' aria-hidden='true' />
        All writing
      </Link>
      <ViewTransition name={viewTransitionName(slug)}>
        <h1 className='max-w-3xl text-3xl leading-tight font-semibold tracking-tight text-pretty sm:text-4xl'>
          {title}
        </h1>
      </ViewTransition>
      <div className='text-muted-foreground mt-4 mb-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:mb-12'>
        <time dateTime={new Date(publishedAt).toISOString()}>{formatDate(publishedAt)}</time>
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
      <article className='prose dark:prose-invert prose-headings:font-mono prose-headings:font-medium prose-headings:tracking-tight min-w-full'>
        <Post />
      </article>
      <div className='border-border/60 mt-10 flex flex-wrap items-center gap-6 border-t pt-3 text-sm'>
        <SocialShare title={title} slug={slug} />
        <ErrorBoundary fallback={<span>{"Couldn't load hearts"}</span>}>
          <Suspense fallback={<HeartButton />}>
            <Hearts slug={slug} />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className='mt-10'>
        <ErrorBoundary fallback={<span>{"Couldn't load comments"}</span>}>
          <Suspense fallback={<Spinner variant='ellipsis' />}>
            <h2 className='mb-6 font-mono text-xl font-medium tracking-tight' id='comments'>
              Comments
            </h2>
            <ScrollToHash id='comments' />
            <CommentsSection slug={slug} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
}
