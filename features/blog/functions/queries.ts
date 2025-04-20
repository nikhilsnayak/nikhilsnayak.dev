import 'server-only';

import fs from 'fs/promises';
import path from 'path';

import { db } from '~/lib/db';
import { getIPHash } from '~/lib/utils/server';

import { CONTENT_DIR } from '../constants';
import { BlogMetadataSchema } from '../schema';
import type { Comment } from '../types';

export async function getBlogsMetadata() {
  const files = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  const slugs = files
    .filter((file) => file.isDirectory())
    .map((file) => file.name);

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const metadata = await getBlogMetadataBySlug(slug);
      return {
        metadata,
        slug,
      };
    })
  );

  return posts.toSorted((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });
}

export async function getBlogMetadataBySlug(slug: string) {
  const postPath = path.join(CONTENT_DIR, slug, 'post.mdx');
  const postContent = await fs.readFile(postPath, 'utf-8');
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(postContent);
  const frontMatterBlock = match ? match[1] : '';
  const frontMatterLines = frontMatterBlock.trim().split('\n');
  const metadata = frontMatterLines.reduce(
    (acc, line) => {
      const [key, ...valueArr] = line.split(': ');
      const value = valueArr.join(': ').trim();
      acc[key.trim()] = value.replace(/^['"](.*)['"]$/, '$1');
      return acc;
    },
    {} as Record<string, string>
  );
  return BlogMetadataSchema.parse(metadata);
}

export function getBlogViewsBySlug(slug: string) {
  return db.query.views.findFirst({
    where: (views, { eq }) => eq(views.slug, slug),
  });
}

export async function getHeartsInfoBySlug(slug: string) {
  const ip = await getIPHash();

  const hearts = await db.query.hearts.findMany({
    where: (hearts, { eq }) => eq(hearts.slug, slug),
  });

  const total = hearts.reduce((acc, cv) => acc + cv.count, 0);

  const currentClientHeartsCount =
    hearts.find((heart) => heart.clientIdentifier === ip)?.count ?? 0;

  return { total, currentClientHeartsCount };
}

export async function getCommentsBySlug(slug: string): Promise<Comment[]> {
  const comments = await db.query.comments.findMany({
    where: (commentsTable, { eq }) => eq(commentsTable.slug, slug),
    with: {
      user: true,
    },
    orderBy: (commentsTable, { desc }) => [desc(commentsTable.createdAt)],
  });

  const commentMap = new Map(
    comments.map((comment) => [
      comment.id,
      { ...comment, replies: [] as Comment[] },
    ])
  );

  const result: Comment[] = [];

  comments.forEach((comment) => {
    if (comment.parentId) {
      const parentComment = commentMap.get(comment.parentId)!;
      parentComment.replies.push(commentMap.get(comment.id)!);
    } else {
      result.push(commentMap.get(comment.id)!);
    }
  });

  return result;
}
