import { signOut } from '@/config/auth';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';

export function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <Button type='submit' size='icon'>
        <LogOut />
      </Button>
    </form>
  );
}
