import path from 'path';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { db } from '../db';
import { documents as documentsTable } from '../db/schema';
import { generateEmbeddings } from './utils';

function getLoader() {
  const slug = process.argv.at(2);
  const CONTENT_DIR = path.join(process.cwd(), 'content');
  if (slug) {
    return new TextLoader(path.join(CONTENT_DIR, `${slug}.mdx`));
  }

  return new DirectoryLoader(CONTENT_DIR, {
    '.mdx': (path) => new TextLoader(path),
  });
}

const loader = getLoader();

const content = await loader.load();

const markdownSplitter =
  RecursiveCharacterTextSplitter.fromLanguage('markdown');

const splittedDocuments = await markdownSplitter.splitDocuments(content);

const chunks = splittedDocuments.map((document) => document.pageContent);

const embeddings = await generateEmbeddings(chunks);

await Promise.all(
  embeddings.map((embedding, i) =>
    db.insert(documentsTable).values({
      embedding,
      content: splittedDocuments[i].pageContent,
      metadata: splittedDocuments[i].metadata,
    })
  )
);
