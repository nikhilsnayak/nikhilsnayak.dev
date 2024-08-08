import { openai } from '@ai-sdk/openai';
import { embed, embedMany } from 'ai';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';

import { db } from '../db';
import { embeddings } from '../db/schema';

const embeddingModel = openai.embedding('text-embedding-ada-002');

function generatePlainTextChunks(input: string): string[] {
  return input
    .trim()
    .split('.')
    .filter((i) => i !== '');
}

function generateMarkdownChunks(
  input: string,
  maxChunkSize: number = 1000
): string[] {
  const lines = input.split('\n');

  const isHeader = (line: string): boolean => /^#{1,6}\s/.test(line);

  const isCodeBlock = (line: string): boolean => /^```/.test(line);

  let chunks: string[] = [];
  let currentChunk: string[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (isCodeBlock(line)) {
      inCodeBlock = !inCodeBlock;
    }

    if (isHeader(line) && !inCodeBlock) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join('\n').trim());
        currentChunk = [];
      }
    }

    currentChunk.push(line);

    if (currentChunk.join('\n').length > maxChunkSize) {
      chunks.push(currentChunk.join('\n').trim());
      currentChunk = [];
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n').trim());
  }

  return chunks.map((chunk) => JSON.stringify(chunk));
}

function generateChunks({
  value,
  contentType,
}: {
  value: string;
  contentType: 'plainText' | 'markdown';
}) {
  switch (contentType) {
    case 'plainText':
      return generatePlainTextChunks(value);
    case 'markdown':
      return generateMarkdownChunks(value);
  }
}

export async function generateEmbeddings({
  value,
  contentType,
}: {
  value: string;
  contentType: 'plainText' | 'markdown';
}): Promise<Array<{ embedding: number[]; content: string }>> {
  const chunks = generateChunks({ value, contentType });

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
}

export async function generateEmbedding(value: string): Promise<number[]> {
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
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(10);
}
