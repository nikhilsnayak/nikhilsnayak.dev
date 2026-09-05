'use client';

import { useRouter } from 'next/navigation';
import { startTransition, useEffect } from 'react';

import { Button } from '~/components/ui/button';

export default function ErrorFallback({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className='py-6 sm:py-10'>
      <h1 className='font-mono text-2xl font-medium tracking-tight'>Something went wrong</h1>
      <p className='text-muted-foreground mt-3 max-w-prose text-sm leading-relaxed'>
        This page couldn't load. You can try again.
      </p>
      <div className='mt-6'>
        <Button
          variant='link'
          className='text-foreground h-auto p-0 text-sm font-normal underline underline-offset-4'
          onClick={() => {
            startTransition(() => {
              router.refresh();
              reset();
            });
          }}
        >
          Try again
        </Button>
      </div>
    </section>
  );
}
