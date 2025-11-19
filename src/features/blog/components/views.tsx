import { after, connection } from 'next/server';

import { NumberFormatter } from '~/lib/utils';

import { updateViewsBySlug } from '../functions/mutations';
import { getViewsBySlug } from '../functions/queries';

interface ViewsProps {
  slug: string;
  update?: boolean;
}

export async function ViewsCount({ slug, update = false }: ViewsProps) {
  await connection();
  const views = await getViewsBySlug(slug);

  if (process.env.NODE_ENV === 'production' && update) {
    after(() => updateViewsBySlug(slug));
  }

  return (
    <p className='w-max'>{NumberFormatter.format(views?.count ?? 0)} views</p>
  );
}
