'use client';

import { useSelectedLayoutSegments } from 'next/navigation';

import { ExternalLink } from '~/components/external-link';

export function SourceLink() {
  const parts = useSelectedLayoutSegments();

  const isBlogPage = ['blog', 'blogs'].includes(parts.at(-2) ?? '');

  let href = 'https://github.com/nikhilsnayak/nikhilsnayak.dev';

  if (isBlogPage) {
    href = `${href}/blob/main/src/content/${parts.at(-1)}/post.mdx`;
  } else {
    const combinedParts = parts.join('/');
    href = `${href}/blob/main/src/app/${combinedParts ? `${combinedParts}/` : ''}page.tsx`;
  }

  return (
    <ExternalLink href={href} className='text-link gap-1' aria-label='source code'>
      source
    </ExternalLink>
  );
}
