"use client";
import Link from "next/link";
import { ModeToggle } from "../mode-toggle";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-background px-4 py-2 text-foreground drop-shadow-md lg:rounded-md">
      <nav>
        <ul className="flex gap-2">
          <li>
            <Link
              href="/"
              className={cn(
                path === "/" &&
                  "after:block after:h-[2px] after:w-full after:bg-current after:dark:bg-fluorescent",
              )}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/work"
              className={cn(
                path === "/work" &&
                  "after:block after:h-[2px] after:w-full after:bg-current after:dark:bg-fluorescent",
              )}
            >
              Work
            </Link>
          </li>
        </ul>
      </nav>
      <ModeToggle />
    </header>
  );
}
