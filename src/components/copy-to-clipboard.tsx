'use client';

import { startTransition, type ComponentProps } from 'react';
import posthog from 'posthog-js';
import { toast } from 'sonner';

interface CopyToClipBoardProps extends ComponentProps<'button'> {
  content: string;
}

export function CopyToClipBoard({
  content,
  onClick,
  ...rest
}: Readonly<CopyToClipBoardProps>) {
  return (
    <button
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        startTransition(async () => {
          try {
            await navigator.clipboard.writeText(content);
            toast.success('Copied');
          } catch (error) {
            posthog.captureException(error);
            toast.error('Failed to Copy');
          }
        });
      }}
    />
  );
}
