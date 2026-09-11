'use client';

import Link from 'next/link';
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
        This page couldn't load. Trying again usually works.
      </p>
      {error.digest ? (
        <p className='text-muted-foreground mt-5 font-mono text-xs'>
          error <span className='text-foreground select-all'>{error.digest}</span>
        </p>
      ) : null}
      <div className='mt-6 flex flex-wrap items-center gap-x-6 gap-y-2'>
        <Button
          variant='link'
          className='text-link h-auto p-0 font-mono text-xs font-normal'
          onClick={() => {
            startTransition(() => {
              router.refresh();
              reset();
            });
          }}
        >
          try again
        </Button>
        <Link href='/' className='text-link font-mono text-xs'>
          back to home
        </Link>
      </div>
    </section>
  );
}
