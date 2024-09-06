import { Suspense } from 'react';
import { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import { notFound } from 'next/navigation';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { Eye, LogOut } from 'lucide-react';

import { auth, signIn, signOut } from '~/lib/auth';
import { BASE_URL, BLOB_STORAGE_URL } from '~/lib/constants';
import { db } from '~/lib/db';
import { formatDate } from '~/lib/utils';
import { getBlogPosts } from '~/lib/utils/server';
import { Form, FormSubmit } from '~/components/ui/form';
import { Skeleton } from '~/components/ui/skeleton';
import { AudioPlayer } from '~/components/audio-player';
import { CustomMDX } from '~/components/mdx';
import { PostViewsCount } from '~/components/post-views';
import { Spinner } from '~/components/spinner';

import { AddHeartForm } from './add-heart-form';
import { CommentsManager } from './comments-manager';
import { HeartButton } from './heart-button';
import { SocialShare } from './social-share';
import { SummarizeButton } from './summarize-button';

interface BlogProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: BlogProps): Metadata {
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
  noStore();
  const hearts = await db.query.hearts.findFirst({
    where: (hearts, { eq }) => eq(hearts.slug, slug),
  });
  return <AddHeartForm initialValue={hearts?.count} slug={slug} />;
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
          <Form
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
          </Form>
        </div>
      ) : (
        <div className='flex items-center gap-2'>
          <p>You are signed in as {session.user.name}.</p>
          <Form
            action={async () => {
              'use server';
              return await signOut();
            }}
          >
            <FormSubmit pendingFallback={<Spinner />}>
              <LogOut />
            </FormSubmit>
          </Form>
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
  const post = getBlogPosts().find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  const { metadata } = post;
  const components: Record<string, any> = {};

  if (metadata.components) {
    const parsedJSON = JSON.parse(metadata.components);
    if (Array.isArray(parsedJSON)) {
      for (let component of parsedJSON as string[]) {
        components[component] = (
          await import(`../../../content/components/${component}`)
        ).default;
      }
    }
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
      <h1 className='title font-mono text-2xl font-semibold tracking-tighter'>
        {post.metadata.title}
      </h1>
      <div className='mb-8 mt-4 flex flex-col justify-between gap-3 text-sm sm:flex-row sm:items-center'>
        <div className='flex items-center gap-3'>
          <p className='text-sm text-neutral-600 dark:text-neutral-400'>
            {formatDate(post.metadata.publishedAt)}
          </p>
          <SummarizeButton blogTitle={blogTitle} />
        </div>
        <Suspense fallback={<Spinner variant='ellipsis' />}>
          <PostViewsCount slug={post.slug} updateViews>
            {(count) => (
              <span className='flex items-center gap-2'>
                <Eye /> {count}
              </span>
            )}
          </PostViewsCount>
        </Suspense>
      </div>
      <div className='mb-8'>
        <h2 className='mb-4'>
          {"Don't have enough time? Listen the audio version!!!"}
        </h2>
        <AudioPlayer
          src={`${BLOB_STORAGE_URL}/${post.slug}.mp3`}
          title={post.metadata.title}
        />
      </div>
      <article className='prose min-w-full dark:prose-invert'>
        <CustomMDX source={post.content} components={components} />
      </article>
      <div className='mt-8 space-y-4'>
        <p className='text-[#D4AF37] text-lg'>
          If you enjoyed this blog, drop some hearts below and share this blog
          on social media to help others find it too.
        </p>
        <div className='flex gap-4 items-center'>
          <Suspense fallback={<HeartButton count={0} />}>
            <Hearts slug={post.slug} />
          </Suspense>
          <SocialShare title={post.metadata.title} slug={post.slug} />
        </div>
      </div>
      <div className='mt-8'>
        <h2
          className='mb-4 font-mono text-xl font-bold sm:text-2xl'
          id='comments'
        >
          Comments
        </h2>
        <Suspense fallback={<Spinner variant='ellipsis' />}>
          <CommentsSection slug={post.slug} />
        </Suspense>
      </div>
    </section>
  );
}
