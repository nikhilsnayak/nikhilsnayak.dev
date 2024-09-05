'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { generateId } from 'ai';
import { useActions, useAIState, useUIState } from 'ai/rsc';
import { BotIcon, CircleUserRound, LucideTrash2 } from 'lucide-react';
import { toast } from 'sonner';

import { AI } from '~/lib/ai';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { UserMessage } from '~/components/messages';
import { Spinner } from '~/components/spinner';

export function Chat() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState<typeof AI>();
  const [messages, setMessages] = useAIState<typeof AI>();
  const { continueConversation } = useActions<typeof AI>();

  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLLIElement>(null);
  const scrollAreaRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    const messagesEnd = messagesEndRef.current;
    if (!scrollArea || !messagesEnd) return;
    const observer = new MutationObserver(() => {
      messagesEnd.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });

    observer.observe(scrollArea, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className='h-[65dvh] space-y-4'>
      <ul
        ref={scrollAreaRef}
        className='h-[85%] border rounded overflow-y-auto p-4 space-y-4 no-scrollbar'
      >
        {conversation.map((message) => (
          <li key={message.id} className='border-b pb-4 flex gap-4 items-start'>
            <div>
              {message.role === 'user' ? <CircleUserRound /> : <BotIcon />}
            </div>
            <div className='prose prose-sm min-w-0 break-words dark:prose-invert overflow-x-auto'>
              {message.display}
            </div>
          </li>
        ))}
        {isPending ? <Spinner variant='ellipsis' /> : null}
        <li ref={messagesEndRef} />
      </ul>
      <form
        className='flex items-center gap-3'
        onSubmit={async (e) => {
          e.preventDefault();
          const value = input.trim();
          setInput('');
          if (!value) return;
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
            if ('error' in response) {
              toast.error(response.error);
            } else {
              setConversation((currentConversation) => [
                ...currentConversation,
                response,
              ]);
            }
          });
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
    </section>
  );
}
