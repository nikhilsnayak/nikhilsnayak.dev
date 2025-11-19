'use client';

import { type PropsWithChildren } from 'react';
import { useTheme } from 'next-themes';

import { cn } from '~/lib/utils';
import { useIsClient } from '~/hooks/use-is-client';
import { Button } from '~/components/ui/button';

interface ThemeButtonProps extends PropsWithChildren {
  type: 'light' | 'dark' | 'system';
}

export function ThemeButton({ type, children }: Readonly<ThemeButtonProps>) {
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => setTheme(type)}
      className={cn(
        'hover:bg-background/50 rounded-full p-2',
        isClient && theme === type && 'bg-background'
      )}
    >
      <span className='sr-only'>{type}</span>
      {children}
    </Button>
  );
}
