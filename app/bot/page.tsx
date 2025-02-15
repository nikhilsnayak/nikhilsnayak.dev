import type { Metadata } from 'next';
import { zoro } from '~/assets/images';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Chat } from '~/features/ai/components/chat';
import { getSuggestedQuestions } from '~/features/ai/functions/queries';

export const metadata: Metadata = {
  title: 'Bot',
  description: 'My personal AI Chat Bot called Zoro which speaks about me',
};

export const maxDuration = 60;

export default async function BotPage() {
  const suggestedQuestions = await getSuggestedQuestions();
  return (
    <section className='space-y-6'>
      <header className='flex items-center gap-3'>
        <Avatar className='ring-3 ring-green-500 sm:h-12 sm:w-12'>
          <AvatarImage alt='zoro' src={zoro.src} />
          <AvatarFallback>Z</AvatarFallback>
        </Avatar>
        <h1 className='animate-pulse bg-linear-to-br from-green-900 to-green-400 bg-clip-text font-mono text-2xl font-bold text-transparent italic sm:text-3xl'>
          Zoro
        </h1>
      </header>
      <Chat suggestedQuestions={suggestedQuestions} />
    </section>
  );
}
