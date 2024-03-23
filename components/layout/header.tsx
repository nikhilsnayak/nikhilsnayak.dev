import Link from "next/link";
import { ModeToggle } from "../mode-toggle";

export function Header() {
  return (
    <header className="flex justify-between px-4 py-2 lg:rounded-md drop-shadow-md items-center sticky top-0 bg-background text-foreground z-10">
      <nav>
        <ul className="flex gap-2">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/">Work</Link>
          </li>
          <li>
            <Link href="/">Blogs</Link>
          </li>
        </ul>
      </nav>
      <ModeToggle />
    </header>
  );
}
