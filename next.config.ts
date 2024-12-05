import { NextConfig } from 'next';
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
    after: true,
    inlineCss: true,
  },
};

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      // @ts-ignore https://nextjs.org/docs/canary/app/building-your-application/configuring/mdx#using-plugins-with-turbopack
      ['rehype-mdx-code-props', { strict: true, throwOnError: true }],
    ],
  },
});

export default withMDX(nextConfig);
