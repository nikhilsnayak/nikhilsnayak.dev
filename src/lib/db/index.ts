import { neon } from '@neondatabase/serverless';
import { defineRelations } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

const relations = defineRelations(schema, (r) => ({
  users: {
    comments: r.many.comments({
      from: r.users.id,
      to: r.comments.userId,
    }),
  },
  comments: {
    user: r.one.users({
      from: r.comments.userId,
      to: r.users.id,
      optional: false,
    }),
  },
}));

const client = neon(process.env.DATABASE_URL!);

export const db = drizzle({
  client,
  relations,
  logger: process.env.NODE_ENV === 'development',
});
