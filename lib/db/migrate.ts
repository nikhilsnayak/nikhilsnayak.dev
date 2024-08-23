import { sql } from '@vercel/postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/vercel-postgres';

const runMigrate = async () => {
  const db = drizzle(sql);

  console.log('⏳ Running migrations...');

  const start = Date.now();

  await migrate(db, { migrationsFolder: 'lib/db/migrations' });

  const end = Date.now();

  console.log('✅ Migrations completed in', end - start, 'ms');

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
