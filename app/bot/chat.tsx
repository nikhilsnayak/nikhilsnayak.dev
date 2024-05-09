'use client';

import { useState } from 'react';
import { AssistantContent, UserContent, type CoreMessage } from 'ai';
import { readStreamableValue } from 'ai/rsc';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { continueConversation } from './actions';

function BotMessage({ content }: { content: AssistantContent }) {
  return (
    <div className='max-w-full'>
      <p className='max-w-max whitespace-pre-wrap rounded-lg bg-gray-100 p-2 dark:bg-gray-800'>
        {content as string}
      </p>
    </div>
  );
}

function UserMessage({ content }: { content: UserContent }) {
  return (
    <div className='max-w-full'>
      <p className='ml-auto max-w-max whitespace-pre-wrap rounded-lg bg-gray-800 p-2 text-gray-100 dark:bg-gray-100 dark:text-gray-800'>
        {content as string}
      </p>
    </div>
  );
}

export function Chat() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState('');
  return (
    <div className='flex h-[55vh] w-full flex-col gap-4'>
      <div className='flex-1 overflow-auto'>
        <ScrollArea className='h-full w-full rounded-md border'>
          <div className='p-4 text-sm'>
            <div className='grid gap-4'>
              {/* <BotMessage content={'Coming soon...'} /> */}
              {messages.map((m, i) =>
                m.role === 'user' ? (
                  <UserMessage key={i} content={m.content} />
                ) : (
                  <BotMessage key={i} content={m.content as AssistantContent} />
                )
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
      <form
        className='flex items-center'
        action={async () => {
          const newMessages: CoreMessage[] = [
            ...messages,
            { content: input, role: 'user' },
          ];

          setMessages(newMessages);
          setInput('');

          const result = await continueConversation(newMessages);

          if ('error' in result) {
            setMessages((messages) => messages.slice(0, -1));
            toast.error(result.error as string);
            return;
          }

          for await (const content of readStreamableValue(result)) {
            setMessages([
              ...newMessages,
              {
                role: 'assistant',
                content: content as string,
              },
            ]);
          }
        }}
      >
        <Input
          className='mr-4 flex-1'
          placeholder='Type your message...'
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button size='sm'>Ask Zoro</Button>
      </form>
    </div>
  );
}
