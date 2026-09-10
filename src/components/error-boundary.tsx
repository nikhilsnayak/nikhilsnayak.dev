'use client';

import { catchError } from 'next/error';
import type { ReactNode } from 'react';

export const ErrorBoundary = catchError((props: { fallback: ReactNode }) => props.fallback);
