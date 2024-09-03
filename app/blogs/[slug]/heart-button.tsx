import { Heart } from 'lucide-react';

export function HeartButton({ count }: { count: number }) {
  return (
    <button
      className='flex items-center gap-1 rounded-full bg-red-100 p-2 text-red-500 transition-all hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
      aria-label={`Like. Current likes: ${count}`}
      type='submit'
    >
      <Heart className='size-6 fill-current animate-pulse' />
      <span className='font-semibold'>{count}</span>
    </button>
  );
}
