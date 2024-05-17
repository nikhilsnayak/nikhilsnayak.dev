import { ThemeToggle } from '../theme-toggle';
import { BotLink } from './bot-link';
import { NavLink } from './nav-link';

export function Header() {
  return (
    <header className='sticky top-0 z-50 w-full shadow-md backdrop-blur'>
      <div className='mx-auto flex max-w-screen-lg items-center gap-4 px-2 py-4'>
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
      </div>
    </header>
  );
}
