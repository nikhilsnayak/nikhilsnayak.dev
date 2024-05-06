import { ThemeToggle } from '../theme-toggle';
import { NavLink } from './nav-link';

export function Header() {
  return (
    <header className='sticky top-0 z-10 flex items-center justify-between bg-background px-4 py-2 text-foreground drop-shadow-md lg:rounded-bl-lg lg:rounded-br-lg'>
      <nav>
        <ul className='flex gap-2'>
          <li>
            <NavLink href='/'>Home</NavLink>
          </li>
          <li>
            <NavLink href='/work'>Work</NavLink>
          </li>
        </ul>
      </nav>
      <ThemeToggle />
    </header>
  );
}
