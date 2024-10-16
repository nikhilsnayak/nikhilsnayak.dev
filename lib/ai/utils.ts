import { unstable_cache } from 'next/cache';
import { openai } from '@ai-sdk/openai';
import { embed, embedMany, generateObject } from 'ai';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '../db';
import { documents } from '../db/schema';

async function INTERNAL__getSuggestedQuestions() {
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
  INTERNAL__getSuggestedQuestions,
  ['getSuggestedQuestions'],
  {
    revalidate: 24 * 60 * 60,
    tags: ['getSuggestedQuestions'],
  }
);

export async function generateEmbeddings(chunks: string[]) {
  const { embeddings } = await embedMany({
    model: openai.embedding('text-embedding-ada-002'),
    values: chunks,
  });
  return embeddings;
}

async function generateEmbedding(value: string) {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-ada-002'),
    value: input,
  });
  return embedding;
}

export async function findRelevantContent(userQuery: string) {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    documents.embedding,
    userQueryEmbedded
  )})`;
  return db
    .select({
      similarity,
      content: documents.content,
      metadata: documents.metadata,
    })
    .from(documents)
    .where(gt(similarity, 0.7))
    .orderBy((t) => desc(t.similarity))
    .limit(10);
}
