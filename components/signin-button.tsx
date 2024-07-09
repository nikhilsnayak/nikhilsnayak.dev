'use client';
import { useActionState } from 'react';
import { Button } from './ui/button';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { signInWithGithub } from '@/lib/actions/auth';
import { LoadingSpinner } from '@/assets/icons';

export function SignInButton() {
  const [_, action, isPending] = useActionState(signInWithGithub, undefined);

  return (
    <form action={action}>
      <Button
        type='submit'
        disabled={isPending}
        className='flex items-center gap-2'
      >
        <SiGithub />
        <span>Sign in with GitHub</span>
        {isPending ? <LoadingSpinner className='fill-background' /> : null}
      </Button>
    </form>
  );
}
