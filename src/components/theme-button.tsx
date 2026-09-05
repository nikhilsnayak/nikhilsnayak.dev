'use client';

import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { type PropsWithChildren } from 'react';

import { Button } from '~/components/ui/button';
import { useIsClient } from '~/hooks/use-is-client';
import { cn } from '~/lib/utils';

interface ThemeButtonProps extends PropsWithChildren {
  type: 'light' | 'dark' | 'system';
}

export function ThemeButton({ type, children }: Readonly<ThemeButtonProps>) {
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();
  const isActive = isClient && theme === type;

  return (
    <div className='relative'>
      {isActive && (
        <motion.div
          layoutId='activeThemeIndicator'
          className='bg-muted absolute inset-0'
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
      <Button
        variant='ghost'
        size='icon'
        aria-pressed={isActive}
        aria-label={`${type === 'system' ? 'System' : type === 'dark' ? 'Dark' : 'Light'} theme`}
        onClick={() => setTheme(type)}
        className={cn(
          'relative z-10 p-2 transition-colors duration-200',
          isActive ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {children}
      </Button>
    </div>
  );
}
