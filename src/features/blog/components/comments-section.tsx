import { SiGithub } from '@icons-pack/react-simple-icons';
import { LogOut } from 'lucide-react';

import { auth, signIn, signOut } from '~/lib/auth';
import { FormSubmit } from '~/components/form-submit';
import { Spinner } from '~/components/spinner';

import { getCommentsBySlug } from '../functions/queries';
import { CommentsManager } from './comments-manager';

export async function CommentsSection({ slug }: Readonly<{ slug: string }>) {
  const session = await auth();
  const initialComments = await getCommentsBySlug(slug);

  return (
    <div className='space-y-8'>
      {!session?.user ? (
        <div className='space-y-2'>
          <p>Please sign in to comment.</p>
          <form
            action={async () => {
              'use server';
              await signIn('github');
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
              await signOut();
            }}
          >
            <FormSubmit pendingFallback={<Spinner />}>
              <LogOut />
            </FormSubmit>
          </form>
        </div>
      )}
      <CommentsManager
        session={session}
        slug={slug}
        initialComments={initialComments}
      />
    </div>
  );
}
