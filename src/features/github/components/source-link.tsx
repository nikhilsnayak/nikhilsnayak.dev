'use client';

import { usePathname } from 'next/navigation';

export function SourceLink() {
  const path = usePathname();
  const parts = path.split('/').slice(1);

  const isBlogPage = ['blog', 'blogs'].includes(parts.at(-2) ?? '');

  let href = 'https://github.com/nikhilsnayak/nikhilsnayak.dev';

  if (isBlogPage) {
    href = `${href}/blob/main/src/content/${parts.at(-1)}/post.mdx`;
  } else {
    const combinedParts = parts.join('/');
    href = `${href}/blob/main/src/app/${combinedParts ? `${combinedParts}/` : ''}page.tsx`;
  }

  return (
    <a
      href={href}
      className='hover:text-foreground focus-ring underline-offset-4 hover:underline focus-visible:underline'
      target='_blank'
      rel='noopener noreferrer'
      aria-label='source code'
    >
      Source
    </a>
  );
}
