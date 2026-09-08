import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

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
  cacheComponents: true,
  experimental: {
    // The validation worker cannot resolve client modules behind dynamic server imports.
    devValidationWorker: false,
    inlineCss: true,
    prefetchInlining: true,
    cachedNavigations: true,
    optimisticRouting: true,
    varyParams: true,
    useOffline: true,
    useTypeScriptCli: true,
    requestInsights: true,
    turbopackRustReactCompiler: true,
    turbopackFileSystemCacheForBuild: true,
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-mdx-frontmatter'],
    rehypePlugins: ['rehype-mdx-code-props'],
  },
});

export default withMDX(nextConfig);
