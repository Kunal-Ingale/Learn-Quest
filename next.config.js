/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    return config;
  },
  // Enable static exports
  output: 'standalone',
  // Ensure proper module resolution
  experimental: {
    esmExternals: true,
  },
}

module.exports = nextConfig; 