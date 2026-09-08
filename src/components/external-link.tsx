'use client';

import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, type ComponentProps } from 'react';

import { detailEase } from '~/lib/motion';

export function ExternalLink({ children, ...props }: ComponentProps<'a'>) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      {...props}
      target='_blank'
      rel='noopener noreferrer'
      onPointerEnter={(event) => {
        if (
          event.pointerType === 'mouse' &&
          window.matchMedia('(hover: hover) and (pointer: fine)').matches
        )
          setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
    >
      {children}
      <motion.span
        className='external-arrow inline-flex shrink-0'
        aria-hidden='true'
        animate={{
          x: hovered ? 2 : 0,
          y: hovered ? -2 : 0,
        }}
        transition={{ duration: 0.14, ease: detailEase }}
      >
        <ArrowUpRight className='size-3.5' />
      </motion.span>
    </a>
  );
}
