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

export function Chat({ suggestedQuestions }: { suggestedQuestions: string[] }) {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState<typeof AI>();
  const [messages, setMessages] = useAIState<typeof AI>();
  const { continueConversation } = useActions<typeof AI>();

  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLLIElement>(null!);
  const scrollAreaRef = useRef<HTMLUListElement>(null!);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    const messagesEnd = messagesEndRef.current;

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

  const handleSubmit = (value: string) => {
    if (!value.trim()) return;
    const id = generateId();
    setConversation((currentConversation) => [
      ...currentConversation,
      {
        id,
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
  };

  return (
    <section className='h-[65dvh] space-y-4'>
      <ul
        ref={scrollAreaRef}
        className='no-scrollbar h-[85%] space-y-4 overflow-y-auto rounded border p-4'
      >
        {conversation.length === 0 ? (
          <li className='text-center text-gray-500'>
            <p className='mb-4'>No messages yet. Try asking a question!</p>
            <div className='grid gap-2 md:grid-cols-2'>
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant='outline'
                  className='h-auto whitespace-normal px-3 py-2 text-start text-sm font-normal'
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
              <div className='prose prose-sm min-w-0 overflow-x-auto break-words dark:prose-invert'>
                {message.display}
              </div>
            </li>
          ))
        )}
        {isPending ? <Spinner variant='ellipsis' /> : null}
        <li ref={messagesEndRef} />
      </ul>
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
    </section>
  );
}
