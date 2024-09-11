'use client';

import { useState, useTransition, type FormEvent, type ReactNode } from 'react';

import { continueConversation } from './actions';

export interface Message {
  id: string;
  role: 'user' | 'bot';
  display: ReactNode;
}

export default function GenUI() {
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
    <section className=' w-full p-4 border bg-background rounded-lg shadow-lg'>
      <ul className='space-y-4 mb-4 p-4 h-[60vh] overflow-auto relative rounded-lg'>
        {messages.length === 0 ? (
          <li className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground'>
            No Conversation
          </li>
        ) : (
          messages.map((message) => (
            <li key={message.id} className=' w-full border-b py-4'>
              {message.role.toUpperCase()}: {message.display}
            </li>
          ))
        )}
        {isPending ? <li className='w-full'>Thinking...</li> : null}
      </ul>
      <form className='grid gap-4 grid-cols-8' onSubmit={handleSubmit}>
        <input
          type='text'
          name='query'
          className='flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 col-span-6'
          placeholder='Enter your message...'
        />
        <button
          type='submit'
          disabled={isPending}
          className='p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none disabled:bg-blue-300 col-span-2'
        >
          Ask
        </button>
      </form>
    </section>
  );
}
