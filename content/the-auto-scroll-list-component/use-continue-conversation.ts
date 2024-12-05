'use client';

import { startTransition, useActionState, useOptimistic } from 'react';
import { StreamableValue } from 'ai/rsc';

import { continueConversation as continueConversationServerFn } from './functions';

interface UserMessage {
  id: string;
  role: 'user';
  value: string;
}

interface AssistantMessage {
  id: string;
  role: 'assistant';
  value: StreamableValue;
}

type Message = UserMessage | AssistantMessage;

export function useContinueConversation() {
  const [state, dispatch, isPending] = useActionState(
    async (prev: Message[], currentUserMessage: UserMessage) => {
      const streamable = await continueConversationServerFn(
        currentUserMessage.value
      );

      const assistantMessage: AssistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        value: streamable,
      };
      return [...prev, currentUserMessage, assistantMessage];
    },
    []
  );

  const [messages, setOptimisticMessages] = useOptimistic(state);

  const continueConversation = (formData: FormData) => {
    const query = formData.get('query') as string;

    const currentUserMessage: UserMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      value: query,
    };

    startTransition(() => {
      setOptimisticMessages((prev) => [...prev, currentUserMessage]);
      dispatch(currentUserMessage);
    });
  };

  return { messages, continueConversation, isPending };
}
