import type { User } from 'next-auth';

import type { comments } from '~/lib/db/schema';

export type Comment = typeof comments.$inferSelect;

export type BlogMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  components?: string;
};

export type CommentWithUser = Comment & {
  user: User;
};

export type HeartsInfo = { total: number; currentClientHeartsCount: number };
