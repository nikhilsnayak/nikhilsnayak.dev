'use server';

import { revalidateTag } from 'next/cache';

export async function refreshQuestions() {
  revalidateTag('getSuggestedQuestions');
}
