import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Button, ButtonProps } from './button';

interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean;
  loadingIndicator?: ReactNode;
}

export function LoadingButton({
  isLoading,
  loadingIndicator,
  className,
  children,
  disabled,
  ...rest
}: Readonly<LoadingButtonProps>) {
  return (
    <Button
      className={cn(className, 'relative')}
      disabled={isLoading || disabled}
      {...rest}
    >
      <>
        {isLoading ? (
          <span className='absolute inset-0 flex items-center justify-center'>
            {loadingIndicator ?? 'Loading....'}
          </span>
        ) : null}
        <span className={isLoading ? 'invisible' : ''}>{children}</span>
      </>
    </Button>
  );
}
