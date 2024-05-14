'use client';

import { Message } from 'ai';
import { useChat } from 'ai/react';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';
import { useLocalStorage, useUnmount } from 'usehooks-ts';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/assets/icons';
import { LucideTrash2 } from 'lucide-react';
import Markdown from 'react-markdown';

interface MessageProps {
  content: string;
}

function BotMessage({ content }: Readonly<MessageProps>) {
  return (
    <div className='max-w-full'>
      <div className='max-w-max whitespace-pre-wrap rounded-md bg-gray-100 p-2 dark:bg-gray-800'>
        <Markdown className='prose prose-green dark:prose-invert'>
          {content}
        </Markdown>
      </div>
    </div>
  );
}

function UserMessage({ content }: Readonly<MessageProps>) {
  return (
    <div className='max-w-full'>
      <p className='ml-auto max-w-max whitespace-pre-wrap rounded-md bg-gray-800 p-2 text-gray-100 dark:bg-gray-100 dark:text-gray-800'>
        {content}
      </p>
    </div>
  );
}

export function Chat() {
  const [initialMessages, saveMessages] = useLocalStorage<Message[]>(
    'messages',
    []
  );

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    initialMessages,
    onError: (e) => {
      toast(e.message);
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useUnmount(() => {
    saveMessages(messages);
  });

  useEffect(() => {
    const scrollArea = scrollRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    );
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  return (
    <div className='flex h-[60dvh] w-full flex-col gap-4'>
      <div className='flex-1 overflow-auto'>
        <ScrollArea className='h-full w-full rounded-md border' ref={scrollRef}>
          <div className='p-4 text-sm'>
            <div className='grid gap-4'>
              {messages.map(({ id, content, role }) =>
                role === 'user' ? (
                  <UserMessage key={id} content={content} />
                ) : (
                  <BotMessage key={id} content={content} />
                )
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
      <form className='flex items-center gap-3' onSubmit={handleSubmit}>
        <Input
          className=''
          placeholder='Type your message...'
          type='text'
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <Button disabled={isLoading} size='sm' className='w-1/5 text-xs'>
          {isLoading ? <LoadingSpinner /> : 'Ask Zoro'}
        </Button>
        <Button size='icon' variant='outline' onClick={() => setMessages([])}>
          <LucideTrash2 />
          <span className='sr-only'>clear chat</span>
        </Button>
      </form>
    </div>
  );
}
