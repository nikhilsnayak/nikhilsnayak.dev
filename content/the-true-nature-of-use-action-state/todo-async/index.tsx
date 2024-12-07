'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

const TodoAsync = dynamic(() => import('./todo-async'), { ssr: false });

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <TodoAsync />
    </ErrorBoundary>
  );
}

function FallbackComponent({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className='not-prose flex flex-col items-center justify-center gap-3 rounded-sm bg-gray-100 p-4 text-gray-900 dark:bg-gray-800 dark:text-gray-100'>
      <p className='text-center'>
        App Crashed: {error.message ?? 'Something went wrong'}
      </p>
      <button
        onClick={resetErrorBoundary}
        className='rounded bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800'
      >
        Reset
      </button>
    </div>
  );
}
