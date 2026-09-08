'use client';

import { Check, Link, ShareIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

import { XIcon } from '~/assets/icons/x';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard';
import { BASE_URL } from '~/lib/constants';
import { detailEase } from '~/lib/motion';

export function SocialShare({ slug, title }: Readonly<{ slug: string; title: string }>) {
  const postLink = `${BASE_URL}/blog/${slug}`;
  const { status, copy } = useCopyToClipboard(postLink);
  const [keyboard, setKeyboard] = useState(false);
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className='focus-ring text-muted-foreground hover:text-foreground aria-expanded:text-foreground inline-flex h-11 cursor-pointer items-center gap-2 bg-transparent p-0 text-sm leading-none'>
          <motion.span
            key={status}
            className='relative top-[-1.5px] shrink-0'
            aria-hidden='true'
            initial={{ opacity: keyboard ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.12, ease: detailEase }}
          >
            {status === 'copied' ? (
              <Check size={14} className='size-3.5' strokeWidth={1.5} />
            ) : (
              <ShareIcon size={14} className='size-3.5' strokeWidth={1.5} />
            )}
          </motion.span>
          <span className='inline-grid text-left'>
            <span className='invisible col-start-1 row-start-1'>Try again</span>
            <span className='col-start-1 row-start-1'>
              {status === 'copied' ? 'Copied' : status === 'error' ? 'Try again' : 'Share'}
            </span>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side='bottom'
          align='start'
          sideOffset={8}
          className='bg-background w-44 border p-1 shadow-[0_8px_24px_oklch(0_0_0/0.18)]'
        >
          <DropdownMenuItem
            className='text-muted-foreground data-highlighted:text-foreground data-highlighted:bg-foreground/5 [&_svg]:text-muted-foreground min-h-11 cursor-pointer gap-3 px-3 font-mono'
            onClick={(event) => {
              setKeyboard(event.detail === 0);
              void copy();
            }}
          >
            <Link size={14} className='size-3.5' strokeWidth={1.5} aria-hidden='true' />
            <span>Copy link</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='text-muted-foreground data-highlighted:text-foreground data-highlighted:bg-foreground/5 [&_svg]:text-muted-foreground min-h-11 cursor-pointer gap-3 px-3 font-mono'
            render={
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} — ${postLink}`)}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <XIcon width={14} height={14} className='size-3.5' aria-hidden='true' />
                <span>Share on X</span>
              </a>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <output className='sr-only'>
        {status === 'copied'
          ? 'Link copied'
          : status === 'error'
            ? 'Could not copy the link. Try again.'
            : ''}
      </output>
    </div>
  );
}
