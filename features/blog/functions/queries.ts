import 'server-only';

import fs from 'fs/promises';
import path from 'path';

import { db } from '~/lib/db';
import { getIPHash } from '~/lib/utils/server';

import { CONTENT_DIR } from '../constants';
import { Comment } from '../types';
import { readAndParseMDXFile } from '../utils';

export async function getBlogPosts() {
  const files = await fs.readdir(CONTENT_DIR);

  const posts = await Promise.all(
    files
      .filter((file) => path.extname(file) === '.mdx')
      .map(async (file) => {
        const filePath = path.join(CONTENT_DIR, file);
        const { metadata, content } = await readAndParseMDXFile(filePath);
        const slug = path.basename(file, path.extname(file));

        return {
          metadata,
          slug,
          content,
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

export async function getBlogPostBySlug(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  try {
    return await readAndParseMDXFile(filePath);
  } catch {
    throw new Error(`Blog post with slug "${slug}" not found.`);
  }
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
