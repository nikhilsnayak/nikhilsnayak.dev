import type { User } from '~/lib/auth';
import type { comments } from '~/lib/db/schema';

export type CommentAuthor = Pick<User, 'id' | 'name' | 'image'>;

export type Comment = typeof comments.$inferSelect & {
  user: CommentAuthor;
  replies: Comment[];
};

export type CommentWithoutReplies = Omit<Comment, 'replies'>;

export type HeartsInfo = { total: number; currentClientHeartsCount: number };
