'use client';

import type { ComponentProps, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

import { LoadingButton } from './loading-button';

interface FormSubmitProps
  extends Omit<
    ComponentProps<typeof LoadingButton>,
    'type' | 'disabled' | 'isLoading'
  > {
  pendingFallback?: ReactNode;
}

export function FormSubmit({
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
    />
  );
}
