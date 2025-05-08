import 'server-only';

import crypto from 'crypto';
import { headers } from 'next/headers';
import { after } from 'next/server';

import { PostHogClient } from '~/lib/posthog';

export async function getIPHash() {
  const $h = await headers();
  const ip = $h.get('x-forwarded-for') ?? $h.get('x-real-ip');

  if (!ip) {
    return null;
  }

  const secret = process.env.HASH_SECRET;

  if (!secret) {
    throw new Error('HASH_SECRET env is required');
  }

  return crypto.createHmac('sha256', secret).update(ip).digest('hex');
}

export function sendErrorToPostHog(error: unknown) {
  after(async () => {
    console.log(error);
    const posthog = PostHogClient();
    posthog.captureException(error);
    await posthog.shutdown();
  });
}
