import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { zoro } from '@/assets/images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatSkeleton } from './chat-skeleton';

const Chat = dynamic(() => import('./chat').then(({ Chat }) => Chat), {
  ssr: false,
  loading: () => <ChatSkeleton />,
});

export const metadata: Metadata = {
  title: 'Bot',
  description: 'My personal AI Chat Bot called Zoro which speaks about me',
};

export default function BotPage() {
  return (
    <section className='space-y-4'>
      <header className='flex items-center gap-3'>
        <Avatar className='ring ring-green-500 sm:h-12 sm:w-12'>
          <AvatarImage alt='zoro' src={zoro.src} fetchPriority='high' />
          <AvatarFallback>Z</AvatarFallback>
        </Avatar>
        <h1 className='animate-pulse bg-gradient-to-tr from-green-900 to-green-200 bg-clip-text font-mono text-2xl font-bold italic text-transparent sm:text-3xl'>
          Zoro
        </h1>
      </header>
      <Chat />
    </section>
  );
}
