'use server';

import { auth } from '@/config/auth';
import { db } from '../db';
import { type Comment, comments } from '../db/schema';
import { revalidatePath } from 'next/cache';
import { createSelectSchema } from 'drizzle-zod';
import { eq } from 'drizzle-orm';

const editCommentSchema = createSelectSchema(comments);

const addCommentSchema = editCommentSchema.pick({
  content: true,
  slug: true,
});

export async function addComment(prev: any, formData: FormData) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return 'Unauthorized';
  }

  const parsedResult = addCommentSchema.safeParse(Object.fromEntries(formData));

  if (!parsedResult.success) {
    return 'Invaild input';
  }

  const { slug, content } = parsedResult.data;

  await db.insert(comments).values({ slug, content, userId: session.user.id });

  revalidatePath('/blogs/[slug]', 'page');
}

export async function editComment(comment: Comment) {
  const parsedResult = editCommentSchema.safeParse(comment);

  if (!parsedResult.success) {
    return 'Invaild input';
  }

  const { data: updatedComment } = parsedResult;

  const session = await auth();

  if (!session || !session.user || updatedComment.userId !== session.user.id) {
    return 'Unauthorized';
  }

  const userId = session.user.id;
  const existingComment = await db.query.comments.findFirst({
    where: (commentsTable, { and, eq }) =>
      and(
        eq(commentsTable.id, updatedComment.id),
        eq(commentsTable.userId, userId)
      ),
  });

  if (!existingComment) {
    return 'Comment not found';
  }

  await db
    .update(comments)
    .set(updatedComment)
    .where(eq(comments.id, updatedComment.id));

  revalidatePath('/blogs/[slug]', 'page');
}

export async function deleteComment(commentId: string) {
  if (!commentId) {
    return 'Invaild input';
  }

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return 'Unauthorized';
  }

  const userId = session.user.id;
  const existingComment = await db.query.comments.findFirst({
    where: (commentsTable, { and, eq }) =>
      and(eq(commentsTable.id, commentId), eq(commentsTable.userId, userId)),
  });

  if (!existingComment) {
    return 'Comment not found';
  }

  await db.delete(comments).where(eq(comments.id, commentId));

  revalidatePath('/blogs/[slug]', 'page');
}
