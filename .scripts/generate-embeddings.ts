import { OpenAIEmbeddings } from '@langchain/openai';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { createClient } from '@supabase/supabase-js';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
const DOCUMENT_TABLE = 'documents';
const CONTENT_DIR = './content';

const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
await client.from('documents').delete().neq('id', 0);

const store = new SupabaseVectorStore(new OpenAIEmbeddings(), {
  client,
  tableName: DOCUMENT_TABLE,
});

const loadDocuments = async (directory: string) => {
  const loader = new DirectoryLoader(
    directory,
    {
      '.md': (path) => new TextLoader(path),
      '.mdx': (path) => new TextLoader(path),
    },
    true
  );
  return loader.load();
};

const content = await loadDocuments(CONTENT_DIR);
const markdownSplitter =
  RecursiveCharacterTextSplitter.fromLanguage('markdown');
const splitedContent = await markdownSplitter.splitDocuments(content);

await store.addDocuments(splitedContent);
