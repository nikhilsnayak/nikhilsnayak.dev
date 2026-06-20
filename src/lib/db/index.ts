import { neonConfig, Pool } from '@neondatabase/serverless';
import { defineRelations } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { WebSocket } from 'ws';

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

const connectionString = process.env.DATABASE_URL;

if (process.env.NODE_ENV === 'production') {
  neonConfig.webSocketConstructor = WebSocket;
  neonConfig.poolQueryViaFetch = true;
} else {
  neonConfig.wsProxy = (host) => `${host}:5433/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

const pool = new Pool({ connectionString });

export const db = drizzle({
  relations,
  client: pool,
  logger: process.env.NODE_ENV === 'development',
});
