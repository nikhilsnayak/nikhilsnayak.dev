'use server';

import 'server-only';

import { eq, sql } from 'drizzle-orm';

import { auth } from '~/lib/auth';
import { db } from '~/lib/db';
import { comments, hearts, views } from '~/lib/db/schema';
import { getIPHash } from '~/lib/utils/server';

import {
  AddCommentSchema,
  DeleteCommentSchema,
  EditCommentSchema,
} from '../schema';
import type { CommentWithoutReplies, HeartsInfo } from '../types';

export async function updateViewsBySlug(slug: string) {
  try {
    await db
      .insert(views)
      .values({
        slug,
        count: 1,
      })
      .onConflictDoUpdate({
        target: [views.slug],
        set: { count: sql`${views.count} + 1` },
      });
  } catch (error) {
    console.log(error);
  }
}

export async function addHeart(
  prevState: HeartsInfo,
  formData: FormData
): Promise<HeartsInfo> {
  const slug = formData.get('slug')?.toString();
  if (!slug) {
    return prevState;
  }

  const ip = await getIPHash().then((ip) => ip ?? 'UNKNOWN');

  try {
    const updatedHearts = await db
      .insert(hearts)
      .values({
        clientIdentifier: ip,
        slug,
        count: 1,
      })
      .onConflictDoUpdate({
        target: [hearts.clientIdentifier, hearts.slug],
        set: { count: sql`${hearts.count} + 1` },
      })
      .returning()
      .then((res) => res[0]);

    if (ip === 'UNKNOWN') {
      return {
        currentClientHeartsCount: prevState.currentClientHeartsCount + 1,
        total: prevState.total + 1,
      };
    }

    return {
      total: prevState.total + 1,
      currentClientHeartsCount: updatedHearts.count,
    };
  } catch (error) {
    console.log(error);
    return prevState;
  }
}

export async function addComment(
  formData: FormData
): Promise<CommentWithoutReplies | { error: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  const parsedResult = AddCommentSchema.safeParse(Object.fromEntries(formData));

  if (!parsedResult.success) {
    return { error: 'Invalid input' };
  }

  try {
    const newComment = await db
      .insert(comments)
      .values({ ...parsedResult.data, userId: session.user.id })
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
): Promise<CommentWithoutReplies | { error: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  const parsedResult = EditCommentSchema.safeParse(
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
): Promise<CommentWithoutReplies | { error: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  const parsedResult = DeleteCommentSchema.safeParse(
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
