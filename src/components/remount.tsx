'use client';

import { Fragment, type PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';

interface RemountProps extends PropsWithChildren {
  on: 'path-change';
}

export function Remount({ children, on }: RemountProps) {
  switch (on) {
    case 'path-change':
      return <RemountOnPathChange>{children}</RemountOnPathChange>;
    default:
      return <>{children}</>;
  }
}

function RemountOnPathChange({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return <Fragment key={pathname}>{children}</Fragment>;
}
