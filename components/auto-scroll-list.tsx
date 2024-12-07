import type { ComponentProps } from 'react';

import { cn } from '~/lib/utils';

export function AutoScrollList({
  className,
  ...rest
}: Omit<ComponentProps<'ul'>, 'ref'>) {
  return (
    <ul
      ref={scrollAreaRef}
      className={cn('overflow-y-auto', className)}
      {...rest}
    />
  );
}

function scrollAreaRef(list: HTMLUListElement) {
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

  list.addEventListener('wheel', handleWheel);
  list.addEventListener('touchstart', handleTouchStart);
  list.addEventListener('touchmove', handleTouchMove);

  const observer = new MutationObserver(() => {
    if (shouldAutoScroll) {
      list.scrollTo({ top: list.scrollHeight });
    }
  });

  observer.observe(list, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  return () => {
    observer.disconnect();
    list.removeEventListener('wheel', handleWheel);
    list.removeEventListener('touchstart', handleTouchStart);
    list.removeEventListener('touchmove', handleTouchMove);
  };
}
