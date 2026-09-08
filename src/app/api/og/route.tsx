import { NextRequest } from 'next/server';

import { createArticleSocialImage } from '~/lib/social-image';

export function GET(request: NextRequest) {
  return createArticleSocialImage(
    request.nextUrl.searchParams.get('title')?.trim() || 'Writing by Nikhil S',
  );
}
