import { LogOut } from 'lucide-react';
import type { Route } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { GithubIcon } from '~/assets/icons/github';
import { FormSubmit } from '~/components/form-submit';
import { Spinner } from '~/components/spinner';
import { auth } from '~/lib/auth';

import { getCommentsBySlug } from '../functions/queries';
import { CommentsManager } from './comments-manager';

export async function CommentsSection({ slug }: Readonly<{ slug: string }>) {
  const session = await auth.api.getSession({ headers: await headers() });
  const initialComments = await getCommentsBySlug(slug);

  return (
    <div className='space-y-8'>
      {!session?.user ? (
        <div className='space-y-2'>
          <p>Please sign in to comment.</p>
          <form
            action={async () => {
              'use server';
              const { url } = await auth.api.signInSocial({
                body: {
                  provider: 'github',
                  callbackURL: `/blog/${slug}#comments`,
                },
                headers: await headers(),
              });
              if (url) {
                redirect(url as Route);
              }
            }}
          >
            <FormSubmit pendingFallback={<Spinner />}>
              <span className='flex items-center gap-2'>
                <GithubIcon />
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
              await auth.api.signOut({ headers: await headers() });
            }}
          >
            <FormSubmit pendingFallback={<Spinner />}>
              <LogOut />
            </FormSubmit>
          </form>
        </div>
      )}
      <CommentsManager session={session} slug={slug} initialComments={initialComments} />
    </div>
  );
}
