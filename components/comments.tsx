import { auth } from '@/config/auth';
import { SignInButton } from './auth/signin-button';
import { SignOutButton } from './auth/signout-button';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

function CommentArea() {
  return (
    <form className='flex flex-col gap-2'>
      <Textarea name='comment' placeholder='Write a comment...' />
      <Button className='self-end'>Comment</Button>
    </form>
  );
}

export async function Comments() {
  const session = await auth();
  if (!session || !session.user) {
    return (
      <div className='space-y-2'>
        <p>Please sign in to comment.</p>
        <SignInButton />
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <div className='flex items-center gap-2'>
        <p>You are signed in as {session.user.name}.</p>
        <SignOutButton />
      </div>
      <CommentArea />
    </div>
  );
}
