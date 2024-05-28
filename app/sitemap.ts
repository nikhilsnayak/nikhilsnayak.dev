import { BASE_URL } from '@/config/constants';
import { getBlogPosts } from '@/lib/utils/server';

export default async function sitemap() {
  const blogs = getBlogPosts().map((post) => ({
    url: `${BASE_URL}/blogs/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));
  const routes = ['', '/work', '/bot', '/blogs'].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes, ...blogs];
}
