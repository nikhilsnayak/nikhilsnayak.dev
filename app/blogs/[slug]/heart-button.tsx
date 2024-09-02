import { Heart } from 'lucide-react';

export function HeartButton({ count }: { count: number }) {
  return (
    <button
      className='flex items-center justify-center space-x-1 rounded-full bg-red-100 p-2 text-red-500 transition-all hover:bg-red-200 focus:outline-none'
      aria-label={`Like. Current likes: ${count}`}
      type='submit'
    >
      <Heart className='h-6 w-6 fill-current' />
      <span className='font-semibold'>{count}</span>
    </button>
  );
}
