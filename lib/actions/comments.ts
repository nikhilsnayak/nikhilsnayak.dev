'use server';

import { auth } from '@/config/auth';
import { db } from '../db';
import { comments } from '../db/schema';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const addCommentSchema = z.object({
  slug: z.string(),
  content: z.string(),
});

export async function addComment(prev: any, formData: FormData) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return 'Unauthorized';
  }

  const parsedResult = addCommentSchema.safeParse(Object.fromEntries(formData));

  if (!parsedResult.success) {
    return 'Invaild input';
  }

  const { slug, content } = parsedResult.data;

  await db.insert(comments).values({ slug, content, userId: session.user.id });

  revalidatePath('/blogs/[slug]', 'page');
}
