import { OpenAIEmbeddings } from '@langchain/openai';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { createClient } from '@supabase/supabase-js';
import { DocumentInterface } from '@langchain/core/documents';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { env } from './config/env';

function trimPageContent(doc: DocumentInterface) {
  return doc.pageContent
    .replace(/^import\s.*$/gm, '') // Remove all import statements
    .replace(/ className=(["']).*?\1/g, '') // Remove all className props with quotes
    .replace(/ className=\{[^}]*\}/g, '') // Remove all className props with curly braces
    .replace(/^\s*[\r\n]/gm, '') // remove empty lines
    .trim();
}

async function generateEmbeddings() {
  const client = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

  await client.from('documents').delete().neq('id', 0);

  const embeddings = new OpenAIEmbeddings();

  const store = new SupabaseVectorStore(embeddings, {
    client,
    tableName: 'documents',
  });

  const pagesLoader = new DirectoryLoader(
    './app/',
    {
      '.tsx': (path) => new TextLoader(path),
    },
    true
  );

  const layoutLoader = new DirectoryLoader(
    './components/layout/',
    {
      '.tsx': (path) => new TextLoader(path),
    },
    true
  );

  const pageContent = (await pagesLoader.load())
    .filter((doc) => doc.metadata.source.endsWith('page.tsx'))
    .map((doc): DocumentInterface => {
      const url =
        doc.metadata.source
          .replace(/\\/g, '/')
          .split('/app')[1]
          .split('/page.')[0] || '/';

      return {
        pageContent: trimPageContent(doc),
        metadata: { url },
      };
    });

  const layoutContent = (await layoutLoader.load()).map(
    (doc): DocumentInterface => {
      return {
        ...doc,
        pageContent: trimPageContent(doc),
      };
    }
  );

  const docs = [...layoutContent, ...pageContent];

  const splitter = RecursiveCharacterTextSplitter.fromLanguage('html');

  const splitDocs = await splitter.splitDocuments(docs);

  await store.addDocuments(splitDocs);
}

generateEmbeddings();
