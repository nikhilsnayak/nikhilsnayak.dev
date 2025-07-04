import { SiX } from '@icons-pack/react-simple-icons';
import { Link, ShareIcon } from 'lucide-react';

import { BASE_URL } from '~/lib/constants';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { CopyToClipBoard } from '~/components/copy-to-clipboard';

export function SocialShare({
  slug,
  title,
}: Readonly<{ slug: string; title: string }>) {
  const postLink = `${BASE_URL}/blog/${slug}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='text-foreground ml-2 size-4 p-0 align-text-bottom'
        >
          <ShareIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='right'>
        <DropdownMenuItem>
          <CopyToClipBoard
            className='flex w-full items-center gap-2'
            content={postLink}
          >
            <Link className='size-3' /> <span>Copy link</span>
          </CopyToClipBoard>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this blog post: ${title} - ${postLink} by @_nikhilsnayak_`)}`}
            className='flex w-full items-center gap-2'
            target='_blank'
            rel='noopener noreferrer'
          >
            <SiX className='size-3' /> <span>Share on X</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
