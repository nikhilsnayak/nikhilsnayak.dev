import { createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod';

import { comments } from '~/lib/db/schema';

const CommentSchema = createSelectSchema(comments, {
  content: z.string().refine((content) => content.trim().length >= 3, {
    message: 'Write at least three characters.',
  }),
});

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

export const DeleteCommentSchema = CommentSchema.pick({ id: true }).extend(BaseSchema);

export const PostMetadataSchema = z.object({
  title: z.string(),
  publishedAt: z.date(),
  updatedAt: z.date().optional(),
  summary: z.string(),
  series: z
    .object({
      id: z.string(),
      order: z.number().int().positive(),
    })
    .optional(),
  related: z.array(z.string()).optional(),
});
