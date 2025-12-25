import { Monitor, Moon, Sun } from 'lucide-react';

import { ThemeButton } from './theme-button';

export function ThemeToggle() {
  return (
    <div className='bg-muted flex gap-2 border'>
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
