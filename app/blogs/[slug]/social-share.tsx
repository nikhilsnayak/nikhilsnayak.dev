import { SiLinkedin, SiX } from '@icons-pack/react-simple-icons';
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

export function SocialShare({ slug, title }: { slug: string; title: string }) {
  const postLink = `${BASE_URL}/blogs/${slug}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size={'icon'}>
          <ShareIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='right'>
        <DropdownMenuItem>
          <CopyToClipBoard
            className='flex items-center gap-2 w-full'
            content={postLink}
          >
            <Link className='size-3' /> <span>Copy link</span>
          </CopyToClipBoard>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this blog post: ${title} - ${postLink} by @_nikhilsnayak_`)}`}
            className='flex items-center gap-2 w-full'
            target='_blank'
            rel='noopener noreferrer'
          >
            <SiX className='size-3' /> <span>Share on X</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postLink)}`}
            className='flex items-center gap-2 w-full'
            target='_blank'
            rel='noopener noreferrer'
          >
            <SiLinkedin className='size-3' />
            <span>Share on Linkedin</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
