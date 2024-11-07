import type { ReactNode } from 'react';
import { unstable_after as after, connection } from 'next/server';

import { updateViewsBySlug } from '../functions/mutations';
import { getBlogViewsBySlug } from '../functions/queries';

interface ViewsProps {
  slug: string;
  children: (count: number) => ReactNode;
  update?: boolean;
}

export async function BlogViewsCount({
  slug,
  children,
  update = false,
}: ViewsProps) {
  await connection();
  const views = await getBlogViewsBySlug(slug);
  if (process.env.NODE_ENV === 'production' && update) {
    after(() => updateViewsBySlug(slug));
  }

  return children(views?.count ?? 0);
}
