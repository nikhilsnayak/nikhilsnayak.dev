'use client';

import { useChat } from 'ai/react';
import { toast } from 'sonner';
import Markdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';
import { LoadingSpinner } from '@/assets/icons';

function BotMessage({ content }: { content: string }) {
  return (
    <div className='max-w-full'>
      <p className='max-w-max whitespace-pre-wrap rounded-lg bg-gray-100 p-2 dark:bg-gray-800'>
        <Markdown>{content}</Markdown>
      </p>
    </div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className='max-w-full'>
      <p className='ml-auto max-w-max whitespace-pre-wrap rounded-lg bg-gray-800 p-2 text-gray-100 dark:bg-gray-100 dark:text-gray-800'>
        {content}
      </p>
    </div>
  );
}

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      onError: (e) => {
        toast(e.message);
      },
    });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollArea = scrollRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    );
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  return (
    <div className='flex h-[70dvh] w-full flex-col gap-4'>
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
        <Button disabled={isLoading} size='sm'>
          {isLoading ? <LoadingSpinner /> : 'Ask Zoro'}
        </Button>
      </form>
    </div>
  );
}
