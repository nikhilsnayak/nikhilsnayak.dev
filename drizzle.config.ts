import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({
  path: '.env.local',
});

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  verbose: true,
  strict: true,
});
