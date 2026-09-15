import { Loader2Icon } from 'lucide-react';

import { cn } from '~/lib/utils';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <Loader2Icon
      data-slot='spinner'
      aria-label='Loading'
      className={cn('size-4 motion-safe:animate-spin', className)}
      {...props}
    />
  );
}

export { Spinner };
