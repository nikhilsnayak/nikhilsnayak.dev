'use client';

/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The overflowing code region needs keyboard focus for horizontal scrolling. */

import { Check, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard';
import { detailEase } from '~/lib/motion';

export function CodeFrame({
  children,
  code,
  filename,
  lineNumbers,
}: {
  children: ReactNode;
  code: string;
  filename?: string;
  lineNumbers?: boolean;
}) {
  const { status, copy } = useCopyToClipboard(code);
  const [keyboard, setKeyboard] = useState(false);
  const viewport = useRef<HTMLPreElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const measure = () =>
      setEdges({
        left: element.scrollLeft > 1,
        right: element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
      });
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    element.addEventListener('scroll', measure, { passive: true });
    measure();
    return () => {
      observer.disconnect();
      element.removeEventListener('scroll', measure);
    };
  }, []);

  return (
    <div className='code-frame not-prose border-border bg-muted/50 relative my-6 min-w-0 border font-mono text-sm leading-relaxed'>
      <div className='code-toolbar text-muted-foreground flex min-h-11 items-center justify-between gap-4 border-b pl-4 font-mono text-xs font-normal'>
        <span className='min-w-0 truncate' title={filename}>
          {filename}
        </span>
        <button
          type='button'
          className='focus-ring hover:text-foreground flex min-h-11 shrink-0 cursor-pointer items-center gap-2 px-3 text-xs transition-colors print:hidden'
          aria-label={status === 'error' ? 'Copy failed. Try copying code again' : 'Copy code'}
          onClick={(event) => {
            setKeyboard(event.detail === 0);
            void copy();
          }}
        >
          <motion.span
            key={status}
            aria-hidden='true'
            initial={{ opacity: status === 'idle' || keyboard ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.12, ease: detailEase }}
          >
            {status === 'copied' ? <Check className='size-3.5' /> : <Copy className='size-3.5' />}
          </motion.span>
          <span className='inline-grid text-left'>
            <span className='invisible col-start-1 row-start-1'>try again</span>
            <span className='col-start-1 row-start-1'>
              {status === 'copied' ? 'copied' : status === 'error' ? 'try again' : 'copy'}
            </span>
          </span>
        </button>
        <output className='sr-only'>
          {status === 'copied'
            ? 'Code copied'
            : status === 'error'
              ? 'Could not copy. Select the code to copy manually.'
              : ''}
        </output>
      </div>
      <div className='relative'>
        <pre
          ref={viewport}
          tabIndex={0}
          aria-label={filename ? `Code: ${filename}` : 'Code block'}
          className='focus-ring m-0 scrollbar-thin [scrollbar-color:var(--border)_transparent] overflow-x-auto rounded-none border-0 bg-transparent p-0 -outline-offset-2 print:overflow-visible print:whitespace-pre-wrap'
          data-line-numbers={lineNumbers}
        >
          {children}
        </pre>
        <span
          aria-hidden='true'
          className='from-foreground/12 pointer-events-none absolute inset-y-0 left-0 w-4.5 bg-linear-to-r to-transparent opacity-0 data-[visible=true]:opacity-100 print:hidden'
          data-visible={edges.left}
        />
        <span
          aria-hidden='true'
          className='from-foreground/12 pointer-events-none absolute inset-y-0 right-0 w-4.5 bg-linear-to-l to-transparent opacity-0 data-[visible=true]:opacity-100 print:hidden'
          data-visible={edges.right}
        />
      </div>
    </div>
  );
}
