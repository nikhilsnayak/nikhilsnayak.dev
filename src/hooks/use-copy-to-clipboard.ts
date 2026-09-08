'use client';

import { useEffect, useRef, useState } from 'react';

export function useCopyToClipboard(content: string) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const attempt = useRef(0);
  useEffect(
    () => () => {
      clearTimeout(timeout.current);
      attempt.current++;
    },
    [],
  );

  async function copy() {
    const currentAttempt = ++attempt.current;
    clearTimeout(timeout.current);
    try {
      await navigator.clipboard.writeText(content);
      if (currentAttempt !== attempt.current) return;
      setStatus('copied');
      timeout.current = setTimeout(() => setStatus('idle'), 1200);
    } catch {
      if (currentAttempt !== attempt.current) return;
      setStatus('error');
    }
  }

  return { status, copy };
}
