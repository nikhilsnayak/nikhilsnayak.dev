import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function ChatSkeleton() {
  return (
    <div className='flex h-[60dvh] w-full flex-col gap-4'>
      <div className='flex-1 overflow-auto'>
        <div className='h-full w-full rounded-md border'>
          <div className='p-4 text-sm'>
            <div className='grid gap-4'>
              {new Array(5).fill(undefined).map((_, i) => {
                return (
                  <div className='mx-w-full' key={i}>
                    <Skeleton
                      className={cn('h-8 w-2/5', i % 2 === 0 && 'ml-auto')}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <form className='flex items-center gap-3'>
        <Input
          className=''
          placeholder='Type your message...'
          type='text'
          disabled
        />
        <Button size='sm' className='w-1/5' disabled>
          Ask Zoro
        </Button>
      </form>
    </div>
  );
}
