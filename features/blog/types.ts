import type { User } from 'next-auth';

import type { comments } from '~/lib/db/schema';

export type BlogMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  components?: string;
};

export type Comment = typeof comments.$inferSelect & {
  user: User;
  replies: Comment[];
};

export type CommentWithoutReplies = Omit<Comment, 'replies'>;

export type HeartsInfo = { total: number; currentClientHeartsCount: number };
