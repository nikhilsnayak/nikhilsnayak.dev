'use client';

import type { PropsWithChildren } from 'react';
import posthog, { type Properties } from 'posthog-js';
import { Slot } from 'radix-ui';

interface TrackClickProps extends PropsWithChildren {
  eventName: string;
  properties?: Properties;
}

export function TrackClick({
  children,
  eventName,
  properties,
}: TrackClickProps) {
  return (
    <Slot.Slot
      onClick={() => {
        posthog.capture(eventName, properties);
      }}
    >
      {children}
    </Slot.Slot>
  );
}
