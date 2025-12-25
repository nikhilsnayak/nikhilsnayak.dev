'use client';

import { type PropsWithChildren } from 'react';
import { motion } from 'motion/react';
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
  const isActive = isClient && theme === type;

  return (
    <motion.div
      className='relative'
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      {isActive && (
        <motion.div
          layoutId='activeThemeIndicator'
          className='bg-background absolute inset-0'
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
      <Button
        variant='ghost'
        size='icon'
        onClick={() => setTheme(type)}
        className={cn(
          'hover:bg-background/40! relative z-10 p-2 transition-colors duration-200'
        )}
      >
        <span className='sr-only'>{type}</span>
        {children}
      </Button>
    </motion.div>
  );
}
