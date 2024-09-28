import { openai } from '@ai-sdk/openai';
import { embed, embedMany } from 'ai';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';

import { db } from '../db';
import { documents } from '../db/schema';

const embeddingModel = openai.embedding('text-embedding-ada-002');

export async function generateEmbeddings(chunks: string[]) {
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings;
}

async function generateEmbedding(value: string) {
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
