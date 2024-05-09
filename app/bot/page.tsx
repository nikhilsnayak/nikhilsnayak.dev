import { zoro } from '@/assets/images';
import { Chat } from '@/components/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bot',
  description: 'My personal AI Chat Bot called Zoro which speaks about me',
};

export default function BotPage() {
  return (
    <section className='flex h-[70vh] w-full flex-col rounded-sm bg-gray-100 px-4 py-2 dark:bg-gray-950'>
      <header className='flex h-16 items-center'>
        <div className='flex items-center gap-3'>
          <Avatar className='h-12 w-12 ring ring-green-500'>
            <AvatarImage alt='zoro' src={zoro.src} fetchPriority='high' />
            <AvatarFallback>Z</AvatarFallback>
          </Avatar>
          <h1 className='text-3xl font-bold italic'>Zoro</h1>
        </div>
      </header>
      <Chat />
    </section>
  );
}
