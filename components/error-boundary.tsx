'use client';

import type { ComponentProps } from 'react';
import { unstable_rethrow as rethrow } from 'next/navigation';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

export function ErrorBoundary({
  onError,
  ...rest
}: ComponentProps<typeof ReactErrorBoundary>) {
  return (
    <ReactErrorBoundary
      {...rest}
      onError={(error, info) => {
        rethrow(error);
        console.error(error);
        onError?.(error, info);
      }}
    />
  );
}
