'use client';

import {
  type ComponentProps,
  createContext,
  useActionState,
  use,
  ReactNode,
  PropsWithChildren,
} from 'react';
import { Button, ButtonProps } from './button';

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

interface FormProps extends Omit<ComponentProps<'form'>, 'action'> {
  action: (
    state: string | undefined,
    payload: FormData
  ) => Promise<string | undefined>;
}

export function Form({ action, ...rest }: FormProps) {
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
}: FormSubmitProps) {
  const { isPending } = useForm();

  return (
    <Button type='submit' disabled={isPending} {...rest}>
      {isPending && pendingFallback ? pendingFallback : children}
    </Button>
  );
}

export function FormError(props: Omit<ComponentProps<'p'>, 'children'>) {
  const { error } = useForm();

  return <p {...props}>{error}</p>;
}

Form.Pending = function FormPending({ children }: PropsWithChildren) {
  const { isPending } = useForm();
  if (isPending) {
    return <>{children}</>;
  }
};
