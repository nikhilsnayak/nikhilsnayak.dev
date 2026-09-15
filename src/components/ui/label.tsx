'use client';

import * as React from 'react';

import { cn } from '~/lib/utils';

function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    // oxlint-disable-next-line jsx-a11y/label-has-associated-control -- Consumers provide htmlFor or aria-labelledby for composite controls.
    <label
      data-slot='label'
      className={cn(
        'flex items-center gap-2 text-xs leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Label };
