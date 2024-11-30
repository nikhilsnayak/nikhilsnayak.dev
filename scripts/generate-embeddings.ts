import path from 'path';
import { openai } from '@ai-sdk/openai';
import { embedMany } from 'ai';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { db } from '~/lib/db';
import { documents as documentsTable } from '~/lib/db/schema';

console.log('🚀 Starting the script...');

async function generateEmbeddings(chunks: string[]) {
  console.log(`🤖 Generating embeddings for ${chunks.length} chunks...`);
  try {
    const { embeddings } = await embedMany({
      model: openai.embedding('text-embedding-ada-002'),
      values: chunks,
    });
    console.log('✅ Embeddings generated successfully!');
    return embeddings;
  } catch (error) {
    console.error('❌ Error generating embeddings:', error);
    throw error;
  }
}

function getLoader() {
  const slug = process.argv.at(2);
  const CONTENT_DIR = path.join(process.cwd(), 'content');
  console.log(`📂 Using content directory: ${CONTENT_DIR}`);

  if (slug) {
    console.log(`📄 Loading single file for slug: ${slug}`);
    return new TextLoader(path.join(CONTENT_DIR, `${slug}.mdx`));
  }

  console.log('📚 Loading all files from directory...');
  return new DirectoryLoader(CONTENT_DIR, {
    '.mdx': (path) => new TextLoader(path),
  });
}

async function main() {
  try {
    console.log('🔧 Initializing loader...');
    const loader = getLoader();

    console.log('📥 Loading content...');
    const content = await loader.load();
    console.log(`✅ Loaded ${content.length} document(s).`);

    console.log('✂️ Splitting documents...');
    const markdownSplitter =
      RecursiveCharacterTextSplitter.fromLanguage('markdown');
    const splittedDocuments = await markdownSplitter.splitDocuments(content);
    console.log(`✅ Split into ${splittedDocuments.length} chunks.`);

    const chunks = splittedDocuments.map((document) => document.pageContent);

    console.log('🧠 Generating embeddings...');
    const embeddings = await generateEmbeddings(chunks);

    console.log('💾 Inserting embeddings into the database...');
    await Promise.all(
      embeddings.map((embedding, i) =>
        db.insert(documentsTable).values({
          embedding,
          content: splittedDocuments[i].pageContent,
          metadata: splittedDocuments[i].metadata,
        })
      )
    );
    console.log('✅ Data inserted successfully into the database!');
  } catch (error) {
    console.error('🔥 Error occurred during execution:', error);
    process.exit(1);
  }
}

main().then(() => {
  console.log('🎉 Script completed successfully!');
  process.exit(0);
});
