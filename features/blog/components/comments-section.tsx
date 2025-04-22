import { Suspense } from 'react';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { LogOut } from 'lucide-react';

import { auth, signIn, signOut } from '~/lib/auth';
import { Skeleton } from '~/components/ui/skeleton';
import { FormSubmit } from '~/components/form-submit';
import { Spinner } from '~/components/spinner';

import { getCommentsBySlug } from '../functions/queries';
import { CommentsManager } from './comments-manager';

export async function CommentsSection({ slug }: Readonly<{ slug: string }>) {
  const commentsPromise = getCommentsBySlug(slug);

  const session = await auth();

  return (
    <div className='space-y-8'>
      {!session?.user ? (
        <div className='space-y-2'>
          <p>Please sign in to comment.</p>
          <form
            action={async () => {
              'use server';
              return await signIn('github', {
                redirectTo: `/blog/${slug}#comments`,
              });
            }}
          >
            <FormSubmit pendingFallback={<Spinner />}>
              <span className='flex items-center gap-2'>
                <SiGithub />
                <span>Sign in with GitHub</span>
              </span>
            </FormSubmit>
          </form>
        </div>
      ) : (
        <div className='flex items-center gap-2'>
          <p>You are signed in as {session.user.name}.</p>
          <form
            action={async () => {
              'use server';
              return await signOut({
                redirectTo: `/blog/${slug}#comments`,
              });
            }}
          >
            <FormSubmit pendingFallback={<Spinner />}>
              <LogOut />
            </FormSubmit>
          </form>
        </div>
      )}
      <Suspense fallback={<CommentsSkeleton />}>
        <CommentsManager
          session={session}
          slug={slug}
          initialCommentsPromise={commentsPromise}
        />
      </Suspense>
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
