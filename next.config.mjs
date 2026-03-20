import withMDX from '@next/mdx';
import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(
  withMDX({
    extension: /\.mdx?$/,
    options: {
      remarkPlugins: [],
    },
  })({
    reactStrictMode: true,
    trailingSlash: true,
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
    compress: true,
    generateEtags: true,
    poweredByHeader: false,
    webpack: (config, { webpack }) => {
      // Exclude @vercel/og wasm/edge runtime — no dynamic OG routes, using static opengraph-image.png
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /compiled\/@vercel\/og/,
        })
      );
      return config;
    },
    turbopack: {
      resolveAlias: {
        fs: { browser: './src/lib/empty.ts' },
      },
    },
  })
);

export default nextConfig;
