'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { generateId } from 'ai';
import { useActions, useUIState } from 'ai/rsc';

import { LoadingButton } from '~/components/loading-button';
import { Spinner } from '~/components/spinner';

import type { AI } from '..';
import { UserMessage } from '../components/messages';

export function SummarizeButton({
  blogTitle,
}: Readonly<{ blogTitle: string }>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [, setConversation] = useUIState<typeof AI>();
  const { continueConversation } = useActions<typeof AI>();

  const handleClick = () => {
    router.push('/bot');

    startTransition(async () => {
      const prompt = `Summarize "${blogTitle}" Blog`;
      setConversation((currentConversation) => [
        ...currentConversation,
        {
          id: generateId(),
          role: 'user',
          display: <UserMessage>{prompt}</UserMessage>,
        },
      ]);
      const response = await continueConversation(prompt);
      setConversation((currentConversation) => [
        ...currentConversation,
        response,
      ]);
    });
  };

  return (
    <LoadingButton
      isLoading={isPending}
      loadingIndicator={<Spinner />}
      className='rounded-full text-green-500'
      variant={'outline'}
      onClick={handleClick}
    >
      summarize with zoro
    </LoadingButton>
  );
}
