'use client';

import type { ComponentProps } from 'react';
import { unstable_rethrow as rethrow } from 'next/navigation';
import posthog from 'posthog-js';
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
        posthog.captureException(error);
        onError?.(error, info);
      }}
    />
  );
}
