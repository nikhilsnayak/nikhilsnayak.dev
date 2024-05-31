import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';

export const views = pgTable('views', {
  slug: varchar('slug', { length: 255 }).primaryKey(),
  count: integer('count').notNull().default(0),
});
