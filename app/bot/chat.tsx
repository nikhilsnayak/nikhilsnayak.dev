'use client';
import type { Message } from 'ai';
import { useEffect, useRef, useState } from 'react';
import { useChat } from 'ai/react';
import { toast } from 'sonner';
import { LucideTrash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/assets/icons';
import Cookies from 'js-cookie';

interface MessageProps {
  content: string;
}

function BotMessage({ content }: Readonly<MessageProps>) {
  return (
    <div className='max-w-full'>
      <p className='max-w-max whitespace-pre-wrap rounded-md bg-gray-100 p-2 dark:bg-gray-800'>
        {content}
      </p>
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

interface ChatProps {
  initialMessages: Message[];
}

export function Chat({ initialMessages }: ChatProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showSpinner, setShowSpinner] = useState(false);
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
      toast.error(e.message);
    },
    onResponse: () => {
      setShowSpinner(false);
    },
  });

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
    Cookies.set('messages', JSON.stringify(messages));
  }, [messages]);

  return (
    <div className='flex h-[60dvh] w-full flex-col gap-4'>
      <div className='flex-1 overflow-auto'>
        <ScrollArea
          className='h-full w-full rounded-md border'
          ref={scrollAreaRef}
        >
          <div className='p-4 text-sm'>
            <div className='grid gap-4'>
              {messages.map(({ id, content, role }) =>
                role === 'user' ? (
                  <UserMessage key={id} content={content} />
                ) : (
                  <BotMessage key={id} content={content} />
                )
              )}
              {showSpinner ? <LoadingSpinner /> : null}
            </div>
          </div>
        </ScrollArea>
      </div>
      <form
        className='flex items-center gap-3'
        onSubmit={(e) => {
          e.preventDefault();
          if (input.length < 5) {
            toast.error('Message must be minimum 5 characters');
          } else {
            setShowSpinner(true);
            handleSubmit(e);
          }
        }}
      >
        <Input
          placeholder='Type your message...'
          type='text'
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <Button
          disabled={isLoading}
          size='sm'
          className='w-1/5 text-xs'
          type='submit'
        >
          Ask Zoro
        </Button>
        <Button
          size='icon'
          variant='outline'
          onClick={() => setMessages([])}
          type='reset'
          disabled={isLoading || messages.length < 1}
        >
          <LucideTrash2 />
          <span className='sr-only'>clear chat</span>
        </Button>
      </form>
    </div>
  );
}
