import { Eye } from 'lucide-react';
import { Suspense } from 'react';
import { Skeleton } from './ui/skeleton';
import { unstable_after as after } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { db } from '@/lib/db';
import { views as viewsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface ViewsProps {
  slug: string;
}

async function ViewsCount({ slug }: ViewsProps) {
  const views = await db.query.views.findFirst({
    where: (views, { eq }) => eq(views.slug, slug),
  });

  if (process.env.NODE_ENV === 'production') {
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

  return <span className='h-5 w-5'>{(views?.count ?? 0) + 1}</span>;
}

export function Views({ slug }: ViewsProps) {
  return (
    <div className='flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400'>
      <Eye />
      <Suspense fallback={<Skeleton className='h-5 w-5 bg-foreground/10' />}>
        <ViewsCount slug={slug} />
      </Suspense>
    </div>
  );
}

export async function PostViewCount({ slug }: ViewsProps) {
  noStore();
  const views = await db.query.views.findFirst({
    where: (views, { eq }) => eq(views.slug, slug),
  });

  return <span className='text-lg'>{views?.count ?? 0} views</span>;
}
