'use client';

import { useActionState, useOptimistic } from 'react';

import { addHeart } from '../functions/mutations';
import type { HeartsInfo } from '../types';
import { HeartButton } from './heart-button';

export function AddHeartForm({
  initialValue,
  slug,
}: Readonly<{
  initialValue: HeartsInfo;
  slug: string;
}>) {
  const [heartsInfo, addHeartAction] = useActionState(addHeart, initialValue);
  const [optimisticHeartsInfo, setOptimisticHeartsInfo] =
    useOptimistic(heartsInfo);

  return (
    <form
      action={(formData) => {
        setOptimisticHeartsInfo(({ currentClientHeartsCount, total }) => ({
          currentClientHeartsCount: currentClientHeartsCount + 1,
          total: total + 1,
        }));
        addHeartAction(formData);
      }}
    >
      <input type='text' name='slug' hidden readOnly value={slug} />
      <HeartButton heartsInfo={optimisticHeartsInfo} />
    </form>
  );
}
