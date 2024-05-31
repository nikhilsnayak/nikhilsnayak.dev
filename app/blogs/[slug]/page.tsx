import { notFound } from 'next/navigation';
import { CustomMDX } from '@/components/mdx';
import { BASE_URL } from '@/config/constants';
import { formatDate } from '@/lib/utils';
import { getBlogPosts } from '@/lib/utils/server';
import { Views } from '@/components/views';

interface BlogProps {
  params: { slug: string };
}

export function generateMetadata({ params }: BlogProps) {
  const post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return;
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
      <h1 className='title text-2xl font-semibold tracking-tighter'>
        {post.metadata.title}
      </h1>
      <div className='mb-8 mt-2 flex items-center justify-between text-sm'>
        <p className='text-sm text-neutral-600 dark:text-neutral-400'>
          {formatDate(post.metadata.publishedAt)}
        </p>
        <Views slug={post.slug} />
      </div>
      <article className='prose min-w-full dark:prose-invert'>
        <CustomMDX source={post.content} />
      </article>
    </section>
  );
}
