'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className='flex flex-col items-center justify-center px-4 md:px-6'>
      <h1 className='mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl'>
        Something went wrong!
      </h1>
      <div className='mt-6'>
        <Button
          onClick={() => {
            reset();
            router.refresh();
          }}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
