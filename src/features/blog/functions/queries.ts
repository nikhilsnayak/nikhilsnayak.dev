import 'server-only';
import fs from 'fs/promises';
import path from 'path';

import { sql } from 'drizzle-orm';
import matter from 'gray-matter';
import { cacheLife } from 'next/cache';

import { db } from '~/lib/db';
import { getIPHash } from '~/lib/utils/server';

import { CONTENT_DIR } from '../constants';
import { PostMetadataSchema } from '../schema';
import type { Comment } from '../types';

export async function getBlogMetadata() {
  'use cache';
  cacheLife('max');

  const files = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  const slugs = files.filter((file) => file.isDirectory()).map((file) => file.name);

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const postContent = await fs.readFile(path.join(CONTENT_DIR, slug, 'post.mdx'), 'utf-8');
      const { data } = matter(postContent);
      const metadata = PostMetadataSchema.parse(data);
      return {
        metadata,
        slug,
      };
    }),
  );

  return posts.toSorted((a, b) => {
    if (a.metadata.publishedAt > b.metadata.publishedAt) {
      return -1;
    }
    return 1;
  });
}

export async function getPostMetadataBySlug(slug: string) {
  const posts = await getBlogMetadata();
  const post = posts.find((post) => post.slug === slug);
  return post?.metadata;
}

export function getViewsBySlug(slug: string) {
  return db.query.views.findFirst({ where: { slug } });
}

export async function getHeartsInfoBySlug(slug: string) {
  const ip = await getIPHash();

  const hearts = await db.query.hearts.findMany({ where: { slug } });

  const total = hearts.reduce((acc, cv) => acc + cv.count, 0);

  const currentClientHeartsCount =
    hearts.find((heart) => heart.clientIdentifier === ip)?.count ?? 0;

  return { total, currentClientHeartsCount };
}

export async function getCommentsBySlug(slug: string): Promise<Comment[]> {
  const comments = await db.query.comments.findMany({
    where: { slug },
    with: { user: { columns: { id: true, name: true, image: true } } },
    orderBy: (commentsTable, { desc }) => [desc(commentsTable.createdAt)],
  });

  const commentMap = new Map(
    comments.map((comment) => [comment.id, { ...comment, replies: [] as Comment[] }]),
  );

  const result: Comment[] = [];

  commentMap.forEach((comment) => {
    const parentComment = comment.parentId ? commentMap.get(comment.parentId) : undefined;
    if (parentComment) {
      parentComment.replies.push(comment);
    } else {
      // Keep historical orphaned replies readable if their parent isn't in this article.
      result.push(comment);
    }
  });

  return result;
}

export async function getBlogStats() {
  const result = await db.execute(sql`
    SELECT
      (SELECT COALESCE(SUM(v.count), 0) FROM views v) AS "totalViews",
      (SELECT COALESCE(SUM(h.count), 0) FROM hearts h) AS "totalHearts",
      (SELECT COALESCE(COUNT(*), 0) FROM comment c) AS "totalComments";
  `);

  const [stats] = result.rows;

  return stats as {
    totalViews: number;
    totalHearts: number;
    totalComments: number;
  };
}
