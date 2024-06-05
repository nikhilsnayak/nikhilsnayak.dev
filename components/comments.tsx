import { Suspense } from 'react';
import { auth } from '@/config/auth';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { SignInButton } from './auth/signin-button';
import { SignOutButton } from './auth/signout-button';
import { CommentArea } from './comment-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { DeleteCommentControl, EditCommentControl } from './comment-controls';
import type { User } from 'next-auth';

interface CommentsProps {
  slug: string;
  user?: User;
}

async function Comments({ slug, user }: CommentsProps) {
  const comments = await db.query.comments.findMany({
    where: (commentsTable, { eq }) => eq(commentsTable.slug, slug),
    with: {
      user: true,
    },
    orderBy: (commentsTable, { desc }) => [desc(commentsTable.createdAt)],
  });

  if (comments.length === 0) {
    return <p>No comments yet.</p>;
  }

  return (
    <div className='space-y-6'>
      {comments.map((comment) => (
        <div key={comment.id} className='flex items-start gap-4'>
          <Avatar className='h-10 w-10 border'>
            <AvatarImage
              alt={comment.user.name ?? ''}
              src={comment.user.image ?? ''}
            />
            <AvatarFallback>{comment.user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className='flex flex-col gap-2'>
            <div>
              <h3 className='font-bold'>{comment.user.name}</h3>
              <span className='text-sm text-neutral-600 dark:text-neutral-400'>
                {formatDate(comment.createdAt.toISOString(), true)}
              </span>
            </div>
            <p>{comment.content}</p>
            {user && user.id === comment.userId ? (
              <div className='flex items-center gap-2'>
                <EditCommentControl comment={comment} />
                <DeleteCommentControl comment={comment} />
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentsSkeleton() {
  return new Array(3).fill(0).map((_, i) => (
    <div key={i} className='flex items-start gap-4'>
      <Skeleton className='h-10 w-10 rounded-full' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[120px]' />
        <Skeleton className='h-4 w-[300px]' />
      </div>
    </div>
  ));
}

export async function CommentsSection({ slug }: CommentsProps) {
  const session = await auth();
  return (
    <div className='space-y-8'>
      {!session || !session.user ? (
        <div className='space-y-2'>
          <p>Please sign in to comment.</p>
          <SignInButton />
        </div>
      ) : (
        <>
          <div className='flex items-center gap-2'>
            <p>You are signed in as {session.user.name}.</p>
            <SignOutButton />
          </div>
          <CommentArea slug={slug} />
        </>
      )}
      <Suspense fallback={<CommentsSkeleton />}>
        <Comments slug={slug} user={session?.user} />
      </Suspense>
    </div>
  );
}
