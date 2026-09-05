import { NextRequest } from 'next/server';

import { createSocialImage } from '~/lib/social-image';

export function GET(request: NextRequest) {
  return createSocialImage({
    title: request.nextUrl.searchParams.get('title') || 'Writing by Nikhil S',
  });
}
