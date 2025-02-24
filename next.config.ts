import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
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
    rehypePlugins: [
      // @ts-expect-error https://nextjs.org/docs/canary/app/building-your-application/configuring/mdx#using-plugins-with-turbopack
      ['rehype-mdx-code-props', { strict: true, throwOnError: true }],
    ],
  },
});

export default withMDX(nextConfig);
