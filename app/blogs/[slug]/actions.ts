'use server';

import { eq, sql } from 'drizzle-orm';

import { auth } from '~/lib/auth';
import { db } from '~/lib/db';
import {
  addCommentSchema,
  comments,
  deleteCommentSchema,
  editCommentSchema,
  hearts,
} from '~/lib/db/schema';

import { CommentWithUser } from './types';

export async function addComment(
  formData: FormData
): Promise<CommentWithUser | { error: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  const parsedResult = addCommentSchema.safeParse(Object.fromEntries(formData));

  if (!parsedResult.success) {
    return { error: 'Invalid input' };
  }

  const { slug, content } = parsedResult.data;

  try {
    const newComment = await db
      .insert(comments)
      .values({ slug, content, userId: session.user.id })
      .returning()
      .then((res) => res[0]);

    return { ...newComment, user: session.user };
  } catch (error) {
    console.log(error);
    return { error: 'Server error' };
  }
}

export async function editComment(
  formData: FormData
): Promise<CommentWithUser | { error: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  const parsedResult = editCommentSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!parsedResult.success) {
    return { error: 'Invalid input' };
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
      return { error: 'Comment not found' };
    }

    if (existingComment.content.trim() === updatedComment.content.trim()) {
      return { error: 'You are updating the same comment' };
    }

    const updatedCommentFromDb = await db
      .update(comments)
      .set({
        ...existingComment,
        content: updatedComment.content,
      })
      .where(eq(comments.id, updatedComment.id))
      .returning()
      .then((res) => res[0]);

    return { ...updatedCommentFromDb, user: session.user };
  } catch (error) {
    console.log(error);
    return { error: 'Server error' };
  }
}

export async function deleteComment(
  formData: FormData
): Promise<CommentWithUser | { error: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  const parsedResult = deleteCommentSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!parsedResult.success) {
    return { error: 'Invalid input' };
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
    return { error: 'Comment not found' };
  }

  try {
    const deletedComment = await db
      .delete(comments)
      .where(eq(comments.id, commentId))
      .returning()
      .then((res) => res[0]);
    return { ...deletedComment, user: session.user };
  } catch (error) {
    console.log(error);
    return { error: 'Server error' };
  }
}

export async function addHeart(prev: number | undefined, formData: FormData) {
  const slug = formData.get('slug')?.toString();
  if (!slug) {
    return prev;
  }

  try {
    if (prev === undefined) {
      const updatedHearts = await db
        .insert(hearts)
        .values({ slug, count: 1 })
        .returning()
        .then((val) => val[0]);

      return updatedHearts.count;
    } else {
      const updatedHearts = await db
        .update(hearts)
        .set({
          count: sql`${hearts.count} + 1`,
        })
        .where(eq(hearts.slug, slug))
        .returning()
        .then((val) => val[0]);

      return updatedHearts.count;
    }
  } catch (error) {
    console.log(error);
    return prev;
  }
}
