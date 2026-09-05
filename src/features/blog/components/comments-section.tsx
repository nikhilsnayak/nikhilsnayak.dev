import type { Route } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { FormSubmit } from '~/components/form-submit';
import { auth } from '~/lib/auth';

import { getCommentsBySlug } from '../functions/queries';
import { CommentsManager } from './comments-manager';

export async function CommentsSection({ slug }: Readonly<{ slug: string }>) {
  const session = await auth.api.getSession({ headers: await headers() });
  const initialComments = await getCommentsBySlug(slug);

  return (
    <div className='max-w-(--breakpoint-sm) space-y-6'>
      {!session?.user ? (
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
          <FormSubmit
            variant='link'
            className='text-muted-foreground hover:text-foreground h-auto p-0 text-sm leading-6 font-normal underline underline-offset-4'
            pendingFallback={<output className='w-full text-left'>Signing in…</output>}
          >
            Sign in with GitHub to comment
          </FormSubmit>
        </form>
      ) : (
        <div className='text-muted-foreground flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm leading-6'>
          <p>Signed in as {session.user.name}</p>
          <form
            action={async () => {
              'use server';
              await auth.api.signOut({ headers: await headers() });
            }}
          >
            <FormSubmit
              variant='link'
              className='text-muted-foreground hover:text-foreground h-auto min-w-20 justify-start p-0 text-sm leading-6 font-normal underline underline-offset-4'
              pendingFallback={<output className='w-full text-left'>Signing out…</output>}
            >
              Sign out
            </FormSubmit>
          </form>
        </div>
      )}
      <CommentsManager session={session} slug={slug} initialComments={initialComments} />
    </div>
  );
}
