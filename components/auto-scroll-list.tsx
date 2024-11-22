import { ComponentProps } from 'react';

import { cn } from '~/lib/utils';

export function AutoScrollList({
  children,
  className,
  ...rest
}: Omit<ComponentProps<'ul'>, 'ref'>) {
  return (
    <ul
      ref={scrollAreaRef}
      className={cn('overflow-y-auto', className)}
      {...rest}
    >
      {children}
      <li data-list-end />
    </ul>
  );
}

function scrollAreaRef(list: HTMLUListElement) {
  if (!list) return;

  let shouldAutoScroll = true;
  let touchStartY = 0;
  let lastScrollTop = 0;

  const checkScrollPosition = () => {
    const { scrollHeight, clientHeight, scrollTop } = list;
    const maxScrollHeight = scrollHeight - clientHeight;
    const scrollThreshold = maxScrollHeight / 2;

    if (scrollTop < lastScrollTop) {
      shouldAutoScroll = false;
    } else if (maxScrollHeight - scrollTop <= scrollThreshold) {
      shouldAutoScroll = true;
    }

    lastScrollTop = scrollTop;
  };

  const handleWheel = (e: WheelEvent) => {
    if (e.deltaY < 0) {
      shouldAutoScroll = false;
    } else {
      checkScrollPosition();
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touchEndY = e.touches[0].clientY;
    const deltaY = touchStartY - touchEndY;

    if (deltaY < 0) {
      shouldAutoScroll = false;
    } else {
      checkScrollPosition();
    }

    touchStartY = touchEndY;
  };

  const handleScroll = () => {
    checkScrollPosition();
  };

  list.addEventListener('wheel', handleWheel, { passive: true });
  list.addEventListener('touchstart', handleTouchStart, { passive: true });
  list.addEventListener('touchmove', handleTouchMove, { passive: true });
  list.addEventListener('scroll', handleScroll, { passive: true });

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
    list.removeEventListener('wheel', handleWheel);
    list.removeEventListener('touchstart', handleTouchStart);
    list.removeEventListener('touchmove', handleTouchMove);
    list.removeEventListener('scroll', handleScroll);
  };
}
