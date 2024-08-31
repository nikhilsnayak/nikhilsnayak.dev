'use client';

import {
  createContext,
  PropsWithChildren,
  ReactNode,
  use,
  useActionState,
  type ComponentProps,
} from 'react';

import { cn } from '~/lib/utils';

import { ButtonProps } from './button';
import { LoadingButton } from './loading-button';

interface FormContext {
  error?: string;
  isPending: boolean;
}

const FormContext = createContext<FormContext | null>(null);

export function useForm() {
  const formContext = use(FormContext);
  if (formContext === null) {
    throw new Error('useForm needs to be used inside Form');
  }
  return formContext;
}

export interface FormProps extends Omit<ComponentProps<'form'>, 'action'> {
  action: (
    state: string | undefined,
    payload: FormData
  ) => Promise<string | undefined>;
}

export function Form({ action, ...rest }: Readonly<FormProps>) {
  const [error, formAction, isPending] = useActionState(action, undefined);

  return (
    <FormContext
      value={{
        isPending,
        error,
      }}
    >
      <form action={formAction} {...rest} />
    </FormContext>
  );
}

interface FormSubmitProps extends Omit<ButtonProps, 'type' | 'disabled'> {
  pendingFallback?: ReactNode;
}

export function FormSubmit({
  children,
  pendingFallback,
  ...rest
}: Readonly<FormSubmitProps>) {
  const { isPending } = useForm();

  return (
    <LoadingButton
      type='submit'
      isLoading={isPending}
      loadingIndicator={pendingFallback}
      {...rest}
    >
      {children}
    </LoadingButton>
  );
}

export function FormError({
  className,
  ...rest
}: Readonly<Omit<ComponentProps<'p'>, 'children'>>) {
  const { error } = useForm();

  return (
    <p className={cn('text-red-500', className)} {...rest}>
      {error}
    </p>
  );
}

export function FormPending({ children }: PropsWithChildren) {
  const { isPending } = useForm();
  if (isPending) {
    return <>{children}</>;
  }
}
