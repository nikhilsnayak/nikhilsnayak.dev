import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Existing application rewrites
      {
        source: '/blogs/:slug*',
        destination: '/blog/:slug*',
      },
      // PostHog ingestion endpoints
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://us.i.posthog.com/decide',
      },
    ];
  },
  // Required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
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
    viewTransition: true,
    // clientSegmentCache: true,
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
