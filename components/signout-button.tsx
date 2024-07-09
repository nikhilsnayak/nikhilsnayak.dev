'use client';
import { useActionState } from 'react';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { logout } from '@/lib/actions/auth';
import { LoadingSpinner } from '@/assets/icons';

export function SignOutButton() {
  const [_, action, isPending] = useActionState(logout, undefined);
  return (
    <form action={action}>
      <Button type='submit' size='icon' disabled={isPending}>
        {isPending ? (
          <LoadingSpinner className='fill-background' />
        ) : (
          <LogOut />
        )}
      </Button>
    </form>
  );
}
