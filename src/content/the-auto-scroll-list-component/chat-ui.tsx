'use client';

import { AssistantMessage, UserMessage } from './message';
import { useContinueConversation } from './use-continue-conversation';
import { UserInput } from './user-input';

export function ChatUI() {
  const { messages, continueConversation, isPending } =
    useContinueConversation();

  return (
    <div className='not-prose w-full border bg-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <ul className='mb-4 h-[50vh] space-y-4 overflow-auto p-4'>
        {messages.map((message) => {
          return (
            <li key={message.id} className='flex'>
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
