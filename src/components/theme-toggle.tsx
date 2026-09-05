import { Monitor, Moon, Sun } from 'lucide-react';

import { ThemeButton } from './theme-button';

export function ThemeToggle() {
  return (
    <fieldset className='flex shrink-0 gap-1'>
      <legend className='sr-only'>Color theme</legend>
      <ThemeButton type='light'>
        <Sun />
      </ThemeButton>
      <ThemeButton type='dark'>
        <Moon />
      </ThemeButton>
      <ThemeButton type='system'>
        <Monitor />
      </ThemeButton>
    </fieldset>
  );
}
