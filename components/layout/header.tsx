import { ThemeToggle } from '../theme-toggle';
import { BotLink } from './bot-link';
import { NavLink } from './nav-link';

export function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b shadow-md backdrop-blur'>
      <div className='mx-auto flex max-w-screen-lg items-center gap-4 px-2 py-4'>
        <nav className='flex flex-grow items-center justify-between'>
          <ul className='flex gap-4'>
            <li>
              <NavLink href='/'>home</NavLink>
            </li>
            <li>
              <NavLink href='/work'>work</NavLink>
            </li>
            <li>
              <NavLink href='/blogs'>blogs</NavLink>
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
