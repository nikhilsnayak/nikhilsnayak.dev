'use client';

import { useCallback, useState, type ComponentProps } from 'react';

import { AssistantMessage, UserMessage } from './message';
import { useContinueConversation } from './use-continue-conversation';
import { UserInput } from './user-input';

export function V2() {
  const { messages, continueConversation, isPending } =
    useContinueConversation();

  return (
    <div className='not-prose max-w-sm rounded border bg-gray-100 shadow dark:border-gray-700 dark:bg-gray-800'>
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

function AutoScrollList({
  className,
  ...rest
}: Readonly<Omit<ComponentProps<'ul'>, 'ref'>>) {
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const autoScrollListRef = useCallback(
    (list: HTMLUListElement) => {
      const observer = new MutationObserver(() => {
        if (shouldAutoScroll) {
          list.scrollTo({ top: list.scrollHeight });
        }
      });

      observer.observe(list, {
        subtree: true,
        childList: true,
        characterData: true,
      });

      return () => observer.disconnect();
    },
    [shouldAutoScroll]
  );

  return (
    <ul
      ref={autoScrollListRef}
      className={`overflow-y-auto ${className}`}
      onWheel={(e) => {
        const { scrollHeight, clientHeight, scrollTop } = e.currentTarget;
        const maxScrollHeight = scrollHeight - clientHeight;
        if (e.deltaY < 0) {
          setShouldAutoScroll(false);
        } else if (
          e.deltaY > 0 &&
          maxScrollHeight - scrollTop <= maxScrollHeight / 2
        ) {
          setShouldAutoScroll(true);
        }
      }}
      {...rest}
    />
  );
}
