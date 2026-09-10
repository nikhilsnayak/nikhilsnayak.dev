import './prose.css';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
  if (!metadata) notFound();

  const { title, publishedAt, summary: description } = metadata;

  const ogImage = `${BASE_URL}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/blog/${slug}`,
    },
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
          width: 1200,
          height: 630,
          alt: `${title} — Nikhil S`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${title} — Nikhil S` }],
    },
  };
}

export default async function BlogPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;

  const metadata = await getPostMetadataBySlug(slug);
  if (!metadata) notFound();
  const { default: Post } = await import(`~/content/${slug}/post.mdx`);

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
        className='text-link text-muted-foreground group mb-8 inline-flex items-center gap-2 font-mono text-xs'
      >
        <ArrowLeft
          className='ease-detail size-4 transition-transform duration-140 group-hover:-translate-x-0.5 motion-reduce:transition-none'
          aria-hidden='true'
        />
        All writing
      </Link>
      <ViewTransition name={viewTransitionName(slug)} default='none' share='article-title'>
        <h1 className='max-w-3xl text-3xl leading-tight font-medium tracking-tight text-pretty sm:text-[2.75rem]'>
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
      <article className='prose dark:prose-invert prose-headings:font-medium prose-headings:tracking-tight min-w-full'>
        <Post />
      </article>
      <svg className='text-muted-foreground mt-10 h-6 w-6' viewBox='0 0 32 32' aria-hidden='true'>
        <rect x='6' y='12' width='14' height='14' fill='currentColor' />
        <rect x='21' y='6' width='6' height='6' className='fill-primary' />
      </svg>
      <div className='border-border/60 mt-10 flex flex-wrap items-center gap-6 border-t pt-3 text-sm'>
        <SocialShare title={title} slug={slug} />
        <ErrorBoundary fallback={<span>{"Couldn't load hearts"}</span>}>
          <Suspense fallback={<HeartButton />}>
            <Hearts slug={slug} />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className='mt-16'>
        <ErrorBoundary fallback={<span>{"Couldn't load comments"}</span>}>
          <Suspense fallback={<Spinner variant='ellipsis' />}>
            <h2 className='section-label mb-6 scroll-mt-8' id='comments'>
              comments
            </h2>
            <ScrollToHash id='comments' />
            <CommentsSection slug={slug} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
}
