import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { Eye, LogOut } from 'lucide-react';
import { MDXRemoteProps } from 'next-mdx-remote/rsc';

import { auth, signIn, signOut } from '~/lib/auth';
import { BASE_URL } from '~/lib/constants';
import { db } from '~/lib/db';
import { formatDate } from '~/lib/utils';
import { getBlogPosts, getIPHash } from '~/lib/utils/server';
import { Skeleton } from '~/components/ui/skeleton';
import { ErrorBoundary } from '~/components/error-boundary';
import { FormSubmit } from '~/components/form-submit';
import { CustomMDX } from '~/components/mdx';
import { PostViewsCount } from '~/components/post-views';
import { Spinner } from '~/components/spinner';

import { AddHeartForm } from './add-heart-form';
import { CommentsManager } from './comments-manager';
import { HeartButton } from './heart-button';
import { SocialShare } from './social-share';
import { SummarizeButton } from './summarize-button';

interface BlogProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);
  if (!post) {
    return {};
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  const ogImage =
    image ?? `${BASE_URL}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'Nikhil S - Blog',
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

async function Hearts({ slug }: Readonly<{ slug: string }>) {
  const ip = await getIPHash();

  const hearts = await db.query.hearts.findMany({
    where: (hearts, { eq }) => eq(hearts.slug, slug),
  });

  const total = hearts.reduce((acc, cv) => acc + cv.count, 0);

  const currentClientHeartsCount =
    hearts.find((heart) => heart.clientIdentifier === ip)?.count ?? 0;

  return (
    <AddHeartForm
      initialValue={{
        total,
        currentClientHeartsCount,
      }}
      slug={slug}
    />
  );
}

function CommentsSkeleton() {
  return new Array(3).fill(0).map((_, i) => (
    <div key={i} className='flex items-start gap-4'>
      <Skeleton className='h-10 w-10 rounded-full' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[120px]' />
        <Skeleton className='h-4 w-[300px]' />
      </div>
    </div>
  ));
}

export async function CommentsSection({ slug }: Readonly<{ slug: string }>) {
  const commentsPromise = db.query.comments.findMany({
    where: (commentsTable, { eq }) => eq(commentsTable.slug, slug),
    with: {
      user: true,
    },
    orderBy: (commentsTable, { desc }) => [desc(commentsTable.createdAt)],
  });

  const session = await auth();

  return (
    <div className='space-y-8'>
      {!session?.user ? (
        <div className='space-y-2'>
          <p>Please sign in to comment.</p>
          <form
            action={async () => {
              'use server';
              return await signIn('github', {
                redirectTo: `/blogs/${slug}#comments`,
              });
            }}
          >
            <FormSubmit pendingFallback={<Spinner />}>
              <span className='flex items-center gap-2'>
                <SiGithub />
                <span>Sign in with GitHub</span>
              </span>
            </FormSubmit>
          </form>
        </div>
      ) : (
        <div className='flex items-center gap-2'>
          <p>You are signed in as {session.user.name}.</p>
          <form
            action={async () => {
              'use server';
              return await signOut();
            }}
          >
            <FormSubmit pendingFallback={<Spinner />}>
              <LogOut />
            </FormSubmit>
          </form>
        </div>
      )}
      <Suspense fallback={<CommentsSkeleton />}>
        <CommentsManager
          session={session}
          slug={slug}
          initialCommentsPromise={commentsPromise}
        />
      </Suspense>
    </div>
  );
}

export default async function Blog({ params }: Readonly<BlogProps>) {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  const { metadata } = post;
  let components: MDXRemoteProps['components'] = null;

  if (metadata.components) {
    const componentNames = JSON.parse(metadata.components);
    const importedComponents = await Promise.all(
      (componentNames as string[]).map(async (name) => {
        const mod = await import(
          `../../../content/components/${post.slug}/${name}`
        );
        return { [name]: mod.default };
      })
    );
    components = Object.assign({}, ...importedComponents);
  }

  const blogTitle = post.metadata.title;
  return (
    <section>
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
      <h1
        className='font-mono text-2xl font-semibold tracking-tighter'
        style={{
          viewTransitionName: post.slug,
        }}
      >
        {post.metadata.title}
      </h1>
      <div className='mb-8 mt-4 flex flex-col justify-between gap-3 text-sm sm:flex-row sm:items-center'>
        <div className='flex items-center gap-3'>
          <p className='text-sm text-neutral-600 dark:text-neutral-400'>
            {formatDate(post.metadata.publishedAt)}
          </p>
          <SummarizeButton blogTitle={blogTitle} />
        </div>
        <ErrorBoundary fallback={<span>{"Couldn't load views"}</span>}>
          <Suspense fallback={<Spinner variant='ellipsis' />}>
            <PostViewsCount slug={post.slug} updateViews>
              {(count) => (
                <span className='flex items-center gap-2'>
                  <Eye /> {count}
                </span>
              )}
            </PostViewsCount>
          </Suspense>
        </ErrorBoundary>
      </div>
      <article className='prose min-w-full dark:prose-invert'>
        <CustomMDX source={post.content} components={components} />
      </article>
      <div className='mt-8 space-y-4'>
        <p className='dark:text-fluorescent'>
          If you enjoyed this blog, share it on social media to help others find
          it too
          <SocialShare title={post.metadata.title} slug={post.slug} />
        </p>
        <ErrorBoundary fallback={<span>{"Couldn't load hearts"}</span>}>
          <Suspense fallback={<HeartButton />}>
            <Hearts slug={post.slug} />
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
            <CommentsSection slug={post.slug} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
}
