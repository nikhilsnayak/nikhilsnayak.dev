'use client';

import { AutoScrollList } from '~/components/auto-scroll-list';

import { AssistantMessage, UserMessage } from './message';
import { useContinueConversation } from './use-continue-conversation';
import { UserInput } from './user-input';

export function V3() {
  const { messages, continueConversation, isPending } =
    useContinueConversation();

  return (
    <div className='not-prose w-full rounded border bg-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <AutoScrollList className='mb-4 h-[50vh] space-y-4 p-4'>
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
      </AutoScrollList>
      <UserInput action={continueConversation} isPending={isPending} />
    </div>
  );
}
