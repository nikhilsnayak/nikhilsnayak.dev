import { ThemeToggle } from '../theme-toggle';
import { BotLink } from './bot-link';
import { NavLink } from './nav-link';

export function Header() {
  return (
    <header className='sticky top-0 z-10 flex items-center gap-4 bg-background px-4 py-2 text-foreground drop-shadow-md lg:rounded-bl-lg lg:rounded-br-lg'>
      <nav className='flex flex-grow items-center justify-between'>
        <ul className='flex gap-2'>
          <li>
            <NavLink href='/'>Home</NavLink>
          </li>
          <li>
            <NavLink href='/work'>Work</NavLink>
          </li>
        </ul>
        <ul>
          <li className='grid place-items-center'>
            <BotLink />
          </li>
        </ul>
      </nav>
      <ThemeToggle />
    </header>
  );
}
