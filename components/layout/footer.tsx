import { Github, Linkedin, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="text-center text-xl">
      <a
        href="mailto:nikhilsnayak3473@gmail.com"
        className="font-bold hover:underline hover:opacity-70 dark:text-fluorescent"
      >
        nikhilsnayak3473@gmail.com
      </a>
      <ul className="mt-4 flex items-center justify-center gap-4">
        <li className="hover:opacity-70">
          <a
            href="https://x.com/_nikhilsnayak_"
            className="dark:text-fluorescent"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="twitter"
          >
            <Twitter />
          </a>
        </li>
        <li className="hover:opacity-70">
          <a
            href="https://github.com/nikhilsnayak3473"
            className="dark:text-fluorescent"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="github"
          >
            <Github />
          </a>
        </li>
        <li className="hover:opacity-70">
          <a
            href="https://linkedin.com/in/nikhilsnayak3473"
            className="dark:text-fluorescent"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="linkedin"
          >
            <Linkedin />
          </a>
        </li>
        <li className="hover:opacity-70">
          <a
            href="https://instagram.com/_nikhilsnayak_"
            className="dark:text-fluorescent"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="instagram"
          >
            <Instagram />
          </a>
        </li>
      </ul>
    </footer>
  );
}
