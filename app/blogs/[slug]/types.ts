import { User } from 'next-auth';

import { Comment } from '~/lib/db/schema';

export type CommentWithUser = Comment & {
  user: User;
};
