/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Disable x-powered-by header
  poweredByHeader: false,
};

export default nextConfig;
