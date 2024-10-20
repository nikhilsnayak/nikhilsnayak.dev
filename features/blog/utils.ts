import 'server-only';

import fs from 'fs/promises';

import type { BlogMetadata } from './types';

export async function readAndParseMDXFile(filePath: string) {
  const rawContent = await fs.readFile(filePath, 'utf-8');

  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(rawContent);
  const frontMatterBlock = match ? match[1] : '';
  const content = rawContent.replace(frontmatterRegex, '').trim();
  const frontMatterLines = frontMatterBlock.trim().split('\n');
  const metadata: Partial<BlogMetadata> = {};

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(': ');
    let value = valueArr.join(': ').trim();
    value = value.replace(/^['"](.*)['"]$/, '$1');
    metadata[key.trim() as keyof BlogMetadata] = value;
  });

  return { metadata: metadata as BlogMetadata, content };
}
