'use client';

import { usePathname } from 'next/navigation';

export function SourceLink() {
  const path = usePathname();
  const parts = path.split('/').slice(1);

  const isBlogPage = parts.at(-2) === 'blogs';

  let href = 'https://github.com/nikhilsnayak/nikhilsnayak.dev';

  if (isBlogPage) {
    href = `${href}/blob/main/content/${parts.at(-1)}.mdx`;
  } else {
    const combinedParts = parts.join('/');
    href = `${href}/blob/main/app/${combinedParts ? `${combinedParts}/` : ''}page.tsx`;
  }

  return (
    <a
      href={href}
      className='block text-xs tracking-tighter underline dark:text-fluorescent'
      target='_blank'
      rel='noopener noreferrer'
      aria-label='source code'
    >
      view source
    </a>
  );
}