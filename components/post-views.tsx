import React from 'react';
import { unstable_after as after, connection } from 'next/server';
import { eq } from 'drizzle-orm';

import { db } from '~/lib/db';
import { views as viewsTable } from '~/lib/db/schema';

interface ViewsProps {
  slug: string;
  children: (count: number) => React.ReactNode;
  updateViews?: boolean;
}

export async function PostViewsCount({
  slug,
  children,
  updateViews = false,
}: ViewsProps) {
  await connection();
  const views = await db.query.views.findFirst({
    where: (views, { eq }) => eq(views.slug, slug),
  });
  if (process.env.NODE_ENV === 'production' && updateViews) {
    after(async () => {
      if (!views) {
        await db.insert(viewsTable).values({ slug, count: 1 });
      } else {
        await db
          .update(viewsTable)
          .set({ count: views.count + 1 })
          .where(eq(viewsTable.slug, slug));
      }
    });
  }

  return children(views?.count ?? 0);
}
