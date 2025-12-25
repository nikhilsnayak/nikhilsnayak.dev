'use client';

import { useControlStore } from './store';

export function Controls() {
  const { delay, shouldError, setDelay, setShouldError } = useControlStore();

  return (
    <div className='space-y-4 bg-gray-100 px-2 py-1 shadow-md dark:bg-gray-800'>
      <div className='flex flex-col space-y-2'>
        <label className='font-medium text-gray-700 dark:text-gray-300'>
          Delay (ms):
          <input
            type='range'
            min='0'
            max='5000'
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            className='w-full accent-blue-500'
          />
        </label>
        <span className='text-sm text-gray-600 dark:text-gray-400'>
          {delay}ms
        </span>
      </div>
      <label className='flex items-center gap-2 text-gray-700 dark:text-gray-300'>
        <input
          type='checkbox'
          checked={shouldError}
          onChange={(e) => setShouldError(e.target.checked)}
          className='size-4 accent-blue-500'
        />
        Should Error
      </label>
    </div>
  );
}
