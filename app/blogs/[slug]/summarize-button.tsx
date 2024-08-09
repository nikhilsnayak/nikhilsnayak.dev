'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/assets/icons';
import { generateId } from 'ai';
import { useActions, useUIState } from 'ai/rsc';

import { LoadingButton } from '@/components/ui/loading-button';
import { AI } from '@/app/bot/actions';
import { UserMessage } from '@/app/bot/chat';

export function SummarizeButton({ blogTitle }: { blogTitle: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [, setConversation] = useUIState<typeof AI>();
  const { continueConversation } = useActions<typeof AI>();

  const handleClick = () => {
    router.push('/bot');

    startTransition(async () => {
      setConversation((currentConversation) => [
        ...currentConversation,
        {
          id: generateId(),
          role: 'user',
          display: <UserMessage>{`Summarize "${blogTitle}" Blog`}</UserMessage>,
        },
      ]);

      const message = await continueConversation(
        `Summarize "${blogTitle}" Blog`
      );
      setConversation((currentConversation) => [
        ...currentConversation,
        message,
      ]);
    });
  };

  return (
    <LoadingButton
      isLoading={isPending}
      loadingIndicator={<LoadingSpinner className='fill-foreground' />}
      className='text-green-500 rounded-full'
      variant={'outline'}
      onClick={handleClick}
    >
      summarize with zoro
    </LoadingButton>
  );
}
