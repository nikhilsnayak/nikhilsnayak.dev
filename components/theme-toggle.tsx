'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';

interface ThemeButtonProps extends PropsWithChildren {
  type: 'light' | 'dark' | 'system';
}

function ThemeButton({ type, children }: Readonly<ThemeButtonProps>) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => setTheme(type)}
      className={cn(
        'rounded-full p-2 hover:bg-background/50',
        theme === type && 'bg-background'
      )}
    >
      <span className='sr-only'>{type}</span>
      {children}
    </Button>
  );
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className='flex gap-2 rounded-full border bg-muted'>
      <span className='sr-only'>Toggle theme</span>
      <ThemeButton type='light'>
        <Sun />
      </ThemeButton>
      <ThemeButton type='dark'>
        <Moon />
      </ThemeButton>
      <ThemeButton type='system'>
        <Monitor />
      </ThemeButton>
    </div>
  );
}
