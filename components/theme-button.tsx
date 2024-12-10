'use client';

import { useEffect, useState, type PropsWithChildren } from 'react';
import { useTheme } from 'next-themes';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';

interface ThemeButtonProps extends PropsWithChildren {
  type: 'light' | 'dark' | 'system';
}

export function ThemeButton({ type, children }: Readonly<ThemeButtonProps>) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => setTheme(type)}
      className={cn(
        'rounded-full p-2 hover:bg-background/50',
        mounted && theme === type && 'bg-background'
      )}
    >
      <span className='sr-only'>{type}</span>
      {children}
    </Button>
  );
}
