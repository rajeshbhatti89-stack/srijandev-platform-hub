/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: false,
  basePath: '/plus',
  assetPrefix: '/plus',
  images: { unoptimized: true }
};
module.exports = nextConfig;
