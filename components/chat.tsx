import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Chat() {
  return (
    <>
      <div className='flex-1 overflow-auto p-4'>
        <ScrollArea className='h-full w-full rounded-md border'>
          <div className='p-4 text-sm'>
            <div className='grid gap-4'>
              <div className='w-max rounded-lg bg-gray-100 p-3 dark:bg-gray-800'>
                <p>Coming Soon...</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
      <div className='flex h-16 items-center'>
        <Input
          className='mr-2 flex-1'
          placeholder='Type your message...'
          type='text'
        />
        <Button>Send</Button>
      </div>
    </>
  );
}
