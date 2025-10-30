import withMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';

/** @type {import('next').NextConfig} */
const nextConfig = withMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
  },
})({
  reactStrictMode: true,
  trailingSlash: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  // Enable serverless functions and optimize for Vercel
  compress: true,
  generateEtags: true,
  poweredByHeader: false,
  // Configure for Vercel deployment
  webpack: (config, { dev, isServer }) => {
    config.resolve.fallback = {
      fs: false,
    };

    // Production optimizations focused on LCP performance
    if (!dev && !isServer) {
      // Conservative chunk splitting to prioritize LCP over aggressive optimization
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 50000, // Increased to reduce fragmentation
          cacheGroups: {
            styles: {
              name: 'styles',
              test: /\.(css|scss|ass)$/,
              chunks: 'all',
              enforce: true,
            },
            // TODO(human): Simplified vendor chunking - consolidate most vendor code together
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              priority: 10,
              chunks: 'all',
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },
});

export default nextConfig;
