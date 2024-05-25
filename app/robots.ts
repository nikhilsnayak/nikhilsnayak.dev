import { BASE_URL } from '@/config/constants';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: `${BASE_URL}/sitemap`,
  };
}
