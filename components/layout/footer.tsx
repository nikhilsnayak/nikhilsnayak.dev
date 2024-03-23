import { Github, Linkedin, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="text-center text-xl">
      <a
        href="mailto:nikhilsnayak3473@gmail.com"
        className="dark:text-fluorescent font-bold hover:opacity-70 hover:underline"
      >
        nikhilsnayak3473@gmail.com
      </a>
      <ul className="flex justify-center mt-4 gap-4 items-center">
        <li className="hover:opacity-70">
          <a
            href="https://x.com/_nikhilsnayak_"
            className="p-4 dark:text-fluorescent"
            target="_blank"
          >
            <Twitter />
          </a>
        </li>
        <li className="hover:opacity-70">
          <a
            href="https://github.com/nikhilsnayak3473"
            className="p-4 dark:text-fluorescent"
            target="_blank"
          >
            <Github />
          </a>
        </li>
        <li className="hover:opacity-70">
          <a
            href="https://linkedin.com/in/nikhilsnayak3473"
            className="p-4 dark:text-fluorescent"
            target="_blank"
          >
            <Linkedin />
          </a>
        </li>
        <li className="hover:opacity-70">
          <a
            href="https://instagram.com/_nikhilsnayak_"
            className="p-4 dark:text-fluorescent"
            target="_blank"
          >
            <Instagram />
          </a>
        </li>
      </ul>
    </footer>
  );
}
