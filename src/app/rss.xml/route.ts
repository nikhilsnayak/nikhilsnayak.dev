import { BASE_URL } from '~/lib/constants';
import { getBlogMetadata } from '~/features/blog/functions/queries';

export async function GET() {
  const blog = await getBlogMetadata();

  const itemsXml = blog
    .map(
      (post) =>
        `<item>
          <title>${post.metadata.title}</title>
          <link>${BASE_URL}/blog/${post.slug}</link>
          <description>${post.metadata.summary || ''}</description>
          <pubDate>${post.metadata.publishedAt.toUTCString()}</pubDate>
        </item>`
    )
    .join('\n');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>Nikhil S - Blog</title>
        <link>${BASE_URL}</link>
        <description>Nikhil S Blog's RSS feed</description>
        ${itemsXml}
    </channel>
  </rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
