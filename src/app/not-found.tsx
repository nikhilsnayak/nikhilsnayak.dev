import Link from 'next/link';

import { Button } from '~/components/ui/button';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center px-4 md:px-6'>
      <h1 className='text-foreground mt-6 font-mono text-3xl font-medium tracking-tighter sm:text-4xl'>
        Page Not Found
      </h1>
      <p className='text-muted-foreground mt-4 text-base'>
        Oops, the page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <div className='mt-6'>
        <Button render={<Link href='/' />}>Go back home</Button>
      </div>
    </div>
  );
}
