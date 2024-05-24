import { createHash } from 'crypto';
import { OpenAIEmbeddings } from '@langchain/openai';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { createClient } from '@supabase/supabase-js';
import { DocumentInterface } from '@langchain/core/documents';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
const DOCUMENT_TABLE = 'documents';
const APP_DIR = './app/';
const LAYOUT_DIR = './components/layout/';
const TSX_EXTENSION = '.tsx';

function trimPageContent(doc: DocumentInterface) {
  return doc.pageContent
    .replace(/^import\s.*$/gm, '') // Remove all import statements
    .replace(/ className=(["']).*?\1/g, '') // Remove all className props with quotes
    .replace(/ className=\{[^}]*\}/g, '') // Remove all className props with curly braces
    .replace(/^\s*[\r\n]/gm, '') // Remove empty lines
    .trim();
}

function computeHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

async function main() {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const embeddings = new OpenAIEmbeddings();

  const store = new SupabaseVectorStore(embeddings, {
    client,
    tableName: DOCUMENT_TABLE,
  });

  const loadDocuments = async (directory: string) => {
    const loader = new DirectoryLoader(
      directory,
      { [TSX_EXTENSION]: (path) => new TextLoader(path) },
      true
    );
    return loader.load();
  };

  const pages = await loadDocuments(APP_DIR);
  const layouts = await loadDocuments(LAYOUT_DIR);

  const pageContent = pages
    .filter((doc) => doc.metadata.source.endsWith('page.tsx'))
    .map((doc): DocumentInterface => {
      const url =
        doc.metadata.source
          .replace(/\\/g, '/')
          .split('/app')[1]
          .split('/page.')[0] || '/';

      return {
        pageContent: trimPageContent(doc),
        metadata: { url, hash: computeHash(trimPageContent(doc)) },
      };
    });

  const layoutContent = layouts.map(
    (doc): DocumentInterface => ({
      ...doc,
      pageContent: trimPageContent(doc),
      metadata: { ...doc.metadata, hash: computeHash(trimPageContent(doc)) },
    })
  );

  const docs = [...layoutContent, ...pageContent];

  const splitter = RecursiveCharacterTextSplitter.fromLanguage('html');
  const splitDocs = await splitter.splitDocuments(docs);

  for (const doc of splitDocs) {
    const { url, hash } = doc.metadata;
    const existingDoc = await client
      .from(DOCUMENT_TABLE)
      .select('id, hash')
      .eq('url', url)
      .single();

    if (existingDoc.data) {
      if (existingDoc.data.hash !== hash) {
        await client
          .from(DOCUMENT_TABLE)
          .delete()
          .eq('id', existingDoc.data.id);
        await store.addDocuments([doc]);
      }
    } else {
      await store.addDocuments([doc]);
    }
  }
}

main().catch(console.error);
