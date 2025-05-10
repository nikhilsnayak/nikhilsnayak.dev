import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

const client = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client, schema });
