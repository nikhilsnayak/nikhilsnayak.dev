import { getHeartsInfoBySlug } from '../functions/queries';
import { AddHeartForm } from './add-heart-form';

export async function Hearts({ slug }: Readonly<{ slug: string }>) {
  const heartsInfo = await getHeartsInfoBySlug(slug);

  return <AddHeartForm initialValue={heartsInfo} slug={slug} />;
}
