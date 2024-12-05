import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { comments } from '~/lib/db/schema';

const CommentSchema = createSelectSchema(comments);

const BaseSchema = {
  parentId: z.string().optional().nullable().default(null),
};

export const AddCommentSchema = CommentSchema.pick({
  id: true,
  content: true,
  slug: true,
}).extend(BaseSchema);

export const EditCommentSchema = CommentSchema.pick({
  id: true,
  content: true,
}).extend(BaseSchema);

export const DeleteCommentSchema = CommentSchema.pick({ id: true }).extend(
  BaseSchema
);

export const BlogMetadataSchema = z.object({
  title: z.string(),
  publishedAt: z.string(),
  summary: z.string(),
});
