import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';

import { generateEmbeddings } from '@/lib/ai/embedding';
import { embeddings as embeddingsTable } from '@/lib/db/schema';

const CONTENT_DIR = path.join(process.cwd(), 'content');

const db = drizzle(sql);

const log = (message: string) =>
  console.log(`[${new Date().toISOString()}] ${message}`);

const processFile = async (file: string) => {
  const filePath = path.join(CONTENT_DIR, file);
  const content = await readFile(filePath, 'utf-8');
  const extension = path.extname(file);
  const slug = path.basename(file, extension);

  return {
    slug,
    content,
    contentType: ['.mdx', '.md'].includes(extension) ? 'markdown' : 'plainText',
  } as const;
};

const main = async () => {
  log('Starting the process...');

  log('Deleting existing embeddings...');
  await db.delete(embeddingsTable);
  log('Existing embeddings deleted.');

  log('Reading files...');
  const files = await readdir(CONTENT_DIR);
  log(`${files.length} files found.`);

  const filePromises = files.map(processFile);
  const fileContents = await Promise.all(filePromises);
  log('Files read successfully.');

  log('Generating embeddings and preparing batch insert...');
  const embeddingPromises = fileContents.map(
    async ({ content, contentType }) => {
      const embeddings = await generateEmbeddings({
        value: content,
        contentType,
      });
      return embeddings;
    }
  );

  const embeddingsArray = await Promise.all(embeddingPromises);
  log('Embeddings generated.');

  log('Inserting embeddings into the database...');

  await Promise.all(
    embeddingsArray.map((embeddings) =>
      db.insert(embeddingsTable).values(embeddings)
    )
  );
  log('Embeddings inserted successfully.');

  log('Process completed.');
};

main().catch((error) => {
  log(`Error: ${error.message}`);
  process.exit(1);
});
