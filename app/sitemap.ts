import { BASE_URL } from '~/lib/constants';
import { getBlogsMetadata } from '~/features/blog/functions/queries';

export default async function sitemap() {
  const routes = ['', '/work', '/bot', '/blogs', '/rss.xml'];
  const blogs = await getBlogsMetadata();

  return [
    ...routes.map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date().toISOString().split('T')[0],
    })),
    ...blogs.map((post) => ({
      url: `${BASE_URL}/blogs/${post.slug}`,
      lastModified: post.metadata.publishedAt,
    })),
  ];
}
