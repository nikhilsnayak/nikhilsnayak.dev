import * as React from 'react';

import { cn } from '~/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'border-input bg-muted/20 focus:border-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 placeholder:text-muted-foreground block field-sizing-content min-h-28 w-full resize-none border px-3 py-3 text-base leading-7 wrap-anywhere transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-1',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
