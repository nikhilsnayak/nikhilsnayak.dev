'use client';

import { useEffect } from 'react';

/**
 * Scrolls the element with the given `id` into view on mount when the current
 * URL hash matches. Rendered inside the Suspense boundary it targets, so its
 * effect only runs once the streamed content (and the target element) exist —
 * unlike the browser's native hash scroll, which fires before streaming lands.
 */
export function ScrollToHash({
  id,
  behavior = 'smooth',
}: Readonly<{ id: string; behavior?: ScrollBehavior }>) {
  useEffect(() => {
    if (window.location.hash === `#${id}`) {
      document.getElementById(id)?.scrollIntoView({ behavior });
    }
  }, [id, behavior]);

  return null;
}
