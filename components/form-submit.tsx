'use client';

import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

import type { ButtonProps } from './ui/button';
import { LoadingButton } from './ui/loading-button';

interface FormSubmitProps extends Omit<ButtonProps, 'type' | 'disabled'> {
  pendingFallback?: ReactNode;
}

export function FormSubmit({
  children,
  pendingFallback,
  ...rest
}: Readonly<FormSubmitProps>) {
  const { pending } = useFormStatus();

  return (
    <LoadingButton
      type='submit'
      isLoading={pending}
      loadingIndicator={pendingFallback}
      {...rest}
    >
      {children}
    </LoadingButton>
  );
}
