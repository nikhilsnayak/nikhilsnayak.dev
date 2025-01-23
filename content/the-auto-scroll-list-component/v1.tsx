'use client';

import { useEffect, useRef } from 'react';

import { AssistantMessage, UserMessage } from './message';
import { useContinueConversation } from './use-continue-conversation';
import { UserInput } from './user-input';

export function V1() {
  const { messages, continueConversation, isPending } =
    useContinueConversation();

  const autoScrollListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = autoScrollListRef.current;
    if (!list) return;

    const observer = new MutationObserver(() => {
      list.scrollTo({ top: list.scrollHeight });
    });

    observer.observe(list, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className='not-prose max-w-sm rounded border bg-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <ul
        ref={autoScrollListRef}
        className='mb-4 h-[50vh] space-y-4 overflow-y-auto p-4'
      >
        {messages.map((message) => {
          return (
            <li key={message.id}>
              {message.role === 'assistant' ? (
                <AssistantMessage>{message.value}</AssistantMessage>
              ) : (
                <UserMessage>{message.value}</UserMessage>
              )}
            </li>
          );
        })}
      </ul>
      <UserInput action={continueConversation} isPending={isPending} />
    </div>
  );
}
