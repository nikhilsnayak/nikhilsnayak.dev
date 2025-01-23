'use client';

import { useState, useTransition, type FormEvent, type ReactNode } from 'react';

import { continueConversation } from './functions';

export interface Message {
  id: string;
  role: 'user' | 'bot';
  display: ReactNode;
}

export function GenUI() {
  const [messages, setMessages] = useState([] as Message[]);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query')?.toString()?.trim();
    e.currentTarget.reset();
    if (!query) return;

    setMessages((prev) => {
      const id = (Math.random() * 1000).toString();
      return [...prev, { id, role: 'user', display: <div>{query}</div> }];
    });

    startTransition(async () => {
      const response = await continueConversation(query);
      setMessages((prev) => {
        return [...prev, response];
      });
    });
  };

  return (
    <section className='bg-background w-full rounded-lg border p-4 shadow-lg'>
      <ul className='relative mb-4 h-[60vh] space-y-4 overflow-auto rounded-lg p-4'>
        {messages.length === 0 ? (
          <li className='text-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            No Conversation
          </li>
        ) : (
          messages.map((message) => (
            <li key={message.id} className='w-full border-b py-4'>
              {message.role.toUpperCase()}: {message.display}
            </li>
          ))
        )}
        {isPending ? <li className='w-full'>Thinking...</li> : null}
      </ul>
      <form className='grid grid-cols-8 gap-4' onSubmit={handleSubmit}>
        <input
          type='text'
          name='query'
          className='col-span-6 flex-1 rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-hidden'
          placeholder='Enter your message...'
        />
        <button
          type='submit'
          disabled={isPending}
          className='col-span-2 rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-hidden disabled:bg-blue-300'
        >
          Ask
        </button>
      </form>
    </section>
  );
}
