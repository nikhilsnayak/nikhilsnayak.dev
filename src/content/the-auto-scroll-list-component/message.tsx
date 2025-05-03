'use client';

import { useStreamableValue, type StreamableValue } from 'ai/rsc';

export function UserMessage({ children }: Readonly<{ children: string }>) {
  return (
    <p className='rounded-lg rounded-br-none bg-purple-100 p-3 text-purple-800 dark:bg-purple-900 dark:text-purple-100'>
      {children}
    </p>
  );
}

export function AssistantMessage({
  children,
}: Readonly<{ children: StreamableValue }>) {
  const [value] = useStreamableValue(children);
  return (
    <p className='rounded-lg rounded-bl-none bg-gray-200 p-3 text-gray-800 dark:bg-gray-700 dark:text-gray-100'>
      {value}
    </p>
  );
}
