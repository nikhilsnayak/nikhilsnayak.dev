import { BASE_URL } from '~/lib/constants';
import { getBlogMetadata } from '~/features/blog/functions/queries';

export default async function sitemap() {
  const routes = ['', '/blog', '/rss.xml'];
  const blog = await getBlogMetadata();

  return [
    ...routes.map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date().toISOString().split('T')[0],
    })),
    ...blog.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.metadata.publishedAt,
    })),
  ];
}
