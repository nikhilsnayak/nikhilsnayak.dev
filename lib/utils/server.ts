import 'server-only';

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { headers } from 'next/headers';

type BlogMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  components?: string;
};

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);
  const frontMatterBlock = match![1];
  const content = fileContent.replace(frontmatterRegex, '').trim();
  const frontMatterLines = frontMatterBlock.trim().split('\n');
  const metadata: Partial<BlogMetadata> = {};

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(': ');
    let value = valueArr.join(': ').trim();
    value = value.replace(/^['"](.*)['"]$/, '$1'); // Remove quotes
    metadata[key.trim() as keyof BlogMetadata] = value;
  });

  return { metadata: metadata as BlogMetadata, content };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'content'));
}

export async function getIPHash() {
  const $h = await headers();
  const ip = $h.get('x-forwarded-for') ?? $h.get('x-real-ip');

  if (!ip) {
    return null;
  }

  const secret = process.env.HASH_SECRET;

  if (!secret) {
    throw new Error('HASH_SECRET env is required');
  }

  return crypto.createHmac('sha256', secret).update(ip).digest('hex');
}
