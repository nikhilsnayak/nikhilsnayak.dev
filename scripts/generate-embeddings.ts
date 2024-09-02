import path from 'path';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { generateEmbeddings } from '~/lib/ai/embedding';
import { embeddings as embeddingsTable } from '~/lib/db/schema';

const CONTENT_DIR = path.join(process.cwd(), 'content');

const db = drizzle(sql);

const loader = new DirectoryLoader(
  CONTENT_DIR,
  {
    '.md': (path) => new TextLoader(path),
    '.mdx': (path) => new TextLoader(path),
  },
  true
);

const content = await loader.load();

const markdownSplitter =
  RecursiveCharacterTextSplitter.fromLanguage('markdown');

const chunks = (await markdownSplitter.splitDocuments(content)).map(
  (document) => document.pageContent
);

const embeddingsList = await generateEmbeddings(chunks);

await Promise.all(
  embeddingsList.map((embeddings) =>
    db.insert(embeddingsTable).values(embeddings)
  )
);
