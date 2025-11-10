import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/blogs/:slug*',
        destination: '/blog/:slug*',
      },
    ];
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactCompiler: process.env.NODE_ENV === 'development',
  typedRoutes: true,
  cacheComponents: true,
  experimental: {
    inlineCss: true,
    viewTransition: true,
    turbopackFileSystemCacheForDev: true,
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-mdx-frontmatter'],
    rehypePlugins: ['rehype-mdx-code-props'],
  },
});

export default withMDX(nextConfig);
