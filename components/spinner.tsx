import { ComponentProps } from 'react';
import { Loader } from 'lucide-react';

import { cn } from '~/lib/utils';

interface SpinnerProps extends ComponentProps<'svg'> {
  variant?: 'ring' | 'ellipsis';
}

export function Spinner({
  className,
  variant = 'ring',
  ...rest
}: Readonly<SpinnerProps>) {
  switch (variant) {
    case 'ring':
      return (
        <Loader
          className={cn('animate-spin fill-background', className)}
          {...rest}
        />
      );
    case 'ellipsis':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          className={cn('fill-foreground', className)}
          {...rest}
        >
          <style>
            {`
              @keyframes spinner_MGfb {
                93.75% {
                  opacity: 0.2;
                }
              }
              .spinner_S1WN {
                animation: spinner_MGfb 0.8s linear infinite;
                animation-delay: -0.8s;
              }
              .spinner_Km9P {
                animation-delay: -0.65s;
              }
              .spinner_JApP {
                animation-delay: -0.5s;
              }
              `}
          </style>
          <circle cx='4' cy='12' r='3' className='spinner_S1WN' />
          <circle cx='12' cy='12' r='3' className='spinner_S1WN spinner_Km9P' />
          <circle cx='20' cy='12' r='3' className='spinner_S1WN spinner_JApP' />
        </svg>
      );
  }
}
