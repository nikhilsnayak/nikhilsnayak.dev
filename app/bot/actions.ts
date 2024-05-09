'use server';

import { createStreamableValue } from 'ai/rsc';
import { CoreMessage, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { kv } from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';
import { getIp } from '@/lib/server/utils';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(2, '1m'),
});

export async function continueConversation(messages: CoreMessage[]) {
  const ip = getIp() ?? 'ip';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return { error: 'Rate limited!' };
  }

  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    messages,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}
