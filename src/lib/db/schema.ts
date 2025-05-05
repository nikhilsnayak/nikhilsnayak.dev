import { relations } from 'drizzle-orm';
import {
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';

export const views = pgTable('views', {
  slug: varchar('slug', { length: 255 }).primaryKey(),
  count: integer('count').notNull().default(0),
});

export const hearts = pgTable(
  'hearts',
  {
    slug: varchar('slug', { length: 255 }).notNull(),
    count: integer('count').notNull().default(0),
    clientIdentifier: varchar('client_identifier').notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.slug, t.clientIdentifier] }),
    unique().on(t.slug, t.clientIdentifier).nullsNotDistinct(),
  ]
);

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const comments = pgTable(
  'comment',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    slug: varchar('slug', { length: 255 }).notNull(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    parentId: text('parent_id'),
    content: text('content').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
    }).onDelete('cascade'),
  ]
);

export const usersRelations = relations(users, ({ many }) => ({
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  parent: one(comments, {
    relationName: 'repliesRelation',
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments, {
    relationName: 'repliesRelation',
  }),
}));
