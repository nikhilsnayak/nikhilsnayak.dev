import { signIn } from '@/config/auth';
import { Button } from '../ui/button';
import { SiGithub } from '@icons-pack/react-simple-icons';

export function SignInButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('github');
      }}
    >
      <Button type='submit'>
        <SiGithub />
        <span className='ml-2'>Sign in with GitHub</span>
      </Button>
    </form>
  );
}
