'use client';

// Error boundaries must be Client Components
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function ErrorFallback({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className='flex flex-col items-center justify-center px-4 md:px-6'>
      <h1 className='mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl'>
        Something went wrong!
      </h1>
      <div className='mt-6'>
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
