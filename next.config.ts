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
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  typedRoutes: true,
  experimental: {
    typedEnv: true,
    mcpServer: true,
    reactCompiler: true,
    viewTransition: true,
    cacheComponents: true,
    clientSegmentCache: true,
    clientParamParsing: true,
    browserDebugInfoInTerminal: true,
    turbopackPersistentCaching: true,
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
