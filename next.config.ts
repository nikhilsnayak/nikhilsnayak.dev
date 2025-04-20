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
  experimental: {
    reactCompiler: true,
    ppr: true,
    inlineCss: true,
    useCache: true,
    nodeMiddleware: true,
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      // @ts-expect-error https://nextjs.org/docs/canary/app/building-your-application/configuring/mdx#using-plugins-with-turbopack
      ['remark-frontmatter'],
      // @ts-expect-error https://nextjs.org/docs/canary/app/building-your-application/configuring/mdx#using-plugins-with-turbopack
      ['remark-mdx-frontmatter'],
    ],
    rehypePlugins: [
      // @ts-expect-error https://nextjs.org/docs/canary/app/building-your-application/configuring/mdx#using-plugins-with-turbopack
      ['rehype-mdx-code-props'],
    ],
  },
});

export default withMDX(nextConfig);
