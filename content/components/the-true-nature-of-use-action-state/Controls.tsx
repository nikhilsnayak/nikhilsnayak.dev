'use client';

import { useControlStore } from './store';

export default function Controls() {
  const { delay, shouldError, setDelay, setShouldError } = useControlStore();

  return (
    <div className='space-y-4 rounded-lg bg-gray-100 px-2 py-1 shadow-md dark:bg-gray-800'>
      <div className='flex flex-col space-y-2'>
        <label className='font-medium text-gray-700 dark:text-gray-300'>
          Delay (ms):
        </label>
        <input
          type='range'
          min='0'
          max='5000'
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          className='w-full accent-blue-500'
        />
        <span className='text-sm text-gray-600 dark:text-gray-400'>
          {delay}ms
        </span>
      </div>
      <div className='flex items-center space-x-2'>
        <input
          type='checkbox'
          checked={shouldError}
          onChange={(e) => setShouldError(e.target.checked)}
          className='size-4 accent-blue-500'
        />
        <label className='text-gray-700 dark:text-gray-300'>Should Error</label>
      </div>
    </div>
  );
}
