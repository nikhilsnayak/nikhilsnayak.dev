'use client';

import { startTransition, type ComponentProps } from 'react';
import { toast } from 'sonner';

interface CopyToClipBoardProps
  extends Omit<ComponentProps<'button'>, 'onClick'> {
  content: string;
}

export function CopyToClipBoard({
  content,
  ...rest
}: Readonly<CopyToClipBoardProps>) {
  return (
    <button
      {...rest}
      onClick={() => {
        startTransition(async () => {
          try {
            await navigator.clipboard.writeText(content);
            toast.success('Copied');
          } catch (error) {
            console.error({ error });
            toast.error('Failed to Copy');
          }
        });
      }}
    />
  );
}
