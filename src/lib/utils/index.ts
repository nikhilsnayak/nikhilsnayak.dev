export { cn } from 'cn';

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

export function viewTransitionName(slug: string) {
  // `view-transition-name` must be a valid CSS <custom-ident>, which cannot
  // start with a digit. Slugs like "2-years-..." would otherwise produce an
  // invalid `::view-transition-group(...)` pseudo-element, so prefix to guarantee
  // a valid identifier. Keep this consistent across all matching transitions.
  return `vt-${slug.replace(/[^\w-]/g, '-')}`;
}

export function formatDate(date: Date) {
  return date
    .toLocaleString('en-us', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    .toLocaleLowerCase();
}

export const NumberFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
});
