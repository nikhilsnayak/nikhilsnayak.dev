import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center px-4 md:px-6'>
      <h1 className='mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-50'>
        Page Not Found
      </h1>
      <p className='mt-4 text-base text-gray-500 dark:text-gray-400'>
        Oops, the page you are looking for does not exist. It might have been
        moved or deleted.
      </p>
      <div className='mt-6'>
        <Link
          className='inline-flex items-center bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-gray-900/90 focus-visible:ring-1 focus-visible:ring-gray-950 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300'
          href='/'
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
