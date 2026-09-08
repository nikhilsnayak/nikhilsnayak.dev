import type { Route } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';

import { FormSubmit } from '~/components/form-submit';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { auth } from '~/lib/auth';

import { getCommentsBySlug } from '../functions/queries';
import { CommentsManager } from './comments-manager';

export async function CommentsSection({ slug }: Readonly<{ slug: string }>) {
  await connection();
  const session = await auth.api.getSession({ headers: await headers() });
  const initialComments = await getCommentsBySlug(slug);
  const user = session?.user
    ? { id: session.user.id, name: session.user.name, image: session.user.image }
    : null;

  return (
    <div className='max-w-160'>
      {!session?.user ? (
        <form
          className='mb-8 flex flex-wrap items-baseline gap-x-6 gap-y-2'
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
          <p className='text-muted-foreground max-w-64 text-sm leading-7'>
            A question, a correction, a different take?
          </p>
          <FormSubmit
            variant='link'
            className='text-foreground decoration-foreground/35 min-h-11 px-0 text-xs font-normal underline underline-offset-4 hover:decoration-current'
            pendingFallback={<output>Opening GitHub…</output>}
          >
            Sign in with GitHub
          </FormSubmit>
        </form>
      ) : (
        <div className='mb-4 flex items-center justify-between gap-4'>
          <div className='flex min-w-0 items-center gap-3'>
            <Avatar className='size-6 rounded-full grayscale'>
              <AvatarImage alt='' src={session.user.image ?? ''} />
              <AvatarFallback className='font-mono text-xs'>
                {session.user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p className='min-w-0 text-sm wrap-anywhere'>
              <span className='text-muted-foreground mb-0.5 block font-mono text-[10px]'>
                commenting as
              </span>
              {session.user.name}
            </p>
          </div>
          <form
            action={async () => {
              'use server';
              await auth.api.signOut({ headers: await headers() });
            }}
          >
            <FormSubmit
              variant='link'
              className='text-muted-foreground hover:text-foreground min-h-11 px-0 text-xs font-normal underline underline-offset-4'
              pendingFallback={<output className='w-full text-left'>Signing out…</output>}
            >
              Sign out
            </FormSubmit>
          </form>
        </div>
      )}
      <CommentsManager user={user} slug={slug} initialComments={initialComments} />
    </div>
  );
}
