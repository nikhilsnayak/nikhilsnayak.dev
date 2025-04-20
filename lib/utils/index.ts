import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word characters except for -
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

export function deslugify(str: string) {
  return str
    .replace(/-and-/g, ' & ') // Replace '-and-' with '&'
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize the first letter of each word
    .trim(); // Remove whitespace from both ends of a string
}

export function getBreadCrumbItems(path: string) {
  return path
    .split('/')
    .filter(Boolean)
    .map((part, i, parts) => ({
      label: deslugify(part),
      href:
        i < parts.length - 1
          ? '/' + parts.slice(0, i + 1).join('/')
          : undefined,
    }));
}

export function formatDate(date: Date) {
  return date.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function executeAsyncFnWithoutBlocking(
  fn: () => Promise<void>,
  options?: {
    onError?: (error: unknown) => void;
  }
) {
  fn().catch((error) => {
    options?.onError?.(error);
  });
}
