'use client';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useActionState } from 'react';
import { addComment } from '@/lib/actions/comments';
import { LoadingSpinner } from '@/assets/icons';

interface CommentAreaProps {
  slug: string;
}

export function CommentArea({ slug }: CommentAreaProps) {
  const [error, action, isPending] = useActionState(addComment, undefined);
  return (
    <form action={action} className='flex flex-col gap-2'>
      <input type='text' name='slug' value={slug} hidden readOnly />
      <Textarea
        name='content'
        placeholder='Write a comment...'
        required
        minLength={3}
      />
      {error && <p className='text-red-500'>{error}</p>}
      <Button disabled={isPending} className='flex items-center gap-2 self-end'>
        <span>Comment</span>
        {isPending ? <LoadingSpinner className='fill-background' /> : null}
      </Button>
    </form>
  );
}
