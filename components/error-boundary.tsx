'use client';

import type { ComponentProps } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

export function ErrorBoundary({
  onError,
  ...rest
}: ComponentProps<typeof ReactErrorBoundary>) {
  return (
    <ReactErrorBoundary
      {...rest}
      onError={(error, info) => {
        console.error(error);
        onError?.(error, info);
      }}
    />
  );
}
