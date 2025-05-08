import 'server-only';

import { PostHog } from 'posthog-node';

export function PostHogClient() {
  const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: 'https://us.i.posthog.com',
    flushAt: 1,
    flushInterval: 0,
  });
  return posthogClient;
}
