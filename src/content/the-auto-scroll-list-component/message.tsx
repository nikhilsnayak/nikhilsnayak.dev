'use client';

import { useLayoutEffect, useState } from 'react';

export function UserMessage({ children }: Readonly<{ children: string }>) {
  return (
    <p className='rounded-lg rounded-br-none bg-purple-100 p-3 text-purple-800 dark:bg-purple-900 dark:text-purple-100'>
      {children}
    </p>
  );
}

export function AssistantMessage({
  children,
}: Readonly<{ children: AsyncGenerator<string, string> }>) {
  const value = useStreamableValue(children);
  return (
    <p className='rounded-lg rounded-bl-none bg-gray-200 p-3 text-gray-800 dark:bg-gray-700 dark:text-gray-100'>
      {value}
    </p>
  );
}

function useStreamableValue(streamable: AsyncGenerator<string, string>) {
  const [value, setValue] = useState<string>('');

  useLayoutEffect(() => {
    let isCancelled = false;

    async function readStream() {
      for await (const chunk of streamable) {
        if (isCancelled) break;
        setValue((prev) => prev + chunk);
      }
    }

    readStream().catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error reading stream:', error);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [streamable]);

  return value;
}
