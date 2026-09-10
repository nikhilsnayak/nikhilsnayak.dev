'use client';

import dynamic from 'next/dynamic';
import { catchError } from 'next/error';

const TodoAsync = dynamic(() => import('./todo-async'), { ssr: false });

const Boundary = catchError((_props: object, { error, reset }) => (
  <div className='not-prose flex flex-col items-center justify-center gap-3 bg-gray-100 p-4 text-gray-900 dark:bg-gray-800 dark:text-gray-100'>
    <p className='text-center'>
      {`App Crashed: ${error instanceof Error ? error.message : 'Something went wrong'}`}
    </p>
    <button
      onClick={reset}
      className='bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800'
    >
      Reset
    </button>
  </div>
));

export default function App() {
  return (
    <Boundary>
      <TodoAsync />
    </Boundary>
  );
}
