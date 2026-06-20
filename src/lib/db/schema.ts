import {
  boolean,
  foreignKey,
  integer,
  primaryKey,
  snakeCase,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

const pgTable = snakeCase.table;

export const views = pgTable('views', {
  slug: varchar({ length: 255 }).primaryKey(),
  count: integer().notNull().default(0),
});

export const hearts = pgTable(
  'hearts',
  {
    slug: varchar({ length: 255 }).notNull(),
    count: integer().notNull().default(0),
    clientIdentifier: varchar().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.slug, t.clientIdentifier] }),
    unique().on(t.slug, t.clientIdentifier).nullsNotDistinct(),
  ],
);

export const users = pgTable('user', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  image: text(),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const sessions = pgTable('session', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  token: text().notNull().unique(),
  expiresAt: timestamp({ mode: 'date' }).notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const accounts = pgTable('account', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp({ mode: 'date' }),
  refreshTokenExpiresAt: timestamp({ mode: 'date' }),
  scope: text(),
  password: text(),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const verifications = pgTable('verification', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ mode: 'date' }).notNull(),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const comments = pgTable(
  'comment',
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    slug: varchar({ length: 255 }).notNull(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    parentId: text(),
    content: text().notNull(),
    createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
    }).onDelete('cascade'),
  ],
);
