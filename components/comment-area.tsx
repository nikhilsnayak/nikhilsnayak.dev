'use client';

import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { CommentsProps } from './comments';
import { useActionState } from 'react';
import { addComment } from '@/lib/actions/comments';

export function CommentArea({ slug }: CommentsProps) {
  const [error, action, isPending] = useActionState(addComment, undefined);
  return (
    <form action={action} className='flex flex-col gap-2'>
      <input type='text' name='slug' value={slug} hidden />
      <Textarea
        name='content'
        placeholder='Write a comment...'
        required
        minLength={3}
      />
      {error && <p className='text-red-500'>{error}</p>}
      <Button disabled={isPending} className='self-end'>
        {isPending ? '...' : 'Comment'}
      </Button>
    </form>
  );
}
