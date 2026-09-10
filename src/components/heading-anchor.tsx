'use client';

import { toast } from 'sonner';

export function HeadingAnchor({ slug, label }: { slug: string; label: string }) {
  return (
    <a
      href={`#${slug}`}
      className='anchor focus-ring'
      aria-label={`Link to ${label}`}
      onClick={() => {
        const url = `${window.location.origin}${window.location.pathname}#${slug}`;
        const copied = navigator.clipboard?.writeText(url);
        if (copied)
          void copied.then(
            () => toast.success('Link copied'),
            () => {},
          );
      }}
    />
  );
}
