'use client';

import { useActionState, useOptimistic } from 'react';

import { addHeart } from './actions';
import { HeartButton } from './heart-button';

export function AddHeartForm({
  initialValue,
  slug,
}: {
  initialValue?: number;
  slug: string;
}) {
  const [hearts, addHeartAction] = useActionState(addHeart, initialValue);
  const [optimisticHearts, setOptimisticHearts] = useOptimistic(hearts ?? 0);
  return (
    <form
      action={(formData) => {
        setOptimisticHearts((prev) => prev + 1);
        addHeartAction(formData);
      }}
    >
      <input type='text' name='slug' hidden readOnly value={slug} />
      <HeartButton count={optimisticHearts} />
    </form>
  );
}
