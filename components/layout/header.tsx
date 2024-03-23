"use client";
import Link from "next/link";
import { ModeToggle } from "../mode-toggle";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const path = usePathname();
  return (
    <header className="flex justify-between px-4 py-2 lg:rounded-md drop-shadow-md items-center sticky top-0 bg-background text-foreground z-10">
      <nav>
        <ul className="flex gap-2">
          <li>
            <Link
              href="/"
              className={cn(
                path === "/" &&
                  "after:block after:w-full after:h-[2px] after:dark:bg-fluorescent after:bg-current",
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
                  "after:block after:w-full after:h-[2px] after:dark:bg-fluorescent after:bg-current",
              )}
            >
              Work
            </Link>
          </li>
          <li>
            <Link
              href="/blogs"
              className={cn(
                path === "/blogs" &&
                  "after:block after:w-full after:h-[2px] after:dark:bg-fluorescent after:bg-current",
              )}
            >
              Blogs
            </Link>
          </li>
        </ul>
      </nav>
      <ModeToggle />
    </header>
  );
}
