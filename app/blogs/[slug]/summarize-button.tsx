'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { generateId } from 'ai';
import { useActions, useUIState } from 'ai/rsc';
import { toast } from 'sonner';

import { AI } from '~/lib/ai';
import { LoadingButton } from '~/components/ui/loading-button';
import { UserMessage } from '~/components/messages';
import { Spinner } from '~/components/spinner';

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
    <LoadingButton
      isLoading={isPending}
      loadingIndicator={<Spinner />}
      className='text-green-500 rounded-full'
      variant={'outline'}
      onClick={handleClick}
    >
      summarize with zoro
    </LoadingButton>
  );
}
