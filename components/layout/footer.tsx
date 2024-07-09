import dynamic from 'next/dynamic';
import { BotLink } from './bot-link';
const ThemeToggle = dynamic(() => import('../theme-toggle'), { ssr: false });

export function Footer() {
  return (
    <footer className='mx-auto mb-8 flex w-full max-w-screen-lg items-center justify-between border-t p-4'>
      <BotLink />
      <ThemeToggle />
    </footer>
  );
}
