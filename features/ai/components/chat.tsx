'use client';

import { startTransition, useState } from 'react';
import { generateId } from 'ai';
import { useActions, useAIState, useUIState } from 'ai/rsc';
import {
  BotIcon,
  CircleAlert,
  CircleUserRound,
  LucideTrash2,
  RefreshCw,
} from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { AutoScrollList } from '~/components/auto-scroll-list';

import type { AI } from '..';
import { refreshQuestions } from '../functions/mutations';
import { UserMessage } from './messages';

function RefreshButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      variant={'ghost'}
      size={'icon'}
      disabled={pending}
      className={cn(pending && 'animate-spin', 'rounded-full')}
    >
      <RefreshCw />
    </Button>
  );
}

export function Chat({
  suggestedQuestions,
}: Readonly<{ suggestedQuestions: string[] }>) {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState<typeof AI>();
  const [messages, setMessages] = useAIState<typeof AI>();
  const { continueConversation } = useActions<typeof AI>();

  const handleSubmit = (value: string) => {
    if (!value.trim()) return;
    setConversation((currentConversation) => [
      ...currentConversation,
      {
        id: generateId(),
        role: 'user',
        display: <UserMessage>{value}</UserMessage>,
      },
    ]);

    startTransition(async () => {
      const response = await continueConversation(value);
      setConversation((currentConversation) => [
        ...currentConversation,
        response,
      ]);
    });
  };

  return (
    <section className='h-[75vh] space-y-4'>
      <AutoScrollList className='styled-scrollbar h-[85%] space-y-4 rounded border p-4'>
        {conversation.length === 0 ? (
          <li className='text-center text-gray-500'>
            <div className='mb-3 flex items-center justify-center gap-3'>
              <p>No messages yet. Try asking a question!</p>
              <form action={refreshQuestions}>
                <RefreshButton />
                <span className='sr-only'>refresh questions</span>
              </form>
            </div>
            <div className='grid gap-2 md:grid-cols-2'>
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant='outline'
                  className='h-auto px-3 py-2 text-start text-sm font-normal whitespace-normal'
                  onClick={() => {
                    setInput('');
                    handleSubmit(question);
                  }}
                >
                  {question}
                </Button>
              ))}
            </div>
          </li>
        ) : (
          conversation.map((message) => (
            <li
              key={message.id}
              className='flex items-start gap-4 border-b pb-4'
            >
              <div>
                {message.role === 'user' ? <CircleUserRound /> : <BotIcon />}
              </div>
              <div className='prose prose-sm dark:prose-invert min-w-0 overflow-x-auto break-words'>
                {message.display}
              </div>
            </li>
          ))
        )}
      </AutoScrollList>
      <form
        className='flex items-center gap-3'
        onSubmit={(e) => {
          e.preventDefault();
          setInput('');
          handleSubmit(input);
        }}
      >
        <Input
          placeholder='Type your message...'
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          disabled={input.trim() === ''}
          size='sm'
          className='w-1/5 text-xs'
          type='submit'
        >
          Ask Zoro
        </Button>
        <Button
          size='icon'
          variant='outline'
          onClick={() => {
            setMessages([]);
            setConversation([]);
          }}
          type='reset'
          disabled={messages.length < 1 && conversation.length < 1}
        >
          <LucideTrash2 />
          <span className='sr-only'>clear chat</span>
        </Button>
      </form>
      <p className='text-center text-xs text-yellow-600'>
        <CircleAlert className='mr-2 inline-block size-4 align-text-bottom' />
        Zoro has a poor sense of direction and can get lost sometimes. Please
        verify the sources.
      </p>
    </section>
  );
}
