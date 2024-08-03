'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-zod';

import { auth } from '@/config/auth';

import { db } from '../db';
import { comments } from '../db/schema';

const commentSchema = createSelectSchema(comments);

const addCommentSchema = commentSchema.pick({
  content: true,
  slug: true,
});

const editCommentSchema = commentSchema.pick({
  id: true,
  content: true,
});

const deleteCommentSchema = commentSchema.pick({
  id: true,
});

export async function addComment(prev: string | undefined, formData: FormData) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return 'Unauthorized';
  }

  const parsedResult = addCommentSchema.safeParse(Object.fromEntries(formData));

  if (!parsedResult.success) {
    return 'Invaild input';
  }

  const { slug, content } = parsedResult.data;

  try {
    await db
      .insert(comments)
      .values({ slug, content, userId: session.user.id });
  } catch (error) {
    console.log(error);
    return 'Server error';
  }

  revalidatePath('/blogs/[slug]', 'page');
}

export async function editComment(
  prev: string | undefined,
  formData: FormData
) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return 'Unauthorized';
  }

  const parsedResult = editCommentSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!parsedResult.success) {
    return 'Invaild input';
  }

  const { data: updatedComment } = parsedResult;

  const userId = session.user.id;

  try {
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

    if (existingComment.content.trim() === updatedComment.content.trim()) {
      return 'You are updating the same comment';
    }

    await db
      .update(comments)
      .set({
        ...existingComment,
        content: updatedComment.content,
      })
      .where(eq(comments.id, updatedComment.id));
  } catch (error) {
    console.log(error);
    return 'Server error';
  }

  revalidatePath('/blogs/[slug]', 'page');
}

export async function deleteComment(
  prev: string | undefined,
  formData: FormData
) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return 'Unauthorized';
  }
  const parsedResult = deleteCommentSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!parsedResult.success) {
    return 'Invaild input';
  }

  const {
    data: { id: commentId },
  } = parsedResult;

  const userId = session.user.id;
  const existingComment = await db.query.comments.findFirst({
    where: (commentsTable, { and, eq }) =>
      and(eq(commentsTable.id, commentId), eq(commentsTable.userId, userId)),
  });

  if (!existingComment) {
    return 'Comment not found';
  }

  try {
    await db.delete(comments).where(eq(comments.id, commentId));
  } catch (error) {
    console.log(error);
    return 'Server error';
  }

  revalidatePath('/blogs/[slug]', 'page');
}
