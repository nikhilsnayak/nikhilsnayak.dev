'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';

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
    <motion.a
      href={href}
      className='dark:text-accent block max-w-max text-xs tracking-tighter underline'
      target='_blank'
      rel='noopener noreferrer'
      aria-label='source code'
      whileHover={{ opacity: 0.8 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      view source
    </motion.a>
  );
}
