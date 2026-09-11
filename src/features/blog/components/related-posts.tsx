import Link from 'next/link';
import { ViewTransition } from 'react';

import { viewTransitionName } from '~/lib/utils';

import { getPostConnectionsBySlug } from '../functions/queries';

export async function RelatedPosts({ slug }: { slug: string }) {
  const { relatedPosts } = await getPostConnectionsBySlug(slug);

  if (relatedPosts.length === 0) return null;

  return (
    <nav aria-labelledby='related-heading' className='border-border/60 mt-12 border-t pt-8'>
      <h2 id='related-heading' className='section-label mb-5'>
        related reading
      </h2>
      <ul className='space-y-5'>
        {relatedPosts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className='text-link focus-ring text-sm leading-6'>
              <ViewTransition
                name={viewTransitionName(post.slug)}
                default='none'
                share='article-title'
              >
                <h3>{post.metadata.title}</h3>
              </ViewTransition>
            </Link>
            <p className='text-muted-foreground mt-1 text-sm leading-6 text-pretty'>
              {post.metadata.summary}
            </p>
          </li>
        ))}
      </ul>
    </nav>
  );
}
