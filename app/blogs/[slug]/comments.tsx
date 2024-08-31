import { cache, Suspense } from 'react';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { LogOut, Pencil, Trash2 } from 'lucide-react';
import type { User } from 'next-auth';

import { auth, signIn, signOut } from '~/lib/auth';
import { db } from '~/lib/db';
import { type Comment } from '~/lib/db/schema';
import { formatDate } from '~/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { DialogForm } from '~/components/ui/dialog-form';
import { Form, FormError, FormSubmit } from '~/components/ui/form';
import { Skeleton } from '~/components/ui/skeleton';
import { Textarea } from '~/components/ui/textarea';
import { Spinner } from '~/components/spinner';

import { addComment, deleteComment, editComment } from './actions';

function INTERNAL__getComments(slug: string) {
  return db.query.comments.findMany({
    where: (commentsTable, { eq }) => eq(commentsTable.slug, slug),
    with: {
      user: true,
    },
    orderBy: (commentsTable, { desc }) => [desc(commentsTable.createdAt)],
  });
}

const getComments = cache(INTERNAL__getComments);

function EditCommentControl({ comment }: Readonly<{ comment: Comment }>) {
  return (
    <DialogForm
      action={editComment}
      trigger={
        <Button size='icon' variant='ghost'>
          <Pencil className='text-blue-400' />
        </Button>
      }
    >
      <DialogHeader>
        <DialogTitle>Edit Comment</DialogTitle>
      </DialogHeader>
      <input type='text' name='id' value={comment.id} hidden readOnly />
      <Textarea
        name='content'
        placeholder='Write a comment...'
        required
        minLength={3}
        defaultValue={comment.content}
      />
      <FormError />
      <DialogFooter>
        <FormSubmit pendingFallback={<Spinner />}>Save changes</FormSubmit>
      </DialogFooter>
    </DialogForm>
  );
}

function DeleteCommentControl({ id }: Readonly<{ id: string }>) {
  return (
    <DialogForm
      action={deleteComment}
      trigger={
        <Button size='icon' variant='ghost'>
          <Trash2 className='text-red-400' />
        </Button>
      }
    >
      <DialogHeader>
        <DialogTitle>Delete Comment</DialogTitle>
      </DialogHeader>
      <input type='text' name='id' value={id} hidden readOnly />
      <p>Are you sure you want to delete this comment?</p>
      <FormError />
      <DialogFooter>
        <FormSubmit variant='destructive' pendingFallback={<Spinner />}>
          Continue
        </FormSubmit>
      </DialogFooter>
    </DialogForm>
  );
}

interface CommentsProps {
  slug: string;
  user?: User;
}

async function Comments({ slug, user }: Readonly<CommentsProps>) {
  const comments = await getComments(slug);

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
                <DeleteCommentControl id={comment.id} />
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

export async function CommentsSection({ slug }: Readonly<CommentsProps>) {
  getComments(slug);
  const session = await auth();
  return (
    <div className='space-y-8'>
      {!session?.user ? (
        <div className='space-y-2'>
          <p>Please sign in to comment.</p>
          <Form
            action={async () => {
              'use server';
              return await signIn('github');
            }}
          >
            <FormSubmit pendingFallback={<Spinner />}>
              <span className='flex items-center gap-2'>
                <SiGithub />
                <span>Sign in with GitHub</span>
              </span>
            </FormSubmit>
          </Form>
        </div>
      ) : (
        <>
          <div className='flex items-center gap-2'>
            <p>You are signed in as {session.user.name}.</p>
            <Form
              action={async () => {
                'use server';
                return await signOut();
              }}
            >
              <FormSubmit pendingFallback={<Spinner />}>
                <LogOut />
              </FormSubmit>
            </Form>
          </div>
          <Form action={addComment} className='flex flex-col gap-2'>
            <input type='text' name='slug' value={slug} hidden readOnly />
            <Textarea
              name='content'
              placeholder='Write a comment...'
              required
              minLength={3}
            />
            <FormError />
            <FormSubmit className='self-end' pendingFallback={<Spinner />}>
              Comment
            </FormSubmit>
          </Form>
        </>
      )}
      <Suspense fallback={<CommentsSkeleton />}>
        <Comments slug={slug} user={session?.user} />
      </Suspense>
    </div>
  );
}
