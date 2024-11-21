import { ComponentProps, RefCallback, useCallback, useState } from 'react';

import { cn } from '~/lib/utils';

export function AutoScrollList({
  children,
  className,
  ...rest
}: Omit<ComponentProps<'ul'>, 'ref' | 'onWheel'>) {
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const scrollAreaRef: RefCallback<HTMLUListElement> = useCallback(
    (list) => {
      if (!list) return;
      const listEnd = list.querySelector('li[data-list-end]');

      const observer = new MutationObserver(() => {
        if (shouldAutoScroll) {
          listEnd?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      });

      observer.observe(list, {
        childList: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
      };
    },
    [shouldAutoScroll]
  );

  return (
    <ul
      ref={scrollAreaRef}
      className={cn('overflow-y-auto', className)}
      onWheel={(e) => {
        const { scrollHeight, clientHeight, scrollTop } = e.currentTarget;
        const maxScrollHeight = scrollHeight - clientHeight;

        if (e.deltaY < 0) {
          setShouldAutoScroll(false);
        } else if (
          e.deltaY > 0 &&
          maxScrollHeight - scrollTop <= maxScrollHeight / 2
        ) {
          setShouldAutoScroll(true);
        }
      }}
      {...rest}
    >
      {children}
      <li data-list-end />
    </ul>
  );
}
