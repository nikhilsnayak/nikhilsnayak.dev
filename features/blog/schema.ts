import { createSelectSchema } from 'drizzle-zod';

import { comments } from '~/lib/db/schema';

const commentSchema = createSelectSchema(comments);

export const addCommentSchema = commentSchema.pick({
  id: true,
  content: true,
  slug: true,
});

export const editCommentSchema = commentSchema.pick({
  id: true,
  content: true,
});

export const deleteCommentSchema = commentSchema.pick({
  id: true,
});
