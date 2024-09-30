import { unstable_cache } from 'next/cache';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '../db';
import { documents } from '../db/schema';

async function INTERNAL_getSuggestedQuestions() {
  const randomDocs = await db
    .select()
    .from(documents)
    .orderBy(sql`RANDOM()`)
    .limit(10);

  const combinedContent = randomDocs.map((doc) => doc.content).join('\n\n');

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    system:
      'You are a helpful assistant that generates short one line prompts based on given content.',
    prompt: `Generate 4 suggested prompts for a RAG chatbot based on the following content:\n\n${combinedContent}`,
    output: 'array',
    schema: z.string(),
  });

  return object;
}

export const getSuggestedQuestions = unstable_cache(
  INTERNAL_getSuggestedQuestions,
  ['getSuggestedQuestions'],
  {
    revalidate: 24 * 60 * 60,
  }
);
