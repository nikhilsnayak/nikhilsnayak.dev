import 'server-only';

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

import { db } from '~/lib/db';
import { getIPHash } from '~/lib/utils/server';

import { CONTENT_DIR } from '../constants';
import { PostMetadataSchema } from '../schema';
import type { Comment } from '../types';

export async function getBlogMetadata() {
  const files = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  const slugs = files
    .filter((file) => file.isDirectory())
    .map((file) => file.name);

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const metadata = await getPostMetadataBySlug(slug);
      return {
        metadata,
        slug,
      };
    })
  );

  return posts.toSorted((a, b) => {
    if (a.metadata.publishedAt > b.metadata.publishedAt) {
      return -1;
    }
    return 1;
  });
}

export async function getPostMetadataBySlug(slug: string) {
  const postPath = path.join(CONTENT_DIR, slug, 'post.mdx');
  const postContent = await fs.readFile(postPath, 'utf-8');
  const { data } = matter(postContent);
  return PostMetadataSchema.parse(data);
}

export function getViewsBySlug(slug: string) {
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
