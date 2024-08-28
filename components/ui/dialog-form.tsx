'use client';

import { PropsWithChildren, ReactNode, useState } from 'react';

import { cn } from '@/lib/utils';

import { Dialog, DialogContent, DialogTrigger } from './dialog';
import { Form, FormProps } from './form';

interface DialogFormProps extends PropsWithChildren {
  trigger: ReactNode;
  className?: string;
  action: FormProps['action'];
}

export function DialogForm({
  trigger,
  className,
  action,
  children,
}: Readonly<DialogFormProps>) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='w-4/5 rounded-sm'>
        <Form
          className={cn('space-y-4', className)}
          action={async (state, payload) => {
            const error = await action(state, payload);
            if (!error) {
              setOpen(false);
            }
            return error;
          }}
        >
          {children}
        </Form>
      </DialogContent>
    </Dialog>
  );
}
