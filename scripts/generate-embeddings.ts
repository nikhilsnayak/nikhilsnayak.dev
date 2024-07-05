import { OpenAIEmbeddings } from '@langchain/openai';
import { VercelPostgres } from '@langchain/community/vectorstores/vercel_postgres';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { vectorStoreConfig } from '@/config/vector-store';

const CONTENT_DIR = './content';

console.log('Initailizing vector store...');

const vectorstore = await VercelPostgres.initialize(
  new OpenAIEmbeddings(),
  vectorStoreConfig
);

console.log('Initailized vector store');

vectorstore.delete({ deleteAll: true });

console.log('Deleted existing embeddings');

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

console.log({ splitedContent });

await vectorstore.addDocuments(splitedContent);

console.log('Updated vector store. Bye...');

await vectorstore.end();
