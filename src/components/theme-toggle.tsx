'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

import { useIsClient } from '~/hooks/use-is-client';
import { detailEase } from '~/lib/motion';

const themes = [
  { value: 'light', label: 'Light theme', Icon: Sun },
  { value: 'dark', label: 'Dark theme', Icon: Moon },
  { value: 'system', label: 'System theme', Icon: Monitor },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const ready = useIsClient();
  const [pointer, setPointer] = useState(false);
  const index = themes.findIndex(({ value }) => value === theme);
  return (
    <fieldset className='before:border-border relative flex w-fit shrink-0 before:pointer-events-none before:absolute before:inset-[3px] before:rounded-full before:border'>
      <legend className='sr-only'>Color theme</legend>
      {ready && index >= 0 && (
        <motion.span
          aria-hidden='true'
          className='bg-secondary pointer-events-none absolute top-1.5 left-1.5 size-8 rounded-full'
          initial={false}
          animate={{ x: index * 44 }}
          transition={{ duration: !pointer ? 0 : 0.18, ease: detailEase }}
        />
      )}
      {themes.map(({ value, label, Icon }) => (
        <button
          key={value}
          type='button'
          className='focus-ring text-muted-foreground hover:text-foreground aria-pressed:text-foreground relative inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full'
          aria-label={label}
          aria-pressed={ready && theme === value}
          onClick={(event) => {
            setPointer(event.detail > 0);
            if (theme === value) return;
            setTheme(value);
          }}
        >
          <Icon className='size-3.5' />
        </button>
      ))}
    </fieldset>
  );
}
