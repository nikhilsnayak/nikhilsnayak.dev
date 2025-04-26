import { after, connection } from 'next/server';

import { updateViewsBySlug } from '../functions/mutations';
import { getViewsBySlug } from '../functions/queries';

interface ViewsProps {
  slug: string;
  update?: boolean;
}

const formatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
});

export async function ViewsCount({ slug, update = false }: ViewsProps) {
  await connection();
  await new Promise((res) => setTimeout(res, 5000));
  const views = await getViewsBySlug(slug);

  if (process.env.NODE_ENV === 'production' && update) {
    after(() => updateViewsBySlug(slug));
  }

  return <p className='w-max'>{formatter.format(views?.count ?? 0)} views</p>;
}
