import { openai } from '@ai-sdk/openai';
import { embed, embedMany } from 'ai';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';

import { db } from '../db';
import { embeddings } from '../db/schema';

const embeddingModel = openai.embedding('text-embedding-ada-002');

export async function generateEmbeddings(
  chunks: string[]
): Promise<Array<{ embedding: number[]; content: string }>> {
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
}

async function generateEmbedding(value: string): Promise<number[]> {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
}

export async function findRelevantContent(userQuery: string) {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded
  )})`;
  return db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.7))
    .orderBy((t) => desc(t.similarity))
    .limit(10);
}
