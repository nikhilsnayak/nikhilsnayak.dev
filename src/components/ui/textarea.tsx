import * as motion from 'motion/react-client';
import * as React from 'react';

import { cn } from '~/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<typeof motion.textarea>) {
  return (
    <motion.textarea
      data-slot='textarea'
      className={cn(
        'border-input dark:bg-input/30 focus-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full border bg-transparent px-2.5 py-2 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-1 md:text-xs',
        className,
      )}
      whileFocus={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      {...props}
    />
  );
}

export { Textarea };
