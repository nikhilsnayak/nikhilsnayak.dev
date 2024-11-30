import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { comments } from '~/lib/db/schema';

const commentSchema = createSelectSchema(comments);

const baseSchema = {
  parentId: z.string().optional().nullable().default(null),
};

export const addCommentSchema = commentSchema
  .pick({ id: true, content: true, slug: true })
  .extend(baseSchema);

export const editCommentSchema = commentSchema
  .pick({ id: true, content: true })
  .extend(baseSchema);

export const deleteCommentSchema = commentSchema
  .pick({ id: true })
  .extend(baseSchema);
