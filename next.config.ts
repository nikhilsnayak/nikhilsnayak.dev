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
  reactCompiler: true,
  typedRoutes: true,
  experimental: {
    viewTransition: true,
    cacheComponents: true,
    clientParamParsing: true,
    staleTimes: {
      dynamic: 300,
    },
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-mdx-frontmatter'],
    rehypePlugins: ['rehype-mdx-code-props'],
  },
});

export default withMDX(nextConfig);
